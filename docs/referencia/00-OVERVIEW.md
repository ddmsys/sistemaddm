# Sistema DDM - Visão Geral e Arquitetura

> **📅 Última Atualização:** 14 de outubro de 2025  
> **🎯 Objetivo:** Documentação completa e atualizada para continuidade de desenvolvimento  
> **⚠️ IMPORTANTE:** Budget foi renomeado para Budget. Ver [MIGRAÇÃO](Progress/08-DOCUMENTO%20DE%20MIGRAÇÃO%20E%20PADRONIZAÇÃO.md)

## 🎯 Sobre o Sistema

O Sistema DDM é uma plataforma de gestão empresarial completa desenvolvida em Next.js 14 com TypeScript, Firebase e Tailwind CSS.

## 📦 Stack Tecnológica

### Core

- **Framework:** Next.js 14.2.21 (App Router)
- **Linguagem:** TypeScript 5.x
- **Estilização:** Tailwind CSS 3.4.1
- **Autenticação:** Firebase Auth
- **Banco de Dados:** Cloud Firestore
- **Storage:** Firebase Storage

### UI/UX

- **Componentes Base:** Radix UI
- **Gráficos:** Recharts 2.15.0
- **Ícones:** Lucide React 0.468.0
- **Tabelas:** TanStack Table 8.20.5
- **Formulários:** React Hook Form + Zod

### Ferramentas

- **Validação:** Zod
- **Date:** date-fns
- **PDF:** jsPDF + jsPDF-AutoTable
- **Linting:** ESLint + TypeScript ESLint

## 🏗️ Estrutura de Pastas

```
sistemaddm/
├── src/
│   ├── app/                          # Next.js App Router
│   │   │   ├── crm/                 # Módulo CRM
│   │   │   │   ├── clients/         # Gestão de clientes
│   │   │   │   ├── leads/           # Gestão de leads
│   │   │   │   └── projects/        # Gestão de projetos
│   │   │   ├── budgets/             # ✅ Gestão de orçamentos (substitui budgets)
│   │   │   │   └── budgets/          # Gestão de orçamentos
│   │   │   ├── dashboard/           # Dashboard principal
│   │   │   └── layout.tsx           # Layout autenticado
│   │   ├── (auth)/                  # Rotas de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── layout.tsx               # Layout raiz
│   │   └── page.tsx                 # Página inicial
│   │
│   ├── components/                   # Componentes React
│   │   ├── comercial/               # Componentes do CRM
│   │   │   ├── cards/              # Cards de exibição
│   │   │   ├── charts/             # Gráficos e visualizações
│   │   │   ├── modals/             # Modais de criação/edição
│   │   │   ├── ClientList.tsx      # Lista de clientes
│   │   │   ├── KPICards.tsx        # Cards de métricas
│   │   │   ├── LeadList.tsx        # Lista de leads
│   │   │   ├── ProjectList.tsx     # Lista de projetos
│   │   │   └── BudgetsList.tsx     # ✅ Lista de orçamentos
│   │   ├── dashboard/              # Componentes do dashboard
│   │   │   └── CommercialDashboard.tsx
│   │   └── ui/                     # Componentes UI base (Shadcn)
│   │
│   ├── hooks/                       # React Hooks customizados
│   │   ├── comercial/              # Hooks do módulo comercial
│   │   │   ├── useClients.ts
│   │   │   ├── useCommercialMetrics.ts
│   │   │   ├── useFunnelData.ts
│   │   │   ├── useLeads.ts
│   │   │   ├── useProjects.ts
│   │   │   └── useBudgets.ts       # ✅ Hook de orçamentos
│   │   ├── useAuth.tsx             # Hook de autenticação
│   │   └── useFirestore.ts         # Hook genérico Firebase
│   │
│   ├── lib/                        # Bibliotecas e utilitários
│   │   ├── firebase/               # Configuração Firebase
│   │   │   ├── config.ts
│   │   │   └── firestore.ts
│   │   ├── types/                  # Definições de tipos
│   │   │   ├── clients.ts          # ⚠️ CRÍTICO
│   │   │   ├── leads.ts            # ⚠️ CRÍTICO
│   │   │   ├── projects.ts         # ⚠️ CRÍTICO
│   │   │   ├── budgets.ts          # ✅ CRÍTICO (substitui budgets.ts)
│   │   │   ├── books.ts            # ✅ Catálogo de livros
│   │   │   ├── orders.ts           # ✅ Pedidos
│   │   │   └── production-projects.ts  # ✅ Projetos de produção
│   │   ├── utils/                  # Funções utilitárias
│   │   │   └── formatters.ts
│   │   └── utils.ts                # Utilitários gerais
│   │
│   └── styles/                     # Estilos globais
│       └── globals.css
│
├── docs/                           # Documentação
├── public/                         # Assets estáticos
├── .env.local                      # Variáveis de ambiente
├── next.config.mjs                 # Configuração Next.js
├── tailwind.config.ts              # Configuração Tailwind
└── tsconfig.json                   # Configuração TypeScript
```

