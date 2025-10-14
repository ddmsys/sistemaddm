# 📘 Plano Mestre — DDM Sistema (Versão Completa)

> **📅 Última Atualização:** 14 de outubro de 2025  
> **⚠️ MIGRAÇÃO IMPORTANTE:** Quote → Budget (Orçamentos)  
> **📖 Ver:** [Documento 08 - Migração](Progress/08-DOCUMENTO%20DE%20MIGRAÇÃO%20E%20PADRONIZAÇÃO.md)

## 🏗️ Estrutura Final Definitiva

```
sistemaddm/
├── 📁 docs/                          # ✅ Documentação completa
│   ├── MVP-1.md
│   ├── MVPs_Detalhado.md
│   ├── Plano_Mestre_DDM.md
│   └── Documentacao_Completa.md      # 🆕 Este documento
├── 📁 functions/                     # ⚡ Cloud Functions organizadas
│   ├── src/
│   │   ├── clients/                  # Functions de clientes
│   │   │   ├── assignClientNumber.ts
│   │   │   └── createClient.ts
│   │   ├── budgets/                  # ✅ Functions de orçamentos (era quotes/)
│   │   │   ├── createBudgetPdf.ts
│   │   │   ├── onBudgetApproved.ts
│   │   │   └── assignBudgetNumber.ts
│   │   ├── projects/                 # Functions de projetos
│   │   │   ├── assignProjectCatalogCode.ts
│   │   │   └── updateProjectStatus.ts
│   │   ├── pdfs/                     # Geração de PDFs
│   │   │   ├── generateBudget.ts     # ✅ Atualizado
│   │   │   └── generateInvoice.ts
│   │   ├── notifications/            # Sistema de notificações
│   │   │   ├── emailNotification.ts
│   │   │   └── webhookNotification.ts
│   │   └── index.ts                  # Exports centralizados
├── 📁 config/                        # 🔧 Configurações centralizadas
│   ├── firestore.rules              # Regras de segurança
│   ├── storage.rules                # Regras de storage
│   └── firestore.indexes.json       # Índices compostos
├── 📁 src/                           # 🏗️ Código fonte frontend
│   ├── 📁 app/                       # App Router Next.js 14
│   │   │   ├── crm/                  # 📈 COMERCIAL COMPLETO
│   │   │   │   ├── dashboard/        # Dashboard comercial integrado
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── leads/            # Prospecção e qualificação
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── projects/         # 🎯 PROJETOS (pós-venda)
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── clients/          # Base de clientes
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/page.tsx
│   │   │   ├── budgets/              # ✅ Orçamentos (era /crm/quotes)
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   │       └── [id]/page.tsx
│   │   │   ├── production/           # 🎨 PRODUÇÃO/ARTE
│   │   │   │   ├── dashboard/        # Dashboard produção
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── queue/            # Fila de produção
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── proofs/           # Provas/Revisões
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── quality/          # Controle de qualidade
│   │   │   │       └── page.tsx
│   │   │   ├── finance/              # 💰 FINANCEIRO
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── invoices/
│   │   │   │       └── page.tsx
│   │   │   ├── purchases/            # 🛒 COMPRAS
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── suppliers/
│   │   │   │       └── page.tsx
│   │   │   ├── logistics/            # 🚚 LOGÍSTICA
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── shipments/
│   │   │   │       └── page.tsx
│   │   │   └── marketing/            # 📣 MARKETING
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       ├── campaigns/
│   │   │       │   └── page.tsx
│   │   │       └── creatives/
│   │   │           └── page.tsx
│   │   ├── 📁 dashboard/             # 📊 Dashboard Executivo Principal
│   │   │   └── page.tsx
│   │   ├── 📁 portal/                # 🌐 Portal do Cliente
│   │   │   ├── page.tsx
│   │   │   └── projects/[id]/page.tsx
│   │   ├── 📁 admin/                 # 🔐 Administração
│   │   │   └── users/page.tsx
│   │   ├── 📁 login/
│   │   │   └── page.tsx
│   │   ├── 📁 register/
│   │   │   └── page.tsx
│   │   ├── globals.css               # Estilos Tailwind
│   │   ├── layout.tsx                # Layout principal
│   │   └── page.tsx                  # Home page
│   ├── 📁 components/                # 🧩 Componentes organizados
│   │   ├── ui/                       # 🎨 Componentes base
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── table.tsx
│   │   ├── comercial/                # 📈 MÓDULO COMERCIAL COMPLETO
│   │   │   ├── modals/               # 🔧 Modais de edição
│   │   │   │   ├── LeadModal.tsx
│   │   │   │   ├── QuoteModal.tsx
│   │   │   │   ├── ProjectModal.tsx
│   │   │   │   └── ClientModal.tsx
│   │   │   ├── cards/                # 📋 Cards para listagens
│   │   │   │   ├── LeadCard.tsx
│   │   │   │   ├── QuoteCard.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   └── ClientCard.tsx
│   │   │   ├── charts/               # 📊 Gráficos específicos
│   │   │   │   ├── FunnelChart.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── PerformanceChart.tsx
│   │   │   │   └── ConversionChart.tsx
│   │   │   ├── tables/               # 📋 Tabelas e listas
│   │   │   │   ├── LeadsTable.tsx
│   │   │   │   ├── QuotesTable.tsx
│   │   │   │   ├── ProjectsTable.tsx
│   │   │   │   └── ClientsTable.tsx
│   │   │   ├── forms/                # 📝 Formulários específicos
│   │   │   │   ├── LeadForm.tsx
│   │   │   │   ├── QuoteForm.tsx
│   │   │   │   ├── ProjectForm.tsx
│   │   │   │   └── ClientForm.tsx
│   │   │   ├── dashboards/           # 📊 Dashboards
│   │   │   │   ├── CommercialDashboard.tsx
│   │   │   │   ├── KPICards.tsx
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   └── filters/              # 🔍 Filtros e buscas
│   │   │       ├── LeadFilters.tsx
│   │   │       ├── QuoteFilters.tsx
│   │   │       ├── ProjectFilters.tsx
│   │   │       └── DateRangePicker.tsx
│   │   ├── production/               # 🎨 Componentes produção
│   │   │   ├── ProductionDashboard.tsx
│   │   │   ├── QueueManagement.tsx
│   │   │   ├── ProofReview.tsx
│   │   │   └── QualityControl.tsx
│   │   ├── dashboards/               # 📊 Dashboards gerais
│   │   │   ├── ExecutiveDashboard.tsx
│   │   │   ├── FinanceDashboard.tsx
│   │   │   ├── PurchasesDashboard.tsx
│   │   │   ├── LogisticsDashboard.tsx
│   │   │   └── MarketingDashboard.tsx
│   │   ├── layout/                   # 🏗️ Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── charts/                   # 📈 Gráficos reutilizáveis
│   │   │   ├── PieChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   └── MetricsCard.tsx
│   │   └── shared/                   # 🔄 Componentes compartilhados
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── ConfirmDialog.tsx
│   ├── 📁 hooks/                     # 🎣 Custom hooks organizados
│   │   ├── comercial/                # 🎣 Hooks do comercial
│   │   │   ├── useLeads.ts           # CRUD e queries leads
│   │   │   ├── useQuotes.ts          # CRUD e queries orçamentos
│   │   │   ├── useProjects.ts        # CRUD e queries projetos
│   │   │   ├── useClients.ts         # CRUD e queries clientes
│   │   │   ├── useFunnelData.ts      # Dados para funil
│   │   │   ├── useCommercialMetrics.ts # Métricas comerciais
│   │   │   └── useConversionRate.ts  # Taxa de conversão
│   │   ├── production/               # 🎣 Hooks de produção
│   │   │   ├── useProductionQueue.ts # Fila de produção
│   │   │   ├── useProofs.ts          # Provas e revisões
│   │   │   └── useQuality.ts         # Controle qualidade
│   │   ├── finance/                  # 🎣 Hooks financeiro
│   │   │   ├── useInvoices.ts        # Faturas
│   │   │   └── useFinancialMetrics.ts # Métricas financeiras
│   │   └── shared/                   # 🎣 Hooks compartilhados
│   │       ├── useAuth.ts            # Autenticação
│   │       ├── usePermissions.ts     # Verificação permissões
│   │       ├── useFilters.ts         # Filtros genéricos
│   │       ├── usePagination.ts      # Paginação
│   │       └── useLocalStorage.ts    # Storage local
│   ├── 📁 context/                   # 🔄 Context providers
│   │   ├── AuthContext.tsx           # Context de autenticação
│   │   ├── ThemeContext.tsx          # Context de tema
│   │   └── NotificationContext.tsx   # Context de notificações
│   ├── 📁 lib/                       # 🛠️ Utilitários e configurações
│   │   ├── firebase.ts               # Config Firebase
│   │   ├── types/                    # 📝 TypeScript types organizados
│   │   │   ├── comercial.ts          # Types do comercial
│   │   │   ├── production.ts         # Types da produção
│   │   │   ├── finance.ts            # Types financeiro
│   │   │   ├── shared.ts             # Types compartilhados
│   │   │   └── index.ts              # Exports centralizados
│   │   ├── utils.ts                  # Funções utilitárias
│   │   ├── constants.ts              # Constantes do sistema
│   │   ├── permissions.ts            # Sistema RBAC
│   │   ├── validations.ts            # Schemas de validação
│   │   └── formatters.ts             # Formatadores (data, moeda, etc.)
│   ├── 📁 pages/                     # 📄 API Routes (legacy - manter)
│   │   └── api/getUserRole.ts
│   └── middleware.ts                 # 🛡️ Middleware de proteção
├── .env.local                        # 🔐 Variáveis de ambiente
├── .firebaserc                       # ✅ Config Firebase
├── firebase.json                     # ✅ Config Firebase (atualizar)
├── package.json                      # ✅ Dependências
├── tsconfig.json                     # ✅ Config TypeScript
└── README.md                         # ✅ Documentação básica
```

