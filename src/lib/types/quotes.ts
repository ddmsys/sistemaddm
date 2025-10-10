// src/lib/types/quotes.ts
import { Timestamp } from 'firebase/firestore';

// ================ INTERFACES PRINCIPAIS ================
export interface Quote {
  // Identificação
  id?: string;
  number: string; // Auto-gerado: QUO-001, QUO-002...

  // Relacionamentos OBRIGATÓRIOS
  clientId?: string;
  clientName: string; // OBRIGATÓRIO para compatibilidade
  leadId?: string;

  // Dados básicos OBRIGATÓRIOS
  projectTitle: string; // Era 'title' em alguns lugares
  description?: string;
  quoteType: QuoteType; // OBRIGATÓRIO

  // Datas OBRIGATÓRIAS
  issueDate: string; // Data de emissão
  validityDays: number; // Dias de validade (padrão 30)
  expiryDate?: string; // Data de expiração calculada

  // Status OBRIGATÓRIO
  status: QuoteStatus;

  // Itens OBRIGATÓRIOS
  items: QuoteItem[]; // Array de itens do orçamento

  // Totais OBRIGATÓRIOS
  totals: {
    subtotal: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    freight: number;
    taxes: number;
    total: number;
  };

  // Campos opcionais de compatibilidade
  subtotal?: number; // Duplicado para compatibilidade
  taxes?: number;
  discount?: number;
  grandTotal?: number;
  validUntil?: Date | Timestamp; // Compatibilidade

  // Campos opcionais
  productionTime?: string;
  terms?: string;
  notes?: string;
  pdfUrl?: string;

  // Campos de controle
  signedAt?: Date;
  signedBy?: string;
  refusedAt?: Date;
  refusedReason?: string;
  sentAt?: Date;
  viewedAt?: Date;

  // Campos de usuário
  ownerId?: string;
  ownerName?: string;

  // Timestamps OBRIGATÓRIOS
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;

  // Campo para conversão em projeto (compatibilidade com QuoteCard)
  convertedToProjectId?: string;
}

export interface QuoteItem {
  id?: string;
  description: string;
  kind: 'etapa' | 'impressao'; // Tipo do item
  specifications?: string;

  // Campos de quantidade e preço
  quantity: number; // Campo principal
  qty?: number; // Compatibilidade
  unitPrice?: number; // Campo principal
  value: number; // Valor total
  totalPrice: number; // Compatibilidade

  // Campos opcionais
  category?: string;
  notes?: string;
}

// ================ ENUMS E TYPES ================
export type QuoteStatus =
  | 'draft' // Rascunho
  | 'sent' // Enviado
  | 'viewed' // Visualizado
  | 'signed' // Assinado
  | 'rejected' // Rejeitado
  | 'expired'; // Expirado

export type QuoteType =
  | 'producao' // Produção
  | 'impressao' // Impressão
  | 'misto'; // Misto

// ================ INTERFACES DE FORM ================
export interface QuoteFormData {
  // Relacionamentos
  leadId?: string;
  clientId?: string;
  clientName?: string;
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };

  // Dados básicos
  title: string; // Será mapeado para projectTitle
  description?: string;
  projectTitle: string; // Campo principal
  quoteType: QuoteType;

  // Datas
  issueDate: string;
  validUntil?: string | Date; // Para HTML forms
  expiryDate?: string;

  // Status
  status?: QuoteStatus;

  // Itens
  items: QuoteItem[];

  // Totais
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  totals?: {
    subtotal: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    freight: number;
    taxes: number;
    total: number;
  };

  // Campos opcionais
  notes?: string;
}

// ================ FILTROS ================
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

// Alias para compatibilidade com comercial
export type ComercialFilters = QuoteFilters;

// ================ INTERFACES AUXILIARES ================
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'blocked';
  clientNumber?: string; // Para compatibilidade com QuoteModal
}
// src/lib/types/quotes.ts - CORREÇÃO NA QuoteFormData
export interface QuoteFormData {
  // Relacionamentos
  leadId?: string;
  clientId?: string;
  clientName?: string;
  client?: {
    name: string;
    email?: string;
    phone?: string;
  };

  // Dados básicos
  title: string; // Será mapeado para projectTitle
  description?: string;
  projectTitle: string; // Campo principal
  quoteType: QuoteType;

  // Datas
  issueDate: string;
  validUntil?: string | Date; // Para HTML forms
  expiryDate?: string;
  validityDays?: number; // ADICIONADO: para compatibilidade com hooks

  // Status
  status?: QuoteStatus;

  // Itens
  items: QuoteItem[];

  // Totais
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  totals?: {
    subtotal: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    freight: number;
    taxes: number;
    total: number;
  };

  // Campos opcionais
  notes?: string;
}
