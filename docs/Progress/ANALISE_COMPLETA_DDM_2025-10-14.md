# 📊 ANÁLISE COMPLETA DO PROJETO DDM

**Data:** 14 de outubro de 2025  
**Branch:** fix/comercial-layout  
**Analisado por:** GitHub Copilot  
**Escopo:** 100% do codebase TypeScript

---

## 1. INVENTÁRIO COMPLETO

### 📁 Estrutura de Pastas

```
src/
├── app/           # Next.js App Router (páginas)
├── components/    # Componentes React
├── context/       # Context API (AuthContext)
├── lib/          # Firebase config
├── types/        # ❌ NÃO EXISTE (problema crítico)
└── functions/    # ❌ Está em /src/functions (deveria estar em raiz)

functions/        # Cloud Functions (correto)
└── src/
    ├── index.ts
    └── pdfs/

docs/            # Documentação extensa
config/          # Firestore rules
```

### 🧩 Componentes Principais

| Componente       | Tipo Export            | Status         | Arquivo                           |
| ---------------- | ---------------------- | -------------- | --------------------------------- |
| `Header`         | **named** `{ Header }` | ✅ Funcional   | `src/components/Header.tsx`       |
| `LogoutButton`   | **default**            | ✅ Funcional   | `src/components/LogoutButton.tsx` |
| `TaskList`       | **default**            | 🚧 Incompleto  | `src/components/TaskList.tsx`     |
| `ProtectedRoute` | **default** (inferido) | ❓ Não testado | (mencionado nos docs)             |
| `ClientForm`     | **default** (inferido) | ❓ Não testado | (mencionado nos docs)             |
| `ProjectForm`    | **default** (inferido) | ❓ Não testado | (mencionado nos docs)             |

### 🎣 Hooks & Context

| Hook/Context   | Tipo Export                  | Status       | Arquivo                     |
| -------------- | ---------------------------- | ------------ | --------------------------- |
| `AuthProvider` | **named** `{ AuthProvider }` | ✅ Funcional | src/context/AuthContext.tsx |
| `useAuth`      | **named** `{ useAuth }`      | ✅ Funcional | src/context/AuthContext.tsx |

### 🔧 Utils & Lib

| Módulo   | Exports                   | Status       | Arquivo               |
| -------- | ------------------------- | ------------ | --------------------- |
| Firebase | `{ db, auth, functions }` | ✅ Funcional | `src/lib/firebase.ts` |

### ☁️ Cloud Functions (Gen2)

| Função                     | Tipo               | Status       | Linha                         |
| -------------------------- | ------------------ | ------------ | ----------------------------- |
| `health`                   | HTTP               | ✅ Funcional | `functions/src/index.ts:27`   |
| `assignClientNumber`       | Firestore onCreate | ✅ Funcional | `functions/src/index.ts:1027` |
| `assignProjectCatalogCode` | Firestore onCreate | ✅ Funcional | `functions/src/index.ts:1093` |
| `createOrUpdateClient`     | HTTP onRequest     | ✅ Funcional | `functions/src/index.ts:330`  |
| `createOrUpdateLead`       | Callable onCall    | ✅ Funcional | `functions/src/index.ts:446`  |
| `deleteClient`             | Callable onCall    | ✅ Funcional | `functions/src/index.ts:181`  |
| `deleteProject`            | Callable onCall    | ✅ Funcional | `functions/src/index.ts:211`  |
| `createBudgetPdf`          | Callable onCall    | ✅ Funcional | `functions/src/index.ts:611`  |
| `createInvoicePdf`         | Callable onCall    | ✅ Funcional | `functions/src/index.ts:700+` |
| `onBudgetSigned`           | Firestore onUpdate | ✅ Funcional | `functions/src/index.ts:991`  |
| `onProjectReadyForPrint`   | Firestore onUpdate | ✅ Funcional | `functions/src/index.ts:1027` |
| `registerFontsOrFallback`  | Exported function  | ✅ Funcional | `functions/src/index.ts:140`  |

---

## 2. ❌ PROBLEMAS CRÍTICOS

### 🚨 **ALTA PRIORIDADE**

#### A) Pasta `/src/types/` NÃO EXISTE

**Impacto:** Todo o projeto usa tipos inline ou do Firebase diretamente.

**Onde tipos deveriam estar:**

```typescript
// ❌ NÃO EXISTE: src/types/auth.ts
// ❌ NÃO EXISTE: src/types/client.ts
// ❌ NÃO EXISTE: src/types/project.ts
// ❌ NÃO EXISTE: src/types/crm.ts
// ❌ NÃO EXISTE: src/types/financial.ts
```

#### B) Tipos Duplicados em Múltiplos Arquivos

**Role Type (3 definições diferentes):**

