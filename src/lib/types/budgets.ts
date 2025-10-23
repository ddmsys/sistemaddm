// src/lib/types/budgets.ts
// ✅ SEU ARQUIVO ORIGINAL + campos adicionais + calculateItemTotal

// Tipos para gerenciamento de orçamentos

import { Timestamp } from "firebase/firestore";

import { BookSpecifications, ProjectCatalogType } from "./books";

// ==================== ENUMS ====================

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

// ✅ ADICIONADO: BudgetStatus enum para compatibilidade
export enum BudgetStatusEnum {
  DRAFT = "draft",
  SENT = "sent",
  APPROVED = "approved", // BookCard usa este status
  REJECTED = "rejected",
  EXPIRED = "expired",
}

// ==================== BUDGET ITEMS ====================

export interface BudgetItemBase {
  id: string;
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
  printRun: number;
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

// ==================== BUDGET INTERFACE ====================

export interface Budget {
  id?: string;
  number: string; // v5_1310.1435
  version: number;

  // Relacionamentos
  leadId?: string;
  clientId?: string;
  bookId?: string;

  // ✅ ADICIONADO: Campos que BookCard e CommercialDashboard usam
  clientName?: string; // BookCard.tsx usa este campo
  projectTitle?: string; // BookCard.tsx usa este campo
  description?: string; // BookCard.tsx usa este campo

  // Tipo do projeto
  projectType?: ProjectCatalogType;

  // Dados do projeto (se não tiver bookId)
  projectData?: {
    title: string;
    subtitle?: string;
    author?: string;
    pages?: number;
    specifications?: BookSpecifications;
  };

  // Itens
  items: BudgetItem[];

  // Valores
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  total: number;

  // ✅ ADICIONADO: Compatibilidade com versão antiga (CommercialDashboard usa)
  totals?: {
    total: number; // CommercialDashboard.tsx usa este campo
    discount?: number; // BookCard.tsx usa este campo
  };
  grandTotal?: number; // BookCard.tsx usa este campo

  // Condições Comerciais
  paymentMethods: string[];
  validityDays: number;
  validUntil?: Timestamp; // ✅ ADICIONADO: BookCard.tsx usa este campo (cálculo expiração)
  productionDays?: number;
  clientProvidedMaterial: boolean;
  materialDescription?: string;
  notes?: string;

  // Status
  status: BudgetStatus;

  // ✅ ADICIONADO: Datas e tracking (BookCard usa para mostrar histórico)
  issueDate: Timestamp;
  expiryDate: Timestamp;
  approvalDate?: Timestamp;
  sentAt?: Timestamp; // BookCard.tsx usa este campo
  viewedAt?: Timestamp; // BookCard.tsx usa este campo

  // ✅ ADICIONADO: Arquivos e conversão (BookCard usa)
  pdfUrl?: string; // BookCard.tsx usa este campo (botão download)
  convertedToProjectId?: string; // BookCard.tsx usa este campo

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface BudgetFormData {
  projectTitle: string;
  projectType?: ProjectCatalogType;
  leadId?: string;
  clientId?: string;
  items: Omit<BudgetItem, "id" | "totalPrice">[];
  validityDays: number;
  paymentMethods: string[];
  notes?: string;
  clientProvidedMaterial: boolean;
  materialDescription?: string;
  // ✅ ADICIONADO: Campos faltantes
  bookId?: string;
  projectData?: {
    title: string;
    subtitle?: string;
    author?: string;
    pages?: number;
    specifications?: any;
  };
  discount?: number;
  discountPercentage?: number;
  productionDays?: number;
}

// ==================== HELPER FUNCTIONS ====================

export function generateBudgetNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const versionYear = `v${year - 2020}`;

  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  return `${versionYear}_${day}${month}.${hour}${minute}`;
}

export function calculateSubtotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateTotal(
  subtotal: number,
  discount?: number,
  discountPercentage?: number,
): number {
  let total = subtotal;

  if (discountPercentage) {
    total -= (subtotal * discountPercentage) / 100;
  }

  if (discount) {
    total -= discount;
  }

  return Math.max(0, total);
}

// ✅ ADICIONADO: Função que estava faltando
export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

// ✅ ADICIONADO: Função que estava faltando
export function canApprove(budget: Budget): boolean {
  return budget.status === "sent" && budget.items.length > 0;
}

export function validateBudget(budget: Partial<Budget>): string[] {
  const errors: string[] = [];

  if (!budget.items || budget.items.length === 0) {
    errors.push("Budget must have at least one item");
  }

  if (!budget.paymentMethods || budget.paymentMethods.length === 0) {
    errors.push("Budget must specify payment methods");
  }

  if (budget.validityDays && budget.validityDays < 1) {
    errors.push("Validity days must be at least 1");
  }

  if (
    budget.discountPercentage &&
    (budget.discountPercentage < 0 || budget.discountPercentage > 100)
  ) {
    errors.push("Discount percentage must be between 0 and 100");
  }

  return errors;
}

export function getBudgetStatusLabel(status: BudgetStatus): string {
  const labels: Record<BudgetStatus, string> = {
    draft: "Rascunho",
    sent: "Enviado",
    approved: "Aprovado",
    rejected: "Rejeitado",
    expired: "Expirado",
  };
  return labels[status];
}
