import { Timestamp } from 'firebase/firestore';

import { BaseEntity } from './shared';

// ========== MARKETING ==========

export interface Campaign extends BaseEntity {
  name: string;
  description?: string;
  type: 'email' | 'socialMedia' | 'advertising' | 'event' | 'content';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Timestamp;
  endDate: Timestamp;
  budget: number;
  actualSpend: number;
  targetAudience?: string;
  goals: string[];
  metrics: CampaignMetrics;
  createdBy: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  leadsGenerated: number;
  costPerLead: number;
  roi: number;
}

export interface Creative extends BaseEntity {
  name: string;
  type: 'image' | 'video' | 'text' | 'banner';
  campaignId?: string;
  fileUrl?: string;
  content?: string;
  dimensions?: string;
  status: 'draft' | 'approved' | 'inUse' | 'archived';
  createdBy: string;
  approvedBy?: string;
  approvalDate?: Timestamp;
}
