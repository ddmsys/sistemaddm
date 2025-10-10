import { Timestamp } from 'firebase/firestore';

import { BaseEntity } from './shared';

// ========== ENUMS ==========

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

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
