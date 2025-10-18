# 📚 REFERÊNCIA COMPLETA DE TYPES - Sistema DDM

**Data:** 15 de outubro de 2025  
**Objetivo:** Documento único com TODOS os types do sistema para evitar erros de código

---

## ⚠️ IMPORTANTE - LEIA ANTES DE USAR

Este documento contém os **types REAIS** implementados no código. Use-o como referência única para:

- ✅ Gerar código TypeScript
- ✅ Validar interfaces
- ✅ Evitar campos inexistentes
- ✅ Garantir tipagem correta

**NÃO invente campos que não existem aqui!**

---

## 📦 1. BUDGETS (Orçamentos)

### 1.1 Enums

```typescript
export enum EditorialServiceType {
  REVISION = "Revisão",
  PREPARATION = "Preparação",
  COPYEDIT = "Copidesque",
  GRAPHIC_DESIGN = "Criação do projeto gráfico",
  LAYOUT = "Diagramação",
  COVER = "Capa",
  EBOOK_FORMAT = "Formatação eBook",
  KINDLE_CONVERSION = "Conversão Kindle",
  ISBN = "ISBN",
  CATALOG_CARD = "Ficha Catalográfica",
  PRINTING = "Impressão",
  SOCIAL_MEDIA = "Divulgação Rede Sociais",
  MARKETING_CAMPAIGN = "Campanha de Marketing",
  CUSTOM = "Personalizado",
}

export enum ExtraType {
  PROOFS = "Provas",
  SHIPPING = "Frete",
  CUSTOM = "Personalizado",
}

export type BudgetStatus = "draft" | "sent" | "approved" | "rejected" | "expired";
```

### 1.2 Budget Items

```typescript
export interface BudgetItemBase {
  id: string;
  type: "editorial_service" | "printing" | "extra";
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface EditorialServiceItem extends BudgetItemBase {
  type: "editorial_service";
  service: EditorialServiceType;
  customService?: string;
  estimatedDays?: number;
}

export interface PrintingItem extends BudgetItemBase {
  type: "printing";
  printRun: number; // tiragem
  useBookSpecs: boolean;
  customSpecs?: Partial<BookSpecifications>;
  productionDays?: number;
}

export interface ExtraItem extends BudgetItemBase {
  type: "extra";
  extraType: ExtraType;
  customExtra?: string;
}

export type BudgetItem = EditorialServiceItem | PrintingItem | ExtraItem;
```

### 1.3 Project Data (Temporário)

```typescript
export interface ProjectData {
  title: string;
  subtitle?: string;
  author?: string;
  specifications?: BookSpecifications;
  pages?: number;
}
```

### 1.4 Budget Interface

```typescript
export interface Budget {
  id?: string;
  number: string; // v5_1310.1435
  version: number;

  // RELACIONAMENTOS OPCIONAIS
  leadId?: string;
  clientId?: string;
  bookId?: string;

  // TIPO DO PROJETO
  projectType?: ProjectCatalogType;

  // DADOS TEMPORÁRIOS DO PROJETO
  projectData?: ProjectData;

  // ITENS
  items: BudgetItem[];

  // VALORES
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  total: number;

  // CONDIÇÕES COMERCIAIS
  paymentMethods: string[];
  validityDays: number;
  productionDays?: number;
  clientProvidedMaterial: boolean;
  materialDescription?: string;
  notes?: string;

  // STATUS
  status: BudgetStatus;

  // DATAS
  issueDate: Timestamp;
  expiryDate: Timestamp;
  approvalDate?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
}
```

### 1.5 Budget Form Data

```typescript
export interface BudgetFormData {
  // Origem (OU lead OU cliente)
  leadId?: string;
  clientId?: string;
  bookId?: string;

  // Tipo e dados do projeto
  projectType?: ProjectCatalogType;
  projectData?: ProjectData;

  // Itens
  items: Omit<BudgetItem, "id" | "totalPrice">[];

  // Condições
  paymentMethods: string[];
  validityDays: number;
  productionDays?: number;
  clientProvidedMaterial: boolean;
  materialDescription?: string;
  discount?: number;
  discountPercentage?: number;
  notes?: string;
}
```

