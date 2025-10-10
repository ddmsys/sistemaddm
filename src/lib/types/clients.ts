import { Timestamp } from 'firebase/firestore';

export type ClientStatus = 'active' | 'inactive' | 'blocked';

export interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Contact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}
export type ClientType = 'individual' | 'company';

export interface Client {
  id?: string;
  clientNumber?: number;
  type: ClientType;

  // ✅ Campos obrigatórios básicos
  name: string; // Nome sempre obrigatório
  email: string; // Email sempre obrigatório
  phone: string; // Telefone sempre obrigatório
  status: ClientStatus;
  document: string; // ADICIONAR ESSA LINHA!

  // ✅ Pessoa Física
  cpf?: string;
  rg?: string;
  birthDate?: string;

  // ✅ Pessoa Jurídica
  company?: string; // Razão social
  companyName?: string; // Alias para compatibilidade
  cnpj?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;

  // ✅ Campos adicionais
  source?: string;
  notes?: string;
  socialMedia?: SocialMedia;
  address?: Address;
  firebaseAuthUid?: string;
  referredBy?: string; // nome da pessoa que indicou, pode ser opcional
  tags?: string[];

  // ✅ Timestamps obrigatórios
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface ClientFilters {
  status?: ClientStatus[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
export interface ClientFormData {
  type: ClientType;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF ou CNPJ
  cpf?: string;
  cnpj?: string;
  company?: string;
  companyName?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;
  status: ClientStatus;
  tags: string[];
  source?: string;
  notes?: string;
  socialMedia?: SocialMedia;
  address?: Address;
  referredBy?: string; // nome da pessoa que indicou, pode ser opcional
}
export interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSave: (data: Client) => Promise<void>;
  loading?: boolean;
}
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}