---

## 🎨 Design System

### **Paleta de Cores**

- **Primary:** `#1e293b` (slate-800) - Sidebar, headers
- **Secondary:** `#626c71` (slate-500) - Textos secundários
- **Accent:** `#32b8c6` (blue-500) - Links e ações primárias
- **Success:** `#21808d` (emerald-500) - Status positivos
- **Warning:** `#f59e0b` (amber-500) - Alertas
- **Danger:** `#c0152f (red-500) - Erros e status críticos
- **Background:** `#f8fafc` (slate-50) - Fundo principal
- **Card:** `#ffffff` - Fundo dos cards com shadow suave

### **Tipografia**

- **Font Family:** `Inter, system-ui, sans-serif` (fonte delicada)
- **Tamanhos:** xs(11px), sm(12px), base(14px), lg(16px), xl(18px), 2xl(20px), 3xl(24px), 4xl(30px)
- **Pesos:** normal(400), medium(500), semibold(550), bold(600)
- **Características:** Texto pequeno e delicado para alta densidade de informação

### **Componentes Visuais**

- **Cards:** `rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md`
- **Buttons:** `rounded-lg px-4 py-2 font-medium transition-colors duration-200`
- **Inputs:** `rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`
- **Badges:** `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
- **Modais:** `rounded-xl shadow-2xl border-0 backdrop-blur-sm`

### **Gráficos e Charts**

- **Estilo:** Modernos com cantos arredondados e gradientes suaves
- **Cores:** `['#5995f4ff', '#10b9b3ff', '#d7b263ff', '#e15e5eff', '#8e76c5ff', '#06b6d4]`
- **Disco/Pizza:** Com gradientes radiais e animações suaves
- **Barras:** Cantos arredondados, cores complementares
- **Linhas:** Curvas suaves com pontos destacados
- **Animações:** Transições suaves de 300ms

---

## 📊 Dashboards Especializados Detalhados

### 🎯 **Dashboard Comercial - `/crm/dashboard`**

**Componente:** `CommercialDashboard.tsx`

**Métricas Principais:**

- Funil por `leads.stage` (em negociação ordenado por `lastActivityAt` asc)
- Receita ganha vs perdida (soma `quotes.grandTotal`)
- Taxa de conversão por fonte (`leads.source`)
- Performance por vendedor (`ownerId`)
- Orçamentos pendentes de assinatura (`quotes.status = 'sent'`)
- Projetos em andamento (`projects.status = 'open'`)
- SLA de aprovações (`clientApprovalTasks.status = 'pending'`)
- Projetos críticos (próximos do `dueDate`)

**Visualizações:**

- Kanban de leads por estágio
- Gráfico de funil com conversão
- Cards de métricas (receita, conversão, performance)
- Tabela de projetos críticos
- Feed de atividades recentes
- Gráfico de performance por vendedor

### 🎨 **Dashboard Produção - `/production/dashboard`**

**Componente:** `ProductionDashboard.tsx`

**Métricas Principais:**

- Kanban de projetos por `projects.status`
- Calendário por `dueDate` com criticidade
- Fila de produção ordenada por prioridade
- Aprovações pendentes (`clientApprovalTasks.status = 'pending'`)
- Provas em revisão (`proofs.status = 'in_review'`)
- Capacidade vs demanda (projetos vs recursos)
- Tempo médio por etapa de produção

**Visualizações:**

- Kanban de projetos
- Calendário com timeline
- Lista de aprovações pendentes
- Cards de status e métricas
- Gráfico de capacidade vs demanda

### 💰 **Dashboard Financeiro - `/finance/dashboard`**

**Componente:** `FinanceDashboard.tsx`

**Métricas Principais:**

- Receita vs despesa (`invoices.paid` vs `purchases.paga`)
- Contas a receber (`invoices.status = 'pending'`)
- Contas a pagar (`purchases.contratada = true && paga = false`)
- Fluxo de caixa projetado (próximos 90 dias)
- Taxa de inadimplência
- Margem de lucro por projeto

**Visualizações:**

- Gráfico de linha (receita/despesa mensal)
- Cards de KPIs financeiros
- Tabela de contas a receber (destacar vencidas)
- Tabela de contas a pagar
- Gráfico de fluxo de caixa projetado

### 🛒 **Dashboard Compras - `/purchases/dashboard`**

**Componente:** `PurchasesDashboard.tsx`

**Métricas Principais:**

- Distribuição por categoria (gráfico pizza)
- Cotações em andamento (ranking por `vendorName`)
- Performance de fornecedores
- Gastos por categoria temporal
- Tempo médio de cotação
- Economia gerada por negociações

**Visualizações:**

- Gráfico pizza por categoria
- Ranking de fornecedores
- Cards de economia e performance
- Tabela de cotações em andamento

### ✅ **Dashboard Qualidade - `/quality/dashboard`**

**Componente:** `QualityDashboard.tsx`

**Métricas Principais:**

- Provas `in_review` com tempo de espera
- Média de ciclos de revisão (`projects.proofsCount`)
- Taxa de aprovação first-time
- Tempo médio de revisão por tipo
- Backlog de provas por prioridade
- Projetos aguardando aprovação do cliente

**Visualizações:**

- Fila de revisão com priorização
- Cards de métricas de qualidade
- Gráfico de tempo médio de revisão
- Lista de backlog organizada

### 🚚 **Dashboard Logística - `/logistics/dashboard`**

**Componente:** `LogisticsDashboard.tsx`

**Métricas Principais:**

- Envios pendentes/em trânsito
- Performance por transportadora
- Tempo médio de entrega por região
- Entregas atrasadas (críticas)
- Custo de frete por região/peso
- Status de rastreamentos ativos

**Visualizações:**

- Mapa de entregas em tempo real
- Lista de rastreamentos ativos
- Cards de performance por transportadora
- Gráfico de tempo médio por região

### 📣 **Dashboard Marketing - `/marketing/dashboard`**

**Componente:** `MarketingDashboard.tsx`

**Métricas Principais:**

- Campanhas ativas com progresso
- Status de criativos (kanban)
- ROI por canal de marketing
- Leads gerados por campanha
- CPC, CTR, conversões por canal
- Performance de públicos-alvo

**Visualizações:**

- Cards de campanhas com progresso
- Kanban de status de criativos
- Gráficos de ROI e performance
- Métricas de performance por canal

### 📊 **Dashboard Executivo - `/dashboard` (Principal)**

**Componente:** `ExecutiveDashboard.tsx`

**Métricas Principais:**

- KPIs consolidados (receita, fluxo de caixa, inadimplência)
- Visão consolidada de todos os setores
- Indicadores de conversão e gargalos
- Projetos críticos (todas as áreas)
- Performance geral da empresa
- Alertas e notificações importantes

**Visualizações:**

- Cards de KPIs principais
- Gráficos consolidados de performance
- Lista de alertas e projetos críticos
- Visão resumida de cada setor

---

## 1. Visão Geral e Princípios

O **DDM Sistema** é a plataforma interna da editora para gerenciar todo o ciclo de vida de um livro: do lead até a entrega final e o pós-venda.

- **Automação:** Cloud Functions para numeração, PDFs, criação de entidades, notificações e integrações, (numeração, catálogos, PDFs, geração de entidades encadeadas).
- **Transparência:** dashboards por setor + portal do cliente.
- **Segurança:** Firestore Rules e Storage com acesso controlado.
- **Escalabilidade:** Firebase (Auth, Firestore, Storage, Functions) + Next.js.
- **\*\*Stack:\*\*** Next.js 14 + Tailwind • Firebase (Auth, Firestore, Functions Gen2 Node 20, Storage) • PDFKit

  \

## 2. Convenções Técnicas

- **IDs:** Firestore Doc ID (`clients/{id}`, `projects/{id}`).
- **Datas:** UI usa `YYYY-MM-DD`, Firestore salva `Timestamp`.
- **\*Dinheiro (BRL):\*\*** UI com máscara; Firestore salva **\*\*number\*\*** (ex.: \`1234.56\`).
- **Enums:** sempre em inglês (ex.: `status: 'draft'|'sent'`).
- **Sinônimos legados:** mantidos na UI (ex.: `price → budget`).
- \- **\*\*Sinônimos legados (a UI ainda compreende para não quebrar):\*\***

  \- \`catalogo\` ⇒ **\*\*\`catalogCode\`\*\***

  \- \`price\` ⇒ **\*\*\`budget\`\*\*** (em \`projects\`)

  \- \`amount\` ⇒ **\*\*\`value\`\*\*** (em \`invoices\`)

  \- \`due_at\` ⇒ **\*\*\`dueDate\`\*\***

  \- \`client_id\` ⇒ **\*\*\`clientId\`\*\***

- \- **\*\*Códigos e catálogos:\*\*** \`catalogCode = DDM{L/C/X}{clientNumber}[.N]\`.
- \- **\*\*Status padronizados:\*\*** ver [Anexos]\(#anexos--enums-e-máscaras).

---

## 3. Modelagem de Dados (coleções Firestore)

### 3.1 Clientes (`clients`)

- Agenda oficial de contatos (PF ou PJ).
- Criados manualmente ou ao converter um lead.
- Endereço puxa o Cep e preenche o endereço automaticamente. Cep com máscara
- Validação: CPF, RG, CNPJ, phone, email (são campos únicos)
- **Automação:** `assignClientNumber`.

Campos principais:

```ts
| Campo | Tipo | Obrig. | Regra / Observações | Exemplo |
|---|---|---|---|---|
| **name** | string | S | PF/PJ | Ana Souza |
| dataAniversario |
| email | string | N | validação | ana@ex.com |
| phone | string | N | máscara | (11) 98888-0000 |
| **clientNumber** | number | S | **sequencial por Function** | 459 |
| address.* | object | N | CEP, rua, nº, etc. | — |
| status | enum | S | `ativo`/`inativo` | ativo |
| indication | string | N | origem/indicação |
| source: 'website'|'referral'|'social_media'|'cold_call'|'event'|'advertising'|'other'
notes?: string |
| createdAt/updatedAt | Timestamp | N | audit | — |
```

Tela/Dashboard:

- `/clients`: lista + filtros.
- `/clients/[id]`: ficha com projetos e faturas do cliente.

---

### 3.2 CRM — Leads (`leads`)

- Interessados em publicar.
- Fluxo: **Lead → Orçamento → Cliente**.
- **Automação:** `onQuoteSigned` cria cliente + projeto + pedido.

Campos principais:

```ts
 Campo | Tipo | Obrig. | Regra / Observações |
|---|---|---|---|
| **name** | string | S | obrigatório |
| email/phone | string | N | máscaras |
| indication | string | N | origem/indicação |
| stage/status | enum | S | funil: contato → qualificação → negociação → orçamento → ganho/perdido |
| quoteId | string | N | vínculo com `quotes` |
source: 'website'|'referral'|'social_media'|'cold_call'|'event'|'advertising'|'other'
tags?: string[]
notes?: string
| owner{id,name,email} | object | N | responsável |
| sign | object | N | `signerName/email/cpf/signedAt` |
| createdAt/updatedAt | Timestamp | N | audit |


```

**Tarefas de Lead (\`leads/{id}/tasks\`)**

\| Campo | Tipo | Regra |

\|---|---|---|

\| note | string | anotação da conversa |

\| dueAt | Timestamp | próximo contato |

\| done | boolean | concluída? |

\| owner{id,name,email} | object | responsável |

\| createdAt/updatedAt | Timestamp | audit |

Tela/Dashboard:

- `/crm/leads`: kanban por estágio.
- `/crm/leads/[id]`: ficha com notas/tarefas + link “Ver orçamentos”.

---

### 3.3 Orçamentos (`budgets`)

> ✅ **ATUALIZADO** - Era `quotes`, agora é `budgets`

- Proposta formal enviada ao autor.
- **Automação:** `createBudgetPdf`, `onBudgetApproved`.

Campos principais:

```ts
| Campo | Tipo | Obrig. | Regra / Observações |
|---|---|---|---|
| **number** | string | S | ex.: `v5_1310.1435` (v5_DDMM.HHMM) |
| **status** | enum | S | `draft/sent/approved/rejected/expired` |
| version | number | S | 1, 2, 3... |
| projectType | enum | N | L/E/K/C/etc (TipoProjetoCatalogo) |
| leadId | string | N | lead que originou |
| clientId | string | N | cliente existente |
| bookId | string | N | livro existente (reimpressão) |
| projectData | object | N | {title, subtitle, author, specifications} |
| items | array | S | ver tabela de itens |
| subtotal | number | S | soma dos itens |
| discount | number | N | desconto em R$ |
| discountPercentage | number | N | desconto em % |
| total | number | S | valor final |
| paymentMethods | array | S | ex: ["À vista", "3x"] |
| validityDays | number | S | prazo do orçamento |
| productionDays | number | N | prazo de produção manual |
| clientProvidedMaterial | boolean | S | cliente fornece material? |
| materialDescription | string | N | descrição do material |
| notes | string | N | observações |
| issueDate | Timestamp | S | emissão |
| expiryDate | Timestamp | S | validade |
| approvalDate | Timestamp | N | aprovação |
| pdfUrl | string | N | link do PDF |
| createdAt/updatedAt | Timestamp | S | audit |
| createdBy | string | S | userId |

**Estrutura de `items` (budgets):**
| Campo | Tipo | Observações |
|---|---|---|
| id | string | identificador único |
| type | string | `editorial_service` \| `printing` \| `extra` |
| description | string | descrição do item |
| quantity | number | quantidade |
| unitPrice | number | preço unitário |
| totalPrice | number | calculado (quantity * unitPrice) |
| notes | string | observações |
| **Editorial Service:** |
| service | enum | EditorialServiceType |
| customService | string | se CUSTOM |
| estimatedDays | number | prazo estimado |
| **Printing:** |
| printRun | number | tiragem |
| useBookSpecs | boolean | usar specs do livro? |
| customSpecs | object | specs personalizadas |
| productionDays | number | prazo de produção |
| **Extra:** |
| extraType | enum | ExtraType |
| customExtra | string | se CUSTOM |
```

Tela/Dashboard:

- `/budgets`: lista com filtros + ações.
- `/budgets/[id]`: editor completo.

---

### 3.4 Projetos (`projects`)

- Caderno do livro.
- Criados ao assinar orçamento.
- **Automação:** `assignProjectCatalogCode`.

Campos principais:

```ts
| Campo | Tipo | Obrig. | Regra / Observações |
|---|---|---|---|
| **clientId** | ref | S | vínculo cliente |
| **title** | string | S | título do projeto |
| **productType** | enum | S | `L/C/X` (livro/curso/outros) |
| **catalogCode** | string | S | `DDM{L/C/X}{clientNumber}[.N]` |
| author | string | N | — |
| edition | string | N | — |
| pages | number | N | ≥ 1 |
| isbn | string | N | ISBN-13 |
| budget | number | N | BRL |
| dueDate | date/Timestamp | N | prazo |
| status | enum | S | `open/approved/in_progress/done` |
| createdAt/updatedAt | Timestamp | N | audit |
```

Tela/Dashboard:

- `/projects`: Kanban por status + calendário.
- `/projects/[id]`: ficha técnica + provas + tarefas.

**\*\*assignClientNumber (onCreate clients):\*\*** numeração sequencial.

\- **\*\*assignProjectCatalogCode (onCreate projects):\*\*** gera \`catalogCode\`; **\*\*backfillCatalogCodes (HTTP)\*\*** para ajuste em lote.

---

### 3.5 Provas (`proofs`)

- Revisões de qualidade.
- Criadas ao subir PDF no Storage.
- **Automação:** `onProofUpload` → cria doc + notifica.

Campos principais:

```ts
projectId: string
proofNumber: number
status: 'in_review'|'pending_fixes'|'approved'|'rejected'
reviewerId?: string
fileUrl: string
checklist?: Array<{ id, label, done }>
createdAt, updatedAt
```

Tela/Dashboard:

- `/quality/proofs`: fila de provas em revisão.
- `/projects/[id]/proofs`: histórico.

---

### 3.6 Pedidos (`orders`)

- Contrato financeiro gerado quando orçamento é assinado.
- **Automação:** `onQuoteSigned`.

Campos principais:

```ts
quoteId: string, clientId: string, projectId: string
total: number
paymentSchedule: Array<{ value, dueDate, status: 'pending'|'paid'|'canceled', invoiceId? }>
status: 'aberto'|'fechado'
createdAt
```

Tela/Dashboard:

- `/finance/orders`: lista + parcelas + status.

---

### 3.7 Faturas (`invoices`)

- Documento de cobrança ao cliente.
- **Automação:** `createInvoicePdf`.

Campos principais:

```ts
projectId: string, clientId: string, catalogCode?: string
items?: Array<{ description, qty, unitPrice }>
value?: number
status: 'draft'|'pending'|'paid'|'canceled'
issueDate?: string, dueDate?: string|Timestamp, paidAt?: Timestamp
notes?: string, pdfUrl?: string
createdAt, updatedAt
```

Tela/Dashboard:

- `/invoices`: contas a receber.
- `/invoices/[id]`: editor + botão PDF.

---

### 3.8 Compras (`purchases`)

- Contas a pagar para fornecedores.
- Criadas quando projeto vai para gráfica.
- **Automação:** `onProjectReadyForPrint`.

Campos principais:

```ts
orderId?: string, projectId: string
vendorName: string, category?: string
status: 'cotação_em_andamento'|'negociação'|'contratada'|'paga'|'concluída'
quoteValue?: number, orderValue?: number, invoiceId?: string
createdAt, updatedAt
```

Tela/Dashboard:

- `/purchases`: lista + pizza de gastos por categoria.

---

### 3.9 Logística (`logistics`)

- Controle de entregas físicas.
- **Automação:** notificação ao cliente com rastreio.

Campos principais:

```ts
projectId: string, orderId?: string
carrier: string, trackingCode?: string
status: 'preparando'|'em_transito'|'entregue'|'atrasado'
history?: Array<{ at: Timestamp; status; note? }>
createdAt, updatedAt
```

Tela/Dashboard:

- `/logistics`: lista de envios pendentes/em trânsito.

---

### 3.10 Marketing (`campaigns`, `audiences`, `creatives`)

- Gestão de campanhas, públicos e criativos.
- **Automação:** leads de campanhas entram no CRM.

**Campanhas (campaigns):**

```ts
name, description?, type, status, budget, spent, startDate, endDate
audienceId?, objectives[], channels[]
metrics{ impressions, clicks, conversions, leads, ctr, cpc, roi }
priority, utm?, timestamps.
```

**Públicos (audiences):**

```ts
name, description?
demographics{ ageRange?, gender?, location?, incomeRange? }
interests[], behaviors[]
sizeEstimate?, platforms[], timestamps.
```

**Criativos (creatives):**

```ts
name, campaignId
headline?, copy?, caption?, cta?
format, platform, responsibleDesigner?, dueDate?
status, finalUrl?, assets?, metrics?, timestamps.
```

Tela/Dashboard:

- `/marketing/campaigns`: cards + progresso.
- `/marketing/creatives`: kanban de status.
- `/marketing/audiences`: tabela.
- `/marketing/analytics`: gráficos ROI.

---

### 3.11 Dashboards Executivos

- Visão geral para diretoria.
- KPIs: receita, fluxo de caixa, inadimplência, conversão, gargalos, ROI.

Tela/Dashboard:

- `/dashboards`: cards + gráficos.

---

## 3.12 Campos adicionais e índices recomendados

**Clients**

- `firebaseAuthUid: string` (vínculo com usuário do portal)
- `billing?: { cnpj?: string; address?: string; city?: string; state?: string; zipcode?: string }`
- Índices: `clientNumber asc` (único lógico por CF), `createdAt desc`

**Leads**

- `ownerId?: string`, `lastActivityAt?: Timestamp`
- Índices: `stage asc + updatedAt desc`

**Quotes**

- `number: string` (ex.: `v5_0821.2221` - v(final do ano 2025 MMDD.HRMM)), `subtotal`, `discountTotal?`, `freight?`, `surcharge?`, `grandTotal`
- Índices: `status + updatedAt desc`, `number asc`

**Projects**

- `proofsCount: number`, `finalProofUrl?: string`
- `clientApprovalTasks?: Array<{ id: string; title: string; status: 'pending'|'approved'|'changes_requested'; note?: string; createdAt: Timestamp; decidedAt?: Timestamp }>`
- Índices: `status + updatedAt desc`, `clientId + createdAt desc`, `dueDate asc`

**Proofs (nova coleção)**

- `projectId: string`, `proofNumber: number`, `status`, `reviewerId?`, `fileUrl: string`, `checklist?`
- Índices: `projectId + proofNumber asc`, `status + updatedAt desc`

**Purchases**

- `vendorName`, `category? ('Impressão'|'Design'|'Frete'|'ISBN'|...)`, `quoteValue?`, `orderValue?`, `invoiceId?`
- Índices: `projectId + status`, `category + updatedAt desc`

**Invoices**

- `number?: string` (ex.: `NF-2025-0001`), `value`, `status`, `dueDate?`, `paidAt?`
- Índices: `status + dueDate asc`, `projectId + createdAt desc`

---

## 3.13 Fluxos detalhados (automações)

1. **Budget aprovado → cria Cliente, Projeto e Pedido**

- Trigger: `onWrite(budgets)` quando `status` muda para `approved`.
- Se `client.id` não existir em `clients`, criar e atribuir `clientNumber`.
- Criar `projects` com `catalogCode` (CF) e `status='open'`.
- (Opcional) Criar usuário no Auth (`firebaseAuthUid`) e enviar e‑mail de acesso ao portal.

2. **Início de produção → Upload de Prova**

- Upload em `projects/{projectId}/proofs/*` (Storage) dispara `onProofUpload`.
- CF cria doc em `proofs` com `proofNumber++`, `status='in_review'` e notifica Qualidade.

3. **Revisão de qualidade**

- Checklist e alteração de `status` em `proofs`.
- Se `approved` da última prova: atualizar `projects.status='final_approved'`, setar `finalProofUrl` e incrementar `proofsCount`.

4. **Liberação para gráfica**

- Ao atingir `final_approved`, CF cria `purchases` (categoria "Impressão" e correlatas).

5. **Faturamento**

- Financeiro cria `invoices` (manual ou automático por milestone).
- CF `createInvoicePdf` gera `pdfUrl` e agenda lembrete para `invoices.pending` próximos do `dueDate`.

6. **Aprovação do cliente**

- Criar `clientApprovalTasks` no `project`.
- Portal do cliente exibe PDF atual e tarefas de aprovação; ações mudam `status` para `revising` quando houver ajustes.

---

## 3.14 Dashboards por setor

**Comercial**

- Funil por `leads.stage`; "Em negociação" ordenado por `lastActivityAt asc`; Receita Ganha vs Perdida (soma `budgets.total`).

**Produção/Arte**

- Kanban `projects.status`; Calendário por `dueDate`; Aprovações pendentes (`clientApprovalTasks.status='pending'`).

**Financeiro**

- Linha Receita vs Despesa: `invoices.paid` (por mês) vs `purchases.paga`.
- Contas a Receber (`invoices.pending`, destacar vencidos) e a Pagar (`purchases.contratada` não pagas).

**Compras/Fornecedores**

- Pizza por `category` (soma `orderValue`); Cotações em andamento; ranking por `vendorName`.

**Qualidade**

- Provas `in_review` com "idade"; média de ciclos (`projects.proofsCount`).

**Portal do Cliente**

- Lista de projetos (via `firebaseAuthUid`), viewer do PDF e tarefas de aprovação.

---

## 3.15 Exportação para planilhas (Sheets/CSV)

- **Scheduler + HTTP CF:** gera CSVs por coleção e salva em `exports/yyyy-mm-dd/*.csv` (Storage) ou escreve no Google Sheets.
- Normalizar campos: flaten de objetos e formatação de Timestamp.
- Alternativa: botão "Exportar" na UI que chama CF e retorna link de download.

---

## 3.16 PDFs (orçamentos e faturas)

- Templates com PDFKit em `functions/src/pdfs/*`.
- Nomes: `quotes/{quoteId}/quote-{number}.pdf`, `invoices/{invoiceId}/invoice-{number|id}.pdf`.
- Ação "Regerar PDF" após editar itens/valores (chama CF).

---

## 3.17 ÍNDICES compostos (sugestão)

Crie apenas quando solicitado pelo console ou conforme abaixo:

- `leads`: `stage asc, updatedAt desc`
- `quotes`: `status asc, updatedAt desc`
- `projects`: `status asc, updatedAt desc`
- `proofs`: `projectId asc, proofNumber asc`
- `invoices`: `status asc, dueDate asc`

---

## 3.18 Perfis de acesso (RBAC)

- **admin:** acesso total.
- **producao:** `projects`, `proofs`, leitura parcial de `purchases` e `clients`.
- **financeiro:** `invoices`, leitura de `purchases` e dados de faturamento de `clients`.
- **cliente:** somente seus `projects` e `clientApprovalTasks`, e leitura do PDF final/prova liberada.

Regras (resumo):

- `clients`: leitura restrita por papel; cliente lê apenas seu doc (`request.auth.uid == firebaseAuthUid`).
- `projects`: cliente lê apenas docs cujo `clientId` está vinculado ao seu `clients`.
- `proofs`: cliente lê apenas quando explicitamente liberado.
- `invoices/purchases`: leitura/edição por papéis.
- `storage`: paths com escopo `projects/{projectId}/...` validados pelo Firestore.

---

## 3.19 Roadmap prático (passo a passo)

**Dados & Segurança**

- Ajustar esquemas (campos novos) e `firestore.rules` + `firestore.indexes.json`.

**Automações**

- Validar `assignClientNumber` e `assignProjectCatalogCode`.
- Implementar `onBudgetApproved`, `onProofUpload`, `createInvoicePdf` e lembretes de `invoices.pending`. # ✅ Atualizado

**Telas**

- CRM (funil Leads + Budgets), Projetos (Kanban + provas + aprovações), Qualidade (fila de `in_review`), Compras, Financeiro, Portal do Cliente. # ✅ Atualizado

**Exportações & Observabilidade**

- Endpoint de exportação CSV, logs estruturados, feature flags simples.

---

## 4. Cloud Functions

- `assignClientNumber` → numeração sequencial.
- `assignProjectCatalogCode` → gera `catalogCode`.
- `backfillCatalogCodes` → ajuste em lote.
- `createBudgetPdf` / `createInvoicePdf` → PDFs. # ✅ Atualizado
- `onBudgetApproved` → cria Cliente + Projeto + Pedido. # ✅ Atualizado
- `onProjectReadyForPrint` → gera compras.
- `onProofUpload` → cria proofs e notifica.
- `assignBudgetNumber` → gera número do orçamento. # ✅ Novo
- `createOrUpdateClient` / `createOrUpdateLead` (HTTP/Callable).

---

## 5. Segurança (Firestore Rules)

- Escrita apenas autenticada.
- `clients`: cliente só vê seu doc (via `firebaseAuthUid`).
- `projects`: cliente só lê docs ligados ao seu `clientId`.
- `proofs`: cliente só vê provas liberadas.
- `invoices/purchases`: leitura limitada por papel (financeiro/compras).
- `storage`: escopo por path + validação no Firestore.

---

## 6. Fluxos Principais

1. Lead criado → responsável atribuído.
2. Lead convertido em Orçamento → gera PDF.
3. Orçamento aprovado → cria Cliente + Projeto + Pedido + Faturas. # ✅ Atualizado
4. Projeto pronto para gráfica → gera Compra.
5. Upload de prova → cria proofs, dispara revisão.
6. Aprovação de prova → atualiza Projeto + libera Compras.
7. Fatura emitida → gera PDF + notificação.
8. Logística registra envio → cliente recebe rastreio.

---

## 7. Convenções & Catálogos (para consulta rápida)

### 8.1 Padrões de ID e códigos

- **Doc ID (Firestore):** gerado pelo cliente ou automático (`collection().doc().id`).
- **ClientNumber:** sequencial (CF `assignClientNumber`).
- **CatalogCode (Projeto):** `DDML####[.n]` (CF `assignProjectCatalogCode`).
- **Invoice Number (opcional):** `NF-AAAA-####` (série/ano).

### 8.2 Status — tabela mestra (usar sempre estes valores)

```ts
export type LeadStage =
  | 'primeiro_contato'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';
export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';  // ✅ Atualizado
export type ProjectStatus =
  | 'open'
  | 'design'
  | 'review'
  | 'production'
  | 'clientApproval'
  | 'approved'
  | 'printing'
  | 'delivering'
  | 'shipped'
  | 'done'
  | 'cancelled';
export type ProofStatus = 'in_review' | 'pending_fixes' | 'approved' | 'rejected';
export type OrderStatus = 'aberto' | 'fechado';
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'canceled';
export type PurchaseStatus =
  | 'cotação_em_andamento'
  | 'negociação'
  | 'contratada'
  | 'paga'
  | 'concluída';
```

### 8.3 Storage — caminhos e nomes

- **Proofs:** `projects/{projectId}/proofs/proof-{n}.pdf`
- **Final do Projeto:** `projects/{projectId}/final/final-{catalogCode}.pdf`
- **Budgets PDFs:** `budgets/{budgetId}/budget-{number}.pdf` # ✅ Atualizado
- **Invoices PDFs:** `invoices/{invoiceId}/invoice-{number|id}.pdf`

### 8.4 Regiões e limites

- **Functions Gen2:** `southamerica-east1`.
- **Batch writes:** até 500 operações/batch.
- **Consultas:** criar índices apenas quando necessário.

---

## 9. Utilitários de código (colocar no repositório)

### 9.1 `src/lib/constants.ts`

```ts
// src/lib/constants.ts
export const APP_REGION = 'southamerica-east1';
export const COLLECTIONS = {
  clients: 'clients',
  leads: 'leads',
  quotes: 'quotes',
  projects: 'projects',
  proofs: 'proofs',
  orders: 'orders',
  invoices: 'invoices',
  purchases: 'purchases',
} as const;

export const STORAGE_PATHS = {
  proof: (projectId: string, n: number) => `projects/${projectId}/proofs/proof-${n}.pdf`,
  projectFinal: (projectId: string, code: string) =>
    `projects/${projectId}/final/final-${code}.pdf`,
  budgetPdf: (budgetId: string, number: string) => `budgets/${budgetId}/budget-${number}.pdf`,  // ✅ Atualizado
  invoicePdf: (invoiceId: string, number: string | null) =>
    `invoices/${invoiceId}/invoice-${number ?? invoiceId}.pdf`,
} as const;
```

### 9.2 `functions/src/contracts.ts` (contratos de eventos/DTOs)

```ts
// functions/src/contracts.ts
export interface QuoteSignedEvent {
  quoteId: string;
  client: { id?: string | null; name: string; email?: string | null };
  totals: { grandTotal: number };
  signedAt: FirebaseFirestore.Timestamp;
}

export interface ProofUploadedEvent {
  projectId: string;
  filePath: string; // storage path
  uploadedAt: FirebaseFirestore.Timestamp;
}

export interface InvoiceReminderJob {
  invoiceId: string;
  dueDate: string;
}
```

### 9.3 `functions/src/utils/paths.ts`

```ts
// functions/src/utils/paths.ts
export const path = {
  proof: (projectId: string, n: number) => `projects/${projectId}/proofs/proof-${n}.pdf`,
  final: (projectId: string, code: string) => `projects/${projectId}/final/final-${code}.pdf`,
  budget: (budgetId: string, num: string) => `budgets/${budgetId}/budget-${num}.pdf`,  // ✅ Atualizado
  invoice: (invoiceId: string, num?: string) =>
    `invoices/${invoiceId}/invoice-${num ?? invoiceId}.pdf`,
};
```

### 9.4 `src/lib/env.ts` (variáveis obrigatórias)

```ts
// src/lib/env.ts
import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
})

export const ENV = schema.parse({
 NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD9_vAO_-xcMGtlDXkHqrhtlbjjUF3Y1Uc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sistemaddm-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sistemaddm-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sistemaddm-dev.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=825537655768
NEXT_PUBLIC_FIREBASE_APP_ID=1:825537655768:web:bcfc023a6bb872cd8ef8ad

})
```

### 9.5 `src/lib/permissions.ts` (RBAC simples)

```ts
// src/lib/permissions.ts
export type Role = 'admin' | 'producao' | 'financeiro' | 'cliente';
export function canReadInvoice(role: Role) {
  return role === 'admin' || role === 'financeiro';
}
export function canReadProject(role: Role) {
  return role !== 'cliente' ? true : true;
}
// Expanda conforme necessidade
```

---

## 10. Segurança — esqueleto de regras (Firestore/Storage)

### 10.1 `firestore.rules`

```groovy
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null }
    function uid() { return request.auth.uid }

    match /clients/{id} {
      allow read, write: if isSignedIn(); // refinar por papel
    }

    match /projects/{id} {
      allow read, write: if isSignedIn();
    }

    match /invoices/{id} {
      allow read, write: if isSignedIn();
    }

    match /{document=**} { allow read: if false; }
  }
}
```

> **Nota:** depois refinamos por papel/relacionamento (`firebaseAuthUid`, `clientId`).

### 10.2 `storage.rules`

```groovy
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{projectId}/proofs/{file} {
      allow read, write: if request.auth != null; // refinar com Firestore
    }
    match /{path=**} { allow read: if false; }
  }
}
```

---

## 11. Indexes — `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "stage", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "budgets",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "proofs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "proofNumber", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "invoices",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "dueDate", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 12. Logging & Observabilidade (Functions)

```ts
// functions/src/utils/log.ts
export const log = (scope: string, data: Record<string, unknown>) => {
  console.log(JSON.stringify({ scope, ...data }));
};
```

- Padrão: um `scope` por função/evento e payload serializado.

---

## 13. Job de Exportação CSV (esqueleto)

```ts
// functions/src/jobs/exportCsv.ts
import * as admin from 'firebase-admin'
import { onRequest } from 'firebase-functions/v2/https'

export const exportCsv = onRequest(async (_req, res) => {
  const db = admin.firestore()
  const snap = await db.collection('projects').get()
  const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  const csv = ['id,title,clientId,status'].concat(rows.map(r => `${r.id},${r.title},${r.clientId},${r.status}`)).join('
')
  // TODO: salvar no Storage e responder URL assinada
  res.status(200).send(csv)
})
```

---

## 14. E-mails & Notificações (rascunho de matriz)

- **Invoice vencendo** → destinatário: cliente (financeiro) | quando: `dueDate-3d`.
- **Prova disponível** → cliente + produção | quando: upload aprovado para revisão.
- **Quote assinado** → comercial + financeiro | quando: `quotes.status → signed`.

---

## 15. Dados de exemplo (seed)

```ts
// scripts/seed.ts (sugestão)
export const demoClient = {
  name: 'Autor Demo',
  email: 'autor@demo.com',
  status: 'ativo',
};
export const demoProject = {
  title: 'Livro Demo',
  clientId: 'CLIENT_ID',
  status: 'open',
};
```

---

**Anexos — Enums e Máscaras**

\- **\*\*Leads.stage/status:\*\*** \`contato\`, \`qualificação\`, \`negociação\`, \`orçamento\`, \`ganho\`, \`perdido\`.

\- **\*\*Quotes.status:\*\*** \`draft\`, \`sent\`, \`signed\`, \`refused\`.

\- **\*\*Invoices.status:\*\*** \`draft\`, \`pending\`, \`paid\`, \`canceled\`.

\- **\*\*Projects.status:\*\*** \`open\`, \`approved\`, \`in_progress\`, \`done\`.

\- **\*\*Máscaras:\*\*** CPF/CNPJ, telefone, CEP, BRL (UI); datas \`YYYY-MM-DD\` (UI) → Timestamp (Firestore).

\

> Estas seções adicionadas servem de **cola operacional**: padrões, contratos, regras e arquivos que vamos consultar e reutilizar durante o desenvolvimento. Ajusto qualquer parte conforme decidirmos os detalhes finais.
