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

export type LeadStatus =
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
  status: LeadStatus;
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];
  socialMedia?: SocialMedia;
  referredBy?: string; // nome da pessoa que indicou, pode ser opcional
  interestArea?: string; // CAMPO NOVO - igual ao do form!
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  ownerId?: string[];
  probability?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  value?: number;
  probability?: number;
  socialMedia?: SocialMedia;
  referredBy?: string; // nome da pessoa que indicou, pode ser opcional
  interestArea?: string; // CAMPO NOVO - igual ao do Lead!
  notes?: string;
  tags?: string[];
}

export interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (data: LeadFormData) => Promise<void>;
  loading?: boolean;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  conversionRate: number;
  averageValue: number;
  totalValue: number;
}
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}
