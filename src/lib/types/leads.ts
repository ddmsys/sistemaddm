import { Timestamp } from 'firebase/firestore';

export type LeadSource =
  | 'website'
  | 'email'
  | 'phone'
  | 'referral'
  | 'socialmedia'
  | 'coldcall'
  | 'event'
  | 'advertising'
  | 'other';

export type LeadStage =
  | 'primeiro_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  stage: LeadStage;
  status: LeadStage; // Alias para stage para compatibilidade
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LeadFilters {
  stage?: LeadStage[];
  source?: LeadSource[];
  ownerId?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}
