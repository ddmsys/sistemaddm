# 🎯 PLANO MESTRE INTEGRADO E DEFINITIVO - SISTEMA DDM

**Versão:** 3.0 Final Integrada  
**Data:** 18 de outubro de 2025  
**Objetivo:** Unificação de toda documentação existente + roadmap completo

---

## 📊 VISÃO EXECUTIVA

### Sistema DDM é uma plataforma completa de gestão empresarial com **6 MÓDULOS**:

| Módulo                 | Funcionalidades                              | Status Atual | Prioridade |
| ---------------------- | -------------------------------------------- | ------------ | ---------- |
| 🏢 **Comercial (CRM)** | Leads, Budgets, Projects, Clients, Dashboard | 🟡 70%       | 🔴 CRÍTICA |
| 🎨 **Produção**        | Queue, Proofs, Quality, Dashboard            | ⚪ 0%        | 🟠 ALTA    |
| 💰 **Financeiro**      | Invoices, Payments, Reports, Dashboard       | ⚪ 0%        | 🟠 ALTA    |
| 🛒 **Compras**         | Suppliers, Purchases, Dashboard              | ⚪ 0%        | 🟡 MÉDIA   |
| 🚚 **Logística**       | Shipments, Tracking, Dashboard               | ⚪ 0%        | 🟡 MÉDIA   |
| 📣 **Marketing**       | Campaigns, Creatives, Dashboard              | ⚪ 0%        | 🟢 BAIXA   |

**Total de Funcionalidades:** 22 áreas principais  
**Estimativa de Conclusão:** 15-20 semanas (3,5-5 meses)

---

## ✅ O QUE JÁ ESTÁ PRONTO (Status Real)

### 1. ✅ INFRAESTRUTURA (100%)

**Backend (Firebase)**

- ✅ Firebase configurado (região São Paulo)
- ✅ Firestore Database
- ✅ Authentication
- ✅ Cloud Functions estruturadas
- ✅ Storage configurado

**Frontend (Next.js 14)**

- ✅ Next.js com App Router
- ✅ TypeScript 5.x
- ✅ Tailwind CSS + Shadcn UI
- ✅ Estrutura de pastas definida
- ✅ Sistema de rotas

### 2. ✅ TIPOS TYPESCRIPT (100%)

**Interfaces Completas:**

- ✅ `Lead` - Prospecção comercial
- ✅ `Client` - Base de clientes
- ✅ `Budget` - Orçamentos (migrado de Quote)
- ✅ `Book` - Catálogo de livros
- ✅ `Order` - Pedidos de venda
- ✅ `ProductionProject` - Projetos em produção
- ✅ `Project` - Projetos CRM
- ✅ Enums de status (LeadStatus, BudgetStatus, etc)
- ✅ Tipos de formulários (LeadFormData, BudgetFormData)

### 3. ✅ HOOKS FIREBASE (100%)

**Hooks Implementados:**

- ✅ `useAuth.ts` - Autenticação
- ✅ `useLeads.ts` - CRUD de leads
- ✅ `useClients.ts` - CRUD de clientes
- ✅ `useBudgets.ts` - CRUD de orçamentos
- ✅ `useProjects.ts` - CRUD de projetos
- ✅ `useFirestore.ts` - Hook genérico

### 4. 🟡 MÓDULO COMERCIAL (70%)

**✅ Páginas Criadas:**

- ✅ `/crm/leads` - Lista de leads
- ✅ `/crm/leads/[id]` - Detalhes do lead
- ✅ `/crm/clients` - Lista de clientes
- ✅ `/crm/projects` - Lista de projetos
- ✅ `/crm/budgets` - Lista de orçamentos

**✅ Componentes Básicos:**

- ✅ `LeadModal` - Criar/editar leads
- ✅ `ClientModal` - Criar/editar clientes
- ✅ `ProjectModal` - Criar/editar projetos
- ✅ `LeadCard` - Card de exibição
- ✅ Cards de KPI básicos

**🟡 Componentes Incompletos:**

- 🟡 `BudgetModal` - Falta itens de serviço/impressão
- 🟡 Dashboard Comercial - Apenas estrutura básica
- ❌ Detalhes do Budget (`/crm/budgets/[id]`)
- ❌ Gestão de Books (catálogo)
- ❌ Gestão de Orders (pedidos)

### 5. ✅ CLOUD FUNCTIONS (100%)

**Functions Implementadas:**

- ✅ `onBudgetSigned` - Trigger de aprovação
  - Cria Cliente automaticamente
  - Cria Book (catálogo)
  - Cria Order (pedido)
  - Cria ProductionProject
  - Gera números sequenciais
- ✅ Geração de PDF de orçamentos
- ✅ Sistema de numeração automática

---

## ⚠️ PROBLEMAS IDENTIFICADOS (Resolver AGORA)

### 🔴 CRÍTICO - Impedem funcionamento

