🎨 ANÁLISE UX E COMPONENTES FALTANTES

📋 MAPEAMENTO COMPLETO
✅ O QUE JÁ EXISTE (CRM - Funcionando)
typescriptLEADS
├── LeadModal ✅ (criar/editar)
├── LeadCard ✅ (exibir)
├── LeadKanban ✅ (quadro)
└── /crm/leads/page.tsx ✅

CLIENTS
├── ClientModal ✅ (criar/editar)
├── ClientCard ✅ (exibir)
├── ClientsTable ✅ (lista)
└── /crm/clients/page.tsx ✅

PROJECTS (Gerencial CRM)
├── ProjectModal ✅ (criar/editar)
├── ProjectCard ✅ (exibir)
├── ProjectsTable ✅ (lista)
└── /crm/projects/page.tsx ✅

❌ O QUE ESTÁ FALTANDO (Módulo Comercial)
BUDGETS (Orçamentos)
typescript✅ BudgetModal (base criada, mas incompleta)
✅ BudgetCard (existe)
⏳ BudgetItemForm (criei agora)
⏳ BudgetItemsList (criei agora)
❌ BudgetSummary (resumo financeiro)
❌ BudgetsList (lista completa - existe mas precisa revisar)
❌ /budgets/page.tsx (lista)
❌ /budgets/[id]/page.tsx (detalhes)
BOOKS (Catálogo)
typescript❌ BookModal (criar livro no catálogo)
❌ BookCard (exibir livro)
❌ BookSpecsForm (especificações técnicas)
❌ /books/page.tsx (catálogo completo)
❌ /books/[id]/page.tsx (detalhes do livro)
ORDERS (Pedidos)
typescript❌ OrderModal (criar pedido - interno?)
❌ OrderCard (exibir pedido)
❌ OrderItemsList (itens do pedido)
❌ PaymentForm (registrar pagamento)
❌ /orders/page.tsx (lista)
❌ /orders/[id]/page.tsx (detalhes + pagamentos)
PRODUCTION (Produção)
typescript❌ ProductionProjectModal (criar projeto - interno?)
❌ StageCard (card de etapa)
❌ StageModal (editar etapa)
❌ StageTimeline (linha do tempo)
❌ FileUpload (upload de arquivos)
❌ /production/page.tsx (kanban de projetos)
❌ /production/[id]/page.tsx (detalhes + etapas)
```

---

## 🎯 LÓGICA UX PROPOSTA

### FLUXO DO USUÁRIO
```
1. LEAD (entrada do funil)
   └── LeadModal (usuário cria manualmente)

2. BUDGET (proposta)
   └── BudgetModal (usuário cria a partir do Lead)
       ├── Seleciona Lead
       ├── Adiciona itens (BudgetItemForm)
       ├── Define condições comerciais
       └── Envia para cliente

3. APROVAÇÃO (automática)
   └── Sistema cria automaticamente:
       ├── Client (interno)
       ├── Book (interno)
       ├── Order (interno)
       └── ProductionProject (interno)

4. ORDERS (gestão interna)
   └── Páginas administrativas
       ├── Ver pedidos
       ├── Registrar pagamentos
       └── Acompanhar status

5. PRODUCTION (operacional)
   └── Kanban de produção
       ├── Atualizar etapas
       ├── Fazer upload de arquivos
       └── Marcar conclusões

🧩 COMPONENTES POR NÍVEL DE ACESSO
👤 USUÁRIO COMERCIAL (Vendedor)
typescriptPODE CRIAR:
✅ LeadModal
✅ BudgetModal

PODE VER:
✅ Leads, Budgets
⚠️ Orders (só visualização)
❌ Production (não acessa)
👨‍💼 GERENTE COMERCIAL
typescriptPODE CRIAR:
✅ LeadModal
✅ BudgetModal
✅ ClientModal (converter Lead)

PODE VER/EDITAR:
✅ Leads, Budgets, Orders
⚠️ Production (só visualização)
👷 PRODUÇÃO
typescriptPODE CRIAR:
❌ (nada, recebe automaticamente)

PODE VER/EDITAR:
✅ Production (editar etapas)
⚠️ Orders (só visualização)
❌ Budgets (não acessa)
👨‍💻 ADMIN
typescriptPODE CRIAR/EDITAR TUDO:
✅ Leads, Clients, Budgets
✅ Books, Orders, Production

🎨 PROPOSTA DE MODAIS
MODAIS PARA USUÁRIO (Criar Manualmente)
1. LeadModal ✅ (já existe)
typescript- Nome, email, telefone
- Origem, probabilidade
- Observações
2. BudgetModal ⏳ (completar)
typescript- Selecionar Lead/Cliente
- Tipo de projeto
- Dados do projeto (título, autor)
- BudgetItemForm (adicionar itens)
  ├── Serviços editoriais
  ├── Impressão
  └── Extras
- Condições comerciais
- Descontos, validade
3. ClientModal ✅ (já existe - converter Lead)
typescript- Dados cadastrais
- Endereço
- Documentos

MODAIS INTERNOS (Criação Automática)
4. BookModal (quando aprovar Budget sem bookId)
typescript❌ Usuário NÃO cria diretamente
✅ Sistema cria ao aprovar Budget
⚠️ Mas precisa de modal para EDITAR depois
5. OrderModal (criado automaticamente)
typescript❌ Usuário NÃO cria
✅ Sistema cria ao aprovar Budget
⚠️ Modal só para ver detalhes
6. ProductionProjectModal (criado automaticamente)
typescript❌ Usuário NÃO cria
✅ Sistema cria ao aprovar Budget
⚠️ Modal só para editar etapas

📝 DECISÃO: O QUE CRIAR AGORA?
PRIORIDADE 1 (Essencial - Bloqueia Tudo)
typescript1. BudgetModal COMPLETO ⭐⭐⭐
   ├── BudgetItemForm ✅ (criei)
   ├── BudgetItemsList ✅ (criei)
   └── BudgetSummary ❌ (criar agora)

2. /budgets/page.tsx ⭐⭐⭐
   └── Lista de orçamentos com filtros

3. /budgets/[id]/page.tsx ⭐⭐⭐
   └── Detalhes + botão aprovar
PRIORIDADE 2 (Visualização)
typescript4. /orders/page.tsx ⭐⭐
   └── Lista de pedidos

5. /orders/[id]/page.tsx ⭐⭐
   ├── Detalhes do pedido
   └── Pagamentos (PaymentForm)

6. /books/page.tsx ⭐⭐
   └── Catálogo de livros
PRIORIDADE 3 (Operacional)
typescript7. /production/page.tsx ⭐
   └── Kanban de projetos

8. /production/[id]/page.tsx ⭐
   ├── Timeline de etapas
   └── Upload de arquivos

🤔 MINHA SUGESTÃO
AGORA (próximos passos):

✅ Criar BudgetSummary.tsx
✅ Completar BudgetModal.tsx
✅ Criar /budgets/page.tsx
✅ Criar /budgets/[id]/page.tsx
✅ Testar fluxo: Lead → Budget → Aprovação

Depois:

Orders (visualização)
Books (catálogo)
Production (operacional)