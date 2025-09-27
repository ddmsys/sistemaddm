import { Timestamp } from "firebase/firestore";

export interface Quote {
  id?: string;
  number: string;
  clientId?: string;
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };
  leadId?: string;
  projectTitle: string;
  quoteType: "producao" | "impressao" | "misto";
  issueDate: string;
  validityDays: number;
  expiryDate?: string;
  status: "draft" | "sent" | "viewed" | "signed" | "refused" | "expired";
  items: QuoteItem[];
  totals: {
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    freight: number;
    taxes: number;
    total: number;
  };
  productionTime?: string;
  terms?: string;
  notes?: string;
  pdfUrl?: string;
  signedAt?: Date;
  signedBy?: string;
  refusedAt?: Date;
  refusedReason?: string;
  sentAt?: Date;
  viewedAt?: Date;
  ownerId?: string;
  ownerName?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface QuoteItem {
  id?: string;
  description: string;
  kind: "etapa" | "impressao";
  specifications?: string;
  qty?: number;
  unitPrice?: number;
  value: number;
  category?: string;
  notes?: string;
}

export interface QuoteTemplate {
  id?: string;
  name: string;
  description?: string;
  quoteType: "producao" | "impressao" | "misto";
  defaultItems: QuoteItem[];
  defaultTerms?: string;
  defaultValidityDays: number;
  isActive: boolean;
  createdAt?: Timestamp | Date;
}

export interface QuoteStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  pending: number;
}
