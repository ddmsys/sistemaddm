📋 DOCUMENTO DE MIGRAÇÃO E PADRONIZAÇÃO - Sistema DDM

Criado: 14 de outubro de 2025
Objetivo: Organizar mudanças e padronizar nomenclatura
Status: ✅ Documento Oficial de Referência

🎯 RESUMO EXECUTIVO
O Que Aconteceu
Durante a Fase 2 do desenvolvimento, houve uma padronização completa do sistema para inglês, conforme documentado em 07-RENOMEACAO-INGLES.md. Esta mudança foi intencional e necessária para:

✅ Manter consistência com módulo CRM (já em inglês)
✅ Seguir padrão internacional de desenvolvimento
✅ Facilitar manutenção futura
✅ Alinhar com Firebase/Firestore (inglês)

PROBLEMA IDENTIFICADO: Não foi criado um guia claro de migração, causando confusão entre versões.

📊 TABELA DE EQUIVALÊNCIAS DEFINITIVA
Módulos Principais
Português (Fase 1)Inglês (Fase 2 - Atual)StatusNotasOrçamentoBudget✅ MigradoPrincipal mudançaBudget (antigo)Budget⚠️ RENOMEADO!Budget não existe maisPedidoOrder✅ Migrado-LivroBook✅ MigradoCatálogo DDMProjeto ProduçãoProductionProject✅ MigradoEtapas de produçãoLeadLead✅ Sempre inglêsSem mudançaClienteClient✅ Sempre inglêsSem mudançaProjeto (CRM)Project✅ Sempre inglêsGerencial apenas

🔄 FLUXO COMPLETO DO SISTEMA (ATUAL)
┌─────────────────────────────────────────────────────────────┐
│ FLUXO COMERCIAL DDM │
└─────────────────────────────────────────────────────────────┘

1. LEAD (pessoa interessada)
   │ - name, email, phone
   │ - status: primeiro_contato → qualificado → proposta_enviada
   │ - probability: 0-100%
   ↓

2. BUDGET (proposta comercial)
   │ - number: "v5_1410.1435"
   │ - leadId vinculado
   │ - projectData temporário (title, author, specs)
   │ - items: EditorialService | Printing | Extra
   │ - status: draft → sent → approved/rejected
   ↓ APROVAÇÃO

3. CONVERSÃO AUTOMÁTICA (via approveBudget function)
   ├─→ CLIENT criado
   │ └─ catalogNumber: 456
   │
   ├─→ BOOK criado (catálogo DDM)
   │ └─ catalogCode: "DDML0456"
   │
   ├─→ ORDER criado (pedido formal)
   │ └─ snapshot dos dados do budget
   │
   └─→ PRODUCTION PROJECT criado
   └─ stages: text_preparation, revision, layout, etc.

📁 ESTRUTURA DE ARQUIVOS ATUAL
src/lib/types/
├── leads.ts ✅ CRM (sempre foi inglês)
├── clients.ts ✅ CRM (sempre foi inglês)
├── projects.ts ✅ Gerencial (sempre foi inglês)
├── books.ts ✅ Migrado (era livros.ts)
├── budgets.ts ✅ Migrado (era orcamentos.ts)
├── orders.ts ✅ Migrado (era pedidos.ts)
├── production-projects.ts ✅ Migrado (era projetos-producao.ts)
└── budgets-module/
└── index.ts ✅ Exports centralizados

src/hooks/comercial/
├── useLeads.ts ✅
├── useClients.ts ✅
├── useBudgets.ts ✅ (era useBudgets.ts)
├── useOrders.ts ✅
├── useBooks.ts ✅
└── useProductionProjects.ts ✅

src/components/comercial/
├── modals/
│ ├── LeadModal.tsx ✅
│ ├── ClientModal.tsx ✅
│ ├── BudgetModal.tsx ✅ (era BudgetModal.tsx)
│ ├── ProjectModal.tsx ✅ (gerencial)
│ └── BookModal.tsx ✅
├── cards/
│ ├── LeadCard.tsx ✅
│ ├── ClientCard.tsx ✅
│ ├── BudgetCard.tsx ✅
│ └── ProjectCard.tsx ✅
└── list/
└── BudgetsList.tsx ✅

src/app/(authenticated)/
├── crm/
│ ├── leads/ ✅
│ ├── clients/ ✅
│ └── projects/ ✅ (gerencial)
├── budgets/ ✅ (era budgets/)
├── orders/ ✅
├── production/ ✅ (ProductionProjects)
└── books/ ✅ (catálogo)

