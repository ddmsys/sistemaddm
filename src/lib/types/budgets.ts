// src/lib/types/budgets.ts

// Tipos para gerenciamento de orçamentos

import { Timestamp } from 'firebase/firestore';

import { BookSpecifications, ProjectCatalogType } from './books';

// ==================== ENUMS ====================

export enum EditorialServiceType {
  REVISION = 'Revisão',
  PREPARATION = 'Preparação',
  COPYEDIT = 'Copidesque',
  GRAPHIC_DESIGN = 'Criação do projeto gráfico',
  LAYOUT = 'Diagramação',
  COVER = 'Capa',
  EBOOK_FORMAT = 'Formatação eBook',
  KINDLE_CONVERSION = 'Conversão Kindle',
  ISBN = 'ISBN',
  CATALOG_CARD = 'Ficha Catalográfica',
  PRINTING = 'Impressão',
  SOCIAL_MEDIA = 'Divulgação Rede Sociais',
  MARKETING_CAMPAIGN = 'Campanha de Marketing',
  CUSTOM = 'Personalizado',
}

export enum ExtraType {
  PROOFS = 'Provas',
  SHIPPING = 'Frete',
  CUSTOM = 'Personalizado',
}

export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

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
  type: 'editorial_service';
  service: EditorialServiceType;
  customService?: string;
  estimatedDays?: number;
}

export interface PrintingItem extends BudgetItemBase {
  type: 'printing';
  printRun: number; // tiragem
  useBookSpecs: boolean;
  customSpecs?: Partial<BookSpecifications>;
  productionDays?: number;
}

export interface ExtraItem extends BudgetItemBase {
  type: 'extra';
  extraType: ExtraType;
  customExtra?: string;
}

export type BudgetItem = EditorialServiceItem | PrintingItem | ExtraItem;

// ==================== PROJECT DATA (TEMPORARY) ====================

export interface ProjectData {
  title: string;
  subtitle?: string;
  author?: string;
  specifications?: BookSpecifications;
}

// ==================== BUDGET ====================

export interface Budget {
  id?: string;
  number: string; // v5_1310.1435
  version: number;

  // ✅ RELACIONAMENTOS OPCIONAIS (flexível para Lead ou Cliente)
  leadId?: string; // Lead que originou (orçamento novo)
  clientId?: string; // Cliente existente (reimpressão)
  bookId?: string; // Livro existente (reimpressão)

  // ✅ TIPO DO PROJETO
  projectType?: ProjectCatalogType; // L, E, K, C, etc

  // ✅ DADOS TEMPORÁRIOS DO PROJETO (se não tiver bookId)
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
  productionDays?: number; // manual
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
}

// ==================== FORM DATA ====================

export interface BudgetFormData {
  // ✅ Origem (OU lead OU cliente)
  leadId?: string;
  clientId?: string;
  bookId?: string;

  // ✅ Tipo e dados do projeto
  projectType?: ProjectCatalogType;
  projectData?: ProjectData;

  // Itens
  items: Omit<BudgetItem, 'id' | 'totalPrice'>[];

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

// ==================== HELPER FUNCTIONS ====================

export function generateBudgetNumber(): string {
  const now = new Date();

  // Ano: 2025 → v5
  const year = now.getFullYear();
  const versionYear = `v${year - 2020}`;

  // Data: DDMM
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const datePart = `${day}${month}`;

  // Hora: HHMM
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const timePart = `${hour}${minute}`;

  return `${versionYear}_${datePart}.${timePart}`;
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

export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function validateBudget(data: BudgetFormData): string[] {
  const errors: string[] = [];

  // ✅ Precisa ter OU lead OU cliente
  if (!data.leadId && !data.clientId) {
    errors.push('Budget needs leadId or clientId');
  }

  // ✅ Se não tem bookId, precisa de projectData
  if (!data.bookId && !data.projectData?.title) {
    errors.push('Need bookId or projectData.titulo');
  }

  // Validar itens
  if (!data.items || data.items.length === 0) {
    errors.push('At least one item is required');
  }

  // Validar condições
  if (!data.paymentMethods || data.paymentMethods.length === 0) {
    errors.push('At least one payment method is required');
  }

  if (!data.validityDays || data.validityDays <= 0) {
    errors.push('Validity days must be greater than 0');
  }

  return errors;
}

export function getBudgetStatusLabel(status: BudgetStatus): string {
  const labels: Record<BudgetStatus, string> = {
    draft: 'Rascunho',
    sent: 'Enviado',
    approved: 'Aprovado',
    rejected: 'Recusado',
    expired: 'Expirado',
  };
  return labels[status];
}

export function getEditorialServiceLabel(service: EditorialServiceType): string {
  return service; // Já está em português no enum
}

export function getExtraTypeLabel(extra: ExtraType): string {
  return extra; // Já está em português no enum
}

export function isExpired(budget: Budget): boolean {
  return budget.status === 'sent' && budget.expiryDate.toMillis() < Date.now();
}

export function canApprove(budget: Budget): boolean {
  return budget.status === 'sent' && !isExpired(budget);
}

export function canEdit(budget: Budget): boolean {
  return budget.status === 'draft';
}
