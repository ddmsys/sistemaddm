'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { Client, ClientStatus } from '@/lib/types/comercial';
import { AsyncState, SelectOption } from '@/lib/types/shared';
import { getErrorMessage } from '@/lib/utils/errors';

export interface ClientFilters {
  status?: ClientStatus[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ClientFormData {
  type: 'individual' | 'company';
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  company?: string;
  status: ClientStatus;
  indication?: string;
  notes?: string;
}

export function useClients() {
  const { user } = useAuth();
  const [clients, setClients] = useState<AsyncState<Client[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // ================ FETCH CLIENTS ================
  const fetchClients = useCallback(
    async (filters?: ClientFilters) => {
      if (!user) return;

      setClients((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let clientsQuery = query(collection(db, 'clients'), orderBy('name', 'asc'));

        if (filters?.status && filters.status.length > 0) {
          clientsQuery = query(clientsQuery, where('status', 'in', filters.status));
        }

        const snapshot = await getDocs(clientsQuery);
        const clientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];

        // Aplicar filtros no frontend
        let filteredClients = clientsData;

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredClients = filteredClients.filter(
            (client) =>
              client.name.toLowerCase().includes(searchLower) ||
              client.email.toLowerCase().includes(searchLower) ||
              client.company?.toLowerCase().includes(searchLower) ||
              (client.cpf && client.cpf.includes(filters.search!)) ||
              (client.cnpj && client.cnpj.includes(filters.search!)),
          );
        }

        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          filteredClients = filteredClients.filter((client) => {
            const createdAt = client.createdAt.toDate();
            const start = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
            const end = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        setClients({
          data: filteredClients,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao buscar clientes:', error);
        setClients({
          data: null,
          loading: false,
          error: errorMessage,
        });
        toast.error('Erro ao carregar clientes');
      }
    },
    [user],
  );

  // ================ GET SINGLE CLIENT ================
  const getClient = useCallback(async (id: string): Promise<Client | null> => {
    try {
      const docRef = doc(db, 'clients', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Client;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      toast.error('Erro ao carregar cliente');
      return null;
    }
  }, []);

  // ================ CREATE CLIENT ================
  const createClient = useCallback(
    async (data: ClientFormData): Promise<string | null> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return null;
      }

      try {
        const clientData: Omit<Client, 'id' | 'clientNumber'> = {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'clients'), clientData);
        toast.success('Cliente criado com sucesso!');
        await fetchClients();
        return docRef.id;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao criar cliente:', error);
        toast.error(`Erro ao criar cliente: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchClients],
  );

  // ================ UPDATE CLIENT ================
  const updateClient = useCallback(
    async (id: string, data: Partial<ClientFormData>): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'clients', id);
        const updateData: Partial<Client> = {
          ...data,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);
        toast.success('Cliente atualizado com sucesso!');
        await fetchClients();
        return true;
      } catch (error) {
        const _errorMessage = getErrorMessage(error);
        console.error('Erro ao atualizar cliente:', error);
        toast.error('Erro ao atualizar cliente');
        return false;
      }
    },
    [user, fetchClients],
  );

  // ================ DELETE CLIENT ================
  const deleteClient = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await deleteDoc(doc(db, 'clients', id));
        toast.success('Cliente excluído com sucesso!');
        await fetchClients();
        return true;
      } catch (error) {
        const _errorMessage = getErrorMessage(error);
        console.error('Erro ao excluir cliente:', error);
        toast.error('Erro ao excluir cliente');
        return false;
      }
    },
    [user, fetchClients],
  );

  // ================ GET CLIENTS OPTIONS FOR SELECT ================
  const getClientsOptions = useCallback((): SelectOption[] => {
    if (!clients.data) return [];

    return clients.data
      .filter((client) => client.status === 'ativo' && client.id)
      .map((client) => ({
        value: client.id!,
        label: `${client.name}${client.company ? ` (${client.company})` : ''}`,
      }));
  }, [clients.data]);

  // ================ GET CLIENT BY EMAIL ================
  const getClientByEmail = useCallback(async (email: string): Promise<Client | null> => {
    try {
      const clientsQuery = query(collection(db, 'clients'), where('email', '==', email));

      const snapshot = await getDocs(clientsQuery);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        return { id: docData.id, ...docData.data() } as Client;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente por email:', error);
      return null;
    }
  }, []);

  // ================ LOAD DATA ON MOUNT ================
  useEffect(() => {
    if (user) {
      void fetchClients();
    }
  }, [user, fetchClients]);

  return {
    clients: clients.data || [],
    loading: clients.loading,
    error: clients.error,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    getClientsOptions,
    getClientByEmail,
    refetch: fetchClients,
  };
}
