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
} from './comercial';
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
} from './shared';

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

// ========== CENTRAL EXPORTS ==========

// Shared types
export * from './shared';

// CRM Module exports
export * from './clients';
export * from './leads';
export * from './projects';
export * from './quotes';

// Other modules exports
export * from './finance';
export * from './logistics';
export * from './marketing';
export * from './purchases';