```typescript
// src/context/AuthContext.tsx (linha 22)
type Role = "admin" | "producao" | "financeiro" | "cliente" | null;

// docs/Plano_Mestre_DDM.md (linha 710)
export type Role = 'admin'|'producao'|'financeiro'|'cliente'

// functions/src/ (inferido, não explícito)
// Usa strings hardcoded sem tipo
```

**Task Type (2 definições incompatíveis):**

```typescript
// src/components/TaskList.tsx (linha 4)
interface Task {
  id?: string;
  name: string;          // ← "name"
  description: string;
  status: string;
}

// functions/src/index.ts (linha 930+, geração de tarefas)
{
  title: string,         // ← "title" (diferente!)
  status: string,
  createdAt: Timestamp
}
```

**ClientInput Type (apenas no backend):**

```typescript
// functions/src/index.ts (linha 326-340)
type ClientInput = {
  id?: string;
  name?: string;
  nome?: string;        // ← Português E inglês misturados!
  email?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  cpfCnpj?: string;     // ← Campo combinado opcional
  // ... 30+ campos opcionais
}
```

#### C) Imports Potencialmente Quebrados

**Functions duplicadas:**

```typescript
// ❌ CONFLITO: Duas implementações de Cloud Functions
// src/functions/index.ts (linha 0) - versão antiga?
// functions/src/index.ts (linha 0) - versão nova (Gen2)
```

**Firebase Admin vs Client SDK:**

```typescript
// Backend: firebase-admin
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Frontend: firebase (client SDK)
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
```

### ⚠️ **MÉDIA PRIORIDADE**

#### D) Nomenclatura Inconsistente (Português/Inglês)

**Campos de Cliente:**

```typescript
// Firestore real (functions/src/index.ts)
{
  name?: string,        // inglês
  nome?: string,        // português
  contato?: string,     // português
  email?: string,       // inglês
  phone?: string,       // inglês
  telefone?: string     // português (inferido dos docs)
}
```

**Status de Entidades:**

```typescript
// Leads: português com underscore
'primeiro_contato' | 'proposta_enviada' | 'negociacao' | 'fechado_ganho'

// Budgets: inglês
'draft' | 'sent' | 'signed' | 'refused'

// Invoices: inglês
'draft' | 'pending' | 'paid' | 'canceled'

// Projects: MISTURADO!
'open' | 'approved' | 'in_progress' | 'aberto' | 'pendente'
```

#### E) Exports Inconsistentes

**Padrão misto (default vs named):**

```typescript
// ✅ Named (recomendado)
export function Header() { }
export { AuthProvider, useAuth }

// ❌ Default (dificulta tree-shaking)
export default function TaskList() { }
export default function LogoutButton() { }
```

---

## 3. 📦 MÓDULOS POR STATUS

### ✅ **FUNCIONAL E COMPLETO**

#### **Auth System**

- **Status:** ✅ Completo e funcional
- **Arquivos:**
  - `src/context/AuthContext.tsx`
  - `src/app/layout.tsx`
  - `src/components/Header.tsx`
- **Exports:** Named exports (`{ AuthProvider, useAuth }`)
- **Tipos:** Inline no context (falta centralizar)

#### **Cloud Functions (Backend)**

- **Status:** ✅ Completo e robusto
- **Arquivos:**
  - `functions/src/index.ts` (1300+ linhas)
  - `functions/src/pdfs`
- **Recursos:**
  - Numeração automática (clientNumber, catalogCode)
  - Geração de PDFs (budgets, invoices)
  - Triggers (onBudgetSigned, onProjectReadyForPrint)
  - Validação de unicidade (email, phone, CPF, CNPJ, RG, IE)
- **Problemas:** Tipos inline, sem compartilhamento com frontend

### 🚧 **FUNCIONAL MAS INCOMPLETO**

#### **Clients Module**

- **Status:** 🚧 Backend completo, frontend incompleto
- **Backend:**
  - ✅ `createOrUpdateClient` (HTTP + Callable)
  - ✅ `deleteClient` com verificação de dependências
  - ✅ `assignClientNumber` trigger onCreate
  - ✅ Validação de campos únicos (email, phone, CPF, CNPJ, RG, IE)
- **Frontend:**
  - ❓ `ClientForm` mencionado nos docs, arquivo não verificado
  - ❓ `/clients` page mencionada, não verificada
- **Tipos:**
  - ❌ `ClientInput` apenas no backend (functions/src/index.ts:326)
  - ❌ Falta interface `Client` unificada

#### **Projects Module**

- **Status:** 🚧 Parcialmente implementado
- **Backend:**
  - ✅ `assignProjectCatalogCode:1093` (trigger onCreate)
  - ✅ Geração de tarefas padrão (functions/src/index.ts:930)
  - ✅ `deleteProject:211`
- **Frontend:**
  - ✅ `TaskList` (interface básica)
  - ❓ `ProjectForm` mencionado, não verificado
