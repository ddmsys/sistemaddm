import { Timestamp } from 'firebase/firestore';

// ================ ENUMS E TYPES BÁSICOS ================

export type ProductType =
  | 'L' // Livro
  | 'E' // E-book
  | 'K' // kindle
  | 'C' // CD
  | 'D' // DVD
  | 'G' // Gráfica
  | 'P' // PlatafDigital
  | 'S' // Single
  | 'X' // LivroTerc
  | 'A'; // Arte

export type LeadSource =
  | 'website'
  | 'socialmedia' // alterado de "social-media" para "socialmedia"
  | 'referral'
  | 'advertising'
  | 'email'
  | 'phone'
  | 'coldcall'
  | 'event'
  | 'other';

export type LeadStatus =
  | 'primeiro_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired';

export type ProjectStatus =
  | 'open'
  | 'design'
  | 'review'
  | 'production'
  | 'shipped'
  | 'done'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ClientType = 'individual' | 'company';

// ✅ Corrigido - usar valores em português para compatibilidade
export type ClientStatus = 'ativo' | 'inativo' | 'bloqueado';

// ================ INTERFACES AUXILIARES ================

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

export interface ApprovalTask {
  id: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  dueDate: Timestamp;
  assignedTo?: string;
  completedAt?: Timestamp;
  notes?: string;
}

export interface QuoteItem {
  id?: string; // Opcional para compatibilidade
  description: string;
  kind: 'etapa' | 'impressao';
  specifications?: string;
  quantity: number;
  unitPrice?: number; // Opcional para compatibilidade
  totalPrice: number;
  category?: string;
  notes?: string;
}

// ================ INTERFACES PRINCIPAIS ================

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  indication?: string;
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  quoteId?: string;
  priority?: Priority;
  expectedValue?: number;
  expectedCloseDate?: Timestamp;
  lastContact?: Timestamp;
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Client {
  id?: string;
  clientNumber?: number;
  type: ClientType;

  // ✅ Campos obrigatórios básicos
  name: string; // Nome sempre obrigatório
  email: string; // Email sempre obrigatório
  phone: string; // Telefone sempre obrigatório
  status: ClientStatus;

  // ✅ Pessoa Física
  cpf?: string;
  rg?: string;
  birthDate?: string;

  // ✅ Pessoa Jurídica
  company?: string; // Razão social
  companyName?: string; // Alias para compatibilidade
  cnpj?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;

  // ✅ Campos adicionais
  source?: string;
  notes?: string;
  socialMedia?: SocialMedia;
  address?: Address;
  firebaseAuthUid?: string;

  // ✅ Timestamps obrigatórios
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface Quote {
  id?: string;
  number: string;
  leadId?: string;
  clientId?: string;
  clientName: string;

  // ✅ Campos do projeto
  title?: string; // Para compatibilidade
  projectTitle: string;
  quoteType: 'producao' | 'impressao' | 'misto';

  // ✅ Datas e validade
  issueDate: string; // Alterado para string para compatibilidade
  validityDays: number;
  expiryDate?: string | Timestamp; // Alterado para opcional e aceitar string também
  validUntil?: Timestamp; // Alias para compatibilidade

  // ✅ Status e aprovação
  status: QuoteStatus;
  signedAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp
  signedBy?: string;
  refusedAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp
  refusedReason?: string;
  sentAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp
  viewedAt?: Date | Timestamp; // Compatibilidade para Date e Timestamp

  // ✅ Itens e totais
  items: QuoteItem[];
  totals: {
    subtotal: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    freight: number;
    taxes: number;
    total: number;
  };

  // ✅ Campos de compatibilidade
  grandTotal?: number; // Alias para totals.total
  subtotal?: number; // Alias para totals.subtotal
  taxes?: number; // Alias para totals.taxes
  discount?: number; // Alias para totals.discount

  // ✅ Campos adicionais
  productionTime?: string;
  terms?: string;
  notes?: string;
  pdfUrl?: string;

  // ✅ Metadados
  ownerId?: string; // Opcional para compatibilidade
  ownerName?: string; // Opcional para compatibilidade
  createdBy?: string; // Para compatibilidade
  createdAt?: Timestamp | Date; // Opcional e aceita Date ou Timestamp
  updatedAt?: Timestamp | Date; // Opcional e aceita Date ou Timestamp
}

export interface Project {
  id?: string;
  catalogCode?: string;
  clientId: string;
  clientName: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProductType;
  status: ProjectStatus;
  priority: Priority;
  dueDate: Timestamp;
  budget: number;
  assignedTo?: string;
  assignedToName?: string;
  proofsCount?: number;
  clientApprovalTasks?: ApprovalTask[];
  notes?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ================ FORM DATA INTERFACES ================

export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  value?: number;
  probability?: number;
  notes?: string;
  tags?: string[];
}

export interface ClientFormData {
  type: ClientType;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  company?: string;
  companyName?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;
  status: ClientStatus;
  source?: string;
  notes?: string;
  socialMedia?: SocialMedia;
  address?: Address;
}

export interface QuoteFormData {
  leadId: string;
  clientId?: string;
  projectTitle: string;
  quoteType: 'producao' | 'impressao' | 'misto';
  validityDays: number;
  items: Omit<QuoteItem, 'id' | 'totalPrice'>[];
  discount: number;
  discountType: 'percentage' | 'fixed';
  productionTime?: string;
  notes?: string;
}

export interface ProjectFormData {
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProductType;
  priority: Priority;
  dueDate: string;
  budget: number;
  assignedTo?: string;
  notes?: string;
}

// ================ PROPS INTERFACES ================

export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (data: LeadFormData) => Promise<void>;
  loading?: boolean;
}

export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (data: Client) => Promise<void>;
  loading?: boolean;
}

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: Quote | null;
  leadId?: string;
}

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  quoteId?: string;
}

// ================ CARD PROPS ================

export interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onView?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export interface QuoteCardProps {
  quote: Quote;
  onEdit?: (quote: Quote) => void;
  onView?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
  onSign?: (id: string) => void;
}

// ================ FILTERS & STATS ================

export interface ComercialFilters {
  status?: string[];
  priority?: Priority[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  assignedTo?: string[];
  search?: string;
}

export interface LeadFilters extends ComercialFilters {
  source?: LeadSource[];
  probability?: {
    min?: number;
    max?: number;
  };
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  conversionRate: number;
  averageValue: number;
  totalValue: number;
}
