import { Timestamp } from "firebase/firestore";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired";

// Filtro de Quotes
export interface QuoteFilters {
  status?: QuoteStatus[];
  number?: string;
  clientName?: string[];
  clientId?: string[];
  createdBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

// Alias para padrão de filtros comerciais
export type ComercialFilters = QuoteFilters;

export interface Quote {
  id?: string;
  number: string; // ex: QUO-001
  clientId?: string;
  clientName: string; // Para compatibilidade com comercial.ts (obrigatório)
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };
  leadId?: string;
  projectTitle: string;
  description?: string; // Para compatibilidade
  quoteType: "producao" | "impressao" | "misto";
  issueDate: string;
  validityDays: number;
  expiryDate?: string;
  status: QuoteStatus;
  items: QuoteItem[];
  totals: {
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    freight: number;
    taxes: number;
    total: number;
  };
  // Propriedades para compatibilidade
  subtotal?: number;
  taxes?: number;
  discount?: number;
  grandTotal?: number;
  validUntil?: any; // Compatibilidade com Date | Timestamp | number
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
  quantity: number;
  totalPrice: number;
}

// Formulário de Quote seguro para o hook
export interface QuoteFormData {
  leadId?: string;
  clientId?: string;
  clientName?: string;
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };
  title: string;
  description?: string;
  projectTitle: string;
  quoteType: "producao" | "impressao" | "misto";
  issueDate: string;
  validUntil?: string | Date;
  expiryDate?: string;
  status?: QuoteStatus;
  items: QuoteItem[];
  discount?: number;
  discountType?: "percentage" | "fixed";
  totals?: {
    subtotal: number;
    discount: number;
    discountType: "percentage" | "fixed";
    freight: number;
    taxes: number;
    total: number;
  };
  notes?: string;
}