1. **Nomenclatura Inconsistente**

   - ❌ Código usa `onSave` mas deveria ser `onSubmit`
   - ❌ Mistura de `Quote` e `Budget` em alguns lugares

2. **BudgetModal Incompleto**

   - ❌ Falta formulário de itens de Serviço Editorial
   - ❌ Falta formulário de itens de Impressão
   - ❌ Falta cálculo automático de subtotais
   - ❌ Falta validação de campos obrigatórios

3. **Fluxos Não Testados**
   - ❌ Conversão Lead → Cliente não testada
   - ❌ Aprovação de Budget → Criação automática não testada
   - ❌ Fluxo completo end-to-end não validado

---

## 🗺️ ROADMAP COMPLETO INTEGRADO

### 📅 FASE 1: CORREÇÃO E ESTABILIZAÇÃO (1-2 semanas)

**Objetivo:** Corrigir problemas críticos e completar MVP Comercial

#### 1.1 Corrigir Nomenclaturas ⚠️ URGENTE

**Arquivos afetados:**

```
src/components/comercial/modals/BudgetModal.tsx
src/app/(app)/crm/budgets/page.tsx
src/hooks/comercial/useBudgets.ts
```

**Ações:**

- [ ] Trocar `onSave` por `onSubmit` em todos os modais

- [ ] Verificar imports e exports

**Tempo:** 1 dia

#### 1.2 Completar BudgetModal

**Arquivo:** `src/components/comercial/modals/BudgetModal.tsx`

**Funcionalidades a adicionar:**

- [ ] Seção de Serviços Editoriais
  - Revisão textual
  - Diagramação
  - Capa/Arte
  - Conversão digital
- [ ] Seção de Impressão
  - Especificações do livro (formato, páginas, papel)
  - Acabamento (capa dura, brochura)
  - Quantidade
  - Cálculo automático
- [ ] Seção de Extras
  - Provas físicas
  - Frete
  - Outros serviços
- [ ] Cálculo automático de totais
- [ ] Validação de campos obrigatórios

**Tempo:** 3 dias

#### 1.3 Criar Página de Detalhes do Budget

**Arquivo:** `src/app/(app)/crm/budgets/[id]/page.tsx`

**Funcionalidades:**

- [ ] Exibir todos os dados do orçamento
- [ ] Tabela de itens formatada
- [ ] Botões de ação:
  - Aprovar/Rejeitar
  - Gerar PDF
  - Enviar por email
  - Editar
  - Duplicar
- [ ] Histórico de alterações
- [ ] Link para Cliente/Lead relacionado
- [ ] Status visual com badges

**Tempo:** 2 dias

#### 1.4 Testar Fluxo Completo End-to-End

**Cenário de Teste:**

1. Criar novo Lead
2. Qualificar Lead → Converter em Cliente
3. Criar Budget vinculado ao Cliente
4. Preencher itens (serviços + impressão)
5. Aprovar Budget (mudar status para "approved")
6. Verificar criação automática:
   - Cliente (se não existia)
   - Book com catalogCode
   - Order com número
   - ProductionProject
7. Verificar numeração sequencial

**Tempo:** 2 dias

**🎯 ENTREGA FASE 1:** MVP Comercial 100% funcional e testado

---

### 📅 FASE 2: COMPLETAR MÓDULO COMERCIAL (2-3 semanas)

#### 2.1 Gestão de Books (Catálogo)

**Páginas:**

- [ ] `/crm/books/page.tsx` - Lista de livros
- [ ] `/crm/books/[id]/page.tsx` - Detalhes

**Componentes:**

- [ ] `BookModal.tsx` - Criar/editar
- [ ] `BookCard.tsx` - Card de exibição
- [ ] `BookSpecsForm.tsx` - Especificações técnicas

**Funcionalidades:**

- [ ] CRUD completo
- [ ] Especificações técnicas:
  - Formato (A4, A5, etc)
  - Número de páginas
  - Tipo de papel (miolo e capa)
  - Acabamento
  - Cores (4x4, 4x0, PB)
- [ ] Upload de arquivos (capa, miolo)
- [ ] Vínculo com Cliente
- [ ] Geração de catalogCode (DDML0001, DDML0002...)

**Tempo:** 4 dias

#### 2.2 Gestão de Orders (Pedidos)

**Páginas:**

- [ ] `/crm/orders/page.tsx` - Lista de pedidos
- [ ] `/crm/orders/[id]/page.tsx` - Detalhes

**Componentes:**

- [ ] `OrderCard.tsx`
- [ ] `OrderTimeline.tsx` - Linha do tempo
- [ ] `PaymentForm.tsx` - Registrar pagamentos

**Funcionalidades:**

- [ ] Visualizar pedidos criados automaticamente
- [ ] Registrar pagamentos (parcial/total)
- [ ] Alterar status (pendente → pago → produção)
- [ ] Enviar para produção
- [ ] Cancelar pedido
- [ ] Gerar nota fiscal (integração futura)

