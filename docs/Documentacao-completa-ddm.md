# 📋 Documentação Completa e Definitiva - DDM Sistema

**Versão:** 2.0 Final  
**Data:** 04/10/2025  
**Objetivo:** Zero retrabalho - Documentação completa para implementação

---

## 🎯 Resumo Executivo

Esta documentação consolida **TODAS** as conclusões das conversas anteriores, análises de estrutura, correções identificadas e especificações técnicas para criar um guia definitivo do DDM Sistema, eliminando retrabalho futuro.

---

## 🔍 Principais Conclusões e Correções

### 📋 **Estrutura Corrigida - Projetos no CRM**

- **❌ Problema:** Projetos separados do comercial quebrava o fluxo real
- **✅ Solução:** Projetos dentro do CRM (Lead → Quote → Project)
- **🎯 Impacto:** Reflete o processo real da DDM Editora

### 📊 **Dashboards Especializados**

- **❌ Problema:** Dashboard genérico sem métricas específicas
- **✅ Solução:** 8 dashboards especializados por setor
- **🎯 Impacto:** Métricas específicas e relevantes para cada área

### 🧩 **Componentização Modular**

- **❌ Problema:** Componentes inline e não organizados
- **✅ Solução:** Separação modular como ProjectKanban.tsx
- **🎯 Impacto:** Reutilização, manutenibilidade e organização

### 🛡️ **Route Groups Next.js 14**

- **❌ Problema:** Estrutura `auth/` conflita com Firebase Auth
- **✅ Solução:** `(authenticated)/` route group
- **🎯 Impacto:** Proteção automática e melhor organização

---

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
│   │   ├── quotes/                   # Functions de orçamentos
│   │   │   ├── createQuotePdf.ts
│   │   │   └── onQuoteSigned.ts
│   │   ├── projects/                 # Functions de projetos
│   │   │   ├── assignProjectCatalogCode.ts
│   │   │   └── updateProjectStatus.ts
│   │   ├── pdfs/                     # Geração de PDFs
│   │   │   ├── generateQuote.ts
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
│   │   ├── 📁 (authenticated)/       # 🛡️ Route Group protegido
│   │   │   ├── crm/                  # 📈 COMERCIAL COMPLETO
│   │   │   │   ├── dashboard/        # Dashboard comercial integrado
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── leads/            # Prospecção e qualificação
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── quotes/           # Orçamentos e propostas
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── projects/         # 🎯 PROJETOS (pós-venda)
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── clients/          # Base de clientes
│   │   │   │       ├── page.tsx
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

ProductType =
| "L" // Livro
| "E" // E-book
| "K" // kindle
| "C" // CD
| "D" // DVD
| "G" // Gráfica
| "P" // PlatafDigital
| "S" // Single
| "X" // LivroTerc
| "A"; // Arte

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

## 📝 Types e Interfaces Completos

### comercial types

```typescript
import { Timestamp } from "firebase/firestore";

// ================ ENUMS E TYPES BÁSICOS ================

export type ProductType =
  | "L" // Livro
  | "E" // E-book
  | "K" // Kit
  | "C" // Catálogo
  | "D" // Design
  | "G" // Gráfica
  | "P" // Publicidade
  | "S" // Serviço
  | "X" // Xilogravura
  | "A" // Arte
  | "M"; // Mídia

export type LeadSource =
  | "website"
  | "socialmedia" // alterado de "social-media" para "socialmedia"
  | "referral"
  | "advertising"
  | "email"
  | "phone"
  | "coldcall"
  | "event"
  | "other";

export type LeadStatus =
  | "primeiro_contato"
  | "qualificado"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired";

export type ProjectStatus =
  | "open"
  | "design"
  | "review"
  | "production"
  | "shipped"
  | "done"
  | "cancelled";

export type Priority = "low" | "medium" | "high" | "urgent";

export type ClientType = "individual" | "company";

// ✅ Corrigido - usar valores em português para compatibilidade
export type ClientStatus = "ativo" | "inativo" | "bloqueado";

// ================ INTERFACES AUXILIARES ================

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

export interface ApprovalTask {
  id: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  dueDate: Timestamp;
  assignedTo?: string;
  completedAt?: Timestamp;
  notes?: string;
}

export interface QuoteItem {
  id?: string; // Opcional para compatibilidade
  description: string;
  kind: "etapa" | "impressao";
  specifications?: string;
  quantity: number;
  unitPrice?: number; // Opcional para compatibilidade
  totalPrice: number;
  category?: string;
  notes?: string;
}

// ================ INTERFACES PRINCIPAIS ================

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  indication?: string;
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  quoteId?: string;
  priority?: Priority;
  expectedValue?: number;
  expectedCloseDate?: Timestamp;
  lastContact?: Timestamp;
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Client {
  id?: string;
  clientNumber?: number;
  type: ClientType;

  // ✅ Campos obrigatórios básicos
  name: string; // Nome sempre obrigatório
  email: string; // Email sempre obrigatório
  phone: string; // Telefone sempre obrigatório
  status: ClientStatus;

  // ✅ Pessoa Física
  cpf?: string;
  rg?: string;
  birthDate?: string;

  // ✅ Pessoa Jurídica
  company?: string; // Razão social
  companyName?: string; // Alias para compatibilidade
  cnpj?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;

  // ✅ Campos adicionais
  source?: string;
  notes?: string;
  socialMedia?: SocialMedia;
  address?: Address;
  firebaseAuthUid?: string;

  // ✅ Timestamps obrigatórios
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface Quote {
  id?: string;
  number: string;
  leadId?: string;
  clientId?: string;
  clientName: string;

  // ✅ Campos do projeto
  title?: string; // Para compatibilidade
  projectTitle: string;
  quoteType: "producao" | "impressao" | "misto";

  // ✅ Datas e validade
  issueDate: string; // Alterado para string para compatibilidade
  validityDays: number;
  expiryDate?: string | Timestamp; // Alterado para opcional e aceitar string também
  validUntil?: Timestamp; // Alias para compatibilidade

  // ✅ Status e aprovação
  status: QuoteStatus;
  signedAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp
  signedBy?: string;
  refusedAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp
  refusedReason?: string;
  sentAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp
  viewedAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp

  // ✅ Itens e totais
  items: QuoteItem[];
  totals: {
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    freight: number;
    taxes: number;
    total: number;
  };

  // ✅ Campos de compatibilidade
  grandTotal?: number; // Alias para totals.total
  subtotal?: number; // Alias para totals.subtotal
  taxes?: number; // Alias para totals.taxes
  discount?: number; // Alias para totals.discount

  // ✅ Campos adicionais
  productionTime?: string;
  terms?: string;
  notes?: string;
  pdfUrl?: string;

  // ✅ Metadados
  ownerId?: string; // Opcional para compatibilidade
  ownerName?: string; // Opcional para compatibilidade
  createdBy?: string; // Para compatibilidade
  createdAt?: Timestamp | Date; // Opcional e aceita Date ou Timestamp
  updatedAt?: Timestamp | Date; // Opcional e aceita Date ou Timestamp
}

export interface Project {
  id?: string;
  catalogCode?: string;
  clientId: string;
  clientName: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProductType;
  status: ProjectStatus;
  priority: Priority;
  dueDate: Timestamp;
  budget: number;
  assignedTo?: string;
  assignedToName?: string;
  proofsCount?: number;
  clientApprovalTasks?: ApprovalTask[];
  notes?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ================ FORM DATA INTERFACES ================

export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  value?: number;
  probability?: number;
  notes?: string;
  tags?: string[];
}

export interface ClientFormData {
  type: ClientType;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  company?: string;
  companyName?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;
  status: ClientStatus;
  source?: string;
  notes?: string;
  socialMedia?: SocialMedia;
  address?: Address;
}

export interface QuoteFormData {
  leadId: string;
  clientId?: string;
  projectTitle: string;
  quoteType: "producao" | "impressao" | "misto";
  validityDays: number;
  items: Omit<QuoteItem, "id" | "totalPrice">[];
  discount: number;
  discountType: "percentage" | "fixed";
  productionTime?: string;
  notes?: string;
}

export interface ProjectFormData {
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProductType;
  priority: Priority;
  dueDate: string;
  budget: number;
  assignedTo?: string;
  notes?: string;
}

// ================ PROPS INTERFACES ================

export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (data: LeadFormData) => Promise<void>;
  loading?: boolean;
}

export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (data: Client) => Promise<void>;
  loading?: boolean;
}

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: Quote | null;
  leadId?: string;
}

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  quoteId?: string;
}

// ================ CARD PROPS ================

export interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onView?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export interface QuoteCardProps {
  quote: Quote;
  onEdit?: (quote: Quote) => void;
  onView?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
  onSign?: (id: string) => void;
}

// ================ FILTERS & STATS ================

export interface ComercialFilters {
  status?: string[];
  priority?: Priority[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  assignedTo?: string[];
  search?: string;
}

export interface LeadFilters extends ComercialFilters {
  source?: LeadSource[];
  probability?: {
    min?: number;
    max?: number;
  };
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  conversionRate: number;
  averageValue: number;
  totalValue: number;
}
```

### clients types

```typescript
import { Timestamp } from "firebase/firestore";

export type ClientStatus = "active" | "inactive" | "blocked";

export interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Contact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface Client {
  id?: string;
  number: string; // CLT001, CLT002...
  name: string;
  email: string;
  phone?: string;
  company?: string;
  document: string; // CPF ou CNPJ
  address?: Address;
  contacts?: Contact[];
  status: ClientStatus;
  indication?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClientFilters {
  status?: ClientStatus[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```

### leads types

```typescript
import { Timestamp } from "firebase/firestore";

export type LeadSource =
  | "website"
  | "email"
  | "phone"
  | "referral"
  | "socialmedia"
  | "coldcall"
  | "event"
  | "advertising"
  | "other";

export type LeadStage =
  | "primeiro_contato"
  | "qualificado"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido";

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  stage: LeadStage;
  status: LeadStage; // Alias para stage para compatibilidade
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LeadFilters {
  stage?: LeadStage[];
  source?: LeadSource[];
  ownerId?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}
```

### projects types

```typescript
import { Timestamp } from "firebase/firestore";

export interface Project {
  id?: string;
  catalogCode?: string; // Ex: gerado pela Cloud Function
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate?: Timestamp | Date;
  budget?: number;
  assignedTo?: string;
  proofsCount: number;
  clientApprovalTasks?: ApprovalTask[];
  tags?: string[];
  notes?: string;
  createdBy?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export type ProjectStatus =
  | "open"
  | "design"
  | "review"
  | "production"
  | "shipped"
  | "done"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";
export type ProjectCategory =
  | "book"
  | "magazine"
  | "catalog"
  | "brochure"
  | "other";

export interface ApprovalTask {
  id: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  dueDate?: Timestamp;
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  comments?: string;
}
export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  clientId?: string;
  quoteId?: string;
  onSave: (project: Project) => Promise<void>;
  loading?: boolean;
}

export interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
  className?: string;
}

export interface ProjectFormData {
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProjectCategory;
  status?: ProjectStatus;
  priority: ProjectPriority;
  dueDate?: string | Date;
  budget?: number;
  assignedTo?: string;
  notes?: string;
}
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  category?: ProjectCategory[];
  assignedTo?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  search?: string;
}
export interface DateRange {
  start?: Date;
  end?: Date;
}
```

### quotes types

