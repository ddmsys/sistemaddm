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

// ====Types por categorias individuais =====//

- clients.ts
- comercial.ts
- finance.ts
- leads.ts
- logistics.ts
- marketing.ts
- projects.ts
- purchases.ts
- quotes.ts
- shared.ts

```typescript
import { Timestamp } from 'firebase/firestore';

// ================ ENUMS E TYPES BÁSICOS ================

export type ProductType =
  | 'L' // Livro
  | 'E' // E-book
  | 'K' // Kit
  | 'C' // Catálogo
  | 'D' // Design
  | 'G' // Gráfica
  | 'P' // Publicidade
  | 'S' // Serviço
  | 'X' // Xilogravura
  | 'A' // Arte
  | 'M'; // Mídia

export type LeadSource =
  | 'website'
  | 'socialmedia' // alterado de "social-media" para "socialmedia"
  | 'referral'
  | 'advertising'
  | 'email'
  | 'phone'
  | 'coldcall'
  | 'event'
  | 'other';

export type LeadStatus =
  | 'primeiro_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired';

export type ProjectStatus =
  | 'open'
  | 'design'
  | 'review'
  | 'production'
  | 'shipped'
  | 'done'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ClientType = 'individual' | 'company';

// ✅ Corrigido - usar valores em português para compatibilidade
export type ClientStatus = 'ativo' | 'inativo' | 'bloqueado';

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
  status: 'pending' | 'approved' | 'rejected';
  dueDate: Timestamp;
  assignedTo?: string;
  completedAt?: Timestamp;
  notes?: string;
}

export interface QuoteItem {
  id?: string; // Opcional para compatibilidade
  description: string;
  kind: 'etapa' | 'impressao';
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
  quoteType: 'producao' | 'impressao' | 'misto';

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
    discountType: 'percentage' | 'fixed';
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
  quoteType: 'producao' | 'impressao' | 'misto';
  validityDays: number;
  items: Omit<QuoteItem, 'id' | 'totalPrice'>[];
  discount: number;
  discountType: 'percentage' | 'fixed';
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

## 🔧 Implementação de Componentes Chave

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
