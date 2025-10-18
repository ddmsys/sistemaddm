// ================ TYPES CENTRALIZADOS ================
// Baseado na documentação completa - usar comercial.ts como fonte principal

// Importar types específicos para re-export
import type {
  Address,
  ApprovalTask,
  Budget,
  BudgetCardProps,
  BudgetFormData,
  BudgetItem,
  BudgetModalProps,
  BudgetStatus,
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
  BudgetStatus,
  ClientStatus,
  ClientType,
  LeadSource,
  LeadStatus,
  Priority,
  ProductType,
  ProjectStatus,
};

// Interfaces principais
export type { Budget, Client, Lead, Project };

// Interfaces auxiliares
export type { Address, ApprovalTask, BudgetItem, SocialMedia };

// Form Data
export type { BudgetFormData, ClientFormData, LeadFormData, ProjectFormData };

// Props
export type {
  BudgetCardProps,
  BudgetModalProps,
  ClientModalProps,
  LeadModalProps,
  ProjectCardProps,
  ProjectModalProps,
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

export interface BudgetFilters extends ComercialFilters {
  status?: BudgetStatus[];
  clientId?: string[];
}

export interface ProjectFilters extends ComercialFilters {
  status?: ProjectStatus[];
  clientId?: string[];
  category?: ProductType[];
}

// ================ ALIASES PARA COMPATIBILIDADE ================
export type LeadStage = LeadStatus;

// ========== CENTRAL EXPORTS ==========

// Shared types
export * from "./shared";

// CRM Module exports
export * from "./budgets";
export * from "./clients";
export * from "./leads";
export * from "./projects";

// Other modules exports
export * from "./finance";
export * from "./logistics";
export * from "./marketing";
export * from "./purchases";
