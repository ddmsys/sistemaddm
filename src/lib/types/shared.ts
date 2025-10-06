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