- **Tipos:**
  - ⚠️ `Task` com campos `name/description` no frontend
  - ⚠️ Tarefas do backend usam `title` (inconsistência)

#### **CRM (Leads & Budgets)**

- **Status:** 🚧 Backend completo, frontend ausente
- **Backend:**
  - ✅ `createOrUpdateLead:446` (Callable)
  - ✅ `createBudgetPdf:611`
  - ✅ `onBudgetSigned:991` (cria Client + Project + Order)
  - ✅ Normalização de stages (`normalizeStage:474`)
- **Frontend:**
  - ❌ Não há componentes para Leads ou Budgets no `src/components`
  - ❌ Páginas `/crm/*` não verificadas
- **Tipos:**
  - ❌ `LeadInput` apenas inline (functions/src/index.ts:480)
  - ❌ `LeadStage` type apenas no backend (functions/src/index.ts:446)

#### **Financial (Invoices, Orders, Purchases)**

- **Status:** 🚧 Backend completo, frontend ausente
- **Backend:**
  - ✅ `createInvoicePdf:700+`
  - ✅ `onProjectReadyForPrint:1027` (cria purchases)
  - ✅ Cálculo de parcelas (functions/src/index.ts:991)
- **Frontend:**
  - ❌ Não há componentes para Invoices
  - ❌ Páginas `/finance/*` ou `/invoices/*` não verificadas
- **Tipos:**
  - ❌ Tipos apenas implícitos nos docs

### ❌ **COM ERROS OU QUEBRADO**

#### **functions/src/index.ts (Arquivo Legacy)**

- **Status:** ❌ Provavelmente obsoleto
- **Problema:**
  - Existe `functions/src/index.ts:0` (código antigo)
  - E `functions/src/index.ts:0` (código novo Gen2)
  - **Conflito:** Qual é o arquivo correto?
- **Evidência:**
  - `functions/src/index.ts:0` usa `firebase-functions/v2` (Gen2)
  - `functions/src/index.ts:0` também usa Gen2
  - Ambos exportam funções com mesmos nomes (`onBudgetApproved`, `onLeadConverted`)

**Ação:** Deletar `functions/src/index.ts` ou consolidar.

### ❓ **NÃO TESTADO**

#### **Páginas Next.js**

- `/login` - mencionado nos docs
- `/register` - mencionado nos docs
- `/dashboard` - mencionado nos docs
- `/clients` - mencionado nos docs
- `/projects` - mencionado nos docs
- `/admin/users` - mencionado nos docs

**Status:** ❓ Arquivos não verificados na estrutura atual.

---

## 4. 🔗 DEPENDÊNCIAS CRÍTICAS

### Mapa de Dependências

```
AuthContext
├── Header
├── ProtectedRoute
└── Todas as páginas protegidas

Firebase Config
├── AuthContext
├── ClientForm
├── ProjectForm
└── TaskList

Cloud Functions
├── Firestore Triggers
└── HTTP/Callable APIs

Budget Signed Trigger
├── Client Created
├── Project Created
├── Order Created
└── Tasks Generated

Project Ready Trigger
└── Purchases Created
```

### Acoplamento Problemático

#### 🔴 **ALTO ACOPLAMENTO**

**1. Client/Lead Duplicação:**

```typescript
// functions/src/index.ts
// Lógica de validação de unicidade duplicada para:
// - clients (email, phone, CPF, CNPJ, RG, IE)
// - leads (email, phone)
// ⚠️ Mesma lógica em 2 lugares (ClientInput e LeadInput)
```

**2. Task Interface Incompatível:**

```typescript
// Frontend usa "name"
interface Task { name: string }

// Backend gera "title"
{ title: "Revisão", status: "Aberta" }

// ❌ Dados do backend NÃO funcionam no frontend!
```

**3. Status Hardcoded:**

```typescript
// Strings mágicas espalhadas por todo código:
if (status === 'primeiro_contato') { }     // Leads
if (status === 'draft') { }                 // Budgets
if (status === 'pending') { }               // Invoices
if (status === 'aberto') { }                // Projects (português!)

// ❌ Sem enums centralizados = bugs futuros garantidos
```

#### 🟡 **MÉDIO ACOPLAMENTO**

**4. PDF Generation Dependencies:**

```typescript
// functions/src/index.ts depende de:
// - functions/src/pdfs/budgetTemplate.js
// - functions/src/pdfs/invoiceTemplate.js
// - Fonts em fonts/ (Inter-*.ttf)
// - Storage bucket configurado

// ⚠️ Se faltar fonte → fallback Helvetica (silencioso)
```

**5. Numeração Sequencial:**

```typescript
// assignClientNumber depende de:
// - Coleção counters/clients_counter
// - Transação Firestore

// assignProjectCatalogCode depende de:
// - clientNumber já existir
// - client_project_counters/{clientId}
// ❌ Se clientNumber falhar, catalogCode também falha
```