```typescript
import { Timestamp } from "firebase/firestore";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired";

// Filtro de Quotes
export interface QuoteFilters {
  status?: QuoteStatus[];
  number?: string;
  clientName?: string[];
  clientId?: string[];
  createdBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

// Alias para padrão de filtros comerciais
export type ComercialFilters = QuoteFilters;

export interface Quote {
  id?: string;
  number: string; // ex: QUO-001
  clientId?: string;
  clientName: string; // Para compatibilidade com comercial.ts (obrigatório)
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };
  leadId?: string;
  projectTitle: string;
  description?: string; // Para compatibilidade
  quoteType: "producao" | "impressao" | "misto";
  issueDate: string;
  validityDays: number;
  expiryDate?: string;
  status: QuoteStatus;
  items: QuoteItem[];
  totals: {
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    freight: number;
    taxes: number;
    total: number;
  };
  // Propriedades para compatibilidade
  subtotal?: number;
  taxes?: number;
  discount?: number;
  grandTotal?: number;
  validUntil?: any;
  productionTime?: string;
  terms?: string;
  notes?: string;
  pdfUrl?: string;
  signedAt?: Date;
  signedBy?: string;
  refusedAt?: Date;
  refusedReason?: string;
  sentAt?: Date;
  viewedAt?: Date;
  ownerId?: string;
  ownerName?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface QuoteItem {
  id?: string;
  description: string;
  kind: "etapa" | "impressao";
  specifications?: string;
  qty?: number;
  unitPrice?: number;
  value: number;
  category?: string;
  notes?: string;
  quantity: number;
  totalPrice: number;
}

// Formulário de Quote seguro para o hook
export interface QuoteFormData {
  leadId?: string;
  clientId?: string;
  clientName?: string;
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };
  title: string;
  description?: string;
  projectTitle: string;
  quoteType: "producao" | "impressao" | "misto";
  issueDate: string;
  validUntil?: string | Date;
  expiryDate?: string;
  status?: QuoteStatus;
  items: QuoteItem[];
  discount?: number;
  discountType?: "percentage" | "fixed";
  totals?: {
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    freight: number;
    taxes: number;
    total: number;
  };
  notes?: string;
}
```

### shared types

```typescrit
// src/types/shared.ts
import { Timestamp } from "firebase/firestore";

// ================ FORM FIELD PROPS ================
export interface FormFieldProps {
  label?: string;
  error?: string;
  helpText?: string;
}

// ================ SELECT OPTIONS ================
export interface SelectOption {
  value: string;
  label: string;
}

// ================ TABLE TYPES ================
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: "website" | "referral" | "social" | "advertising" | "other";
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  assignedTo?: string;
  notes?: string;
  value?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  number: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: Address;
  document?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  clientId: string;
  projectId?: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "approved" | "rejected" | "signed";
  validUntil: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  catalogCode: string;
  clientId: string;
  quoteId?: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed" | "cancelled";
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  budget: number;
  team: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  displayName: string;
  uid: string;
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  avatar?: string;
  department?: string;
  createdAt: Date;
}

export interface KPIData {
  leads: {
    total: number;
    new: number;
    qualified: number;
    conversion: number;
  };
  clients: {
    total: number;
    active: number;
    inactive: number;
  };
  quotes: {
    total: number;
    sent: number;
    approved: number;
    value: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    revenue: number;
  };
}
/**
 * Estado assíncrono genérico para hooks
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Opção para componentes Select
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Props de paginação
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * Range de datas para filtros
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Usuário autenticado
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: "admin" | "comercial" | "producao" | "financeiro" | "cliente";
}

/**
 * Perfil de usuário estendido
 */
export interface UserProfile extends AuthUser {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  department?: string;
  phone?: string;
}

/**
 * Configuração de tabela
 */
export interface TableConfig<T> {
  data: T[];
  loading: boolean;
  columns: TableColumn<T>[];
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  onFilter?: (
    filters: Record<string, string | number | boolean | undefined>
  ) => void;
}

// O valor basicamente pode ser o valor de qualquer propriedade do T
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// ================ CONSTANTS ================
export const PRODUCT_TYPE_LABELS = {
  L: "Livro",
  E: "Ebook",
  K: "Kindle (ePub)",
  C: "CD",
  D: "DVD",
  G: "Material Gráfico",
  P: "Plataformas Digitais",
  S: "Single Lançamento",
  X: "Livro de 3ºs",
  A: "Arte em Geral (3ºs)",
  M: "Campanhas / Peças Mkt",
} as const;

/**
 * Resposta de API padrão
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Metadados de auditoria
 */
export interface AuditMetadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Status base para entidades
 */
export type BaseStatus = "active" | "inactive" | "archived";

/**
 * Prioridade base
 */
export type Priority = "low" | "medium" | "high" | "urgent";

export type LeadSource =
  | "website"
  | "referral"
  | "socialmedia"
  | "coldcall"
  | "event"
  | "advertising"
  | "other";

export interface SelectOption {
  value: string;
  label: string;
}
```

### index types

```typescript
// ================ TYPES CENTRALIZADOS ================
// Baseado na documentação completa - usar comercial.ts como fonte principal

// Importar types específicos para re-export
import type {
  Address,
  ApprovalTask,
  Client,
  ClientFormData,
  ClientModalProps,
  ClientStatus,
  ClientType,
  ComercialFilters,
  Lead,
  LeadFilters,
  LeadFormData,
  LeadModalProps,
  LeadSource,
  LeadStats,
  LeadStatus,
  Priority,
  ProductType,
  Project,
  ProjectCardProps,
  ProjectFormData,
  ProjectModalProps,
  ProjectStatus,
  Quote,
  QuoteCardProps,
  QuoteFormData,
  QuoteItem,
  QuoteModalProps,
  QuoteStatus,
  SocialMedia,
} from "./comercial";

import type {
  ApiResponse,
  AsyncState,
  AuditMetadata,
  AuthUser,
  BaseStatus,
  DateRange,
  FormFieldProps,
  PaginationProps,
  SelectOption,
  SortConfig,
  SortDirection,
  TableColumn,
  TableConfig,
  UserProfile,
} from "./shared";

// ================ RE-EXPORTS ================

// Enums e Types
export type {
  ClientStatus,
  ClientType,
  LeadSource,
  LeadStatus,
  Priority,
  ProductType,
  ProjectStatus,
  QuoteStatus,
};

// Interfaces principais
export type { Client, Lead, Project, Quote };

// Interfaces auxiliares
export type { Address, ApprovalTask, QuoteItem, SocialMedia };

// Form Data
export type { ClientFormData, LeadFormData, ProjectFormData, QuoteFormData };

// Props
export type {
  ClientModalProps,
  LeadModalProps,
  ProjectCardProps,
  ProjectModalProps,
  QuoteCardProps,
  QuoteModalProps,
};

// Filters do comercial
export type { ComercialFilters, LeadFilters, LeadStats };

// Shared types
export type {
  ApiResponse,
  AsyncState,
  AuditMetadata,
  AuthUser,
  BaseStatus,
  DateRange,
  FormFieldProps,
  PaginationProps,
  SelectOption,
  SortConfig,
  SortDirection,
  TableColumn,
  TableConfig,
  UserProfile,
};

// ================ INTERFACES DE COMPATIBILIDADE ================

export interface Contact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface ClientFilters {
  status?: ClientStatus[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface QuoteFilters extends ComercialFilters {
  status?: QuoteStatus[];
  clientId?: string[];
}

export interface ProjectFilters extends ComercialFilters {
  status?: ProjectStatus[];
  clientId?: string[];
  category?: ProductType[];
}

// ================ ALIASES PARA COMPATIBILIDADE ================
export type LeadStage = LeadStatus;
```

## Component Props

```typescript
// Props dos Modais
export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead;
  onSave: (lead: Lead) => Promise<void>;
  loading?: boolean;
}

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: Quote;
  leadId?: string;
  onSave: (quote: Quote) => Promise<void>;
  loading?: boolean;
}

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  clientId?: string;
  quoteId?: string;
  onSave: (project: Project) => Promise<void>;
  loading?: boolean;
}

// Props dos Charts
export interface FunnelChartProps {
  data: {
    stage: string;
    label: string;
    count: number;
    value: number;
    color: string;
  }[];
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
  className?: string;
  onStageClick?: (stage: string) => void;
}

export interface RevenueChartProps {
  data: {
    period: string;
    revenue: number;
    expenses: number;
  }[];
  height?: number;
  showGrid?: boolean;
  className?: string;
}

// Props dos Cards
export interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (lead: Lead) => void;
  className?: string;
}

export interface QuoteCardProps {
  quote: Quote;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  onSend?: (quote: Quote) => void;
  onDuplicate?: (quote: Quote) => void;
  className?: string;
}

// Props das Tabelas
export interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onStageChange?: (leadId: string, stage: Lead["stage"]) => void;
  pagination?: PaginationProps;
  filters?: LeadFilters;
  onFiltersChange?: (filters: LeadFilters) => void;
}

// Filtros
export interface LeadFilters {
  stage?: Lead["stage"][];
  source?: Lead["source"][];
  ownerId?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface QuoteFilters {
  status?: Quote["status"][];
  clientId?: string[];
  createdBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  search?: string;
}
```

## 🎣 Hooks Detalhados

### Hook useLeads

