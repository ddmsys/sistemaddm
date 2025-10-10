import { Timestamp } from 'firebase/firestore';

// ========== ENUMS ==========

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closedWon'
  | 'closedLost';

export type LeadSource =
  | 'website'
  | 'socialMedia'
  | 'referral'
  | 'advertising'
  | 'emailMarketing'
  | 'event'
  | 'coldCall'
  | 'other';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired';

export type ProjectStatus =
  | 'approved'
  | 'inProduction'
  | 'review'
  | 'clientApproval'
  | 'completed'
  | 'onHold'
  | 'cancelled';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type UserRole =
  | 'admin'
  | 'comercial'
  | 'producao'
  | 'financeiro'
  | 'compras'
  | 'logistica'
  | 'marketing'
  | 'cliente';

export type ProjectType =
  | 'livroFisico'
  | 'ebook'
  | 'audiobook'
  | 'revista'
  | 'catalogo'
  | 'materialPromocional'
  | 'outros';

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

// ========== CRM - LEADS ==========

export interface Lead extends BaseEntity {
  leadNumber: string; // AUTO: LED-2025-001
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo?: string; // User ID
  interestArea?: string;
  budgetRange?: string;
  message?: string;
  score: number; // 0-100
  lastContact?: Timestamp;
  nextFollowUp?: Timestamp;
  tags: string[];
  activities: Activity[];
  convertedToClientId?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description?: string;
  date: Timestamp;
  userId: string;
  userName: string;
  completed?: boolean;
}

// ========== CRM - QUOTES ==========

export interface Quote extends BaseEntity {
  quoteNumber: string; // v5_0821.2354
  clientId: string;
  clientName: string;
  leadId?: string;
  title: string;
  description?: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  validUntil: Timestamp;
  createdBy: string;
  assignedTo?: string;
  sentDate?: Timestamp;
  viewedDate?: Timestamp;
  signedDate?: Timestamp;
  pdfUrl?: string;
  notes?: string;
  termsConditions?: string;
  convertedToProjectId?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

// ========== CRM - PROJECTS ==========

export interface Project extends BaseEntity {
  projectCode: string; // AUTO: DDML0349
  title: string;
  description?: string;
  clientId: string;
  clientName: string;
  quoteId?: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Timestamp;
  dueDate: Timestamp;
  completionDate?: Timestamp;
  progress: number; // 0-100
  teamMembers: string[]; // User IDs
  projectManager: string; // User ID
  budget: number;
  actualCost: number;
  files: ProjectFile[];
  tasks: ProjectTask[];
  timeline: ProjectTimeline[];
  specifications?: ProjectSpecifications;
  deliveryAddress?: Address;
  invoiceId?: string;
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

// ========== FINANCE ==========

export interface Invoice extends BaseEntity {
  invoiceNumber: string; // AUTO: FAT-2025-001
  clientId: string;
  clientName: string;
  projectId?: string;
  projectTitle?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  dueDate: Timestamp;
  issueDate: Timestamp;
  paidDate?: Timestamp;
  paymentMethod?: string;
  notes?: string;
  pdfUrl?: string;
  paymentLink?: string;
  overdueDays?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ========== PRODUCTION ==========

export interface ProductionQueue extends BaseEntity {
  projectId: string;
  projectTitle: string;
  clientName: string;
  priority: number;
  estimatedCompletion: Timestamp;
  assignedTeam: string[];
  currentStage: string;
  requirements: string[];
}

export interface QualityCheck extends BaseEntity {
  projectId: string;
  checkedBy: string;
  checklist: QualityCheckItem[];
  overallStatus: 'passed' | 'failed' | 'pending';
  notes?: string;
  approvedDate?: Timestamp;
}

export interface QualityCheckItem {
  id: string;
  item: string;
  status: 'passed' | 'failed' | 'n/a';
  notes?: string;
}

// ========== SUPPLIERS ==========

export interface Supplier extends BaseEntity {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  services: string[];
  rating: number; // 1-5
  isActive: boolean;
  paymentTerms?: string;
  notes?: string;
}

export interface PurchaseOrder extends BaseEntity {
  poNumber: string; // AUTO: PO-2025-001
  supplierId: string;
  supplierName: string;
  projectId?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  orderDate: Timestamp;
  expectedDelivery: Timestamp;
  actualDelivery?: Timestamp;
  createdBy: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ========== LOGISTICS ==========

export interface Shipment extends BaseEntity {
  trackingNumber: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  deliveryAddress: Address;
  status: 'preparing' | 'shipped' | 'inTransit' | 'delivered' | 'failed';
  carrier?: string;
  shippingDate?: Timestamp;
  deliveryDate?: Timestamp;
  estimatedDelivery: Timestamp;
  trackingUrl?: string;
  notes?: string;
}

// ========== MARKETING ==========

export interface Campaign extends BaseEntity {
  name: string;
  description?: string;
  type: 'email' | 'socialMedia' | 'advertising' | 'event' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Timestamp;
  endDate: Timestamp;
  budget: number;
  actualSpend: number;
  targetAudience?: string;
  goals: string[];
  metrics: CampaignMetrics;
  createdBy: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  leadsGenerated: number;
  costPerLead: number;
  roi: number;
}

export interface Creative extends BaseEntity {
  name: string;
  type: 'image' | 'video' | 'text' | 'banner';
  campaignId?: string;
  fileUrl?: string;
  content?: string;
  dimensions?: string;
  status: 'draft' | 'approved' | 'inUse' | 'archived';
  createdBy: string;
  approvedBy?: string;
  approvalDate?: Timestamp;
}

// ========== DASHBOARD METRICS ==========

export interface KPIMetric {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
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

// ========== FORM TYPES ==========

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  interestArea?: string;
  budgetRange?: string;
  message?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  companyName?: string;
  contactPerson?: string;
  address?: Partial<Address>;
}

export interface QuoteFormData {
  clientId: string;
  title: string;
  description?: string;
  items: Omit<QuoteItem, 'id' | 'total'>[];
  discountPercentage: number;
  validUntil: string; // YYYY-MM-DD format
  notes?: string;
  termsConditions?: string;
}

export interface ProjectFormData {
  title: string;
  description?: string;
  clientId: string;
  type: ProjectType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string; // YYYY-MM-DD format
  dueDate: string; // YYYY-MM-DD format
  budget: number;
  teamMembers: string[];
  projectManager: string;
  specifications?: Partial<ProjectSpecifications>;
  deliveryAddress?: Partial<Address>;
}