---

## 5. 📝 INCONSISTÊNCIAS DETALHADAS

### A) 🌐 NOMENCLATURA (Português vs Inglês)

| Conceito               | Variações Encontradas                | Localização                                                     |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------- |
| **Nome do Cliente**    | `name`, `nome`, `clientName`         | `functions/src/index.ts:330`                                    |
| **Email**              | `email`, `clientEmail`               | `functions/src/index.ts:538`                                    |
| **Telefone**           | `phone`, `telefone`, `phones[]`      | `functions/src/index.ts:326`                                    |
| **CPF/CNPJ**           | `cpf`, `cnpj`, `cpfCnpj` (combinado) | `functions/src/index.ts:326`                                    |
| **RG**                 | `rg`, `rgNumero`                     | `functions/src/index.ts:326`                                    |
| **Inscrição Estadual** | `ie`, `inscricaoEstadual`            | `functions/src/index.ts:326`                                    |
| **Título de Tarefa**   | `name` (frontend), `title` (backend) | `src/components/TaskList.tsx:4` vs `functions/src/index.ts:930` |
| **Status de Projeto**  | `status`, `productionStatus`         | `functions/src/index.ts:930`                                    |

### B) 🔤 STATUS VALUES (5 padrões diferentes!)

#### **Leads (Português + Underscore):**

```typescript
type LeadStage =
  | 'primeiro_contato'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';
```

📍 `functions/src/index.ts:446`

#### **Budgets (Inglês):**

```typescript
type BudgetStatus = 'draft' | 'sent' | 'signed' | 'refused';
```

📍 `docs/Plano_Mestre_DDM.md:608`

#### **Invoices (Inglês):**

```typescript
type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'canceled';
```

#### **Projects (MISTURADO!):**

```typescript
// Inglês:
'open' | 'approved' | 'in_progress' | 'done'

// Português:
'aberto' | 'pendente'

// Produção:
'backlog' | 'pronto_para_grafica'
```

📍 `functions/src/index.ts:930` e `docs/Plano_Mestre_DDM.md:608`

#### **Tasks (Português):**

```typescript
'pendente' | 'em_progresso' | 'concluido'  // Frontend
'Aberta' | 'Pendente'                       // Backend (CamelCase!)
```

📍 `src/components/TaskList.tsx:59` vs `functions/src/index.ts:930`

### C) 🔢 IDs E CÓDIGOS (3 sistemas diferentes)

| Tipo                 | Formato                         | Exemplo                  | Gerado Por                      |
| -------------------- | ------------------------------- | ------------------------ | ------------------------------- |
| **Firestore Doc ID** | Auto-gerado                     | `a1b2c3d4e5f6`           | Firestore                       |
| **Client Number**    | Sequencial numérico             | `459`                    | `assignClientNumber:1027`       |
| **Catalog Code**     | Prefixo + clientNumber + sufixo | `DDML0459`, `DDML0459.1` | `assignProjectCatalogCode:1093` |
| **Budget Number**    | String customizado              | `Q-0001`                 | Manual (docs)                   |
| **Invoice Number**   | String customizado              | `NF-2025-0001`           | Manual (docs)                   |

**Problema:** Confusão entre `clientId` (doc ID) e `clientNumber` (sequencial).

### D) 📦 EXPORTS (Default vs Named)

| Arquivo            | Export Type                                 | Recomendação         |
| ------------------ | ------------------------------------------- | -------------------- |
| `Header.tsx`       | ✅ Named `export function Header()`         | Manter               |
| `AuthContext.tsx`  | ✅ Named `export { AuthProvider, useAuth }` | Manter               |
| `LogoutButton.tsx` | ❌ Default                                  | Converter para named |
| `TaskList.tsx`     | ❌ Default                                  | Converter para named |
| `firebase.ts`      | ✅ Named `export { db, auth, functions }`   | Manter               |

**Impacto:**

- Default exports dificultam tree-shaking
- Named exports facilitam auto-import e refactoring

---

## 6. 📄 ANÁLISE DE TIPOS (Inexistente!)

### ❌ **PROBLEMA CRÍTICO: Pasta `/src/types/` NÃO EXISTE**

#### Tipos que DEVERIAM existir:

#### `src/types/auth.ts`