### 1.6 Helper Functions

```typescript
// Gerar número do orçamento (v5_1510.1430)
export function generateBudgetNumber(): string;

// Calcular subtotal
export function calculateSubtotal(items: BudgetItem[]): number;

// Calcular total com desconto
export function calculateTotal(
  subtotal: number,
  discount?: number,
  discountPercentage?: number,
): number;

// Calcular total de um item
export function calculateItemTotal(quantity: number, unitPrice: number): number;

// Validar orçamento
export function validateBudget(data: BudgetFormData): string[];

// Verificar se expirou
export function isExpired(budget: Budget): boolean;

// Verificar se pode aprovar
export function canApprove(budget: Budget): boolean;

// Verificar se pode editar
export function canEdit(budget: Budget): boolean;
```

---

## 📚 2. BOOKS (Catálogo de Livros)

### 2.1 Enums

```typescript
export enum ProjectCatalogType {
  BOOK = 'L',              // Livro
  EBOOK = 'E',             // E-book
  KINDLE = 'K',            // Kindle
  CD = 'C',                // CD
  DVD = 'D',               // DVD
  PRINTING = 'G',          // Gráfica
  PLATFORM = 'P',          // Plataforma
  SINGLE = 'S',            // Single
  THIRD_PARTY_BOOK = 'X',  // Livro Terceiros
  ART_DESIGN = 'A',        // Arte/Design
  CUSTOM = 'CUSTOM',       // Customizado
}

export enum BookFormat {
  F_140x210 = '140x210mm',
  F_160x230 = '160x230mm',
  F_A4 = 'A4 (210x297mm)',
  CUSTOM = 'Personalizado',
}

export enum InteriorPaper {
  AVENA_80G = 'Avena 80g',
  POLEN_SOFT_80G = 'Pólen Soft 80g',
  POLEN_BOLD_90G = 'Pólen Bold 90g',
  COUCHE_115G = 'Couché 115g',
  COUCHE_150G = 'Couché 150g',
  OFFSET_90G = 'Offset 90g',
  CUSTOM = 'Personalizado',
}

export enum CoverPaper {
  TRILEX_330G = 'Trilex 330g',
  SUPREMO_250G = 'Supremo 250g',
  SUPREMO_350G = 'Supremo 350g',
  COUCHE_250G = 'Couché 250g',
  CUSTOM = 'Personalizado',
}

export enum InteriorColor {
  C_1x1 = '1x1 cor',
  C_2x2 = '2x2 cores',
  C_4x4 = '4x4 cores',
  CUSTOM = 'Personalizado',
}

export enum CoverColor {
  C_4x0 = '4x0 cor',
  C_4x1 = '4x1 cor',
  C_4x4 = '4x4 cores',
  CUSTOM = 'Personalizado',
}

export enum BindingType {
  PAPERBACK = 'Brochura',
  HARDCOVER = 'Capa dura',
  SADDLE_STITCH = 'Grampo canoa',
  SEWN = 'Costura',
  CUSTOM = 'Personalizado',
}

export enum FinishingType {
  MATTE_LAMINATION = 'Laminação Fosca',
  MATTE_LAMINATION_SPOT_UV = 'Laminação Fosca + Verniz com Reserva',
  GLOSS_LAMINATION = 'Laminação Brilho',
  VARNISH = 'Verniz',
  SPOT_VARNISH = 'Verniz com Reserva',
  HOT_STAMPING = 'Hot Stamping',
  CUSTOM = 'Personalizado',
}
```

### 2.2 Book Specifications

