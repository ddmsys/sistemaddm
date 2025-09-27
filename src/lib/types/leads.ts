import { Timestamp } from "firebase/firestore";

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  source:
    | "website"
    | "referral"
    | "social_media"
    | "cold_call"
    | "event"
    | "advertising"
    | "other";
  stage:
    | "primeiro_contato"
    | "proposta_enviada"
    | "negociacao"
    | "fechado_ganho"
    | "fechado_perdido";
  indication?: string;
  notes?: string;
  tags?: string[];
  ownerId?: string;
  ownerName?: string;
  quoteId?: string;
  priority?: "low" | "medium" | "high";
  expectedValue?: number;
  expectedCloseDate?: Date;
  lastContact?: Date;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface LeadTask {
  id?: string;
  leadId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  ownerId: string;
  ownerName: string;
  createdAt?: Timestamp | Date;
}

export interface LeadFilter {
  stage?: string;
  source?: string;
  owner?: string;
  priority?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface LeadStats {
  total: number;
  byStage: Record<string, number>;
  bySource: Record<string, number>;
  conversionRate: number;
  averageValue: number;
  totalValue: number;
}