**Tempo:** 3 dias

#### 2.3 Dashboard Comercial Completo

**Arquivo:** `src/components/comercial/dashboards/CommercialDashboard.tsx`

**Métricas e Visualizações:**

- [ ] **Funil de Vendas**
  - Por estágio (primeiro_contato → fechado_ganho)
  - Taxa de conversão entre estágios
  - Valor em cada estágio
- [ ] **Receita**
  - Receita mensal (últimos 6 meses)
  - Meta vs realizado
  - Projeção baseada em pipeline
- [ ] **Performance**
  - Top 5 clientes por valor
  - Performance por vendedor
  - Distribuição por fonte de lead
- [ ] **Projetos**
  - Orçamentos pendentes de aprovação
  - Projetos em andamento
  - Projetos críticos (prazo próximo)
- [ ] **KPIs**
  - Taxa de conversão Lead → Cliente
  - Ticket médio
  - Tempo médio de fechamento
  - NPS (futuro)

**Gráficos:**

- [ ] Funil interativo (clicável)
- [ ] Linha de receita mensal
- [ ] Pizza de distribuição por fonte
- [ ] Barras de performance por vendedor
- [ ] Tabela de projetos críticos

**Filtros:**

- [ ] Período (mensal, trimestral, anual, customizado)
- [ ] Vendedor
- [ ] Fonte de lead
- [ ] Status

**Tempo:** 5 dias

#### 2.4 Sistema de Notificações

**Hook:** `src/hooks/useNotifications.ts`

**Tipos de Notificação:**

- [ ] Novo lead criado
- [ ] Lead qualificado
- [ ] Orçamento enviado para cliente
- [ ] Orçamento aprovado
- [ ] Orçamento rejeitado
- [ ] Pedido criado
- [ ] Pagamento recebido
- [ ] Projeto iniciou produção
- [ ] Prazo de entrega próximo (3 dias)
- [ ] Prova enviada para aprovação

**Funcionalidades:**

- [ ] Toast de notificação (in-app)
- [ ] Email de notificação (via Cloud Function)
- [ ] Badge de contagem
- [ ] Centro de notificações
- [ ] Marcar como lida
- [ ] Filtrar por tipo

**Tempo:** 2 dias

**🎯 ENTREGA FASE 2:** Módulo Comercial 100% completo

---

### 📅 FASE 3: MÓDULO DE PRODUÇÃO (3-4 semanas)

#### 3.1 Dashboard de Produção

**Página:** `src/app/(app)/production/dashboard/page.tsx`

**Métricas:**

- [ ] Projetos por status (Kanban visual)
- [ ] Fila de produção (ordenada por prioridade)
- [ ] Provas pendentes de aprovação
- [ ] Prazos críticos (próximos 7 dias)
- [ ] Capacidade produtiva
  - Horas disponíveis
  - Horas alocadas
  - Taxa de utilização
- [ ] Tempo médio por etapa
- [ ] Taxa de aprovação first-time

**Visualizações:**

- [ ] Kanban de projetos (drag-and-drop)
- [ ] Calendário de prazos
- [ ] Lista de aprovações pendentes
- [ ] Cards de métricas
- [ ] Gráfico de capacidade vs demanda

**Tempo:** 5 dias

#### 3.2 Gestão de Projetos de Produção

**Páginas:**

- [ ] `/production/projects/page.tsx` - Lista
- [ ] `/production/projects/[id]/page.tsx` - Detalhes

**Componentes:**

- [ ] `ProductionProjectCard.tsx`
- [ ] `StageTimeline.tsx` - Timeline de etapas
- [ ] `FileUpload.tsx` - Upload de arquivos
- [ ] `ProofApproval.tsx` - Aprovação de provas
- [ ] `QualityChecklist.tsx`

**Etapas do Projeto:**

1. Preparação → Receber materiais, briefing
2. Revisão → Revisão textual
3. Diagramação → Layout e formatação
4. Capa → Criação da capa
5. Prova → Envio para cliente
6. Aprovação → Aguardar aprovação
7. Impressão → Enviar para gráfica
8. Entrega → Produto final

**Funcionalidades:**

- [ ] Kanban de etapas (arrastar e soltar)
- [ ] Atribuir responsável por etapa
- [ ] Upload de arquivos por etapa
- [ ] Comentários por etapa
- [ ] Registrar tempo gasto
- [ ] Enviar prova para cliente
- [ ] Registrar feedback do cliente
- [ ] Marcar etapa como concluída
- [ ] Checklist de qualidade

**Tempo:** 6 dias

#### 3.3 Fila de Produção

**Página:** `src/app/(app)/production/queue/page.tsx`

**Funcionalidades:**

