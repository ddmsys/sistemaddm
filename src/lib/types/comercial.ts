// src/lib/types/comercial.ts
import { Timestamp } from "firebase/firestore";

// ========================================
// INTERFACES PRINCIPAIS
// ========================================

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source:
    | "website"
    | "referral"
    | "social-media" // ✅ CORRIGIDO: hífen em vez de underscore
    | "cold-call"
    | "event"
    | "advertising"
    | "other";
  stage:
    | "primeiro-contato" // ✅ CORRIGIDO: hífen em vez de underscore
    | "qualificado"
    | "proposta-enviada"
    | "negociacao"
    | "fechado-ganho"
    | "fechado-perdido";
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Quote {
  id?: string;
  leadId: string;
  clientId?: string;
  number: string; // Auto-gerado pela Cloud Function
  title: string;
  description?: string;
  items: QuoteItem[];
  subtotal: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  status: "draft" | "sent" | "signed" | "rejected" | "expired";
  validUntil: Timestamp;
  createdBy: string;
  signedAt?: Timestamp;
  signedBy?: string;
  pdfUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface Project {
  id?: string;
  number: string; // Auto-gerado (PRJ001, PRJ002...)
  title: string;
  description?: string;
  clientId: string;
  quoteId?: string;
  category: "book" | "magazine" | "catalog" | "brochure" | "other";
  status:
    | "open"
    | "design"
    | "review"
    | "production"
    | "shipped"
    | "done"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  budget?: number;
  dueDate?: Timestamp; // ✅ CORRIGIDO: Timestamp direto
  assignedTo?: string;
  assignedToName?: string;
  attachments?: ProjectAttachment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Timestamp;
}

export interface Client {
  id?: string;
  number?: string; // CLT-001, CLT-002...
  type: "individual" | "company";

  // ✅ PESSOA FÍSICA
  name?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;

  // ✅ PESSOA JURÍDICA
  companyName?: string; // ✅ ESTE É O CORRETO (não company)
  cnpj?: string;
  stateRegistration?: string;
  contactPerson?: string;

  // ✅ COMUM
  email?: string;
  phone: string; // Obrigatório

  // ✅ REDES SOCIAIS
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };

  // ✅ ENDEREÇO
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };

  status: "active" | "inactive" | "blocked";
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
}

// ========================================
// INTERFACES DE PROPS - MODAIS
// ========================================

export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null; // ✅ ADICIONADO: permite null
  onSave: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  loading?: boolean;
}

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: Quote | null; // ✅ ADICIONADO: permite null
  leadId?: string;
  onSave: (
    quote: Omit<Quote, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  loading?: boolean;
}

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null; // ✅ ADICIONADO: permite null
  clientId?: string;
  quoteId?: string;
  onSave: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  loading?: boolean;
}

export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null; // ✅ ADICIONADO: permite null
  onSave: (
    client: Omit<Client, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  loading?: boolean;
}

// ========================================
// INTERFACES DE PROPS - CHARTS
// ========================================

export interface FunnelChartProps {
  data?: FunnelStage[]; // ✅ OPCIONAL e tipado
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
  loading?: boolean; // ✅ ADICIONADO
  className?: string;
  onStageClick?: (stage: string) => void;
}

export interface FunnelStage {
  stage: string;
  label: string;
  count: number;
  value: number;
  color: string;
  conversionRate?: number; // ✅ ADICIONADO
}

export interface RevenueChartProps {
  data?: RevenueDataPoint[]; // ✅ OPCIONAL e tipado
  height?: number;
  showGrid?: boolean;
  showGoals?: boolean; // ✅ ADICIONADO
  className?: string;
}

export interface RevenueDataPoint {
  date: string; // ✅ CORRIGIDO: mais simples
  value: number;
  goal?: number; // ✅ ADICIONADO
}

// ========================================
// INTERFACES DE PROPS - CARDS
// ========================================

export interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (lead: Lead) => void;
  className?: string;
}

export interface QuoteCardProps {
  quote: Quote;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  onSend?: (quote: Quote) => void;
  onDuplicate?: (quote: Quote) => void;
  className?: string;
}

export interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
  onStatusChange?: (projectId: string, status: Project["status"]) => void;
  className?: string;
}

export interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
  onView?: (client: Client) => void;
  className?: string;
}

// ========================================
// INTERFACES DE PROPS - TABELAS
// ========================================

export interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onStageChange?: (leadId: string, stage: Lead["stage"]) => void;
  pagination?: PaginationProps;
  filters?: LeadFilters;
  onFiltersChange?: (filters: LeadFilters) => void;
}

export interface QuotesTableProps {
  quotes: Quote[];
  loading?: boolean;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  onSend?: (quote: Quote) => void;
  onDuplicate?: (quote: Quote) => void;
  onStatusChange?: (quoteId: string, status: Quote["status"]) => void; // ✅ ADICIONADO
  pagination?: PaginationProps;
  filters?: QuoteFilters;
  onFiltersChange?: (filters: QuoteFilters) => void;
}

export interface ProjectsTableProps {
  projects: Project[];
  loading?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
  onStatusChange?: (projectId: string, status: Project["status"]) => void;
  pagination?: PaginationProps;
  filters?: ProjectFilters;
  onFiltersChange?: (filters: ProjectFilters) => void;
}

// ========================================
// INTERFACES DE FILTROS
// ========================================

export interface LeadFilters {
  stage?: Lead["stage"][];
  source?: Lead["source"][];
  ownerId?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    // ✅ ADICIONADO
    min: number;
    max: number;
  };
  search?: string;
}

export interface QuoteFilters {
  status?: Quote["status"][];
  clientId?: string[];
  createdBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface ProjectFilters {
  status?: Project["status"][];
  category?: Project["category"][];
  priority?: Project["priority"][];
  assignedTo?: string[];
  clientId?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface ClientFilters {
  status?: Client["status"][];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// ========================================
// INTERFACE DE PAGINAÇÃO
// ========================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// ========================================
// INTERFACES DE ESTATÍSTICAS
// ========================================

export interface LeadStats {
  total: number;
  byStage: Record<Lead["stage"], number>;
  bySource: Record<Lead["source"], number>;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  averageDaysToClose: number;
}

export interface QuoteStats {
  total: number;
  byStatus: Record<Quote["status"], number>;
  totalValue: number;
  signedValue: number;
  conversionRate: number;
  averageValue: number;
  averageDaysToSign: number;
}

export interface ProjectStats {
  total: number;
  byStatus: Record<Project["status"], number>;
  byCategory: Record<Project["category"], number>;
  byPriority: Record<Project["priority"], number>;
  onTime: number;
  delayed: number;
  averageDaysToComplete: number;
}

// ========================================
// INTERFACES DE DASHBOARD
// ========================================

export interface CommercialMetrics {
  leads: LeadStats;
  quotes: QuoteStats;
  projects: ProjectStats;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeDeals: number;
  criticalProjects: Project[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type:
    | "lead_created"
    | "quote_sent"
    | "project_approved"
    | "payment_received"
    | "meeting_scheduled";
  title: string;
  description: string;
  entityId: string;
  entityType: "lead" | "quote" | "project" | "client";
  userId: string;
  userName: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}
