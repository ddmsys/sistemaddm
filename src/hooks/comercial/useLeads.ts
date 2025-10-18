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
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { Lead, LeadFilters, LeadStage } from '@/lib/types/leads';
import { AsyncState, SelectOption } from '@/lib/types/shared';
import { getErrorMessage } from '@/lib/utils/errors';

export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: Lead['source'];
  value?: number;
  probability?: number;
  notes?: string;
  tags?: string[];
}

export function useLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<AsyncState<Lead[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // ================ FETCH LEADS ================
  const fetchLeads = useCallback(
    async (filters?: LeadFilters) => {
      if (!user) return;

      setLeads((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));

        // Aplicar filtros se fornecidos
        if (filters?.stage && filters.stage.length > 0) {
          leadsQuery = query(leadsQuery, where('stage', 'in', filters.stage));
        }

        if (filters?.source && filters.source.length > 0) {
          leadsQuery = query(leadsQuery, where('source', 'in', filters.source));
        }

        if (filters?.ownerId && filters.ownerId.length > 0) {
          leadsQuery = query(leadsQuery, where('ownerId', 'in', filters.ownerId));
        }

        const snapshot = await getDocs(leadsQuery);
        const leadsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];

        // Aplicar filtros de data e busca no frontend
        let filteredLeads = leadsData;

        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          filteredLeads = filteredLeads.filter((lead) => {
            const createdAt =
              lead.createdAt instanceof Date ? lead.createdAt : lead.createdAt.toDate();
            const start = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
            const end = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredLeads = filteredLeads.filter(
            (lead) =>
              lead.name.toLowerCase().includes(searchLower) ||
              lead.email?.toLowerCase().includes(searchLower) ||
              lead.company?.toLowerCase().includes(searchLower),
          );
        }

        setLeads({
          data: filteredLeads,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao buscar leads:', error);
        setLeads({
          data: null,
          loading: false,
          error: errorMessage,
        });
        toast.error('Erro ao carregar leads');
      }
    },
    [user],
  );

  // ================ GET SINGLE LEAD ================
  const getLead = useCallback(async (id: string): Promise<Lead | null> => {
    try {
      const docRef = doc(db, 'leads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Lead;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      toast.error('Erro ao carregar lead');
      return null;
    }
  }, []);

  // ================ CREATE LEAD ================
  const createLead = useCallback(
    async (data: LeadFormData): Promise<string | null> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return null;
      }

      try {
        const leadData: Omit<Lead, 'id'> = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          source: data.source,
          stage: 'primeiro_contato',
          status: 'primeiro_contato', // Adicionando status obrigatório
          value: data.value || 0,
          probability: data.probability || 0,
          ownerId: user.uid,
          ownerName: user.displayName || 'Usuário',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastActivityAt: Timestamp.now(),
          notes: data.notes,
          tags: data.tags || [],
        };

        const docRef = await addDoc(collection(db, 'leads'), leadData);
        toast.success('Lead criado com sucesso!');
        await fetchLeads();
        return docRef.id;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao criar lead:', error);
        toast.error(`Erro ao criar lead: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchLeads],
  );

  // ================ UPDATE LEAD ================
  const updateLead = useCallback(
    async (id: string, data: Partial<LeadFormData>): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'leads', id);
        const updateData: Partial<Lead> = {
          ...data,
          updatedAt: Timestamp.now(),
          lastActivityAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);
        toast.success('Lead atualizado com sucesso!');
        await fetchLeads();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao atualizar lead:', error);
        toast.error(`Erro ao atualizar lead: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchLeads],
  );

  // ================ UPDATE LEAD STAGE ================
  const updateLeadStage = useCallback(
    async (id: string, stage: LeadStage): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'leads', id);
        await updateDoc(docRef, {
          stage,
          updatedAt: Timestamp.now(),
          lastActivityAt: Timestamp.now(),
        });

        toast.success('Stage do lead atualizado!');
        await fetchLeads();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao atualizar stage:', error);
        toast.error('Erro ao atualizar stage do lead');
        return false;
      }
    },
    [user, fetchLeads],
  );

  // ================ DELETE LEAD ================
  const deleteLead = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await deleteDoc(doc(db, 'leads', id));
        toast.success('Lead excluído com sucesso!');
        await fetchLeads();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao excluir lead:', error);
        toast.error('Erro ao excluir lead');
        return false;
      }
    },
    [user, fetchLeads],
  );

  // ================ GET LEADS OPTIONS FOR SELECT ================
  const getLeadsOptions = useCallback((): SelectOption[] => {
    if (!leads.data) return [];
    return leads.data
      .filter((lead) => ['primeiro_contato', 'qualificado'].includes(lead.stage) && lead.id)
      .map((lead) => ({
        value: lead.id!,
        label: `${lead.name}${lead.email ? ` (${lead.email})` : ''}`,
      }));
  }, [leads.data]);

  // AQUI, SEM NENHUM OUTRO BLOCO DEPOIS

  return {
    leads: leads.data ?? [],
    loading: leads.loading,
    error: leads.error,
    createLead,
    updateLead,
    updateLeadStage,
    deleteLead,
    fetchLeads,
    getLead,
    getLeadsOptions,
  };
}