- [ ] Visualizar projetos em fila
- [ ] Ordenar por:
  - Prioridade (urgente → baixa)
  - Prazo (mais próximo primeiro)
  - Valor (maior valor primeiro)
  - Data de entrada
- [ ] Drag-and-drop para reordenar
- [ ] Iniciar próximo projeto
- [ ] Pausar projeto
- [ ] Filtrar por tipo (Livro, eBook, Catálogo)
- [ ] Estimativa de tempo total
- [ ] Visão de recursos disponíveis

**Componentes:**

- [ ] `QueueTable.tsx` - Tabela interativa
- [ ] `ProjectPriorityBadge.tsx`
- [ ] `TimeEstimate.tsx`

**Tempo:** 3 dias

#### 3.4 Gestão de Provas

**Página:** `src/app/(app)/production/proofs/page.tsx`

**Funcionalidades:**

- [ ] Lista de provas enviadas
- [ ] Status:
  - Pendente de envio
  - Enviada (aguardando)
  - Em revisão pelo cliente
  - Aprovada
  - Rejeitada (com feedback)
- [ ] Upload de PDF de prova
- [ ] Enviar por email para cliente
- [ ] Link de aprovação online (portal)
- [ ] Registrar feedback do cliente
- [ ] Histórico de versões
- [ ] Gerar nova versão
- [ ] Comparar versões (diff visual)

**Componentes:**

- [ ] `ProofCard.tsx`
- [ ] `ProofViewer.tsx` - Visualizador de PDF
- [ ] `FeedbackForm.tsx`
- [ ] `VersionHistory.tsx`

**Tempo:** 4 dias

#### 3.5 Controle de Qualidade

**Página:** `src/app/(app)/production/quality/page.tsx`

**Checklists por Tipo:**

- [ ] **Revisão Textual**
  - Ortografia verificada
  - Gramática verificada
  - Formatação consistente
  - Sumário conferido
- [ ] **Diagramação**
  - Margens corretas
  - Numeração de páginas
  - Cabeçalhos/rodapés
  - Imagens posicionadas
  - Quebras de página
- [ ] **Capa**
  - Especificações corretas
  - Cores aprovadas
  - Textos verificados
  - Código de barras
  - ISBN
- [ ] **Impressão**
  - Arquivo fechado corretamente
  - Sangria configurada
  - Resolução adequada (300dpi)
  - Cores em CMYK
  - PDF/X-1a

**Funcionalidades:**

- [ ] Checklists predefinidos por tipo
- [ ] Marcar itens como OK/NOK
- [ ] Adicionar observações
- [ ] Anexar fotos/prints
- [ ] Aprovar/Reprovar etapa
- [ ] Histórico de QC

**Tempo:** 2 dias

**🎯 ENTREGA FASE 3:** Módulo de Produção completo

---

### 📅 FASE 4: MÓDULO FINANCEIRO (2-3 semanas)

#### 4.1 Dashboard Financeiro

**Página:** `src/app/(app)/finance/dashboard/page.tsx`

**Métricas:**

- [ ] Receita do mês
- [ ] Despesas do mês
- [ ] Lucro líquido
- [ ] Margem de lucro (%)
- [ ] Contas a receber (total e por vencer)
- [ ] Contas a pagar (total e vencidas)
- [ ] Fluxo de caixa projetado (90 dias)
- [ ] Taxa de inadimplência
- [ ] Receita por cliente (top 10)
- [ ] Receita por tipo de serviço

**Gráficos:**

- [ ] Linha: Receita vs Despesa (6 meses)
- [ ] Barras: Receita por cliente
- [ ] Pizza: Despesas por categoria
- [ ] Área: Fluxo de caixa projetado
- [ ] Barras horizontais: Receita por serviço

**Tempo:** 4 dias

#### 4.2 Gestão de Faturas

**Páginas:**

- [ ] `/finance/invoices/page.tsx` - Lista
- [ ] `/finance/invoices/[id]/page.tsx` - Detalhes

**Funcionalidades:**

- [ ] Criar fatura manualmente
- [ ] Vincular fatura a pedido (automático)
- [ ] Status:
  - Rascunho
  - Emitida
  - Enviada
  - Paga
  - Vencida
  - Cancelada
- [ ] Registrar pagamento (parcial/total)
- [ ] Gerar PDF da fatura
- [ ] Enviar por email
- [ ] Gerar segunda via
- [ ] Lançar automaticamente no caixa
- [ ] Integração com sistema de NF-e (futuro)

**Componentes:**

- [ ] `InvoiceModal.tsx`
- [ ] `InvoiceCard.tsx`
- [ ] `PaymentModal.tsx`
- [ ] `InvoicePDF.tsx` - Template PDF

**Tempo:** 4 dias

#### 4.3 Controle de Pagamentos

**Página:** `src/app/(app)/finance/payments/page.tsx`

**Funcionalidades:**