## 🎨 Padrões de Código

### Nomenclatura

#### Arquivos

- **Componentes:** PascalCase (`LeadCard.tsx`, `ClientModal.tsx`)
- **Hooks:** camelCase com prefixo `use` (`useLeads.ts`, `useAuth.tsx`)
- **Types:** PascalCase (`leads.ts` contém `Lead`, `LeadStatus`)
- **Utils:** camelCase (`formatters.ts`, `validators.ts`)

#### Variáveis e Funções

- **Componentes React:** PascalCase (`function LeadCard()`)
- **Funções:** camelCase (`handleCreateLead`, `fetchLeads`)
- **Constants:** UPPER_SNAKE_CASE ou camelCase
- **Types/Interfaces:** PascalCase (`Lead`, `Client`, `Project`)
- **Enums:** PascalCase com valores snake_case (`LeadStatus.primeiro_contato`)

### Estrutura de Componentes

```typescript
// Imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface ComponentProps {
  // props
}

// Component
export default function Component({ props }: ComponentProps) {
  // Hooks
  const router = useRouter();
  const [state, setState] = useState();

  // Handlers
  const handleAction = () => {
    // logic
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Exports

#### Default Exports (usado em):

- Páginas Next.js (`page.tsx`)
- Componentes principais (`CommercialDashboard.tsx`)
- Modais (`ClientModal.tsx`, `ProjectModal.tsx`, `BudgetModal.tsx`) # ✅ Atualizado

#### Named Exports (usado em):

- Hooks (`export function useLeads()`)
- Types (`export interface Lead`)
- Utilities (`export function formatCurrency()`)
- Alguns modais (`LeadModal` usa named export)

⚠️ **IMPORTANTE:** Sempre verificar o tipo de export antes de importar!

## 🔄 Convenções de Estado

### Status dos Leads

```typescript
type LeadStatus =
  | 'primeiro_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';
```

### Status dos Clientes

```typescript
type ClientStatus = 'active' | 'inactive';
```

### Status dos Projetos

````typescript
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

### Status dos Orçamentos (Budgets)

```typescript
type BudgetStatus =
  | 'draft'      // Rascunho
  | 'sent'       // Enviado
  | 'approved'   // ✅ Aprovado (substitui 'signed')
  | 'rejected'   // Rejeitado
  | 'expired';   // Expirado
```

> ⚠️ **MUDANÇA:** `signed` foi renomeado para `approved`. `viewed` foi removido.`
## 🔥 Firebase Collections

```
firestore/
├── users/                  # Usuários do sistema
├── leads/                  # Leads (potenciais clientes)
├── clients/                # Clientes ativos
├── projects/               # Projetos em andamento
├── budgets/                # ✅ Orçamentos (substitui budgets)
├── books/                  # ✅ Catálogo de livros
├── orders/                 # ✅ Pedidos
## 🚀 Next Steps

1. Ler **01-TYPES-COMPLETE.md** - Tipos atualizados (CRÍTICO)
2. Ler **02-FIREBASE-HOOKS.md** - Hooks e operações
3. Ler **03-CRM-MODULE.md** - Módulo comercial completo
4. Ler **06-ORCAMENTOS-FASE-1-COMPLETA.md** - ✅ Implementação de Budgets
5. Ler **08-DOCUMENTO DE MIGRAÇÃO E PADRONIZAÇÃO.md** - ✅ Guia Budget→Budget

---

> **⚠️ ATENÇÃO:**
> - Sempre consultar os tipos em `01-TYPES-COMPLETE.md` antes de gerar código!
> - **Budget foi renomeado para Budget.** Ver documento 08 para detalhes.

---

> **⚠️ ATENÇÃO:** Sempre consultar os tipos em `01-TYPES-COMPLETE.md` antes de gerar código!
````