```typescript
"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Lead, LeadFilters, LeadStage } from "@/lib/types/leads";
import { AsyncState, SelectOption } from "@/lib/types/shared";
import { getErrorMessage } from "@/lib/utils/errors";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: Lead["source"];
  value?: number;
  probability?: number;
  notes?: string;
  tags?: string[];
}

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<AsyncState<Lead[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // ================ FETCH LEADS ================
  const fetchLeads = useCallback(
    async (filters?: LeadFilters) => {
      if (!user) return;

      setLeads((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let leadsQuery = query(
          collection(db, "leads"),
          orderBy("createdAt", "desc")
        );

        // Aplicar filtros se fornecidos
        if (filters?.stage && filters.stage.length > 0) {
          leadsQuery = query(leadsQuery, where("stage", "in", filters.stage));
        }

        if (filters?.source && filters.source.length > 0) {
          leadsQuery = query(leadsQuery, where("source", "in", filters.source));
        }

        if (filters?.ownerId && filters.ownerId.length > 0) {
          leadsQuery = query(
            leadsQuery,
            where("ownerId", "in", filters.ownerId)
          );
        }

        const snapshot = await getDocs(leadsQuery);
        const leadsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];

        // Aplicar filtros de data e busca no frontend
        let filteredLeads = leadsData;

        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          filteredLeads = filteredLeads.filter((lead) => {
            const createdAt =
              lead.createdAt instanceof Date
                ? lead.createdAt
                : lead.createdAt.toDate();
            const start = filters.dateRange?.start
              ? new Date(filters.dateRange.start)
              : null;
            const end = filters.dateRange?.end
              ? new Date(filters.dateRange.end)
              : null;

            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredLeads = filteredLeads.filter(
            (lead) =>
              lead.name.toLowerCase().includes(searchLower) ||
              lead.email?.toLowerCase().includes(searchLower) ||
              lead.company?.toLowerCase().includes(searchLower)
          );
        }

        setLeads({
          data: filteredLeads,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao buscar leads:", error);
        setLeads({
          data: null,
          loading: false,
          error: errorMessage,
        });
        toast.error("Erro ao carregar leads");
      }
    },
    [user]
  );

  // ================ GET SINGLE LEAD ================
  const getLead = useCallback(async (id: string): Promise<Lead | null> => {
    try {
      const docRef = doc(db, "leads", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Lead;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar lead:", error);
      toast.error("Erro ao carregar lead");
      return null;
    }
  }, []);

  // ================ CREATE LEAD ================
  const createLead = useCallback(
    async (data: LeadFormData): Promise<string | null> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return null;
      }

      try {
        const leadData: Omit<Lead, "id"> = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          source: data.source,
          stage: "primeiro_contato",
          status: "primeiro_contato", // Adicionando status obrigatório
          value: data.value || 0,
          probability: data.probability || 0,
          ownerId: user.uid,
          ownerName: user.displayName || "Usuário",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastActivityAt: Timestamp.now(),
          notes: data.notes,
          tags: data.tags || [],
        };

        const docRef = await addDoc(collection(db, "leads"), leadData);
        toast.success("Lead criado com sucesso!");
        await fetchLeads();
        return docRef.id;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao criar lead:", error);
        toast.error(`Erro ao criar lead: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchLeads]
  );

  // ================ UPDATE LEAD ================
  const updateLead = useCallback(
    async (id: string, data: Partial<LeadFormData>): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        const docRef = doc(db, "leads", id);
        const updateData: Partial<Lead> = {
          ...data,
          updatedAt: Timestamp.now(),
          lastActivityAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);
        toast.success("Lead atualizado com sucesso!");
        await fetchLeads();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao atualizar lead:", error);
        toast.error(`Erro ao atualizar lead: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchLeads]
  );

  // ================ UPDATE LEAD STAGE ================
  const updateLeadStage = useCallback(
    async (id: string, stage: LeadStage): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        const docRef = doc(db, "leads", id);
        await updateDoc(docRef, {
          stage,
          updatedAt: Timestamp.now(),
          lastActivityAt: Timestamp.now(),
        });

        toast.success("Stage do lead atualizado!");
        await fetchLeads();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao atualizar stage:", error);
        toast.error("Erro ao atualizar stage do lead");
        return false;
      }
    },
    [user, fetchLeads]
  );

  // ================ DELETE LEAD ================
  const deleteLead = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        await deleteDoc(doc(db, "leads", id));
        toast.success("Lead excluído com sucesso!");
        await fetchLeads();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao excluir lead:", error);
        toast.error("Erro ao excluir lead");
        return false;
      }
    },
    [user, fetchLeads]
  );

  // ================ GET LEADS OPTIONS FOR SELECT ================
  const getLeadsOptions = useCallback((): SelectOption[] => {
    if (!leads.data) return [];

    return leads.data
      .filter(
        (lead) =>
          ["primeirocontato", "qualificado"].includes(lead.stage) && lead.id
      )
      .map((lead) => ({
        value: lead.id!,
        label: `${lead.name}${lead.email ? ` (${lead.email})` : ""}`,
      }));
  }, [leads.data]);

  // ================ LOAD DATA ON MOUNT ================
  useEffect(() => {
    if (user) {
      void fetchProjects();
    }
  }, [user, fetchProjects]);

  return {
    leads: leads.data || [],
    loading: leads.loading,
    error: leads.error,
    fetchLeads,
    getLead,
    createLead,
    updateLead,
    updateLeadStage,
    deleteLead,
    getLeadsOptions,
    refetch: fetchLeads,
  };
}
function fetchProjects() {
  throw new Error("Function not implemented.");
}
```

### Hook useClients

```typescript
"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Client, ClientStatus } from "@/lib/types/comercial";
import { AsyncState, SelectOption } from "@/lib/types/shared";
import { getErrorMessage } from "@/lib/utils/errors";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface ClientFilters {
  status?: ClientStatus[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ClientFormData {
  type: "individual" | "company";
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  company?: string;
  status: ClientStatus;
  indication?: string;
  notes?: string;
}

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<AsyncState<Client[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // ================ FETCH CLIENTS ================
  const fetchClients = useCallback(
    async (filters?: ClientFilters) => {
      if (!user) return;

      setClients((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let clientsQuery = query(
          collection(db, "clients"),
          orderBy("name", "asc")
        );

        if (filters?.status && filters.status.length > 0) {
          clientsQuery = query(
            clientsQuery,
            where("status", "in", filters.status)
          );
        }

        const snapshot = await getDocs(clientsQuery);
        const clientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];

        // Aplicar filtros no frontend
        let filteredClients = clientsData;

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredClients = filteredClients.filter(
            (client) =>
              client.name.toLowerCase().includes(searchLower) ||
              client.email.toLowerCase().includes(searchLower) ||
              client.company?.toLowerCase().includes(searchLower) ||
              (client.cpf && client.cpf.includes(filters.search!)) ||
              (client.cnpj && client.cnpj.includes(filters.search!))
          );
        }

        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          filteredClients = filteredClients.filter((client) => {
            const createdAt = client.createdAt.toDate();
            const start = filters.dateRange?.start
              ? new Date(filters.dateRange.start)
              : null;
            const end = filters.dateRange?.end
              ? new Date(filters.dateRange.end)
              : null;

            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        setClients({
          data: filteredClients,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao buscar clientes:", error);
        setClients({
          data: null,
          loading: false,
          error: errorMessage,
        });
        toast.error("Erro ao carregar clientes");
      }
    },
    [user]
  );

  // ================ GET SINGLE CLIENT ================
  const getClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      const docRef = doc(db, "clients", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Client;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast.error("Erro ao carregar cliente");
      return null;
    }
  }, []);

  // ================ CREATE CLIENT ================
  const createClient = useCallback(
    async (data: ClientFormData): Promise<string | null> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return null;
      }

      try {
        const clientData: Omit<Client, "id" | "clientNumber"> = {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "clients"), clientData);
        toast.success("Cliente criado com sucesso!");
        await fetchClients();
        return docRef.id;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao criar cliente:", error);
        toast.error(`Erro ao criar cliente: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchClients]
  );

  // ================ UPDATE CLIENT ================
  const updateClient = useCallback(
    async (id: string, data: Partial<ClientFormData>): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        const docRef = doc(db, "clients", id);
        const updateData: Partial<Client> = {
          ...data,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);
        toast.success("Cliente atualizado com sucesso!");
        await fetchClients();
        return true;
      } catch (error) {
        const _errorMessage = getErrorMessage(error);
        console.error("Erro ao atualizar cliente:", error);
        toast.error("Erro ao atualizar cliente");
        return false;
      }
    },
    [user, fetchClients]
  );

  // ================ DELETE CLIENT ================
  const deleteClient = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        await deleteDoc(doc(db, "clients", id));
        toast.success("Cliente excluído com sucesso!");
        await fetchClients();
        return true;
      } catch (error) {
        const _errorMessage = getErrorMessage(error);
        console.error("Erro ao excluir cliente:", error);
        toast.error("Erro ao excluir cliente");
        return false;
      }
    },
    [user, fetchClients]
  );

  // ================ GET CLIENTS OPTIONS FOR SELECT ================
  const getClientsOptions = useCallback((): SelectOption[] => {
    if (!clients.data) return [];

    return clients.data
      .filter((client) => client.status === "ativo" && client.id)
      .map((client) => ({
        value: client.id!,
        label: `${client.name}${client.company ? ` (${client.company})` : ""}`,
      }));
  }, [clients.data]);

  // ================ GET CLIENT BY EMAIL ================
  const getClientByEmail = useCallback(
    async (email: string): Promise<Client | null> => {
      try {
        const clientsQuery = query(
          collection(db, "clients"),
          where("email", "==", email)
        );

        const snapshot = await getDocs(clientsQuery);

        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          return { id: docData.id, ...docData.data() } as Client;
        }

        return null;
      } catch (error) {
        console.error("Erro ao buscar cliente por email:", error);
        return null;
      }
    },
    []
  );

  // ================ LOAD DATA ON MOUNT ================
  useEffect(() => {
    if (user) {
      void fetchClients();
    }
  }, [user, fetchClients]);

  return {
    clients: clients.data || [],
    loading: clients.loading,
    error: clients.error,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    getClientsOptions,
    getClientByEmail,
    refetch: fetchClients,
  };
}
```

### Hook useQuotes

```typescript
"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  ComercialFilters,
  Quote,
  QuoteFormData,
  QuoteItem,
} from "@/lib/types/quotes";
import { AsyncState } from "@/lib/types/shared";
import { getErrorMessage } from "@/lib/utils/errors";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function useQuotes() {
  const { user } = useAuth();

  const [quotes, setQuotes] = useState<AsyncState<Quote[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // =================== FETCH QUOTES ===================
  const fetchQuotes = useCallback(
    async (filters?: ComercialFilters) => {
      if (!user) return;

      setQuotes((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let quotesQuery = query(
          collection(db, "quotes"),
          orderBy("createdAt", "desc")
        );

        if (filters?.status?.length) {
          quotesQuery = query(
            quotesQuery,
            where("status", "in", filters.status)
          );
        }

        const snapshot = await getDocs(quotesQuery);
        const quotesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Quote)
        );

        let filteredQuotes = quotesData;

        // Filtro por data
        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          filteredQuotes = filteredQuotes.filter((quote) => {
            const createdAt = quote.createdAt
              ? quote.createdAt instanceof Timestamp
                ? quote.createdAt.toDate()
                : new Date(quote.createdAt)
              : null;
            const start = filters.dateRange?.start
              ? new Date(filters.dateRange.start)
              : null;
            const end = filters.dateRange?.end
              ? new Date(filters.dateRange.end)
              : null;
            if (!createdAt) return false;
            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        // Filtro por busca
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredQuotes = filteredQuotes.filter(
            (quote) =>
              quote.projectTitle?.toLowerCase().includes(searchLower) ||
              quote.number?.toLowerCase().includes(searchLower) ||
              quote.client?.name?.toLowerCase().includes(searchLower)
          );
        }

        setQuotes({
          data: filteredQuotes,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao buscar orçamentos:", error);
        setQuotes({ data: null, loading: false, error: errorMessage });
        toast.error("Erro ao carregar orçamentos");
      }
    },
    [user]
  );

  // =================== GET SINGLE QUOTE ===================
  const getQuote = useCallback(async (id: string): Promise<Quote | null> => {
    try {
      const docRef = doc(db, "quotes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Quote;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      toast.error("Erro ao carregar orçamento");
      return null;
    }
  }, []);

  // =================== CREATE QUOTE ===================
  const createQuote = useCallback(
    async (data: QuoteFormData): Promise<string | null> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return null;
      }

      try {
        const processedItems: QuoteItem[] = data.items.map((item, index) => ({
          ...item,
          id: item.id || `item_${index + 1}`,
          totalPrice: item.quantity * (item.unitPrice || 0),
        }));

        const subtotal = processedItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        const taxes = subtotal * 0.1; // 10% impostos
        const grandTotal = subtotal + taxes - (data.discount ?? 0);

        const quoteData: Omit<Quote, "id" | "number"> = {
          leadId: data.leadId,
          clientId: data.clientId,
          clientName: data.client?.name || "Cliente", // Adicionando clientName obrigatório
          client: data.client, // agora é um objeto, se quiser só o nome: client: { name: data.clientName ?? "" }
          projectTitle: data.title,
          quoteType: "producao",
          issueDate: new Date().toISOString(),
          validityDays: 30,
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          items: processedItems,
          totals: {
            subtotal,
            discount: data.discount || 0,
            discountType: "fixed",
            freight: 0,
            taxes,
            total: grandTotal,
          },
          productionTime: undefined,
          terms: undefined,
          notes: data.notes,
          pdfUrl: undefined,
          status: "draft",
          ownerId: user.uid,
          ownerName: user.displayName ?? "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "quotes"), quoteData);

        // Aguardar um pouco para a Cloud Function processar a numeração
        setTimeout(async () => {
          await fetchQuotes();
        }, 2000);

        toast.success("Orçamento criado com sucesso!");
        return docRef.id;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao criar orçamento:", error);
        toast.error(`Erro ao criar orçamento: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchQuotes]
  );

  // =================== UPDATE QUOTE ===================
  const updateQuote = useCallback(
    async (id: string, data: Partial<QuoteFormData>): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }
      try {
        const docRef = doc(db, "quotes", id);

        // Prepare update fields somente com os que vieram alterados
        const updateData: Partial<Quote> = {
          updatedAt: Timestamp.now(),
        };

        if (data.title) updateData.projectTitle = data.title;
        if (data.client) updateData.client = data.client;
        if (data.notes) updateData.notes = data.notes;
        if (data.discount !== undefined)
          if (data.items) {
            const processedItems: QuoteItem[] = data.items.map(
              (item, index) => ({
                ...item,
                id: item.id || `item_${index + 1}`,
                totalPrice: item.quantity * (item.unitPrice || 0),
              })
            );
            updateData.items = processedItems;

            updateData.totals = {
              subtotal: processedItems.reduce(
                (sum, item) => sum + item.totalPrice,
                0
              ),
              discount: data.discount ?? 0,
              discountType: "fixed",
              freight: 0,
              taxes:
                processedItems.reduce((sum, item) => sum + item.totalPrice, 0) *
                0.1,
              total:
                processedItems.reduce((sum, item) => sum + item.totalPrice, 0) *
                  1.1 -
                (data.discount ?? 0),
            };
          }

        await updateDoc(docRef, updateData);
        toast.success("Orçamento atualizado com sucesso!");
        await fetchQuotes();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao atualizar orçamento:", error);
        toast.error(`Erro ao atualizar orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes]
  );

  // =================== SIGN QUOTE ===================
  const signQuote = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }
      try {
        const docRef = doc(db, "quotes", id);
        await updateDoc(docRef, {
          status: "signed",
          signedAt: Timestamp.now(),
          signedBy: user?.uid || "dev-user-123",
          updatedAt: Timestamp.now(),
        });
        toast.success("Orçamento assinado com sucesso!");
        await fetchQuotes();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao assinar orçamento:", error);
        toast.error(`Erro ao assinar orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes]
  );

  // =================== DELETE QUOTE ===================
  const deleteQuote = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }
      try {
        await deleteDoc(doc(db, "quotes", id));
        toast.success("Orçamento excluído com sucesso!");
        await fetchQuotes();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao excluir orçamento:", error);
        toast.error(`Erro ao excluir orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes]
  );

  // =================== EFEITO - INICIAL ===================
  useEffect(() => {
    if (user) {
      void fetchQuotes();
    }
  }, [user, fetchQuotes]);

  return {
    quotes: quotes.data || [],
    loading: quotes.loading,
    error: quotes.error,
    fetchQuotes,
    getQuote,
    createQuote,
    updateQuote,
    signQuote,
    deleteQuote,
    refetch: fetchQuotes,
  };
}
```

### Hook useFunnelData

```typescript
// src/hooks/comercial/useFunnelData.ts

import { useState, useEffect } from "react";
import { useLeads } from "./useLeads";
import { Lead } from "@/lib/types/comercial";

interface FunnelStage {
  stage: Lead["stage"];
  label: string;
  count: number;
  value: number;
  color: string;
  conversionRate?: number;
}

export function useFunnelData(period?: { start: Date; end: Date }) {
  const { leads, loading } = useLeads({
    dateRange: period,
  });
  const [funnelData, setFunnelData] = useState<FunnelStage[]>([]);

  const stageConfig = {
    primeiro_contato: { label: "Primeiro Contato", color: "#81f0ffff " },
    qualificado: { label: "Qualificado", color: "#23b8cd" },
    proposta_enviada: { label: "Proposta Enviada", color: "#fabf86 " },
    negociacao: { label: "Negociação", color: "#b5413d" },
    fechado_ganho: { label: "Fechado Ganho", color: "#edebd6" },
    fechado_perdido: { label: "Fechado Perdido", color: "#5c8890" },
  };

  useEffect(() => {
    if (leads.length === 0) return;

    // Agrupar leads por estágio
    const stageStats = leads.reduce((acc, lead) => {
      if (!acc[lead.stage]) {
        acc[lead.stage] = { count: 0, value: 0 };
      }
      acc[lead.stage].count++;
      acc[lead.stage].value += lead.value || 0;
      return acc;
    }, {} as Record<Lead["stage"], { count: number; value: number }>);

    // Criar dados do funil com taxa de conversão
    const stages = Object.keys(stageConfig) as Lead["stage"][];
    const totalLeads = leads.length;

    const funnelStages: FunnelStage[] = stages.map((stage, index) => {
      const stats = stageStats[stage] || { count: 0, value: 0 };
      const prevCount =
        index > 0 ? stageStats[stages[index - 1]]?.count || 0 : totalLeads;

      return {
        stage,
        label: stageConfig[stage].label,
        count: stats.count,
        value: stats.value,
        color: stageConfig[stage].color,
        conversionRate: prevCount > 0 ? (stats.count / prevCount) * 100 : 0,
      };
    });

    setFunnelData(funnelStages);
  }, [leads]);

  return {
    funnelData,
    loading,
    totalLeads: leads.length,
    totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0),
  };
}
```

---

## 🔧 Implementação de Componentes Chave

### CommercialDashboard.tsx

````typescript
// src/components/dashboard/CommercialDashboard.tsx - VERSÃO OTIMIZADA
"use client";

import { ActivityFeed } from "@/components/comercial/ActivityFeed";
import { DonutChart } from "@/components/comercial/charts/DonutChart";
import { RevenueChart } from "@/components/comercial/charts/RevenueChart";
import { DateRangePicker } from "@/components/comercial/filters/DateRangePicker";
import { LeadModal } from "@/components/comercial/modals/LeadModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCommercialMetrics } from "@/hooks/comercial/useCommercialMetrics";
import { useFunnelData } from "@/hooks/comercial/useFunnelData";
import { Lead } from "@/lib/types/comercial";
import { useRouter } from "next/navigation";
import { useState } from "react";

// KPI Component com Design System
interface KPIData {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "purple" | "orange";
}

function KPICard({ metric }: { metric: KPIData }) {
  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
      return `R$ ${value.toLocaleString("pt-BR")}`;
    }
    return value.toString();
  };

  // ✅ CORES DO DESIGN SYSTEM
  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case "success":
        return "bg-success-50 border-success-200";
      case "purple":
        return "bg-purple-50 border-purple-200";
      case "orange":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-primary-50 border-primary-200";
    }
  };

  const getIconColor = (variant?: string) => {
    switch (variant) {
      case "success":
        return "var(--color-success-600)";
      case "purple":
        return "var(--color-purple-600)";
      case "orange":
        return "var(--color-orange-600)";
      default:
        return "var(--color-primary-600)";
    }
  };

  return (
    <Card
      className={`p-6 hover:shadow-md transition-shadow duration-200 ${getVariantClasses(
        metric.variant
      )}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* ✅ CORES DO DESIGN SYSTEM */}
          <p className="text-sm font-medium text-secondary mb-1">
            {metric.label}
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatValue(metric.value)}
          </p>
          {metric.change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                metric.change.type === "increase"
                  ? "text-success"
                  : "text-error"
              }`}
            >
              <span className="mr-1">
                {metric.change.type === "increase" ? "↗" : "↘"}
              </span>
              <span>{Math.abs(metric.change.value)}% vs mês anterior</span>
            </div>
          )}
        </div>
        {metric.icon && (
          <div className="flex-shrink-0 ml-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: getIconColor(metric.variant) + "20",
                border: `1px solid ${getIconColor(metric.variant)}30`,
              }}
            >
              {metric.icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function CommercialDashboard() {
  const router = useRouter();

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { funnelData, loading: funnelLoading } = useFunnelData(dateRange);
  const { metrics, loading: metricsLoading } = useCommercialMetrics(dateRange);

  // ✅ CORES DO DESIGN SYSTEM PARA DONUT
  const donutData = funnelData.map((item, index) => {
    const colors = [
      "var(--color-gray-500)", // primeiro_contato
      "var(--color-primary-600)", // qualificado
      "var(--color-purple-600)", // proposta_enviada
      "var(--color-warning-600)", // negociacao
      "var(--color-success-600)", // fechado_ganho
      "var(--color-error-600)", // fechado_perdido
    ];

    return {
      stage: item.stage,
      label: item.label,
      value: item.count,
      percentage: item.percentage,
      color: colors[index] || "var(--color-gray-400)",
    };
  });

  // ✅ KPIs COM VARIANTS DO DESIGN SYSTEM
  const kpiData: KPIData[] = metrics
    ? [
        {
          label: "Receita do Mês",
          value: metrics.monthlyRevenue || 0,
          change: {
            value: metrics.revenueGrowth || 0,
            type: (metrics.revenueGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="teicon-rotate text-3xl">💰</span>,
          variant: "success", // ✅ USA VARIANT
        },
        {
          label: "Taxa de Conversão",
          value: `${(metrics.conversionRate || 0).toFixed(1)}%`,
          change: {
            value: metrics.conversionGrowth || 0,
            type:
              (metrics.conversionGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="icon-rotate text-3xl">📈</span>,
          variant: "primary", // ✅ USA VARIANT
        },
        {
          label: "Leads Ativos",
          value: metrics.activeLeads || 0,
          change: {
            value: metrics.leadsGrowth || 0,
            type: (metrics.leadsGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="icon-rotate text-3xl">👥</span>,
          variant: "purple", // ✅ USA VARIANT
        },
        {
          label: "Ticket Médio",
          value: metrics.averageTicket || 0,
          change: {
            value: metrics.ticketGrowth || 0,
            type: (metrics.ticketGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="icon-rotate text-3xl">🎯</span>,
          variant: "orange", // ✅ USA VARIANT
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ✅ HEADER COM THEME TOGGLE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Dashboard Comercial
          </h1>
          <p className="text-secondary">Visão geral das vendas e pipeline</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* ✅ THEME TOGGLE */}
          <ThemeToggle />

          <DateRangePicker value={dateRange} onChange={setDateRange} />

          {/* ✅ BOTÕES MANTIDOS (já estão corretos) */}
          <Button variant="outline" onClick={() => router.push("/crm/clients")}>
            Clientes
          </Button>
          <Button variant="outline" onClick={() => router.push("/crm/quotes")}>
            Orçamentos
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/crm/projects")}
          >
            Projetos
          </Button>
          <Button variant="outline" onClick={() => router.push("/crm/leads")}>
            Leads
          </Button>
          <Button variant="outline">Exportar Relatório</Button>
        </div>
      </div>

      {/* ✅ KPI CARDS COM VARIANTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* ✅ FUNIL COM DONUT CHART */}
        <Card className="lg:col-span-2 xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary">
              Funil de Vendas
            </h2>
            <Button variant="ghost" size="sm">
              Ver Detalhes
            </Button>
          </div>
          <DonutChart
            data={donutData}
            height={300}
            showValues={true}
            showPercentages={true}
            loading={funnelLoading}
          />
        </Card>

        {/* ✅ AÇÕES RÁPIDAS (mantidas - já estão perfeitas) */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <Button
              variant="success" // 🟢 VERDE
              className="justify-start"
              onClick={() => setModalOpen(true)}
            >
              <span className="icon-rotate text-3xl">👤</span>
              Novo Lead
            </Button>

            <Button
              variant="primary" // 🔵 AZUL (corrigido de "default")
              className="justify-start"
              onClick={() => router.push("/crm/clients?action=new")}
            >
              <span className="text-xl mr-3">🏢</span>
              Novo Cliente
            </Button>

            <Button
              variant="purple" // 🟣 ROXO
              className="justify-start"
              onClick={() => router.push("/crm/quotes?action=new")}
            >
              <span className="text-xl mr-3">📄</span>
              Novo Orçamento
            </Button>

            <Button
              variant="orange" // 🟠 LARANJA
              className="justify-start"
              onClick={() => router.push("/crm/projects?action=new")}
            >
              <span className="text-xl mr-3">🛠️</span>
              Novo Projeto
            </Button>

            <Button
              variant="outline" // ⚪ OUTLINE
              className="justify-start"
              onClick={() => router.push("/crm/clients")}
            >
              <span className="text-xl mr-3">📋</span>
              Ver Clientes
            </Button>
          </div>
        </Card>

        {/* Receita Mensal */}
        <Card className="lg:col-span-2 xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary">
              Receita vs Meta
            </h2>
            <Button variant="ghost" size="sm">
              Configurar Meta
            </Button>
          </div>
          <RevenueChart data={metrics?.revenueData} height={300} />
        </Card>

        {/* Feed de Atividades */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Atividades Recentes
          </h2>
          <ActivityFeed />
        </Card>
      </div>

      {/* ✅ MODAL MANTIDO */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSave={async (leadData) => {
          console.log("Lead salvo:", leadData);
          setModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}


### LeadModal.tsx

```typescript
// src/components/comercial/modals/LeadModal.tsx

"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/shared/useAuth";
import { Lead } from "@/lib/types/comercial";
import { LeadModalProps } from "@/lib/types/comercial";

export function LeadModal({
  isOpen,
  onClose,
  lead,
  onSave,
  loading,
}: LeadModalProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website",
    stage: "primeiro_contato",
    value: 0,
    probability: 0,
    notes: "",
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preencher form quando lead é passado (edição)
  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        stage: "primeiro_contato",
        value: 0,
        probability: 0,
        notes: "",
        tags: [],
        ownerId: profile?.uid,
        ownerName: profile?.name,
      });
    }
  }, [lead, profile]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.phone && !/^\(?[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Telefone inválido";
    }

    if (formData.value && formData.value < 0) {
      newErrors.value = "Valor não pode ser negativo";
    }

    if (
      formData.probability &&
      (formData.probability < 0 || formData.probability > 100)
    ) {
      newErrors.probability = "Probabilidade deve estar entre 0 e 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSave(formData as Lead);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    }
  };

  const handleInputChange = (field: keyof Lead, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? "Editar Lead" : "Novo Lead"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome *
            </label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="Nome do lead"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Telefone
            </label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Empresa
            </label>
            <Input
              value={formData.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>
        </div>

        {/* Informações de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fonte
            </label>
            <Select
              value={formData.source}
              onChange={(value) => handleInputChange("source", value)}
              options={[
                { value: "website", label: "Website" },
                { value: "referral", label: "Indicação" },
                { value: "social_media", label: "Redes Sociais" },
                { value: "cold_call", label: "Cold Call" },
                { value: "event", label: "Evento" },
                { value: "advertising", label: "Publicidade" },
                { value: "other", label: "Outros" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Valor Potencial (R$)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.value || ""}
              onChange={(e) =>
                handleInputChange("value", parseFloat(e.target.value) || 0)
              }
              error={errors.value}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Probabilidade (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.probability || ""}
              onChange={(e) =>
                handleInputChange("probability", parseInt(e.target.value) || 0)
              }
              error={errors.probability}
              placeholder="0"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observações
          </label>
          <Textarea
            value={formData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Adicione observações sobre este lead..."
            rows={4}
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            {lead ? "Salvar Alterações" : "Criar Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
````

---

## 📋 Próximos Passos para Implementação

### **Fase 1: Setup e Estrutura Base**

1. **🔧 Reorganização de Arquivos**

   - Criar pasta `config/` e mover `firestore.rules`, `storage.rules`
   - Atualizar `firebase.json` com novos caminhos
   - Implementar route group `(authenticated)/`

2. **🛡️ Sistema de Proteção**

   - Implementar `middleware.ts` completo
   - Criar `AuthContext` com verificação de permissões
   - Configurar redirecionamentos automáticos

3. **📝 Types e Constants**
   - Implementar todos os types em `/lib/types/`
   - Criar `constants.ts` com enums e configurações
   - Configurar `permissions.ts` com sistema RBAC

### **Fase 2: Componentes Base**

1. **🎨 Design System**

   - Implementar todos os componentes UI básicos
   - Configurar paleta de cores no Tailwind
   - Criar componentes de layout (Header, Sidebar, etc.)

2. **🧩 Componentes Comerciais**

   - Implementar todos os componentes em `/components/comercial/`
   - Criar modais, cards, tables, charts específicos
   - Implementar formulários com validação

3. **🎣 Hooks Personalizados**
   - Implementar todos os hooks em `/hooks/`
   - Criar hooks específicos para cada módulo
   - Adicionar error handling e loading states

### **Fase 3: Dashboards e Funcionalidades**

1. **📊 Dashboards Especializados**

   - Implementar CommercialDashboard com todas as métricas
   - Criar gráficos e visualizações específicas
   - Implementar filtros e controles avançados

2. **📈 Sistema de Métricas**

   - Implementar cálculo de métricas em tempo real
   - Criar sistema de cache para performance
   - Adicionar exportação de relatórios

3. **🔄 Integração Completa**
   - Conectar todos os módulos (CRM → Projetos)
   - Implementar automações via Cloud Functions
   - Testar fluxo completo Lead → Quote → Project

### **Fase 4: Refinamentos e Deploy**

1. **✅ Testes e Qualidade**

   - Testes unitários dos componentes principais
   - Testes de integração do fluxo comercial
   - Testes de performance e otimização

2. **📱 Responsividade e UX**

   - Ajustes de layout para mobile
   - Melhorias de UX baseadas em feedback
   - Animações e transições suaves

3. **🚀 Deploy e Monitoramento**
   - Deploy em produção com CI/CD
   - Configuração de monitoramento
   - Treinamento da equipe

---

## 🎯 Checklist de Validação

### **Estrutura**

- [ ] Route group `(authenticated)` implementado
- [ ] Middleware de proteção funcionando
- [ ] Arquivos de configuração organizados em `config/`
- [ ] Types completos e organizados por módulo

### **Design System**

- [ ] Paleta de cores implementada no Tailwind
- [ ] Componentes UI funcionais
- [ ] Layout responsivo em todas as telas
- [ ] Fonte Inter configurada corretamente

### **Módulo Comercial**

- [ ] Todos os componentes modulares implementados
- [ ] CRUD completo para Leads, Quotes, Projects, Clients
- [ ] Hooks personalizados funcionais
- [ ] Dashboard comercial com todas as métricas

### **Integração**

- [ ] Fluxo Lead → Quote → Project funcionando
- [ ] Cloud Functions automáticas operacionais
- [ ] Sistema RBAC respeitado em todas as telas
- [ ] Performance otimizada (< 3s carregamento inicial)

---

## 📚 Documentação de Referência

### **Arquivos de Documentação**

1. **`Plano_Mestre.md`** - Regras de negócio e backend
2. **`Documentacao_Completa.md`** - Este documento (estrutura e frontend)
3. **`Design_System.md`** - Guia de componentes e estilos
4. **`API_Reference.md`** - Documentação de hooks e funções
5. **`Deployment_Guide.md`** - Guia de deploy e configuração

### **Padrões de Código**

- **Naming:** camelCase para variáveis, PascalCase para componentes
- **Estrutura:** Um componente por arquivo, exports nomeados
- **Types:** Sempre tipados, interfaces bem definidas
- **Hooks:** Sempre começar com "use", return object com métodos
- **Comments:** JSDoc para funções públicas, inline para lógica complexa

### **Performance**

- **Lazy Loading:** Componentes de rota carregados sob demanda
- **Memoization:** React.memo para componentes pesados
- **Queries:** Uso de índices compostos no Firestore
- **Images:** Otimização automática com Next.js Image

---

## 🔚 Conclusão

Esta documentação representa a **especificação completa e definitiva** do Sistema DDM, consolidando todas as discussões, correções e melhorias identificadas.

**Principais Conquistas:**

✅ **Zero Ambiguidade** - Cada componente, hook e interface está especificado  
✅ **Estrutura Correta** - Projetos integrados ao CRM conforme processo real  
✅ **Componentização Modular** - Organização clara e reutilizável  
✅ **Design System Definido** - Baseado no layout visual de referência  
✅ **Dashboards Especializados** - Métricas específicas por área  
✅ **Roadmap Claro** - Implementação em 4 fases bem definidas

**Com esta documentação, a equipe pode implementar o sistema sem retrabalho, seguindo as especificações técnicas detalhadas e mantendo a consistência em todo o projeto.**

🚀 **Próximo passo:** Implementar a Fase 1 (Setup e Estrutura Base) conforme o roadmap definido.

## Modal

**modal** do Sistema DDM

### ClientModal

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { Modal } from "@/components/ui/Modal";
import { Client } from "@/lib/types/comercial";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (data: Client) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  cpf: string;
  cnpj: string;
  company: string;
  businessType: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
    website: string;
  };
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: "ativo" | "inativo";
  source: string;
  notes: string;
}

export function ClientModal({
  isOpen,
  onClose,
  client,
  onSave,
  loading = false,
}: ClientModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    cpf: "",
    cnpj: "",
    company: "",
    businessType: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      linkedin: "",
      website: "",
    },
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
    status: "ativo",
    source: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [personType, setPersonType] = useState<"fisica" | "juridica">("fisica");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        phone: client.phone || "",
        email: client.email || "",
        cpf: client.cpf || "",
        cnpj: client.cnpj || "",
        company: client.company || "",
        businessType: client.businessType || "",
        socialMedia: {
          instagram: client.socialMedia?.instagram || "",
          facebook: client.socialMedia?.facebook || "",
          linkedin: client.socialMedia?.linkedin || "",
          website: client.socialMedia?.website || "",
        },
        address: {
          street: client.address?.street || "",
          number: client.address?.number || "",
          complement: client.address?.complement || "",
          neighborhood: client.address?.neighborhood || "",
          city: client.address?.city || "",
          state: client.address?.state || "",
          zipCode: client.address?.zipCode || "",
        },
        status:
          client.status === "ativo" || client.status === "inativo"
            ? client.status
            : "ativo",
        source: client.source || "",
        notes: client.notes || "",
      });
      setPersonType(client.cnpj ? "juridica" : "fisica");
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        cpf: "",
        cnpj: "",
        company: "",
        businessType: "",
        socialMedia: {
          instagram: "",
          facebook: "",
          linkedin: "",
          website: "",
        },
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        },
        status: "ativo",
        source: "",
        notes: "",
      });
      setPersonType("fisica");
    }
    setErrors({});
  }, [client, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (personType === "fisica") {
      if (!formData.cpf.trim()) {
        newErrors.cpf = "CPF é obrigatório";
      }
    } else {
      if (!formData.cnpj.trim()) {
        newErrors.cnpj = "CNPJ é obrigatório";
      }
      if (!formData.company.trim()) {
        newErrors.company = "Razão social é obrigatória";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedInputChange = (
    parent: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData: Client = {
        type: personType === "fisica" ? "individual" : "company",
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        cpf: formData.cpf,
        cnpj: formData.cnpj,
        company: formData.company,
        businessType: formData.businessType,
        status: formData.status,
        source: formData.source,
        notes: formData.notes,
        socialMedia: formData.socialMedia,
        address: formData.address,
        createdAt: client?.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (client?.id) clientData.id = client.id;
      if (client?.clientNumber) clientData.clientNumber = client.clientNumber;
      if (client?.firebaseAuthUid)
        clientData.firebaseAuthUid = client.firebaseAuthUid;

      await onSave(clientData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setErrors({ submit: "Erro ao salvar cliente. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const businessTypeOptions = [
    { value: "", label: "Selecione o tipo" },
    { value: "editora", label: "Editora" },
    { value: "livraria", label: "Livraria" },
    { value: "grafica", label: "Gráfica" },
    { value: "autor_independente", label: "Autor Independente" },
    { value: "empresa", label: "Empresa" },
    { value: "instituicao_ensino", label: "Instituição de Ensino" },
    { value: "ong", label: "ONG" },
    { value: "outro", label: "Outro" },
  ];

  const sourceOptions = [
    { value: "", label: "Selecione a origem" },
    { value: "site", label: "Site" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "google", label: "Google" },
    { value: "indicacao", label: "Indicação" },
    { value: "evento", label: "Evento" },
    { value: "email_marketing", label: "Email Marketing" },
    { value: "ligacao_fria", label: "Ligação Fria" },
    { value: "outro", label: "Outro" },
  ];

  const stateOptions = [
    { value: "", label: "Selecione o estado" },
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? "Editar Cliente" : "Novo Cliente"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(e); // O 'void' garante para o TS que não vamos usar o retorno
        }}
        className="space-y-4"
      >
        {/* Pessoa Física / Jurídica */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md border ${
              personType === "fisica"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setPersonType("fisica")}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md border ${
              personType === "juridica"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setPersonType("juridica")}
          >
            Pessoa Jurídica
          </button>
        </div>

        {/* Dados Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              Nome {personType === "juridica" ? "do Contato" : "Completo"} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={
                personType === "juridica"
                  ? "Nome do responsável"
                  : "Nome completo"
              }
              disabled={isSubmitting}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email@exemplo.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <MaskedInput
              id="phone"
              mask="phone"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              placeholder="(11) 99999-9999"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                handleInputChange(
                  "status",
                  e.target.value as "ativo" | "inativo"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
        </div>

        {/* Documentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personType === "fisica" ? (
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <MaskedInput
                id="cpf"
                mask="cpf"
                value={formData.cpf}
                onChange={(value) => handleInputChange("cpf", value)}
                placeholder="000.000.000-00"
                disabled={isSubmitting}
              />
              {errors.cpf && (
                <span className="text-red-500 text-sm">{errors.cpf}</span>
              )}
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <MaskedInput
                  id="cnpj"
                  mask="cnpj"
                  value={formData.cnpj}
                  onChange={(value) => handleInputChange("cnpj", value)}
                  placeholder="00.000.000/0000-00"
                  disabled={isSubmitting}
                />
                {errors.cnpj && (
                  <span className="text-red-500 text-sm">{errors.cnpj}</span>
                )}
              </div>
              <div>
                <Label htmlFor="company">Razão Social *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Nome da empresa"
                  disabled={isSubmitting}
                />
                {errors.company && (
                  <span className="text-red-500 text-sm">{errors.company}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Campos adicionais PJ */}
        {personType === "juridica" && (
          <div>
            <Label htmlFor="businessType">Tipo de Negócio</Label>
            <select
              id="businessType"
              value={formData.businessType}
              onChange={(e) =>
                handleInputChange("businessType", e.target.value)
              }
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {businessTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Origem do Lead */}
        <div>
          <Label htmlFor="source">Origem do Lead</Label>
          <select
            id="source"
            value={formData.source}
            onChange={(e) => handleInputChange("source", e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar campos avançados */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          {showAdvanced
            ? "Ocultar campos avançados"
            : "Mostrar campos avançados"}
        </button>

        {/* Campos Avançados */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <MaskedInput
                    id="zipCode"
                    mask="cep"
                    value={formData.address.zipCode}
                    onChange={(value) =>
                      handleNestedInputChange("address", "zipCode", value)
                    }
                    placeholder="00000-000"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "street",
                        e.target.value
                      )
                    }
                    placeholder="Nome da rua"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address.number}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "number",
                        e.target.value
                      )
                    }
                    placeholder="123"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.address.complement}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "complement",
                        e.target.value
                      )
                    }
                    placeholder="Apto, sala, etc."
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.address.neighborhood}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "neighborhood",
                        e.target.value
                      )
                    }
                    placeholder="Nome do bairro"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleNestedInputChange("address", "city", e.target.value)
                    }
                    placeholder="Nome da cidade"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        e.target.value as "ativo" | "inativo"
                      )
                    }
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {stateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Redes Sociais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialMedia.instagram}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "instagram",
                        e.target.value
                      )
                    }
                    placeholder="@perfil ou URL"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialMedia.facebook}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "facebook",
                        e.target.value
                      )
                    }
                    placeholder="URL do Facebook"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "linkedin",
                        e.target.value
                      )
                    }
                    placeholder="URL do LinkedIn"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.socialMedia.website}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "socialMedia",
                        "website",
                        e.target.value
                      )
                    }
                    placeholder="https://exemplo.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Informações adicionais sobre o cliente"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* Erro de envio */}
        {errors.submit && (
          <div className="text-red-500 text-sm">{errors.submit}</div>
        )}

        {/* Botões finais */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting
              ? "Salvando..."
              : client
              ? "Atualizar"
              : "Criar Cliente"}
          </Button>
        </div>
        {/* Restante do formulário omitido para foco no envio */}

        {/* Botões controlar submissão */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting
              ? "Salvando..."
              : client
              ? "Atualizar Cliente"
              : "Criar Cliente"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ClientModal;
```

### LeadModal

```typescript
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Lead } from "@/lib/types/comercial";
import {
  validateEmail,
  validatePhone,
} from "@/lib/validation/commonValidation";
import { useEffect, useState } from "react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  ) => Promise<void>;
  loading?: boolean;
}