- [ ] Lista de pagamentos recebidos
- [ ] Filtros:
  - Período
  - Forma de pagamento (PIX, boleto, cartão, etc)
  - Cliente
  - Status
- [ ] Conciliar pagamento com fatura
- [ ] Registrar pagamento avulso
- [ ] Exportar relatório
- [ ] Gráfico de pagamentos por forma

**Tempo:** 2 dias

#### 4.4 Relatórios Financeiros

**Página:** `src/app/(app)/finance/reports/page.tsx`

**Relatórios:**

- [ ] **Faturamento Mensal**
  - Total faturado
  - Total recebido
  - A receber
- [ ] **Receita por Cliente**
  - Ranking de clientes
  - Ticket médio
  - Frequência
- [ ] **Receita por Serviço**
  - Serviços mais vendidos
  - Margem por serviço
- [ ] **Despesas por Categoria**
  - Gráfica
  - Fornecedores
  - Salários
  - Infraestrutura
- [ ] **Lucro por Projeto**
  - Receita vs Custo
  - Margem de lucro
- [ ] **DRE (Demonstração de Resultado)**
  - Receita bruta
  - Deduções
  - Receita líquida
  - Custos
  - Despesas
  - Lucro líquido

**Formatos de Exportação:**

- [ ] PDF
- [ ] Excel (XLSX)
- [ ] CSV

**Tempo:** 3 dias

#### 4.5 Contas a Pagar

**Página:** `src/app/(app)/finance/expenses/page.tsx`

**Funcionalidades:**

- [ ] Registrar despesa
- [ ] Categorias:
  - Gráfica
  - Fornecedor
  - Salários
  - Marketing
  - Infraestrutura
  - Impostos
  - Outras
- [ ] Agendar pagamento recorrente
- [ ] Marcar como paga
- [ ] Anexar comprovante
- [ ] Alertas de vencimento
- [ ] Projeção de despesas

**Tempo:** 2 dias

**🎯 ENTREGA FASE 4:** Módulo Financeiro completo

---

### 📅 FASE 5: MÓDULOS SECUNDÁRIOS (2-3 semanas)

#### 5.1 Módulo de Compras

**Páginas:**

- [ ] `/purchases/dashboard/page.tsx`
- [ ] `/purchases/suppliers/page.tsx`
- [ ] `/purchases/quotes/page.tsx`

**Funcionalidades:**

- [ ] Cadastro de fornecedores
- [ ] Cotações de preços
- [ ] Comparação de cotações
- [ ] Ordem de compra
- [ ] Controle de estoque básico
- [ ] Avaliação de fornecedores

**Tempo:** 5 dias

#### 5.2 Módulo de Logística

**Páginas:**

- [ ] `/logistics/dashboard/page.tsx`
- [ ] `/logistics/shipments/page.tsx`

**Funcionalidades:**

- [ ] Cadastro de transportadoras
- [ ] Registro de envios
- [ ] Rastreamento de entregas
- [ ] Integração com Correios API
- [ ] Custo de frete por região
- [ ] Performance de transportadoras

**Tempo:** 5 dias

#### 5.3 Módulo de Marketing

**Páginas:**

- [ ] `/marketing/dashboard/page.tsx`
- [ ] `/marketing/campaigns/page.tsx`
- [ ] `/marketing/creatives/page.tsx`

**Funcionalidades:**

- [ ] Gestão de campanhas
- [ ] Criação de criativos
- [ ] ROI por canal
- [ ] Tracking de origem de leads
- [ ] Email marketing básico
- [ ] Calendário editorial

**Tempo:** 5 dias

**🎯 ENTREGA FASE 5:** Todos os 6 módulos implementados

---

### 📅 FASE 6: FUNCIONALIDADES AVANÇADAS (2-3 semanas)

#### 6.1 Sistema de Permissões (RBAC)

**Arquivo:** `src/lib/permissions.ts`

**Perfis:**

- [ ] **Admin** - Acesso total
- [ ] **Comercial** - CRM + Dashboards
- [ ] **Produção** - Projetos + Provas + Qualidade
- [ ] **Financeiro** - Faturas + Pagamentos + Relatórios
- [ ] **Compras** - Fornecedores + Cotações
- [ ] **Marketing** - Campanhas + Criativos
- [ ] **Cliente** - Apenas seus projetos (Portal)

**Funcionalidades:**

- [ ] Middleware de verificação
- [ ] Proteção de rotas por perfil
- [ ] Proteção de ações por perfil
- [ ] Logs de auditoria
- [ ] Gestão de usuários e perfis

**Tempo:** 3 dias

#### 6.2 Portal do Cliente

**Páginas:**

- [ ] `/portal/page.tsx` - Dashboard do cliente
- [ ] `/portal/projects/[id]/page.tsx` - Detalhes do projeto

**Funcionalidades:**