```typescript
export interface BookSpecifications {
  format: BookFormat;
  customFormat?: string;
  cover: {
    paper: CoverPaper;
    customPaper?: string;
    color: CoverColor;
    customColor?: string;
    finishing: FinishingType;
    customFinishing?: string;
    hasFlapWings: boolean;
  };
  interior: {
    pageCount: number;
    paper: InteriorPaper;
    customPaper?: string;
    color: InteriorColor;
    customColor?: string;
  };
  binding: BindingType;
  customBinding?: string;
  hasShrinkWrap: boolean;
  notes?: string;
}
```

### 2.3 Book Interface

```typescript
export interface Book {
  id: string;
  clientId: string;
  catalogCode: string; // DDML0456
  catalogMetadata: {
    prefix: 'DDM';
    type: ProjectCatalogType;
    clientNumber: number;
    workNumber: number;
  };
  title: string;
  subtitle?: string;
  author: string;
  isbn?: string;
  specifications: BookSpecifications;
  referenceFiles?: {
    name: string;
    url: string;
    type: 'pdf' | 'mockup' | 'artwork' | 'other';
    uploadedAt: Timestamp;
  }[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### 2.4 Helper Functions

```typescript
// Gerar código do catálogo (DDML0456 ou DDML0456.1)
export function generateCatalogCode(
  type: ProjectCatalogType,
  clientNumber: number,
  workNumber: number,
): string;

// Validar especificações do livro
export function validateBookSpecifications(specs: BookSpecifications): string[];
```

---

## 👥 3. LEADS (Prospecção)

### 3.1 Types

```typescript
export type LeadSource =
  | 'website'
  | 'email'
  | 'phone'
  | 'referral'
  | 'socialmedia'
  | 'coldcall'
  | 'event'
  | 'advertising'
  | 'other';

export type LeadStatus =
  | 'primeiro_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';
```

### 3.2 Lead Interface

```typescript
export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  socialMedia?: SocialMedia;
  referredBy?: string;
  interestArea?: string;
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.3 Social Media Interface

```typescript
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}
```

### 3.4 Lead Form Data

```typescript
export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  value?: number;
  probability?: number;
  socialMedia?: SocialMedia;
  referredBy?: string;
  interestArea?: string;
  notes?: string;
  tags?: string[];
}
```

### 3.5 Lead Filters

```typescript
export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  ownerId?: string[];
  probability?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}
```

### 3.6 Lead Stats

```typescript
export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  conversionRate: number;
  averageValue: number;
  totalValue: number;
}
```

---

## 🔧 4. FIREBASE TYPES

### 4.1 Timestamp

```typescript
import { Timestamp } from 'firebase/firestore';

// USO CORRETO:
createdAt: Timestamp.now()
updatedAt: Timestamp.now()

// CONVERSÃO:
timestamp.toDate()           // → Date
timestamp.toMillis()         // → number
Timestamp.fromDate(date)     // Date → Timestamp
```

---

## 📋 5. COMPONENT PROPS

### 5.1 Budget Components

```typescript
// BudgetsList
interface BudgetsListProps {
  budgets: Budget[];
  leads?: Lead[];
  loading?: boolean;
  onCreate: (data: BudgetFormData) => Promise<void>;
  onUpdate: (id: string, data: Partial<Budget>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

// BudgetModal
interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => Promise<void>;
  budget?: Budget | null;
  leads?: Lead[];
  mode?: 'create' | 'edit';
}

// BudgetCard
interface BudgetCardProps {
  budget: Budget;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

// BudgetItemsList
interface BudgetItemsListProps {
  items: BudgetItem[];
  onRemove?: (index: number) => void;
  onEdit?: (index: number) => void;
  readOnly?: boolean;
  showActions?: boolean;
}

// BudgetSummary
interface BudgetSummaryProps {
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  total: number;
  paymentMethods?: string[];
  validityDays?: number;
  compact?: boolean;
}
```

### 5.2 Lead Components

```typescript
// LeadModal
interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (data: LeadFormData) => Promise<void>;
  loading?: boolean;
}
```

---

## ⚠️ 6. ERROS COMUNS E COMO EVITAR

### ❌ ERRO 1: Usar campos que não existem

