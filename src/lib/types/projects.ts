// src/lib/types/projects.ts
import { Timestamp } from "firebase/firestore";

export interface Project {
  id?: string;
  catalogCode?: string; // Ex: gerado pela Cloud Function
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate?: Timestamp | Date;
  budget?: number;
  assignedTo?: string;
  proofsCount: number;
  clientApprovalTasks?: ApprovalTask[];
  tags?: string[];
  notes?: string;
  createdBy?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export type ProjectStatus =
  | "open"
  | "design"
  | "review"
  | "production"
  | "shipped"
  | "done"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";
export type ProjectCategory =
  | "book"
  | "magazine"
  | "catalog"
  | "brochure"
  | "other";

export interface ApprovalTask {
  id: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  dueDate?: Timestamp;
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  comments?: string;
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

export interface ProjectFormData {
  clientId: string;
  clientName?: string;
  quoteId?: string;
  title: string;
  description?: string;
  category: ProjectCategory;
  status?: ProjectStatus;
  priority: ProjectPriority;
  dueDate?: string | Date;
  budget?: number;
  assignedTo?: string;
  notes?: string;
}
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  category?: ProjectCategory[];
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
export type ProductType =
  | "L" // Livro
  | "E" // E-book
  | "K" // kindle
  | "C" // CD
  | "D" // DVD
  | "G" // Gráfica
  | "P" // PlatafDigital
  | "S" // Single
  | "X" // LivroTerc
  | "A"; // Arte