- [ ] Visualizar projetos do cliente
- [ ] Acompanhar status em tempo real
- [ ] Baixar provas
- [ ] Aprovar/Rejeitar provas
- [ ] Comentários e feedback
- [ ] Visualizar faturas
- [ ] Histórico de pedidos

**Tempo:** 4 dias

#### 6.3 Sistema de Busca Global

**Componente:** `src/components/GlobalSearch.tsx`

**Funcionalidades:**

- [ ] Buscar em todas as coleções:
  - Leads
  - Clientes
  - Projetos
  - Orçamentos
  - Pedidos
  - Livros
- [ ] Atalho de teclado (Cmd/Ctrl + K)
- [ ] Busca inteligente (fuzzy search)
- [ ] Filtros rápidos
- [ ] Histórico de buscas

**Tempo:** 2 dias

#### 6.4 Exportação de Relatórios

**Formatos:**

- [ ] PDF (todas as páginas)
- [ ] Excel (listas e tabelas)
- [ ] CSV (dados brutos)

**Funcionalidades:**

- [ ] Exportar listas filtradas
- [ ] Exportar dashboards
- [ ] Agendar relatórios automáticos
- [ ] Enviar por email

**Tempo:** 2 dias

#### 6.5 Integração com Email

**Cloud Functions:**

- [ ] Envio de orçamentos
- [ ] Envio de provas
- [ ] Envio de faturas
- [ ] Notificações automáticas
- [ ] Lembrete de pagamentos

**Provider:** SendGrid ou Mailgun

**Tempo:** 3 dias

#### 6.6 Histórico de Atividades

**Coleção:** `activities` no Firestore

**Funcionalidades:**

- [ ] Registrar todas as ações:
  - Criação de registros
  - Edição de registros
  - Exclusão de registros
  - Mudança de status
  - Upload de arquivos
  - Envio de emails
- [ ] Timeline de atividades
- [ ] Filtros por usuário, tipo, data
- [ ] Logs de auditoria

**Tempo:** 2 dias

**🎯 ENTREGA FASE 6:** Sistema completo com funcionalidades avançadas

---

### 📅 FASE 7: TESTES E OTIMIZAÇÃO (1-2 semanas)

#### 7.1 Testes de Integração

**Fluxos a testar:**

- [ ] Lead → Cliente → Orçamento → Pedido → Produção → Entrega
- [ ] Criação de livro com especificações
- [ ] Aprovação de prova com feedback
- [ ] Geração de fatura e pagamento
- [ ] Notificações automáticas
- [ ] Portal do cliente

**Tempo:** 3 dias

#### 7.2 Testes de Performance

**Otimizações:**

- [ ] Índices compostos no Firestore
- [ ] Paginação de listas
- [ ] Lazy loading de componentes
- [ ] Otimização de queries
- [ ] Cache de dados
- [ ] Compressão de imagens

**Tempo:** 2 dias

#### 7.3 Testes de Segurança

**Verificações:**

- [ ] Firestore Security Rules
- [ ] Validação de inputs
- [ ] Proteção XSS/SQL Injection
- [ ] Permissões de usuário
- [ ] Criptografia de dados sensíveis

**Tempo:** 2 dias

#### 7.4 Melhorias de UX

**Melhorias:**

- [ ] Loading states
- [ ] Mensagens de erro claras
- [ ] Feedback visual de ações
- [ ] Responsividade mobile
- [ ] Acessibilidade (a11y)
- [ ] Animações suaves

**Tempo:** 2 dias

**🎯 ENTREGA FASE 7:** Sistema testado e otimizado

---

### 📅 FASE 8: DEPLOY E DOCUMENTAÇÃO (1 semana)

#### 8.1 Preparação para Produção

**Checklist:**

- [ ] Variáveis de ambiente configuradas
- [ ] Domínio personalizado configurado
- [ ] SSL/HTTPS configurado
- [ ] Backup automático do Firestore
- [ ] Monitoramento de erros (Sentry)
- [ ] Analytics configurado

**Tempo:** 2 dias

#### 8.2 Deploy

**Plataformas:**

- [ ] Frontend → Vercel
- [ ] Functions → Firebase
- [ ] Firestore Rules → Firebase

**Tempo:** 1 dia

#### 8.3 Documentação

**Documentos:**

- [ ] Manual do usuário (PDF)
- [ ] Vídeos tutoriais
- [ ] FAQ
- [ ] Documentação técnica
- [ ] Guia de deploy

**Tempo:** 2 dias

**🎯 ENTREGA FASE 8:** Sistema em produção

---

## 📊 CRONOGRAMA CONSOLIDADO

