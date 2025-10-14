import { Timestamp } from 'firebase/firestore';

// ========== ENUMS ==========

export type UserRole =
  | 'admin'
  | 'comercial'
  | 'producao'
  | 'financeiro'
  | 'compras'
  | 'logistica'
  | 'marketing'
  | 'cliente';

// ========== BASE INTERFACES ==========

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ========== USER MANAGEMENT ==========

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Timestamp;
  permissions: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Timestamp;
}

// ========== CLIENT MANAGEMENT ==========

export interface Client extends BaseEntity {
  clientNumber: string; // AUTO: CLI-2025-001
  name: string;
  email: string;
  phone?: string;
  document?: string; // CPF/CNPJ
  address?: Address;
  companyName?: string;
  contactPerson?: string;
  isActive: boolean;
  totalProjects: number;
  totalRevenue: number;
  lastProjectDate?: Timestamp;
  tags: string[];
  notes?: string;
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
  status: 'todo' | 'inProgress' | 'review' | 'done';
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

// ========== NOTIFICATIONS ==========

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'project' | 'financial' | 'marketing';
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: Timestamp;
}

// ========== AUDIT LOG ==========

export interface AuditLog extends BaseEntity {
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
