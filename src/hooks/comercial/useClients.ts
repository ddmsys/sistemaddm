"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { Client, ClientStatus } from "@/lib/types/clients";

export interface ClientFilters {
  status?: ClientStatus[];
  search?: string;
  type?: "individual" | "company";
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface ClientFormData {
  type: "individual" | "company";
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  document: string; // cpf ou cnpj, obrigatório!
  cpf?: string;
  rg?: string;
  birthDate?: string;
  referralSource?: string;
  cnpj?: string;
  company?: string;
  companyName?: string;
  stateRegistration?: string;
  contactPerson?: string;
  businessType?: string;
  tags?: string[];
  source?: string;
  notes?: string;
  referredBy?: string;
  indication?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export function useClients(filters?: ClientFilters) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 CARREGAR CLIENTES COM FILTROS OPCIONAIS
  useEffect(() => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }
    console.log("🔄 Iniciando carregamento de clientes...", filters);
    setLoading(true);
    setError(null);

    try {
      const clientsRef = collection(db, "clients");
      const constraints: QueryConstraint[] = [];

      // ✅ Filtro por status
      if (filters?.status && filters.status.length > 0) {
        constraints.push(where("status", "in", filters.status));
      }

      // ✅ Filtro por tipo (pessoa física ou jurídica)
      if (filters?.type) {
        constraints.push(where("type", "==", filters.type));
      }

      // ✅ Filtro por tags
      if (filters?.tags && filters.tags.length > 0) {
        constraints.push(where("tags", "array-contains-any", filters.tags));
      }

      // ✅ Filtro por data (não implementado no Firebase query, faremos no JS)
      // Firebase não permite range queries em múltiplos campos ao mesmo tempo

      // Ordenar por data de criação
      constraints.push(orderBy("createdAt", "desc"));

      const q = query(clientsRef, ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let clientsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
          })) as Client[];

          // ✅ Filtro por busca (nome, email, telefone, documento)
          if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            clientsData = clientsData.filter(
              (client) =>
                client.name?.toLowerCase().includes(searchLower) ||
                client.email?.toLowerCase().includes(searchLower) ||
                client.phone?.includes(searchLower) ||
                client.document?.includes(searchLower) ||
                client.company?.toLowerCase().includes(searchLower),
            );
          }

          // ✅ Filtro por range de datas (no JavaScript)
          if (filters?.dateRange) {
            const { start, end } = filters.dateRange;
            clientsData = clientsData.filter((client) => {
              const clientDate =
                client.createdAt instanceof Date
                  ? client.createdAt
                  : client.createdAt?.toDate?.() || new Date();
              return clientDate >= start && clientDate <= end;
            });
          }

          console.log("✅ Clientes carregados:", clientsData.length);
          setClients(clientsData);
          setLoading(false);
        },
        (err) => {
          console.error("❌ Erro ao carregar clientes:", err);
          setError(err.message);
          setLoading(false);
          toast.error("Erro ao carregar clientes");
        },
      );

      return () => unsubscribe();
    } catch (err) {
      const error = err as Error;
      console.error("❌ Erro ao configurar query:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [user, filters?.status, filters?.type, filters?.search, filters?.tags, filters?.dateRange]);

  // ================ GET SINGLE CLIENT ================
  const getClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      const docRef = doc(db, "clients", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Client;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast.error("Erro ao carregar cliente");
      return null;
    }
  }, []);

  // ================ CREATE CLIENT ================
  const createClient = useCallback(
    async (data: ClientFormData): Promise<string | null> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return null;
      }

      try {
        console.log("🔄 Criando cliente:", data);

        if (!data.document || data.document.trim() === "") {
          toast.error("Documento (CPF/CNPJ) é obrigatório");
          return null;
        }

        const clientData: any = {
          type: data.type,
          name: data.name,
          email: data.email,
          phone: data.phone,
          document: data.document,
          status: data.status,
          clientNumber: "", // Firebase Function preenche
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        // 🔥 ADICIONE ESSAS LINHAS (campos opcionais novos):
        if (data.rg) clientData.rg = data.rg;
        if (data.birthDate) clientData.birthDate = data.birthDate;
        if (data.referralSource) clientData.referralSource = data.referralSource;
        // Só adiciona campos opcionais se tiverem valor
        if (data.company) clientData.company = data.company;
        if (data.companyName) clientData.companyName = data.companyName;
        if (data.stateRegistration) clientData.stateRegistration = data.stateRegistration;
        if (data.contactPerson) clientData.contactPerson = data.contactPerson;
        if (data.businessType) clientData.businessType = data.businessType;
        if (data.source) clientData.source = data.source;
        if (data.notes) clientData.notes = data.notes;
        if (data.tags && data.tags.length > 0) clientData.tags = data.tags;
        if (data.socialMedia) clientData.socialMedia = data.socialMedia;
        if (data.address) clientData.address = data.address;

        console.log("✅ Dados preparados:", clientData);

        const docRef = await addDoc(collection(db, "clients"), clientData);

        console.log("✅ Cliente criado com ID:", docRef.id);
        toast.success("Cliente criado com sucesso!");

        return docRef.id;
      } catch (error: any) {
        console.error("❌ Erro ao criar cliente:", error);
        toast.error(`Erro: ${error.message}`);
        return null;
      }
    },
    [user],
  );

  // ================ UPDATE CLIENT ================
  const updateClient = useCallback(
    async (id: string, data: Partial<ClientFormData>): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        console.log("🔄 Atualizando cliente:", id, data);

        const clientRef = doc(db, "clients", id);

        const updateData: any = {
          ...data,
          updatedAt: Timestamp.now(),
        };

        // Remove campos vazios
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === "" || updateData[key] === undefined) {
            delete updateData[key];
          }
        });

        await updateDoc(clientRef, updateData);

        console.log("✅ Cliente atualizado com sucesso");
        toast.success("Cliente atualizado com sucesso!");
        return true;
      } catch (error: any) {
        console.error("❌ Erro ao atualizar cliente:", error);
        toast.error(`Erro ao atualizar cliente: ${error.message}`);
        return false;
      }
    },
    [user],
  );

  // ================ DELETE CLIENT ================
  const deleteClient = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }

      try {
        console.log("🗑️ Deletando cliente:", id);

        const clientRef = doc(db, "clients", id);
        await deleteDoc(clientRef);

        console.log("✅ Cliente deletado com sucesso");
        toast.success("Cliente deletado com sucesso!");
        return true;
      } catch (error: any) {
        console.error("❌ Erro ao deletar cliente:", error);
        toast.error(`Erro ao deletar cliente: ${error.message}`);
        return false;
      }
    },
    [user],
  );

  // ================ HELPER: FILTER LOCALLY ================
  const filterClients = useCallback(
    (searchTerm: string): Client[] => {
      if (!searchTerm) return clients;

      const search = searchTerm.toLowerCase();
      return clients.filter(
        (client) =>
          client.name?.toLowerCase().includes(search) ||
          client.email?.toLowerCase().includes(search) ||
          client.phone?.includes(search) ||
          client.document?.includes(search) ||
          client.company?.toLowerCase().includes(search),
      );
    },
    [clients],
  );

  return {
    clients,
    loading,
    error,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    filterClients,
  };
}
