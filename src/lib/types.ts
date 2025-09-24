// src/lib/types.ts

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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface LeadTask {
  id?: string;
  leadId: string;
  note: string;
  dueAt: Timestamp;
  done: boolean;
  ownerId: string;
  ownerName: string;
  createdAt?: Timestamp;
}

export interface Book {
  title: string;
  author: string;
  year: string;
  ISBN: string;
}

export interface Client {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  clientNumber?: number;
  status?: "ativo" | "inativo";
  address?: {
    zipcode?: string;
    street?: string;
    number?: string;
    city?: string;
    state?: string;
  };
  indication?: string;
  source?:
    | "website"
    | "referral"
    | "social_media"
    | "cold_call"
    | "event"
    | "advertising"
    | "other";
  notes?: string;
  firebaseAuthUid?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: "admin" | "comercial" | "producao" | "financeiro" | "cliente";
  name: string;
  clientId?: string; // Para clientes
}

export type ProjectStatus = "planejamento" | "em_progresso" | "concluido";

export interface ClientApprovalTask {
  id: string;
  title: string;
  status: "pending" | "approved" | "changes_requested";
  note?: string;
  createdAt: Date;
  decidedAt?: Date;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientNumber: number;
  catalogCode: string;
  title: string;
  productType: string; // ex: "L", "C", etc
  description?: string;
  status: ProjectStatus;
  book?: Book | null;
  tasks?: any[];
  clientApprovalTasks?: ClientApprovalTask[];
  budget?: number;
  currency?: "BRL" | "USD" | "EUR";
  ownerId?: string;
  ownerName?: string;
  tags?: string[];
  notes?: string;
  proofsCount?: number;
  finalProofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

export interface KanbanColumn {
  id: ProjectStatus;
  title: string;
  color: string;
  projects: Project[];
}

export interface QuoteItem {
  id?: string;
  kind: "etapa" | "impressao";
  description: string;
  deadlineDays?: number;
  dueDate?: string;
  value?: number;
  qty?: number;
  unit?: string;
  unitPrice?: number;
  notes?: string;
}

export interface Quote {
  id?: string;
  leadId: string;
  number: string;
  status: "draft" | "sent" | "signed" | "refused";
  quoteType: "producao" | "impressao" | "misto";
  currency: "BRL" | "USD" | "EUR";
  projectTitle: string;
  issueDate: string;
  validityDays: number;
  productionTime?: string;
  material?: any;
  items: QuoteItem[];
  terms?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}