```typescript
// ❌ ERRADO - convertidoEm não existe
interface Lead {
  convertidoEm?: Timestamp;
}

// ✅ CORRETO - usar apenas campos documentados
interface Lead {
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### ❌ ERRO 2: Usar 'any' sem necessidade

```typescript
// ❌ ERRADO
catch (error: any) {
  toast.error(error.message);
}

// ✅ CORRETO
catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
  toast.error(errorMessage);
}
```

### ❌ ERRO 3: Esquecer campos obrigatórios

```typescript
// ❌ ERRADO - falta createdAt, updatedAt
const budget: Budget = {
  number: 'v5_1510.1430',
  items: [],
  // ...
};

// ✅ CORRETO - todos os campos obrigatórios
const budget: Budget = {
  number: 'v5_1510.1430',
  items: [],
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  createdBy: user.id,
  // ...
};
```

### ❌ ERRO 4: Confundir Budget com BudgetFormData

```typescript
// ❌ ERRADO - BudgetFormData não tem id, createdAt, etc
const formData: BudgetFormData = {
  id: '123',              // ❌ não existe
  createdAt: Timestamp,   // ❌ não existe
  // ...
};

// ✅ CORRETO - apenas campos do form
const formData: BudgetFormData = {
  leadId: '123',
  items: [],
  paymentMethods: ['PIX'],
  validityDays: 30,
  clientProvidedMaterial: false,
};
```

---

## ✅ 7. CHECKLIST PARA GERAR CÓDIGO

Antes de usar qualquer type, verifique:

- [ ] O campo existe neste documento?
- [ ] O tipo está correto (string, number, Timestamp)?
- [ ] É obrigatório ou opcional (?)?
- [ ] Precisa de import do Firebase (Timestamp)?
- [ ] Está usando a interface correta (Budget vs BudgetFormData)?

---

## 📚 8. IMPORTS CORRETOS

```typescript
// Budgets
import { Budget, BudgetFormData, BudgetItem, BudgetStatus } from '@/lib/types/budgets';

// Books
import { Book, BookSpecifications, ProjectCatalogType } from '@/lib/types/books';

// Leads
import { Lead, LeadFormData, LeadStatus, LeadSource } from '@/lib/types/leads';

// Firebase
import { Timestamp } from 'firebase/firestore';
```

---

## 🎯 9. EXEMPLO COMPLETO DE USO

```typescript
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

import { Budget, BudgetFormData, generateBudgetNumber } from '@/lib/types/budgets';
import { useBudgets } from '@/hooks/comercial/useBudgets';
import { useAuth } from '@/hooks/useAuth';

export default function BudgetExample() {
  const { user } = useAuth();
  const { createBudget } = useBudgets();

  const handleCreate = async () => {
    if (!user?.id) return;

    const formData: BudgetFormData = {
      leadId: 'lead-123',
      projectType: 'L',
      projectData: {
        title: 'Meu Livro',
        author: 'Autor Exemplo',
      },
      items: [
        {
          type: 'editorial_service',
          service: 'REVISION',
          description: 'Revisão completa',
          quantity: 1,
          unitPrice: 500,
        },
      ],
      paymentMethods: ['PIX'],
      validityDays: 30,
      clientProvidedMaterial: false,
    };

    try {
      const budgetId = await createBudget(formData);
      toast.success('Orçamento criado!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar';
      toast.error(message);
    }
  };

  return (
    <button onClick={handleCreate}>
      Criar Orçamento
    </button>
  );
}
```

---

## 📖 10. REFERÊNCIAS

- Arquivo fonte: `src/lib/types/budgets.ts`
- Arquivo fonte: `src/lib/types/books.ts`
- Arquivo fonte: `src/lib/types/leads.ts`
- Documentação: `docs/01-TYPES-COMPLETE.md`
- Auditoria: `docs/Progress/AUDITORIA-TYPES-2025-10-14.md`

---

**Última atualização:** 15 de outubro de 2025  
**Status:** ✅ Validado com código real  
**Versão:** 1.0
