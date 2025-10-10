// src/lib/types/projects.ts
import { Timestamp } from 'firebase/firestore';

// ================ INTERFACES PRINCIPAIS ================
export interface Project {
  // Identificação
  id?: string;
  catalogCode?: string; // Gerado pela Cloud Function

  // Relacionamentos OBRIGATÓRIOS
  clientId: string;
  clientName?: string;
  quoteId?: string;

  // Dados básicos OBRIGATÓRIOS
  title: string;
  description?: string;
  product: ProductType; // Era product?, agora OBRIGATÓRIO
  status: ProjectStatus; // Era status?, agora OBRIGATÓRIO
  priority: ProjectPriority; // Era priority?, agora OBRIGATÓRIO

  // Datas OBRIGATÓRIAS (conforme documentação DDM)
  startDate: Timestamp; // Era opcional, agora OBRIGATÓRIO
  dueDate?: Timestamp | Date;
  completionDate?: Timestamp;

  // Campos OBRIGATÓRIOS para gestão
  progress: number; // Era opcional, agora OBRIGATÓRIO (0-100)
  teamMembers: string[]; // Era opcional, agora OBRIGATÓRIO (array de User IDs)
  projectManager: string; // Era opcional, agora OBRIGATÓRIO (User ID)
  actualCost: number; // Era opcional, agora OBRIGATÓRIO

  // Arrays OBRIGATÓRIOS (podem estar vazios)
  files: ProjectFile[]; // Era opcional, agora OBRIGATÓRIO
  tasks: ProjectTask[]; // Era opcional, agora OBRIGATÓRIO
  timeline: ProjectTimeline[]; // Era opcional, agora OBRIGATÓRIO

  // Campos OBRIGATÓRIOS de gestão
  proofsCount: number; // Era opcional, agora OBRIGATÓRIO

  // Campos opcionais mantidos
  specifications?: ProjectSpecifications;
  invoiceId?: string;
  budget?: number;
  assignedTo?: string;
  clientApprovalTasks?: ApprovalTask[];
  tags?: string[];
  notes?: string;
  createdBy?: string;

  // Timestamps OBRIGATÓRIOS
  createdAt: Timestamp | Date; // Era opcional, agora OBRIGATÓRIO
  updatedAt: Timestamp | Date; // Era opcional, agora OBRIGATÓRIO
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Timestamp;
  category: 'brief' | 'proof' | 'final' | 'reference' | 'other';
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate?: Timestamp;
  completedDate?: Timestamp;
  dependencies: string[]; // Task IDs
  estimatedHours: number;
  actualHours: number;
}

export interface ProjectTimeline {
  id: string;
  event: string;
  description?: string;
  date: Timestamp;
  userId: string;
  userName: string;
  type: 'milestone' | 'update' | 'issue' | 'approval';
}

export interface ProjectSpecifications {
  format?: string;
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  colors?: string;
  finishing?: string[];
  specialRequirements?: string;
}

// ================ ENUMS E TYPES ================
export type ProjectStatus =
  | 'open'
  | 'design'
  | 'review'
  | 'production'
  | 'clientApproval'
  | 'approved'
  | 'printing'
  | 'delivering'
  | 'shipped'
  | 'done'
  | 'cancelled';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

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

export interface ApprovalTask {
  id: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  dueDate?: Timestamp;
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  comments?: string;
}

// ================ INTERFACES DE FORM E PROPS ================
export interface ProjectFormData {
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  product: ProductType; // Mudança: era category
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string | Date; // Para forms HTML
  dueDate?: string | Date;
  budget?: number;
  projectManager: string; // OBRIGATÓRIO
  assignedTo?: string;
  notes?: string;
}

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  clientId?: string;
  quoteId?: string;
  onSave: (project: Project) => Promise<void>;
  loading?: boolean;
}

export interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
  className?: string;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  product?: ProductType[];
  assignedTo?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  search?: string;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

// ================ INTERFACES AUXILIARES ================
export interface Client {
  id: string;
  name: string;
  email?: string;
  status: 'active' | 'inactive' | 'blocked';
}

export interface ProjectFormData {
  // Relacionamentos
  clientId: string;
  clientName?: string;
  quoteId?: string;

  // Dados básicos OBRIGATÓRIOS
  title: string;
  description?: string;
  product: ProductType; // era 'category' em alguns lugares
  status?: ProjectStatus;
  priority?: ProjectPriority;

  // Datas (formato HTML para forms)
  startDate?: string | Date;
  dueDate?: string | Date; // era 'due_date' em alguns lugares

  // Campos de gestão
  projectManager: string; // OBRIGATÓRIO
  assignedTo?: string;
  budget?: number;
  notes?: string;

  // NOVOS CAMPOS para suportar o ProjectModal atual
  specifications?: ProjectSpecifications;
}

// ================ ESPECIFICAÇÕES COMPLETAS ================
export interface ProjectSpecifications {
  // Formato e estrutura
  format?: string; // 'A4', 'A5', 'Custom'
  orientation?: 'portrait' | 'landscape';
  pages?: number;

  // Produção física
  copies?: number;
  paperType?: string; // 'Offset 90g', 'Couchê 115g', etc.
  binding?: string; // 'Espiral', 'Lombada quadrada', 'Brochura'
  colors?: string; // 'CMYK', 'PB', '1+1', '4+4'

  // Acabamentos
  finishing?: string[]; // ['Laminação', 'Verniz UV', 'Hot Stamping']
  lamination?: string; // 'Fosca', 'Brilho', 'Soft Touch'

  // Requisitos especiais
  specialRequirements?: string;
  proofing?: boolean; // Se precisa de prova
  expedited?: boolean; // Se é urgente

  // Embalagem e entrega
  packaging?: string; // 'Caixa', 'Embrulho', 'Padrão'
  delivery?: string; // 'Retirada', 'Transportadora', 'Correios'
}
