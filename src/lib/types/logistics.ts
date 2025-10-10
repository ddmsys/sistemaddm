import { Timestamp } from 'firebase/firestore';

import { Address, BaseEntity } from './shared';

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
