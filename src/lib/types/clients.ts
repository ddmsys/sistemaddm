import { Timestamp } from "firebase/firestore";

export type ClientStatus = "active" | "inactive" | "blocked";

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

export interface Client {
  id?: string;
  number: string; // CLT001, CLT002...
  name: string;
  email: string;
  phone?: string;
  company?: string;
  document: string; // CPF ou CNPJ
  address?: Address;
  contacts?: Contact[];
  status: ClientStatus;
  indication?: string;
  notes?: string;
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