export function LeadModal({
  isOpen,
  onClose,
  lead,
  onSave,
  loading,
}: LeadModalProps) {
  const [formData, setFormData] = useState<
    Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  >({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website",
    status: "primeiro_contato", // ✅ SEMPRE TER VALOR PADRÃO
    value: 0,
    probability: 0,
    ownerId: "user1",
    ownerName: "Usuário Atual",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source || "website",
        status: lead.status || "primeiro_contato", // ✅ FALLBACK
        value: lead.value || 0,
        probability: lead.probability || 0,
        ownerId: lead.ownerId || "user1",
        ownerName: lead.ownerName || "Usuário Atual",
        notes: lead.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        status: "primeiro_contato", // ✅ SEMPRE DEFINIDO
        value: 0,
        probability: 0,
        ownerId: "user1",
        ownerName: "Usuário Atual",
        notes: "",
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  // ✅ VALIDAÇÃO SIMPLIFICADA SEM DUPLICIDADE (por enquanto)
  const validate = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // ✅ NOME OBRIGATÓRIO
    if (!formData.name?.trim()) {
      newErrors.name = "Nome obrigatório";
    }

    // ✅ EMAIL FORMATO (SEM DUPLICIDADE)
    if (formData.email?.trim()) {
      const emailError = validateEmail(formData.email, false);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // ✅ TELEFONE FORMATO (SEM DUPLICIDADE)
    if (formData.phone?.trim()) {
      const phoneError = validatePhone(formData.phone, false);
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    // ✅ OUTRAS VALIDAÇÕES
    if (formData.value && formData.value < 0) {
      newErrors.value = "Valor não pode ser negativo";
    }
    if (
      formData.probability &&
      (formData.probability < 0 || formData.probability > 100)
    ) {
      newErrors.probability = "Probabilidade deve ser entre 0 e 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 Iniciando validação...");
    console.log("📝 Dados do formulário:", formData);

    // ✅ GARANTIR QUE STATUS NUNCA É UNDEFINED
    const safeFormData = {
      ...formData,
      status: formData.status || "primeiro_contato",
      source: formData.source || "website",
      value: formData.value || 0,
      probability: formData.probability || 0,
      ownerId: formData.ownerId || "user1",
      ownerName: formData.ownerName || "Usuário Atual",
    };

    console.log("🔒 Dados seguros para validação:", safeFormData);

    const isValid = await validate();
    console.log("✅ Validação resultado:", isValid);
    console.log("❌ Erros encontrados:", errors);

    if (!isValid) {
      console.log("❌ Validação falhou, não vai salvar");
      return;
    }

    try {
      console.log("💾 Tentando salvar lead...");
      console.log("📊 Dados para salvar:", safeFormData);

      // ✅ USAR DADOS SEGUROS (SEM UNDEFINED)
      await onSave(safeFormData);

      console.log("✅ Lead salvo com sucesso!");
      onClose();
    } catch (error) {
      console.error("❌ ERRO AO SALVAR LEAD:", error);
      if (error instanceof Error) {
        console.error("📋 Stack trace:", error.stack);
      }
    }
  };

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "referral", label: "Indicação" },
    { value: "social-media", label: "Redes Sociais" },
    { value: "cold-call", label: "Cold Call" },
    { value: "event", label: "Evento" },
    { value: "advertising", label: "Publicidade" },
    { value: "other", label: "Outros" },
  ];

  const stageOptions = [
    { value: "primeiro_contato", label: "Primeiro Contato" },
    { value: "qualificado", label: "Qualificado" },
    { value: "proposta_enviada", label: "Proposta Enviada" },
    { value: "negociacao", label: "Negociação" },
    { value: "fechado_ganho", label: "Fechado Ganho" },
    { value: "fechado_perdido", label: "Fechado Perdido" },
  ];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? "Editar Lead" : "Novo Lead"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome *"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            error={errors.name}
            placeholder="Nome do lead"
            required
            autoComplete="off"
            name="lead-name"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            error={errors.email}
            placeholder="email@exemplo.com"
            autoComplete="off"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefone
            </label>
            <MaskedInput
              mask="phone"
              value={formData.phone}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
              placeholder="(11) 99999-9999"
              error={errors.phone}
            />
          </div>

          <Input
            label="Empresa"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
            placeholder="Nome da empresa"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Fonte"
            value={formData.source ?? "website"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                source: (e.target.value as Lead["source"]) ?? "website",
              }))
            }
            options={sourceOptions}
          />

          <Select
            label="Estágio"
            value={formData.status ?? "primeiro-contato"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status:
                  (e.target.value as Lead["status"]) ?? "primeiro-contato",
              }))
            }
            options={stageOptions}
          />

          <Select
            label="Estágio"
            value={formData.status ?? "primeiro-contato"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status:
                  (e.target.value as Lead["status"]) ?? "primeiro-contato",
              }))
            }
            options={stageOptions}
          />

          <Input
            label="Probabilidade (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability || 0}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                probability: parseInt(e.target.value) || 0,
              }))
            }
            error={errors.probability}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valor Potencial (R$)"
            type="number"
            min="0"
            step="0.01"
            value={formData.value || 0}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                value: parseFloat(e.target.value) || 0,
              }))
            }
            error={errors.value}
            placeholder="0.00"
          />

          <Input
            label="Responsável"
            value={formData.ownerName || "Usuário Atual"}
            disabled
            placeholder="Usuário responsável"
          />
        </div>

        <Textarea
          label="Observações"
          value={formData.notes || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Adicione observações sobre este lead..."
          rows={4}
        />

        {/* ✅ PREVIEW DE DADOS VÁLIDOS */}
        {formData.name && (formData.phone || formData.email) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">Lead válido</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              {formData.name} • {formData.company || "Empresa"} •{" "}
              {formData.probability}% chance
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            {lead ? "Salvar Alterações" : "Criar Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

### ProjectModal

```typescript
"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClients } from "@/hooks/comercial/useClients";
import { useQuotes } from "@/hooks/comercial/useQuotes";
import { Project } from "@/lib/types/comercial";
import { useEffect, useState } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (data: Partial<Project>) => Promise<void>;
  loading?: boolean;
}

export function ProjectModal({
  isOpen,
  onClose,
  project,
  onSave,
  loading = false,
}: ProjectModalProps) {
  // ✅ HOOKS PARA BUSCAR DADOS (IGUAL CLIENTE)
  const { clients } = useClients();
  const { quotes } = useQuotes();

  // ✅ FORM STATE (IGUAL CLIENTE)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    quoteId: "",
    status: "open" as
      | "open"
      | "design"
      | "review"
      | "production"
      | "shipped"
      | "done"
      | "cancelled",
    dueDate: "",
    budget: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ POPULATE FORM WHEN EDITING (IGUAL CLIENTE)
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        clientId: project.clientId || "",
        quoteId: project.quoteId || "",
        status: project.status || "open",
        dueDate: project.dueDate
          ? new Date(project.dueDate.toDate()).toISOString().split("T")[0]
          : "",
        budget: project.budget?.toString() || "",
        notes: project.notes || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        clientId: "",
        quoteId: "",
        status: "open",
        dueDate: "",
        budget: "",
        notes: "",
      });
    }
    setErrors({});
  }, [project, isOpen]);

  // ✅ VALIDATION (IGUAL CLIENTE)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // ✅ CAMPOS OBRIGATÓRIOS
    if (!formData.title?.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.clientId) newErrors.clientId = "Cliente é obrigatório";

    // ✅ VALIDAÇÃO DE BUDGET
    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "Valor deve ser um número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT (IGUAL CLIENTE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      // ✅ PREPARAR DADOS PARA SALVAR (IGUAL CLIENTE)
      const projectData: Partial<Project> = {
        title: formData.title,
        clientId: formData.clientId,
        status: formData.status,
      };

      // ✅ ADICIONAR CAMPOS SE PREENCHIDOS (IGUAL CLIENTE)
      if (formData.description?.trim())
        projectData.description = formData.description;
      if (formData.quoteId?.trim()) projectData.quoteId = formData.quoteId;
      if (formData.dueDate?.trim()) {
        // Converter string para Timestamp
        const dueDate = new Date(formData.dueDate);
        projectData.dueDate = {
          seconds: Math.floor(dueDate.getTime() / 1000),
          nanoseconds: 0,
        } as import("firebase/firestore").Timestamp;
      }
      if (formData.budget?.trim()) projectData.budget = Number(formData.budget);
      if (formData.notes?.trim()) projectData.notes = formData.notes;

      await onSave(projectData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
    }
  };

  // ✅ CLOSE HANDLER (IGUAL CLIENTE)
  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      clientId: "",
      quoteId: "",
      status: "open",
      dueDate: "",
      budget: "",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={project ? "Editar Projeto" : "Novo Projeto"}
      size="xl"
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {project ? "Editar Projeto" : "Novo Projeto"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(e);
          }}
          className="space-y-6"
        >
          {/* ✅ INFORMAÇÕES BÁSICAS */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Projeto *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Desenvolvimento do Website"
                error={errors.title}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descreva o projeto detalhadamente..."
                rows={4}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* ✅ VINCULAÇÕES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientId">Cliente *</Label>
              <select
                id="clientId"
                value={formData.clientId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, clientId: e.target.value }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company || client.name}{" "}
                    {/* ✅ usar company em vez de companyName */}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-sm text-red-600 mt-1">{errors.clientId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="quoteId">Orçamento (Opcional)</Label>
              <select
                id="quoteId"
                value={formData.quoteId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quoteId: e.target.value }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Nenhum orçamento</option>
                {quotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.projectTitle || quote.number || quote.id}{" "}
                    {/* usar propriedades existentes */}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ STATUS E DATAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as Project["status"],
                  }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="planning">Planejamento</option>
                <option value="in-progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dueDate">Data de Entrega</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                error={errors.dueDate}
              />
            </div>
          </div>

          {/* ✅ ORÇAMENTO E NOTAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, budget: e.target.value }))
                }
                placeholder="0.00"
                error={errors.budget}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Observações internas sobre o projeto..."
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* ✅ BUTTONS (IGUAL CLIENTE) */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Salvando...
                </div>
              ) : project ? (
                "Atualizar"
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
```

### QuoteModal

```typescript
"use client";

import { QuoteForm } from "@/components/comercial/forms/QuoteForm";
import { Modal } from "@/components/ui/Modal";
import { useQuotes } from "@/hooks/comercial/useQuotes";
import { QuoteModalProps } from "@/lib/types/comercial";

export function QuoteModal({
  isOpen,
  onClose,
  quote,
  leadId,
}: QuoteModalProps) {
  const { createQuote, updateQuote, loading } = useQuotes();

  const handleSubmit = async (data: any) => {
    try {
      if (quote && quote.id) {
        const success = await updateQuote(quote.id, data);
        if (success) {
          onClose();
        }
      } else {
        const id = await createQuote(data);
        if (id) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quote ? "Editar Orçamento" : "Novo Orçamento"}
      size="xl"
    >
      <QuoteForm
        quote={quote}
        leadId={leadId}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
```

## app (authenticated) crm

### clients page

```typescript
"use client";

import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useClients } from "@/hooks/comercial/useClients";
import { Client } from "@/lib/types/comercial";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  const { clients, loading, createClient, updateClient } = useClients();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openModalToCreate() {
    setEditingClient(null);
    setIsModalOpen(true);
  }
  function openModalToEdit(client: Client) {
    setEditingClient(client);
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSave(clientData: Omit<Client, "id">) {
    if (editingClient && editingClient.id) {
      await updateClient(editingClient.id, clientData);
    } else {
      await createClient(clientData);
    }
    closeModal();
  }

  return (
    <div>
      <div className="flex gap-4 mb-4 items-end">
        <Input
          placeholder="Buscar cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search />}
          className="flex-1"
        />
        <Select
          label="Status"
          options={[
            { value: "all", label: "Todos" },
            { value: "ativo", label: "Ativo" },
            { value: "inativo", label: "Inativo" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Todos os status"
          className="w-48"
        />
        <Button onClick={openModalToCreate} leftIcon={<Plus />}>
          Novo Cliente
        </Button>
      </div>

      {loading && <p>Carregando clientes...</p>}

      {!loading && filteredClients.length === 0 && (
        <p>Nenhum cliente encontrado.</p>
      )}

      {!loading && filteredClients.length > 0 && (
        <ul>
          {filteredClients.map((client) => (
            <li
              key={client.id}
              className="flex justify-between p-2 border-b border-gray-200"
            >
              <span>{client.name}</span>
              <button
                className="text-blue-600"
                onClick={() => openModalToEdit(client)}
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <ClientModal
          isOpen={isModalOpen}
          onClose={closeModal}
          client={editingClient}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
```

### clients id page

```typescript
"use client";

import { useClients } from "@/hooks/comercial/useClients";
import { Client } from "@/lib/types/comercial";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientPage() {
  const router = useRouter();
  const params = useParams();
  const { clients } = useClients();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!params?.id) {
      router.push("/crm/clients");
      return;
    }

    const id = params.id as string;
    if (!id || typeof id !== "string") {
      // Se id inválido, pode redirecionar ou mostrar erro simples
      router.push("/crm/clients");
      return;
    }
    loadClient(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  function loadClient(id: string) {
    const foundClient = clients.find((c) => c.id === id);
    if (foundClient) {
      setClient(foundClient);
    } else {
      setClient(null);
      router.push("/crm/clients");
    }
  }

  if (!client) {
    return <p>Cliente não encontrado ou carregando...</p>;
  }

  return (
    <div>
      <h1>Cliente: {client.name}</h1>
      <p>Email: {client.email}</p>
      {/* mais campos aqui conforme seu tipo Client */}
    </div>
  );
}
```

### leads page

```typescript
// src/app/(authenticated)/crm/leads/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { LeadModal } from "@/components/comercial/modals/LeadModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLeads } from "@/hooks/comercial/useLeads";
import { Lead } from "@/lib/types/comercial";
import { Filter, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    leads,
    loading: leadsLoading,
    error,
    createLead,
    updateLead,
    deleteLead,
    fetchLeads,
  } = useLeads();

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ...existing code...

  const handleSave = async (
    leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  ): Promise<void> => {
    setIsLoading(true);
    try {
      if (selectedLead?.id) {
        // Para atualização, combine os dados existentes com os novos
        await updateLead(selectedLead.id, {
          ...selectedLead,
          ...leadData,
        });
      } else {
        // Para criação, use os dados do formulário
        await createLead(leadData as Lead);
      }
      setIsModalOpen(false);
      setSelectedLead(undefined);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Erro ao salvar lead");
    } finally {
      setIsLoading(false);
    }
  };

  // ...existing code...

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Tem certeza que deseja deletar este lead?")) return;

    try {
      await deleteLead(leadId);
    } catch (error) {
      console.error("Erro ao deletar lead:", error);
      alert("Erro ao deletar lead");
    }
  };

  const getStageColor = (status: string) => {
    const colors = {
      primeiro_contato: "bg-gray-100 text-gray-800",
      qualificado: "bg-blue-100 text-blue-800",
      proposta_enviada: "bg-purple-100 text-purple-800",
      negociacao: "bg-yellow-100 text-yellow-800",
      fechado_ganho: "bg-green-100 text-green-800",
      fechado_perdido: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStageLabel = (status: string) => {
    const labels = {
      primeiro_contato: "Primeiro Contato",
      qualificado: "Qualificado",
      proposta_enviada: "Proposta Enviada",
      negociacao: "Negociação",
      fechado_ganho: "Fechado Ganho",
      fechado_perdido: "Fechado Perdido",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600">
            Gerencie seus leads e oportunidades de vendas
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedLead(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Leads */}
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {leadsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 mt-2">Carregando leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum lead encontrado</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          {lead.name}
                        </h3>
                        <Badge className={getStageColor(lead.status)}>
                          {getStageLabel(lead.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Email:</span>
                          <p>{lead.email || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span>
                          <p>{lead.phone || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Empresa:</span>
                          <p>{lead.company || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Valor Potencial:</span>
                          <p>
                            {lead.value
                              ? `R$ ${lead.value.toLocaleString("pt-BR")}`
                              : "Não informado"}
                          </p>
                        </div>
                      </div>

                      {lead.notes && (
                        <div className="mt-3 text-sm text-slate-600">
                          <span className="font-medium">Observações:</span>
                          <p className="mt-1">{lead.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(lead.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(undefined);
        }}
        lead={selectedLead}
        onSave={handleSave}
        loading={isLoading}
      />
    </div>
  );
}
```

### leads id page

```typescript
"use client";

import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { Client } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadClient = useCallback(async () => {
    if (!params?.id || typeof params.id !== "string") return;

    try {
      const clientRef = doc(db, "clients", params.id);
      const clientSnap = await getDoc(clientRef);

      if (clientSnap.exists()) {
        setClient({ id: clientSnap.id, ...clientSnap.data() } as Client);
      }
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      void loadClient();
    }
  }, [params?.id, loadClient]);

  const handleSave = async () => {
    await loadClient();
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-slate-500 mb-4">Cliente não encontrado</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <Badge variant={client.status === "ativo" ? "success" : "default"}>
              {client.status}
            </Badge>
          </div>
          <p className="text-slate-600">
            Cliente #{client.clientNumber || "N/A"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>
            Editar Cliente
          </Button>
        </div>
      </div>

      {/* Informações principais */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Dados do Cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Email</p>
            <p className="text-slate-900">{client.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Telefone</p>
            <p className="text-slate-900">{client.phone || "Não informado"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Documento</p>
            <p className="text-slate-900">
              {client.cpf || client.cnpj || "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Empresa</p>
            <p className="text-slate-900">
              {client.company || "Não informado"}
            </p>
          </div>
        </div>

        {client.address && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-2">Endereço</p>
            <p className="text-slate-900">
              {client.address.street}, {client.address.number}
              {client.address.complement && ` - ${client.address.complement}`}
              <br />
              {client.address.neighborhood} - {client.address.city}/{
                client.address.state
              }
              <br />
              CEP: {client.address.zipCode}
            </p>
          </div>
        )}

        {client.notes && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-2">
              Observações
            </p>
            <p className="text-slate-900 whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}
      </Card>

      {/* Modal de edição */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
        onSave={handleSave}
      />
    </div>
  );
}
```

### profects page

```typescript
//src/app/(authenticated)/crm/projects/page//

"use client";

export const dynamic = "force-dynamic";

import { ProjectCard } from "@/components/comercial/cards/ProjectCard";
import { ProjectModal } from "@/components/comercial/modals/ProjectModal";
import { ProjectsTable } from "@/components/comercial/tables/ProjectsTable";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/comercial/useProjects";
import { ComercialFilters, Project } from "@/lib/types/comercial";
import {
  PlusIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type ViewMode = "table" | "cards";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, fetchProjects } = useProjects();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================ HANDLERS ================
  const handleCreateNew = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleView = (project: Project) => {
    router.push(`/crm/projects/${project.id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleSave = async (projectData: unknown) => {
    // TODO: Implementar lógica de criação/atualização do projeto
    console.log("Salvando projeto:", projectData);

    // Por enquanto, apenas fecha o modal
    handleCloseModal();

    // Recarregar lista de projetos
    await fetchProjects();
  };

  const handleFiltersChange = useCallback(
    (filters: ComercialFilters) => {
      fetchProjects(filters);
    },
    [fetchProjects]
  );

  // ================ STATS ================
  const stats = {
    total: projects.length,
    open: projects.filter((p) => p.status === "open").length,
    design: projects.filter((p) => p.status === "design").length,
    production: projects.filter((p) => p.status === "production").length,
    done: projects.filter((p) => p.status === "done").length,
    overdue: projects.filter((p) => {
      // ✅ Verificação segura da data de vencimento
      if (!p.dueDate) return false;

      try {
        let dueDate: Date;

        // Se for um Timestamp do Firestore
        if (
          p.dueDate &&
          typeof p.dueDate === "object" &&
          "toDate" in p.dueDate
        ) {
          dueDate = p.dueDate.toDate();
        }
        // Se for um objeto com seconds (Timestamp serializado)
        else if (
          p.dueDate &&
          typeof p.dueDate === "object" &&
          "seconds" in p.dueDate
        ) {
          dueDate = new Date((p.dueDate as any).seconds * 1000);
        }
        // Se for Date ou string
        else {
          dueDate = new Date(p.dueDate);
        }

        return (
          dueDate < new Date() &&
          !["done", "cancelled", "shipped"].includes(p.status)
        );
      } catch (error) {
        console.warn(
          "Erro ao processar dueDate do projeto:",
          p.id,
          p.dueDate,
          error
        );
        return false;
      }
    }).length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    completedBudget: projects
      .filter((p) => p.status === "done")
      .reduce((sum, p) => sum + (p.budget || 0), 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* ================ HEADER ================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie todos os projetos em desenvolvimento
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ViewColumnsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={handleCreateNew}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* ================ STATS CARDS ================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Projetos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">D</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Em Design
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.design}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Atrasados
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.overdue}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">C</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Concluídos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.done}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================ BUDGET SUMMARY ================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Orçamento Total
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalBudget)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Soma de todos os projetos ativos
            </p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Receita Realizada
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.completedBudget)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Projetos concluídos</p>
          </div>
        </div>
      </div>

      {/* ================ CONTENT ================ */}
      {viewMode === "table" ? (
        <ProjectsTable
          projects={projects}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onCreateNew={handleCreateNew}
          onFiltersChange={handleFiltersChange}
        />
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {projects.length} projetos encontrados
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-72 rounded-lg animate-pulse"
                />
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhum projeto encontrado</p>
                <Button onClick={handleCreateNew} className="mt-4">
                  Criar primeiro projeto
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ================ MODAL ================ */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
        onSave={handleSave}
      />
    </div>
  );
}
```

### projects id page

```typescript
"use client";

import { ProjectModal } from "@/components/comercial/modals/ProjectModal";
import { PriorityBadge, ProjectStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProjects } from "@/hooks/comercial/useProjects";
import { Project } from "@/lib/types/comercial";
import { PRODUCT_TYPE_LABELS } from "@/lib/types/shared";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, updateProjectStatus } = useProjects();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectId = params?.id as string | undefined;

  if (!projectId) {
    return <div>Erro: ID do projeto não encontrado</div>;
  }

  // ================ LOAD PROJECT ================
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const projectData = await getProject(projectId);
        if (projectData) {
          setProject(projectData);
        } else {
          toast.error("Projeto não encontrado");
          router.push("/crm/projects");
        }
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        toast.error("Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, getProject, router]);

  // ================ HANDLERS ================
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: Project["status"]) => {
    if (!project) return;

    const success = await updateProjectStatus(project.id ?? "", newStatus);
    if (success) {
      // Recarregar dados
      const updatedProject = await getProject(project.id ?? "");
      if (updatedProject) {
        setProject(updatedProject);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // ================ UTILS ================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 h-8 w-64 rounded animate-pulse" />
        <div className="bg-gray-200 h-64 rounded-lg animate-pulse" />
        <div className="bg-gray-200 h-96 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Projeto não encontrado</p>
        <Button onClick={() => router.push("/crm/projects")} className="mt-4">
          Voltar para projetos
        </Button>
      </div>
    );
  }

  const isOverdue =
    project.dueDate.toDate() < new Date() &&
    !["done", "cancelled", "shipped"].includes(project.status);

  return (
    <div className="space-y-6">
      {/* ================ HEADER ================ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/crm/projects")}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.title}
            </h1>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-sm text-gray-600 font-mono">
                {project.catalogCode || "Código em processamento..."}
              </p>
              <span className="text-gray-400">•</span>
              <p className="text-sm text-gray-600">
                {PRODUCT_TYPE_LABELS[project.category]} ({project.category})
              </p>
              <ProjectStatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
              {isOverdue && (
                <span className="text-sm text-red-600 font-medium">
                  (Atrasado)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleEdit}
            leftIcon={<PencilIcon className="w-4 h-4" />}
          >
            Editar
          </Button>
        </div>
      </div>

      {/* ================ QUICK ACTIONS ================ */}
      <Card className="border shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Ações Rápidas</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={project.status === "design" ? "primary" : "outline"}
              onClick={() => handleStatusUpdate("design")}
              disabled={project.status === "design"}
            >
              Iniciar Design
            </Button>

            <Button
              size="sm"
              variant={project.status === "review" ? "primary" : "outline"}
              onClick={() => handleStatusUpdate("review")}
              disabled={project.status === "review"}
            >
              Enviar para Revisão
            </Button>

            <Button
              size="sm"
              variant={project.status === "production" ? "primary" : "outline"}
              onClick={() => handleStatusUpdate("production")}
              disabled={project.status === "production"}
            >
              Iniciar Produção
            </Button>

            <Button
              size="sm"
              variant={project.status === "done" ? "primary" : "outline"}
              onClick={() => handleStatusUpdate("done")}
              disabled={project.status === "done"}
            >
              Marcar como Concluído
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================ INFORMAÇÕES PRINCIPAIS ================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Informações do Projeto</h3>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {project.clientName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <ProjectStatusBadge status={project.status} />
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Prioridade
                </dt>
                <dd className="mt-1">
                  <PriorityBadge priority={project.priority} />
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Tipo de Produto
                </dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {PRODUCT_TYPE_LABELS[project.category]} ({project.category})
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Prazo de Entrega
                </dt>
                <dd
                  className={`text-sm mt-1 ${
                    isOverdue ? "text-red-600 font-medium" : "text-gray-900"
                  }`}
                >
                  {formatDate(project.dueDate)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {formatDate(project.createdAt)}
                </dd>
              </div>

              {project.assignedTo && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Responsável
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {project.assignedTo}
                  </dd>
                </div>
              )}

              {project.quoteId && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Orçamento Vinculado
                  </dt>
                  <dd className="text-sm text-blue-600 mt-1">
                    <button
                      onClick={() =>
                        router.push(`/crm/quotes/${project.quoteId}`)
                      }
                      className="hover:underline"
                    >
                      Ver orçamento →
                    </button>
                  </dd>
                </div>
              )}

              {project.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Descrição
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {project.description}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* ================ RESUMO DO PROJETO ================ */}
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Resumo</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Orçamento</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(project.budget)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Dias até o prazo</p>
                  <p
                    className={`text-lg font-semibold ${
                      isOverdue ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {Math.ceil(
                      (project.dueDate.toDate().getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DocumentCheckIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Provas Enviadas</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {project.proofsCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Aprovações Pendentes</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {
                      project.clientApprovalTasks?.filter(
                        (task) => task.status === "pending"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================ TAREFAS DE APROVAÇÃO ================ */}
      {project.clientApprovalTasks &&
        project.clientApprovalTasks.length > 0 && (
          <Card className="border shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Tarefas de Aprovação do Cliente
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.clientApprovalTasks?.map((task, index) => (
                  <div
                    key={task.id || index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {task.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Prazo: {formatDate(task.dueDate)}
                      </p>
                      {task.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {task.status === "pending"
                          ? "Pendente"
                          : task.status === "approved"
                          ? "Aprovado"
                          : "Rejeitado"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* ================ OBSERVAÇÕES ================ */}
      {project.notes && (
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Observações</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {project.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ================ MODAL ================ */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        onSave={async () => {
          // TODO: implementar salvamento
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
```

### quptes page

```typescript
//src/app/(authenticated)/crm/quotes/page//

"use client";

export const dynamic = "force-dynamic";

import { QuoteCard } from "@/components/comercial/cards/QuoteCard";
import { QuoteModal } from "@/components/comercial/modals/QuoteModal";
import { QuotesTable } from "@/components/comercial/tables/QuotesTable";
import { Button } from "@/components/ui/button";
import { useQuotes } from "@/hooks/comercial/useQuotes";
import { ComercialFilters, Quote } from "@/lib/types/comercial";
import {
  PlusIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type ViewMode = "table" | "cards";

export default function QuotesPage() {
  const router = useRouter();
  const { quotes, loading, signQuote, fetchQuotes } = useQuotes();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================ HANDLERS ================
  const handleCreateNew = () => {
    setSelectedQuote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleView = (quote: Quote) => {
    router.push(`/crm/quotes/${quote.id}`);
  };

  const handleSign = async (id: string) => {
    const success = await signQuote(id);
    if (success) {
      // Orçamento assinado com sucesso
      // A automação cloud function criará cliente + projeto automaticamente
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  const handleFiltersChange = useCallback(
    (filters: ComercialFilters) => {
      void fetchQuotes(filters as any); // Type assertion temporária
    },
    [fetchQuotes]
  );

  // ================ STATS ================
  const stats = {
    total: quotes.length,
    draft: quotes.filter((q) => q.status === "draft").length,
    sent: quotes.filter((q) => q.status === "sent").length,
    signed: quotes.filter((q) => q.status === "signed").length,
    totalValue: quotes.reduce((sum, q) => sum + (q.totals?.total ?? 0), 0),
    signedValue: quotes
      .filter((q) => q.status === "signed")
      .reduce((sum, q) => sum + (q.totals?.total ?? 0), 0),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* ================ HEADER ================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie todos os orçamentos do sistema
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ViewColumnsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={handleCreateNew}
            leftIcon={<PlusIcon className="w-4 h-4" />}
          >
            Novo Orçamento
          </Button>
        </div>
      </div>

      {/* ================ STATS CARDS ================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Orçamentos
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Assinados
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.signed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">E</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Enviados
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.sent}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium text-sm">R$</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Valor Assinado
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(stats.signedValue)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================ CONTENT ================ */}
      {viewMode === "table" ? (
        <QuotesTable
          quotes={quotes}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onSign={handleSign}
          onCreateNew={handleCreateNew}
          onFiltersChange={handleFiltersChange}
        />
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {quotes.length} orçamentos encontrados
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-64 rounded-lg animate-pulse"
                />
              ))
            ) : quotes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhum orçamento encontrado</p>
                <Button onClick={handleCreateNew} className="mt-4">
                  Criar primeiro orçamento
                </Button>
              </div>
            ) : (
              quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onEdit={handleEdit}
                  onView={handleView}
                  onSign={handleSign}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ================ MODAL ================ */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quote={selectedQuote}
      />
    </div>
  );
}
```

### quotes id page

```typescript
"use client";

import { QuoteModal } from "@/components/comercial/modals/QuoteModal";
import { QuoteStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuotes } from "@/hooks/comercial/useQuotes";
import { Quote } from "@/lib/types/comercial";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getQuote, signQuote } = useQuotes();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigningLoading, setIsSigningLoading] = useState(false);

  const quoteId = params?.id as string | undefined;

  if (!quoteId) {
    return <div>Erro: ID do orçamento não encontrado</div>;
  }

  // ================ LOAD QUOTE ================
  useEffect(() => {
    const loadQuote = async () => {
      if (!quoteId) return;

      setLoading(true);
      try {
        const quoteData = await getQuote(quoteId);
        if (quoteData) {
          setQuote(quoteData);
        } else {
          toast.error("Orçamento não encontrado");
          router.push("/crm/quotes");
        }
      } catch (error) {
        console.error("Erro ao carregar orçamento:", error);
        toast.error("Erro ao carregar orçamento");
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId, getQuote, router]);

  // ================ HANDLERS ================
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSign = async () => {
    if (!quote) return;

    setIsSigningLoading(true);
    try {
      const success = await signQuote(quote.id ?? "");
      if (success) {
        // Recarregar dados
        const updatedQuote = await getQuote(quote.id ?? "");
        if (updatedQuote) {
          setQuote(updatedQuote);
        }
      }
    } finally {
      setIsSigningLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShare = () => {
    if (quote?.pdfUrl) {
      window.open(quote.pdfUrl, "_blank");
    } else {
      toast.error("PDF não disponível");
    }
  };

  // ================ UTILS ================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 h-8 w-64 rounded animate-pulse" />
        <div className="bg-gray-200 h-64 rounded-lg animate-pulse" />
        <div className="bg-gray-200 h-96 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Orçamento não encontrado</p>
        <Button onClick={() => router.push("/crm/quotes")} className="mt-4">
          Voltar para orçamentos
        </Button>
      </div>
    );
  }

  const isExpired = quote.validUntil
    ? quote.validUntil.toDate() < new Date()
    : false;

  return (
    <div className="space-y-6">
      {/* ================ HEADER ================ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/crm/quotes")}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.title}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-sm text-gray-600 font-mono">{quote.number}</p>
              <QuoteStatusBadge status={quote.status} />
              {isExpired && (
                <span className="text-sm text-red-600 font-medium">
                  (Expirado)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          {quote.pdfUrl && (
            <Button
              variant="outline"
              onClick={handleShare}
              leftIcon={<DocumentTextIcon className="w-4 h-4" />}
            >
              Ver PDF
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={quote.status === "signed"}
            leftIcon={<PencilIcon className="w-4 h-4" />}
          >
            Editar
          </Button>

          {quote.status === "sent" && (
            <Button
              onClick={handleSign}
              loading={isSigningLoading}
              leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            >
              Assinar Orçamento
            </Button>
          )}
        </div>
      </div>

      {/* ================ INFORMAÇÕES BÁSICAS ================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Informações do Orçamento</h3>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {quote.clientName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <QuoteStatusBadge status={quote.status} />
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Válido até
                </dt>
                <dd
                  className={`text-sm mt-1 ${
                    isExpired ? "text-red-600 font-medium" : "text-gray-900"
                  }`}
                >
                  {formatDate(quote.validUntil)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {formatDate(quote.createdAt)}
                </dd>
              </div>

              {quote.signedAt && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Assinado em
                    </dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {formatDate(quote.signedAt)}
                    </dd>
                  </div>
                </>
              )}

              {/* quote.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Descrição
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {quote.description}
                  </dd>
                </div>
              ) */}
            </dl>
          </CardContent>
        </Card>

        {/* ================ RESUMO FINANCEIRO ================ */}
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Resumo Financeiro</h3>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Subtotal</dt>
                <dd className="text-sm text-gray-900">
                  {formatCurrency(quote.subtotal ?? 0)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Impostos</dt>
                <dd className="text-sm text-gray-900">
                  {formatCurrency(quote.taxes ?? 0)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Desconto</dt>
                <dd className="text-sm text-red-600">
                  - {formatCurrency(quote.discount ?? 0)}
                </dd>
              </div>

              <hr />

              <div className="flex justify-between">
                <dt className="text-base font-medium text-gray-900">
                  Total Geral
                </dt>
                <dd className="text-base font-bold text-blue-600">
                  {formatCurrency(quote.grandTotal ?? 0)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* ================ ITENS DO ORÇAMENTO ================ */}
      <Card className="border shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatCurrency(item.unitPrice ?? 0)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ================ OBSERVAÇÕES ================ */}
      {quote.notes && (
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Observações</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {quote.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ================ MODAL ================ */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quote={quote}
      />
    </div>
  );
}
```