⚠️ MUDANÇAS CRÍTICAS DETALHADAS

1. Budget → Budget (Principal Mudança)
   ANTES (Fase 1):
   typescript// ❌ NÃO USAR MAIS
   interface Budget {
   budgetNumber: string;
   status: BudgetStatus; // 'draft' | 'sent' | 'viewed' | 'signed'
   clientId?: string;
   leadId?: string;
   items: BudgetItem[];
   }

// Hook antigo
const { budgets, createBudget } = useBudgets();
AGORA (Fase 2):
typescript// ✅ USAR SEMPRE
interface Budget {
number: string; // v5_1410.1435
status: BudgetStatus; // 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
leadId?: string;
clientId?: string;
bookId?: string;
projectData?: ProjectData;
items: BudgetItem[];
}

// Hook atual
const { budgets, createBudget } = useBudgets();
Conversão:

Budget → Budget
budgetNumber → number
BudgetStatus → BudgetStatus
BudgetItem → BudgetItem
Status 'signed' → 'approved'

2. Project → ProductionProject (Separação)
   ANTES (Fase 1 - CONFUSO):
   typescript// ❌ Ambíguo: projeto gerencial ou produção?
   interface Project {
   name: string;
   type: string; // ???
   stages?: any[]; // ???
   }
   AGORA (Fase 2 - CLARO):
   typescript// ✅ Project = Gerencial (CRM)
   interface Project {
   name: string;
   description?: string;
   clientId: string;
   status: ProjectStatus; // 'planning' | 'in_progress' | 'completed'
   teamMembers: ProjectMember[];
   // SEM stages de produção
   }

// ✅ ProductionProject = Produção Editorial
interface ProductionProject {
number: string; // PROJ-2025-001
bookId: string;
orderId: string;
clientId: string;
status: ProductionProjectStatus; // 'not_started' | 'in_progress' | 'completed'
stages: ProjectStage[]; // Etapas específicas
progress: number; // 0-100
}

3. Collections do Firestore
   ANTES:
   /budgets ❌ Não existe mais
   /projects ✅ Gerencial (mantém)
   AGORA:
   /budgets ✅ Orçamentos
   /orders ✅ Pedidos
   /books ✅ Catálogo
   /productionProjects ✅ Produção
   /projects ✅ Gerencial (CRM)
   /leads ✅ CRM
   /clients ✅ CRM

🔧 CORREÇÕES NECESSÁRIAS

1. Firebase Functions (PENDENTE)
   As functions ainda usam nomes antigos:
   ❌ ATUAL (incorreto):
   functions/src/
   ├── budgets/
   │ ├── assignBudgetNumber.ts
   │ ├── createBudgetPdf.ts
   │ └── onBudgetSigned.ts
   └── projects/
   ├── assignProjectCatalogCode.ts
   └── onProjectApproval.ts

✅ CORRIGIR PARA:
functions/src/
├── budgets/
│ ├── assignBudgetNumber.ts
│ ├── createBudgetPdf.ts
│ └── onBudgetApproved.ts
└── production-projects/
├── assignCatalogCode.ts
└── onProjectCreated.ts 2. Componentes (EM PROGRESSO)
✅ Concluído:

- BudgetModal.tsx (era BudgetModal)
- BudgetCard.tsx
- useBudgets.ts

⏳ Em Desenvolvimento:

- BudgetItemForm.tsx (adicionar itens)
- BudgetItemsList.tsx (listar itens)
- BudgetSummary.tsx (resumo valores)

❌ Pendente:

- BudgetPDF.tsx (geração PDF)
- BudgetEmailTemplate.tsx

3. Rotas (VERIFICAR)
   ✅ Correto:
   /budgets
   /budgets/[id]
   /orders
   /orders/[id]
   /production
   /production/[id]
   /books
   /books/[id]

❌ Remover (se existir):
/budgets
/budgets/[id]

✅ CHECKLIST COMPLETO DE MIGRAÇÃO
Backend

Renomear Firebase Functions (budgets/ → budgets/)
Atualizar triggers do Firestore
Testar approveBudget() function
Migrar dados antigos (se houver)
Atualizar regras de segurança

Frontend - Types

books.ts criado
budgets.ts criado
orders.ts criado
production-projects.ts criado
Exports centralizados em budgets-module/index.ts

Frontend - Hooks