| Fase       | Descrição                  | Duração           | Acumulado       |
| ---------- | -------------------------- | ----------------- | --------------- |
| **Fase 1** | Correção e Estabilização   | 1-2 semanas       | 2 semanas       |
| **Fase 2** | Completar Módulo Comercial | 2-3 semanas       | 5 semanas       |
| **Fase 3** | Módulo de Produção         | 3-4 semanas       | 9 semanas       |
| **Fase 4** | Módulo Financeiro          | 2-3 semanas       | 12 semanas      |
| **Fase 5** | Módulos Secundários        | 2-3 semanas       | 15 semanas      |
| **Fase 6** | Funcionalidades Avançadas  | 2-3 semanas       | 18 semanas      |
| **Fase 7** | Testes e Otimização        | 1-2 semanas       | 20 semanas      |
| **Fase 8** | Deploy e Documentação      | 1 semana          | 21 semanas      |
| **TOTAL**  |                            | **15-21 semanas** | **≈ 4-5 meses** |

---

## 🎯 PRIORIZAÇÃO DE TAREFAS

### 🔴 CRÍTICO (Fazer AGORA - Semana 1)

1. ✅ Corrigir erro `onSave` → `onSubmit` no BudgetModal
2. ✅ Completar BudgetModal com todos os tipos de itens
3. ✅ Criar página de detalhes do Budget
4. ✅ Testar fluxo completo End-to-End

### 🟠 ALTA (Próximas 2-3 semanas)

1. Gestão de Books (Catálogo)
2. Gestão de Orders (Pedidos)
3. Dashboard Comercial completo
4. Sistema de Notificações

### 🟡 MÉDIA (Próximas 4-8 semanas)

1. Módulo de Produção completo
2. Módulo Financeiro completo
3. Portal do Cliente

### 🟢 BAIXA (Próximas 9+ semanas)

1. Módulo de Compras
2. Módulo de Logística
3. Módulo de Marketing
4. Funcionalidades avançadas

---

## 🏗️ ESTRUTURA DE ARQUIVOS DEFINITIVA

```
sistemaddm/
├── docs/                           # Documentação
│   ├── 00-OVERVIEW.md
│   ├── 01-TYPES-COMPLETE.md
│   ├── 02-FIREBASE-HOOKS.md
│   ├── 03-CRM-MODULE.md
│   ├── 04-COMPONENTS-GUIDE.md
│   ├── 05-QUICK-START-EXAMPLES.md
│   ├── Plano_Mestre_IA.md
│   ├── INSTRUCOES-IA.md
│   └── PLANO-MESTRE-INTEGRADO-COMPLETO.md  # 🆕 Este arquivo
│
├── functions/                      # Cloud Functions
│   ├── src/
│   │   ├── clients/
│   │   │   ├── assignClientNumber.ts
│   │   │   └── createClient.ts
│   │   ├── budgets/
│   │   │   ├── createBudgetPdf.ts
│   │   │   └── onBudgetSigned.ts
│   │   ├── projects/
│   │   ├── pdfs/
│   │   ├── notifications/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── src/                            # Frontend
│   ├── app/
│   │   ├── (authenticated)/        # Route group protegido
│   │   │   ├── crm/                # 🏢 COMERCIAL
│   │   │   │   ├── dashboard/
│   │   │   │   ├── leads/
│   │   │   │   ├── clients/
│   │   │   │   ├── budgets/
│   │   │   │   ├── projects/
│   │   │   │   ├── books/          # 🆕 A criar
│   │   │   │   └── orders/         # 🆕 A criar
│   │   │   │
│   │   │   ├── production/         # 🎨 PRODUÇÃO
│   │   │   │   ├── dashboard/
│   │   │   │   ├── queue/
│   │   │   │   ├── proofs/
│   │   │   │   └── quality/
│   │   │   │
│   │   │   ├── finance/            # 💰 FINANCEIRO
│   │   │   │   ├── dashboard/
│   │   │   │   ├── invoices/
│   │   │   │   ├── payments/
│   │   │   │   └── reports/
│   │   │   │
│   │   │   ├── purchases/          # 🛒 COMPRAS
│   │   │   │   ├── dashboard/
│   │   │   │   ├── suppliers/
│   │   │   │   └── quotes/
│   │   │   │
│   │   │   ├── logistics/          # 🚚 LOGÍSTICA
│   │   │   │   ├── dashboard/
│   │   │   │   └── shipments/
│   │   │   │
│   │   │   └── marketing/          # 📣 MARKETING
│   │   │       ├── dashboard/
│   │   │       ├── campaigns/
│   │   │       └── creatives/
│   │   │
│   │   ├── dashboard/              # 📊 Dashboard Executivo
│   │   ├── portal/                 # 🌐 Portal do Cliente
│   │   ├── login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                     # Componentes base
│   │   ├── comercial/              # Componentes CRM
│   │   │   ├── modals/
│   │   │   ├── cards/
│   │   │   ├── charts/
│   │   │   ├── tables/
│   │   │   ├── forms/
│   │   │   ├── dashboards/
│   │   │   └── filters/
│   │   ├── production/             # Componentes Produção
│   │   ├── finance/                # Componentes Financeiro
│   │   ├── dashboards/             # Dashboards gerais
│   │   ├── layout/                 # Layout components
│   │   ├── charts/                 # Gráficos reutilizáveis
│   │   └── shared/                 # Compartilhados
│   │
│   ├── hooks/
│   │   ├── comercial/
│   │   │   ├── useLeads.ts
│   │   │   ├── useBudgets.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useClients.ts
│   │   │   ├── useBooks.ts         # 🆕 A criar
│   │   │   ├── useOrders.ts        # 🆕 A criar
│   │   │   ├── useFunnelData.ts
│   │   │   └── useCommercialMetrics.ts
│   │   ├── production/
│   │   ├── finance/
│   │   └── shared/
│   │       ├── useAuth.ts
│   │       ├── usePermissions.ts
│   │       ├── useFilters.ts
│   │       └── useNotifications.ts  # 🆕 A criar
│   │
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── types/
│   │   │   ├── comercial.ts
│   │   │   ├── production.ts
│   │   │   ├── finance.ts
│   │   │   └── shared.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── permissions.ts          # 🆕 A criar
│   │   ├── validations.ts
│   │   └── formatters.ts
│   │
│   └── middleware.ts                # 🆕 A criar
│
├── config/
│   ├── firestore.rules
│   ├── storage.rules
│   └── firestore.indexes.json
│
├── .env.local
├── firebase.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📝 DESIGN SYSTEM

### Paleta de Cores

```css
/* Primary */
--primary: #1e293b; /* slate-800 */
--primary-hover: #0f172a; /* slate-900 */

