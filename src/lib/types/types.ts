import { Timestamp } from 'firebase/firestore';

// ========== ENUMS ==========
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type LeadSource =
  | 'website'
  | 'social_media'
  | 'referral'
  | 'advertising'
  | 'email_marketing'
  | 'event'
  | 'cold_call'
  | 'other';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired';

export type ProjectStatus =
  | 'approved'
  | 'in_production'
  | 'review'
  | 'client_approval'
  | 'completed'
  | 'on_hold'
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
  | 'livro_fisico'
  | 'ebook'
  | 'audiobook'
  | 'revista'
  | 'catalogo'
  | 'material_promocional'
  | 'outros';

// ========== BASE INTERFACES ==========
export interface BaseEntity {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ========== USER MANAGEMENT ==========
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  last_login?: Timestamp;
  permissions: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: Timestamp;
}

// ========== CLIENT MANAGEMENT ==========
export interface Client extends BaseEntity {
  client_number: string; // AUTO: CLI-2025-001
  name: string;
  email: string;
  phone?: string;
  document?: string; // CPF/CNPJ
  address?: Address;
  company_name?: string;
  contact_person?: string;
  is_active: boolean;
  total_projects: number;
  total_revenue: number;
  last_project_date?: Timestamp;
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
  zip_code: string;
  country: string;
}

// ========== CRM - LEADS ==========
export interface Lead extends BaseEntity {
  lead_number: string; // AUTO: LED-2025-001
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  assigned_to?: string; // User ID
  interest_area?: string;
  budget_range?: string;
  message?: string;
  score: number; // 0-100
  last_contact?: Timestamp;
  next_follow_up?: Timestamp;
  tags: string[];
  activities: Activity[];
  converted_to_client_id?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description?: string;
  date: Timestamp;
  user_id: string;
  user_name: string;
  completed?: boolean;
}

// ========== CRM - QUOTES ==========
export interface Quote extends BaseEntity {
  quote_number: string; // AUTO: ORC-2025-001
  client_id: string;
  client_name: string;
  lead_id?: string;
  title: string;
  description?: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  total: number;
  valid_until: Timestamp;
  created_by: string;
  assigned_to?: string;
  sent_date?: Timestamp;
  viewed_date?: Timestamp;
  signed_date?: Timestamp;
  pdf_url?: string;
  notes?: string;
  terms_conditions?: string;
  converted_to_project_id?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category?: string;
}

// ========== CRM - PROJECTS ==========
export interface Project extends BaseEntity {
  project_code: string; // AUTO: DDM-2025-001
  title: string;
  description?: string;
  client_id: string;
  client_name: string;
  quote_id?: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: Timestamp;
  due_date: Timestamp;
  completion_date?: Timestamp;
  progress: number; // 0-100
  team_members: string[]; // User IDs
  project_manager: string; // User ID
  budget: number;
  actual_cost: number;
  files: ProjectFile[];
  tasks: ProjectTask[];
  timeline: ProjectTimeline[];
  specifications?: ProjectSpecifications;
  delivery_address?: Address;
  invoice_id?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_by: string;
  uploaded_at: Timestamp;
  category: 'brief' | 'proof' | 'final' | 'reference' | 'other';
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  assigned_to: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  due_date?: Timestamp;
  completed_date?: Timestamp;
  dependencies: string[]; // Task IDs
  estimated_hours: number;
  actual_hours: number;
}

export interface ProjectTimeline {
  id: string;
  event: string;
  description?: string;
  date: Timestamp;
  user_id: string;
  user_name: string;
  type: 'milestone' | 'update' | 'issue' | 'approval';
}

export interface ProjectSpecifications {
  format?: string;
  pages?: number;
  copies?: number;
  paper_type?: string;
  binding?: string;
  colors?: string;
  finishing?: string[];
  special_requirements?: string;
}

// ========== FINANCE ==========
export interface Invoice extends BaseEntity {
  invoice_number: string; // AUTO: FAT-2025-001
  client_id: string;
  client_name: string;
  project_id?: string;
  project_title?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  due_date: Timestamp;
  issue_date: Timestamp;
  paid_date?: Timestamp;
  payment_method?: string;
  notes?: string;
  pdf_url?: string;
  payment_link?: string;
  overdue_days?: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ========== PRODUCTION ==========
export interface ProductionQueue extends BaseEntity {
  project_id: string;
  project_title: string;
  client_name: string;
  priority: number;
  estimated_completion: Timestamp;
  assigned_team: string[];
  current_stage: string;
  requirements: string[];
}

export interface QualityCheck extends BaseEntity {
  project_id: string;
  checked_by: string;
  checklist: QualityCheckItem[];
  overall_status: 'passed' | 'failed' | 'pending';
  notes?: string;
  approved_date?: Timestamp;
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
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: Address;
  services: string[];
  rating: number; // 1-5
  is_active: boolean;
  payment_terms?: string;
  notes?: string;
}

export interface PurchaseOrder extends BaseEntity {
  po_number: string; // AUTO: PO-2025-001
  supplier_id: string;
  supplier_name: string;
  project_id?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  order_date: Timestamp;
  expected_delivery: Timestamp;
  actual_delivery?: Timestamp;
  created_by: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ========== LOGISTICS ==========
export interface Shipment extends BaseEntity {
  tracking_number: string;
  project_id: string;
  project_title: string;
  client_id: string;
  client_name: string;
  delivery_address: Address;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
  carrier?: string;
  shipping_date?: Timestamp;
  delivery_date?: Timestamp;
  estimated_delivery: Timestamp;
  tracking_url?: string;
  notes?: string;
}

// ========== MARKETING ==========
export interface Campaign extends BaseEntity {
  name: string;
  description?: string;
  type: 'email' | 'social_media' | 'advertising' | 'event' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: Timestamp;
  end_date: Timestamp;
  budget: number;
  actual_spend: number;
  target_audience?: string;
  goals: string[];
  metrics: CampaignMetrics;
  created_by: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  leads_generated: number;
  cost_per_lead: number;
  roi: number;
}

export interface Creative extends BaseEntity {
  name: string;
  type: 'image' | 'video' | 'text' | 'banner';
  campaign_id?: string;
  file_url?: string;
  content?: string;
  dimensions?: string;
  status: 'draft' | 'approved' | 'in_use' | 'archived';
  created_by: string;
  approved_by?: string;
  approval_date?: Timestamp;
}

// ========== DASHBOARD METRICS ==========
export interface KPIMetric {
  key: string;
  label: string;
  value: number;
  formatted_value: string;
  change_percentage: number;
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
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'project' | 'financial' | 'marketing';
  is_read: boolean;
  action_url?: string;
  action_label?: string;
  expires_at?: Timestamp;
}

// ========== AUDIT LOG ==========
export interface AuditLog extends BaseEntity {
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// ========== FORM TYPES ==========
export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  interest_area?: string;
  budget_range?: string;
  message?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  document?: string;
  company_name?: string;
  contact_person?: string;
  address?: Partial<Address>;
}

export interface QuoteFormData {
  client_id: string;
  title: string;
  description?: string;
  items: Omit<QuoteItem, 'id' | 'total'>[];
  discount_percentage: number;
  valid_until: string; // YYYY-MM-DD format
  notes?: string;
  terms_conditions?: string;
}

export interface ProjectFormData {
  title: string;
  description?: string;
  client_id: string;
  type: ProjectType;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string; // YYYY-MM-DD format
  due_date: string; // YYYY-MM-DD format
  budget: number;
  team_members: string[];
  project_manager: string;
  specifications?: Partial<ProjectSpecifications>;
  delivery_address?: Partial<Address>;
}
