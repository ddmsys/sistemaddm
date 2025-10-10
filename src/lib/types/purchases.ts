import { Timestamp } from 'firebase/firestore';

import { Address, BaseEntity } from './shared';

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