/* Secondary */
--secondary: #64748b; /* slate-500 */

/* Accent */
--accent: #3b82f6; /* blue-500 */
--accent-hover: #2563eb; /* blue-600 */

/* Status */
--success: #10b981; /* emerald-500 */
--warning: #f59e0b; /* amber-500 */
--danger: #ef4444; /* red-500 */
--info: #06b6d4; /* cyan-500 */

/* Background */
--background: #f8fafc; /* slate-50 */
--card: #ffffff;
--border: #e2e8f0; /* slate-200 */
```

### Tipografia

- **Font:** Inter, system-ui, sans-serif
- **Tamanhos:** 12px, 14px, 16px, 18px, 20px, 24px
- **Pesos:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Componentes

- **Cards:** `rounded-lg shadow-sm border p-6`
- **Buttons:** `rounded-lg px-4 py-2 font-medium transition-colors`
- **Inputs:** `rounded-lg border-slate-300 focus:border-blue-500`
- **Badges:** `rounded-full px-2.5 py-0.5 text-xs font-medium`

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

### Para HOJE/AMANHÃ:

1. ✅ Corrigir erro `onSave` → `onSubmit` em BudgetList
2. ✅ Verificar se página de Budgets carrega sem erros
3. ✅ Tirar print do Firestore (mostrar coleções existentes)

### Para a PRÓXIMA SEMANA:

4. ✅ Completar BudgetModal (formulário completo)
5. ✅ Criar página de detalhes do Budget
6. ✅ Testar aprovação de orçamento End-to-End
7. ✅ Verificar se trigger cria Cliente, Book, Order, ProductionProject

---

## 📚 REFERÊNCIAS

**Documentos Base:**

- `00-OVERVIEW.md` - Visão geral e arquitetura
- `01-TYPES-COMPLETE.md` - Tipos TypeScript
- `02-FIREBASE-HOOKS.md` - Hooks do Firebase
- `03-CRM-MODULE.md` - Módulo CRM
- `04-COMPONENTS-GUIDE.md` - Guia de componentes
- `05-QUICK-START-EXAMPLES.md` - Exemplos práticos
- `Plano_Mestre_IA.md` - Plano mestre resumido
- `Documentacao-completa-ddm.md` - Documentação detalhada
- `INSTRUCOES-IA.md` - Instruções para IA

**Este Documento:**

- `PLANO-MESTRE-INTEGRADO-COMPLETO.md` - **Plano definitivo integrado**

---

## ✅ CONCLUSÃO

Este é o **PLANO MESTRE INTEGRADO E DEFINITIVO** do Sistema DDM, unificando:

✅ Toda documentação existente  
✅ Análise da documentação completa  
✅ Status real do desenvolvimento  
✅ Problemas identificados  
✅ Roadmap completo detalhado  
✅ Cronograma realista  
✅ Estrutura de arquivos final  
✅ Design system  
✅ Próximos passos claros

**Agora você tem uma visão completa e dimensional de todo o projeto!** 🎯

Com este plano, você consegue:

- ✅ Saber exatamente onde está
- ✅ Saber exatamente o que falta fazer
- ✅ Estimar prazos realistas
- ✅ Priorizar o que é mais importante
- ✅ Executar sem retrabalho

**Próximo passo:** Começar pela **FASE 1** (Correção e Estabilização) 🚀