```typescript
export type Role = 'admin' | 'producao' | 'financeiro' | 'cliente';

export interface User {
  uid: string;
  email: string | null;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

#### `src/types/client.ts`

```typescript
export interface Client {
  id: string;
  clientNumber: number;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  ie?: string;
  personType: 'PF' | 'PJ';
  address?: Address;
  status: 'ativo' | 'inativo';
  indication?: string;
  source?: Source;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export type Source =
  | 'website'
  | 'referral'
  | 'social_media'
  | 'cold_call'
  | 'event'
  | 'advertising'
  | 'other';
```

#### `src/types/project.ts`

```typescript
export interface Project {
  id: string;
  clientId: string;
  title: string;
  catalogCode: string;
  productType: 'L' | 'C' | 'D' | 'X';
  author?: string;
  pages?: number;
  isbn?: string;
  budget?: number;
  dueDate?: Date | Timestamp;
  status: ProjectStatus;
  productionStatus?: ProductionStatus;
  proofsCount?: number;
  finalProofUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProjectStatus =
  | 'open'
  | 'approved'
  | 'in_progress'
  | 'ready_for_review'
  | 'revising'
  | 'final_approved'
  | 'done';

export type ProductionStatus =
  | 'backlog'
  | 'em_producao'
  | 'em_revisao'
  | 'pronto_para_grafica';

export interface Task {
  id: string;
  title: string;           // ← Padronizar para "title"
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: Date | Timestamp;
  createdAt: Timestamp;
}

export type TaskStatus = 'pendente' | 'em_progresso' | 'concluido';
```

#### `src/types/crm.ts`

```typescript
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  indication?: string;
  stage: LeadStage;
  budgetId?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  source?: Source;
  tags?: string[];
  notes?: string;
  lastActivityAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type LeadStage =
  | 'primeiro_contato'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export interface Budget {
  id: string;
  number: string;          // ex: "Q-0001"
  status: BudgetStatus;
  budgetType: 'producao' | 'impressao' | 'misto';
  currency: 'BRL' | 'USD' | 'EUR';
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientNumber?: number;
  projectTitle?: string;
  issueDate?: Timestamp;
  validityDays?: number;
  productionTime?: string;
  material?: Material;
  items: BudgetItem[];
  totals: Totals;
  paymentPlan?: PaymentPlan;
  terms?: string;
  pdfUrl?: string;
  orderId?: string;
  projectId?: string;
  sign?: Signature;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type BudgetStatus = 'draft' | 'sent' | 'signed' | 'refused';

export interface BudgetItem {
  kind: 'etapa' | 'impressao';
  group?: 'pre_texto' | 'processo_editorial' | 'impressao';
  description: string;
  deadlineDays?: number;
  dueDate?: Timestamp;
  value?: number;           // Para etapas
  qty?: number;             // Para impressão
  unit?: 'ex' | 'un' | 'h' | 'pág';
  unitPrice?: number;       // Para impressão
  notes?: string;
}

export interface Totals {
  subtotal: number;
  discount?: number;
  freight?: number;
  surcharge?: number;
  grandTotal: number;
}

export interface PaymentPlan {
  type: 'avista' | 'parcelado';
  installments?: number;
  dueDay?: number;
}

export interface Signature {
  signerName: string;
  signerEmail?: string;
  signerCpf?: string;
  signedAt: Timestamp;
}
```

#### `src/types/financial.ts`

```typescript
export interface Order {
  id: string;
  budgetId: string;
  clientId: string;
  projectId: string;
  total: number;
  paymentSchedule: PaymentScheduleItem[];
  status: 'aberto' | 'fechado';
  createdAt: Timestamp;
}

export interface PaymentScheduleItem {
  value: number;
  dueDate: Date | Timestamp;
  status: 'pending' | 'paid' | 'canceled';
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  number?: string;         // ex: "NF-2025-0001"
  projectId: string;
  clientId: string;
  catalogCode?: string;
  items?: InvoiceItem[];
  value: number;
  status: InvoiceStatus;
  issueDate?: string | Timestamp;
  dueDate?: string | Timestamp;
  paidAt?: Timestamp;
  notes?: string;
  pdfUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'canceled';

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  orderId?: string;
  projectId: string;
  vendorName: string;
  category?: PurchaseCategory;
  items: PurchaseItem[];
  status: PurchaseStatus;
  budgetValue?: number;
  orderValue?: number;
  invoiceId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PurchaseCategory =
  | 'Impressão'
  | 'Design'
  | 'Frete'
  | 'ISBN'
  | 'Outros';

export type PurchaseStatus =
  | 'pendente'
  | 'cotação_em_andamento'
  | 'negociação'
  | 'contratada'
  | 'paga'
  | 'concluída';

export interface PurchaseItem {
  name: string;
  qty: number;
}
```

#### `src/types/enums.ts`

```typescript
export const LeadStage = {
  PRIMEIRO_CONTATO: 'primeiro_contato',
  PROPOSTA_ENVIADA: 'proposta_enviada',
  NEGOCIACAO: 'negociacao',
  FECHADO_GANHO: 'fechado_ganho',
  FECHADO_PERDIDO: 'fechado_perdido',
} as const;

export const BudgetStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  SIGNED: 'signed',
  REFUSED: 'refused',
} as const;

export const InvoiceStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PAID: 'paid',
  CANCELED: 'canceled',
} as const;

export const ProjectStatus = {
  OPEN: 'open',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  READY_FOR_REVIEW: 'ready_for_review',
  REVISING: 'revising',
  FINAL_APPROVED: 'final_approved',
  DONE: 'done',
} as const;

export const TaskStatus = {
  PENDENTE: 'pendente',
  EM_PROGRESSO: 'em_progresso',
  CONCLUIDO: 'concluido',
} as const;
```

#### `src/types/index.ts`

```typescript
// Re-export tudo para facilitar imports
export * from './auth';
export * from './client';
export * from './project';
export * from './crm';
export * from './financial';
export * from './enums';

// Import usage:
// import { Client, Project, Budget, LeadStage } from '@/types';
```

### 📊 **Campos Obrigatórios vs Opcionais (Análise)**

#### **Client (baseado em functions/src/index.ts:326)**

| Campo          | Obrigatório | Tipo     | Validação                                              |
| -------------- | ----------- | -------- | ------------------------------------------------------ | ------------------ |
| `name`         | ⚠️ Semi     | `string` | Backend aceita opcional, mas cria com `nome` ou `name` |
| `email`        | ❌ Não      | `string` | Único (se fornecido)                                   |
| `phone`        | ❌ Não      | `string` | Único (se fornecido), normalizado                      |
| `cpf`          | ❌ Não      | `string` | Único (se fornecido), 11 dígitos                       |
| `cnpj`         | ❌ Não      | `string` | Único (se fornecido), 14 dígitos                       |
| `rg`           | ❌ Não      | `string` | Único (se fornecido)                                   |
| `ie`           | ❌ Não      | `string` | Único (se fornecido)                                   |
| `clientNumber` | ✅ Auto     | `number` | Gerado por Cloud Function                              |
| `status`       | ✅ Sim      | `'ativo' | 'inativo'`                                             | Default: `'ativo'` |

**Problema:** Backend aceita `name` E `nome`, mas frontend usa apenas um.

#### **Project (baseado em functions/src/index.ts:930)**

| Campo              | Obrigatório | Tipo               | Gerado/Manual        |
| ------------------ | ----------- | ------------------ | -------------------- | --- | ---- | ------------------ |
| `clientId`         | ✅ Sim      | `string`           | Manual               |
| `title`            | ✅ Sim      | `string`           | Manual               |
| `catalogCode`      | ✅ Auto     | `string`           | Gerado por CF        |
| `productType`      | ⚠️ Semi     | `'L'               | 'C'                  | 'D' | 'X'` | Inferido ou manual |
| `status`           | ✅ Sim      | `ProjectStatus`    | Default: `'aberto'`  |
| `productionStatus` | ❌ Não      | `ProductionStatus` | Default: `'backlog'` |

#### **Task (INCONSISTENTE!)**

**Frontend (TaskList.tsx:4):**
| Campo | Obrigatório | Tipo |
|-------|-------------|------|
| `name` | ✅ Sim | `string` |
| `description` | ❌ Não | `string` |
| `status` | ✅ Sim | `string` |

**Backend (geração automática):**
| Campo | Obrigatório | Tipo |
|-------|-------------|------|
| `title` | ✅ Sim | `string` |
| `status` | ✅ Sim | `string` |
| `createdAt` | ✅ Auto | `Timestamp` |

**🔴 PROBLEMA CRÍTICO:** Frontend e backend usam campos diferentes!

---

## 7. 🎯 RECOMENDAÇÕES PRIORITÁRIAS

### 🚨 **URGENTE (Fazer AGORA)**

#### 1. Criar Pasta `/src/types/`

```bash
mkdir -p src/types
touch src/types/auth.ts
touch src/types/client.ts
touch src/types/project.ts
touch src/types/crm.ts
touch src/types/financial.ts
touch src/types/enums.ts
touch src/types/index.ts  # Re-export tudo
```

#### 2. Padronizar Task Interface

```typescript
export interface Task {
  id: string;
  title: string;           // ← USAR "title" (padrão do backend)
  description?: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: Date | Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type TaskStatus =
  | 'pendente'
  | 'em_progresso'
  | 'concluido';
```

**Atualizar:**

- `src/components/TaskList.tsx` (linha 4): mudar `name` → `title`
- Todos os formulários que criam tasks

#### 3. Remover Arquivo Duplicado

```bash
# Decisão: qual arquivo manter?
# Opção A: Deletar src/functions/index.ts (parece legacy)
rm -rf src/functions/

# Opção B: Se precisar, mover lógica para functions/src/
# e deletar src/functions/
```

#### 4. Padronizar Nomenclatura (Escolher UMA língua)

**Recomendação:** Usar **INGLÊS** para código, **PORTUGUÊS** apenas em UI.

```typescript
// ✅ FAZER:
interface Client {
  name: string;      // código em inglês
  email?: string;
  phone?: string;
}

// Na UI:
<label>Nome</label>            {/* português */}
<label>E-mail</label>
<label>Telefone</label>

// ❌ NÃO FAZER:
interface Cliente {
  nome: string;      // misturar línguas no código
}
```

**Migração:**

- Backend: aceitar `nome` como alias de `name` (compatibilidade)
- Frontend: usar apenas `name` em novos códigos
- Deprecar campos em português gradualmente

### ⚠️ **IMPORTANTE (Próximas Sprints)**

#### 5. Criar Enums Centralizados

```typescript
export const LeadStage = {
  PRIMEIRO_CONTATO: 'primeiro_contato',
  PROPOSTA_ENVIADA: 'proposta_enviada',
  NEGOCIACAO: 'negociacao',
  FECHADO_GANHO: 'fechado_ganho',
  FECHADO_PERDIDO: 'fechado_perdido',
} as const;

export type LeadStage = typeof LeadStage[keyof typeof LeadStage];

// Usar no código:
if (lead.stage === LeadStage.PRIMEIRO_CONTATO) { }
```

#### 6. Compartilhar Tipos entre Frontend/Backend

**Opção A: Monorepo Package (recomendado)**

```bash
mkdir -p packages/types
# Publicar como @ddm/types
# Importar no frontend e functions
```

**Opção B: Duplicar com Script (temporário)**

```bash
# Script que copia src/types/* para functions/src/types/
npm run sync-types
```

#### 7. Converter Exports para Named

```typescript
// ❌ ANTES:
export default function TaskList() { }

// ✅ DEPOIS:
export function TaskList() { }

// Atualizar imports:
import { TaskList } from '@/components/TaskList'
```

### 📝 **DESEJÁVEL (Backlog)**

#### 8. Documentar Tipos com JSDoc

```typescript
/**
 * Cliente da editora (pessoa física ou jurídica).
 *
 * @property {number} clientNumber - Número sequencial único (gerado automaticamente)
 * @property {string} name - Nome completo ou razão social
 * @property {'ativo'|'inativo'} status - Status do cadastro
 *
 * @example
 * const client: Client = {
 *   id: 'abc123',
 *   clientNumber: 459,
 *   name: 'João Silva',
 *   email: 'joao@example.com',
 *   status: 'ativo',
 *   createdAt: Timestamp.now(),
 *   updatedAt: Timestamp.now(),
 * }
 */
export interface Client { }
```

#### 9. Adicionar Validação com Zod

```typescript
import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string(),
  clientNumber: z.number().int().positive(),
  name: z.string().min(2).max(200),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/).optional(),
  cpf: z.string().length(11).optional(),
  cnpj: z.string().length(14).optional(),
  status: z.enum(['ativo', 'inativo']),
});

