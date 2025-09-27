// src/lib/types/projects.ts
import { Timestamp } from "firebase/firestore";

export interface Project {
  id?: string;
  catalogCode: string; // Auto-gerado (DDM2024001, DDM2024002...)
  clientId: string;
  clientName: string;
  quoteId?: string;
  title: string;
  description?: string;
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
  dueDate: Timestamp;
  budget: number;
  assignedTo?: string[];
  proofsCount: number;
  clientApprovalTasks: ApprovalTask[];
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ApprovalTask {
  id: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  dueDate: Timestamp;
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

export interface ProjectFilters {
  status?: Project["status"][];
  priority?: Project["priority"][];
  category?: Project["category"][];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}