useBudgets.ts implementado
useOrders.ts implementado
useBooks.ts implementado
useProductionProjects.ts implementado

Frontend - Componentes

BudgetModal.tsx base criado
BudgetItemForm.tsx - formulário de itens
BudgetItemsList.tsx - lista de itens
BudgetSummary.tsx - resumo financeiro
BookModal.tsx - cadastro de livros
OrderModal.tsx - pedidos

Frontend - Páginas

/budgets/page.tsx - lista
/budgets/[id]/page.tsx - detalhes
/orders/page.tsx - lista
/orders/[id]/page.tsx - detalhes
/production/page.tsx - kanban
/production/[id]/page.tsx - detalhes
/books/page.tsx - catálogo
/books/[id]/page.tsx - detalhes

Documentação

08-MIGRATION-GUIDE.md criado
Atualizar README.md
Atualizar 01-TYPES-COMPLETE.md
Atualizar 04-COMPONENTS-GUIDE.md

Testes

Fluxo Lead → Budget → Aprovação
Criação automática de Client/Book/Order/ProductionProject
CRUD completo de Budgets
Geração de números/códigos

🎯 PLANO DE AÇÃO IMEDIATO
Prioridade 1 (Hoje)

✅ Criar este documento
⏳ Finalizar componentes de Budget

BudgetItemForm
BudgetItemsList
BudgetSummary

⏳ Testar criação de orçamento completo

Prioridade 2 (Esta Semana)

⏳ Páginas /budgets e /budgets/[id]
⏳ Testar aprovação de orçamento
⏳ Migrar Firebase Functions

Prioridade 3 (Próxima Semana)

⏳ Módulo de Orders
⏳ Módulo de Production
⏳ Dashboard consolidado

📚 GLOSSÁRIO OFICIAL DDM
Termos Técnicos
PortuguêsInglêsUsoExemploOrçamentoBudget✅ Usar sempreconst budget: BudgetPedidoOrder✅ Usar sempreconst order: OrderLivroBook✅ Usar sempreconst book: BookProjeto ProduçãoProductionProject✅ Usar sempreconst project: ProductionProjectEtapaStage✅ Usar sempreconst stage: ProjectStageClienteClient✅ Usar sempreconst client: ClientLeadLead✅ Usar sempreconst lead: LeadCatálogoCatalog✅ Usar semprecatalogCode: "DDML0456"TiragemPrint Run✅ Usar sempreprintRun: 1000
Status
MóduloStatus PTStatus ENValoresLead--primeiro_contato, qualificado, proposta_enviada, negociacao, ganho, perdidoBudget--draft, sent, approved, rejected, expiredOrder--pending, confirmed, in_production, completed, cancelled, on_holdProductionProject--not_started, in_progress, paused, completed, cancelledStage--pending, in_progress, awaiting_approval, approved, completed, cancelled

🚨 REGRAS DE OURO

TODO código novo DEVE ser em INGLÊS
SEMPRE consultar este documento antes de criar types
NUNCA usar Budget - usar Budget
ProductionProject = produção editorial com stages
Project = gerenciamento CRM apenas
Seguir nomenclatura de 07-RENOMEACAO-INGLES.md
Consultar 01-TYPES-COMPLETE.md para types corretos
Verificar exports em 04-COMPONENTS-GUIDE.md

🔗 DOCUMENTOS RELACIONADOS

01-TYPES-COMPLETE.md - Tipos completos do sistema
07-RENOMEACAO-INGLES.md - Tabela completa de renomeação
04-COMPONENTS-GUIDE.md - Guia de componentes
02-FIREBASE-HOOKS.md - Hooks e Firebase
README.md - Visão geral do projeto

📞 SUPORTE
Dúvidas sobre nomenclatura?

Consulte este documento primeiro
Verifique 07-RENOMEACAO-INGLES.md
Confira 01-TYPES-COMPLETE.md

Ao criar novo código:

Leia este guia
Use inglês sempre
Siga estrutura de types existentes
Teste compilação TypeScript

Última atualização: 14 de outubro de 2025
Versão: 1.0
Status: ✅ Documento Oficial Ativo

🎯 CONCLUSÃO
Este documento é a fonte única da verdade sobre nomenclatura e estrutura do Sistema DDM. Qualquer confusão futura deve ser resolvida consultando este guia.
Princípio Fundamental:

"No Sistema DDM, tudo é em inglês. Budget é orçamento. ProductionProject é produção editorial. Budget não existe mais."