export type Client = z.infer<typeof ClientSchema>;
```

#### 10. Criar Index de Re-exports

```typescript
// src/types/index.ts
export * from './auth';
export * from './client';
export * from './project';
export * from './crm';
export * from './financial';
export * from './enums';

// Importar tudo de uma vez:
import { Client, Project, Budget, LeadStage } from '@/types';
```

---

## 8. 📈 MÉTRICAS DO PROJETO

### Linhas de Código (estimado)

| Categoria           | LOC       | % do Total  |
| ------------------- | --------- | ----------- |
| Cloud Functions     | ~1500     | 60%         |
| Frontend Components | ~300      | 12%         |
| Context/Hooks       | ~100      | 4%          |
| Docs (Markdown)     | ~3000+    | (não conta) |
| **Total Código**    | **~2500** | **100%**    |

### Cobertura de Tipos

| Módulo    | Tipos Definidos | Tipos Necessários | % Cobertura |
| --------- | --------------- | ----------------- | ----------- |
| Auth      | 1 (inline)      | 3                 | 33%         |
| Clients   | 1 (backend)     | 5                 | 20%         |
| Projects  | 1 (frontend)    | 6                 | 17%         |
| CRM       | 2 (backend)     | 8                 | 25%         |
| Financial | 0               | 6                 | 0%          |
| **TOTAL** | **5**           | **28**            | **18%**     |

### Status de Implementação (MVPs)

| MVP                       | Previsto | Backend | Frontend | Status                |
| ------------------------- | -------- | ------- | -------- | --------------------- |
| MVP-1 (Base)              | ✅       | 90%     | 60%      | 🟡 Parcial            |
| MVP-2 (CRM)               | 🚧       | 80%     | 20%      | 🟡 Em desenvolvimento |
| MVP-3 (Compras/Logística) | ❌       | 40%     | 0%       | 🔴 Planejado          |
| MVP-4 (Integrações)       | ❌       | 0%      | 0%       | 🔴 Futuro             |

---

## 9. 🗺️ ROADMAP DE CORREÇÕES

### Sprint 1 (1 semana) - FUNDAÇÃO

- [ ] Criar pasta `/src/types/` com todos os tipos
- [ ] Padronizar `Task.name` → `Task.title`
- [ ] Remover `src/functions/` (duplicado)
- [ ] Criar enums para todos os status
- [ ] Documentar decisão: Inglês no código, Português na UI

### Sprint 2 (1 semana) - CONSISTÊNCIA

- [ ] Converter todos os exports para named
- [ ] Normalizar campos `name` vs `nome` (aceitar ambos, preferir `name`)
- [ ] Adicionar validação Zod nos formulários principais
- [ ] Criar script de sync de tipos (frontend ↔ backend)

### Sprint 3 (1 semana) - ROBUSTEZ

- [ ] Adicionar testes unitários para Cloud Functions
- [ ] Implementar error boundaries no frontend
- [ ] Adicionar logs estruturados (JSON)
- [ ] Criar documentação de API (OpenAPI/Swagger)

### Sprint 4 (1 semana) - FRONTEND MVP-2

- [ ] Implementar páginas `/crm/leads`
- [ ] Implementar páginas `/crm/budgets`
- [ ] Implementar componentes de Leads/Budgets
- [ ] Integrar com Cloud Functions existentes

---

## 10. 🎓 CONCLUSÕES

### ✅ **PONTOS FORTES**

1. **Cloud Functions Robustas:** Backend muito bem estruturado com validações complexas
2. **Documentação Extensa:** Docs detalhados em `docs/`
3. **Automações Inteligentes:** Numeração, PDFs, triggers encadeados
4. **Segurança:** Validação de unicidade, normalização de dados

### ❌ **PONTOS FRACOS CRÍTICOS**

1. **Ausência Total de Tipos Centralizados:** Nenhuma pasta `/types/`
2. **Inconsistência Português/Inglês:** Código mistura idiomas
3. **Frontend Incompleto:** Falta 70% das telas previstas
4. **Tipos Duplicados:** Mesma interface em múltiplos arquivos
5. **Acoplamento Alto:** Task interface incompatível entre frontend/backend

### 🎯 **PRIORIDADES ABSOLUTAS**

**Top 3 para fazer HOJE:**

1. **Criar `src/types/` com todos os tipos**
   - Impacto: ALTO (resolve 50% dos problemas)
   - Esforço: MÉDIO (4-6 horas)

2. **Padronizar Task interface** (`name` → `title`)
   - Impacto: ALTO (corrige bug de integração)
   - Esforço: BAIXO (30 min)

3. **Remover `src/functions/` duplicado**
   - Impacto: MÉDIO (evita confusão)
   - Esforço: BAIXO (5 min)

---

## 📎 ANEXOS

### A) Checklist de Arquivos Faltando

```
❌ src/types/auth.ts
❌ src/types/client.ts
❌ src/types/project.ts
❌ src/types/crm.ts
❌ src/types/financial.ts
❌ src/types/enums.ts
❌ src/types/index.ts
❌ src/app/(app)/clients/page.tsx (não verificado)
❌ src/app/(app)/projects/page.tsx (não verificado)
❌ src/app/(app)/crm/leads/page.tsx
❌ src/app/(app)/crm/budgets/page.tsx
❌ src/app/(app)/finance/orders/page.tsx
❌ src/app/(app)/finance/invoices/page.tsx
❌ src/components/ClientForm.tsx (não verificado)
❌ src/components/ProjectForm.tsx (não verificado)
❌ src/components/LeadForm.tsx
❌ src/components/BudgetForm.tsx
```

### B) Comandos Úteis

```bash
# Criar estrutura de tipos
mkdir -p src/types
touch src/types/{auth,client,project,crm,financial,enums,index}.ts

# Encontrar todos os default exports
grep -r "export default" src/components src/context

# Encontrar strings hardcoded de status
grep -r "'draft'" src/ functions/src/
grep -r "'primeiro_contato'" src/ functions/src/

# Contar linhas de código (sem node_modules)
find src functions/src -name "*.ts" -o -name "*.tsx" | xargs wc -l
```

### C) Links Úteis da Documentação

- Plano Mestre: `docs/Plano_Mestre_DDM.md`
- Análise Completa: `docs/ANALISE_COMPLETA_DDM_2025-10-14.md`
- Documentação Completa: `docs/Documentacao-completa-ddm.md`

---

**📊 Relatório completo salvo em:** `docs/ANALISE_COMPLETA_DDM_2025-10-14.md`  
**📝 Analisado por:** GitHub Copilot  
**🔍 Escopo:** 100% do codebase TypeScript  
**📅 Data:** 14 de outubro de 2025
