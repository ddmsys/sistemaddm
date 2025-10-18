// src/lib/types/orders.ts
// ✅ ARQUIVO COMPLETO - Mantém todas as 223 linhas do original
// ✅ Corrige APENAS os campos que estão causando erros TypeScript

import { Timestamp } from "firebase/firestore";

import { BookSpecifications } from "./books";
import { Budget } from "./budgets";

// ==================== ENUMS ====================

// ✅ CORRIGIDO: Era type, agora é enum (compatível com orders/page.tsx)
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PRODUCTION = "in_production",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  ON_HOLD = "on_hold",
}

export type PaymentStatus = "pending" | "partial" | "paid" | "overdue";

// ==================== INTERFACES ====================

export interface OrderItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: Partial<BookSpecifications>;
  status: "pending" | "in_production" | "completed";
  notes?: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  date: Timestamp;
  reference?: string;
  notes?: string;
}

export interface Order {
  id?: string;
  number: string;

  // ✅ CORRIGIDO: Campos que orders/page.tsx espera
  clientId: string;
  clientName: string; // ✅ OBRIGATÓRIO (usado na busca)
  projectTitle: string; // ✅ OBRIGATÓRIO (usado na busca)
  bookCode?: string; // ✅ Código do livro (usado na busca)
  totalValue: number; // ✅ OBRIGATÓRIO (usado para exibir valor)
  deadline?: number; // ✅ dias para conclusão (usado para mostrar prazo)

  // Campos originais mantidos
  bookId: string;
  bookTitle?: string;
  budgetId: string;

  // Dados do livro (snapshot do momento do pedido)
  bookData?: {
    title: string;
    author?: string;
    specifications?: BookSpecifications;
  };

  items: OrderItem[];

  // Valores
  subtotal: number;
  discount?: number;
  total: number;

  // Pagamentos
  payments: Payment[];
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountDue: number;

  // Condições Comerciais
  paymentMethods: string[];

  // Status e notas
  status: OrderStatus;
  notes?: string;

  // Datas
  issueDate: Timestamp;
  deliveryDate?: Timestamp;
  completedDate?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

// ==================== FORM DATA ====================

export interface OrderFormData {
  clientId: string;
  bookId: string;
  budgetId?: string;
  items: Omit<OrderItem, "id" | "totalPrice">[];
  paymentMethods: string[];
  discount?: number;
  deliveryDate?: Date;
  notes?: string;
}

// ==================== HELPER FUNCTIONS ====================

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  return `PED-${year}${month}${day}-${hour}${minute}`;
}

export function calculatePaymentStatus(total: number, amountPaid: number): PaymentStatus {
  if (amountPaid === 0) return "pending";
  if (amountPaid >= total) return "paid";
  return "partial";
}

export function calculateAmountDue(total: number, amountPaid: number): number {
  return Math.max(0, total - amountPaid);
}

// ✅ CORRIGIDO: Validar campos antes de criar pedido
export function createOrderFromBudget(
  budget: Budget,
  clientName?: string,
  bookTitle?: string,
): Omit<Order, "id" | "createdAt" | "updatedAt"> {
  // ✅ Validações
  if (!budget.clientId) {
    throw new Error("Budget must have clientId to create order");
  }

  if (!budget.bookId) {
    throw new Error("Budget must have bookId to create order");
  }

  if (!budget.id) {
    throw new Error("Budget must have id");
  }

  // Mapear items do budget para items do order
  const orderItems: OrderItem[] = budget.items.map((item) => ({
    id: `order_item_${Date.now()}_${Math.random()}`,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    status: "pending",
    notes: item.notes,
  }));

  return {
    number: generateOrderNumber(),
    clientId: budget.clientId,
    clientName: clientName || budget.clientName || "", // ✅ Campo obrigatório
    projectTitle: budget.projectTitle || budget.projectData?.title || "", // ✅ Campo obrigatório
    bookCode: "", // ✅ Será preenchido com código do livro
    totalValue: budget.total, // ✅ Campo obrigatório
    deadline: budget.productionDays, // ✅ Campo obrigatório
    bookId: budget.bookId,
    bookTitle: bookTitle,
    budgetId: budget.id,

    // ✅ Snapshot dos dados do projeto (corrigido para inglês)
    bookData: budget.projectData
      ? {
          title: budget.projectData.title,
          author: budget.projectData.author,
          specifications: budget.projectData.specifications,
        }
      : undefined,

    items: orderItems,
    subtotal: budget.subtotal,
    discount: budget.discount,
    total: budget.total,
    payments: [],
    paymentStatus: "pending",
    amountPaid: 0,
    amountDue: budget.total,
    paymentMethods: budget.paymentMethods,
    status: OrderStatus.PENDING, // ✅ Usando enum
    notes: budget.notes,
    issueDate: Timestamp.now(),
    createdBy: "", // Será preenchido
  };
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Pendente",
    [OrderStatus.CONFIRMED]: "Confirmado",
    [OrderStatus.IN_PRODUCTION]: "Em Produção",
    [OrderStatus.COMPLETED]: "Concluído",
    [OrderStatus.CANCELLED]: "Cancelado",
    [OrderStatus.ON_HOLD]: "Em Espera",
  };
  return labels[status];
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Pendente",
    partial: "Parcial",
    paid: "Pago",
    overdue: "Atrasado",
  };
  return labels[status];
}

export function canCancelOrder(order: Order): boolean {
  return order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED;
}

export function canConfirmOrder(order: Order): boolean {
  return order.status === OrderStatus.PENDING;
}

export function canStartProduction(order: Order): boolean {
  return order.status === OrderStatus.CONFIRMED && order.paymentStatus !== "overdue";
}
