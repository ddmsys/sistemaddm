// src/hooks/comercial/useLeads.ts

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Lead, LeadFilters } from "@/lib/types/comercial";

export function useLeads(filters?: LeadFilters) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar leads com filtros
  useEffect(() => {
    let q = query(collection(db, "leads"), orderBy("lastActivityAt", "desc"));

    // Aplicar filtros
    if (filters?.stage?.length) {
      q = query(q, where("stage", "in", filters.stage));
    }
    if (filters?.source?.length) {
      q = query(q, where("source", "in", filters.source));
    }
    if (filters?.ownerId?.length) {
      q = query(q, where("ownerId", "in", filters.ownerId));
    }
    if (filters?.dateRange) {
      q = query(
        q,
        where("createdAt", ">=", Timestamp.fromDate(filters.dateRange.start)),
        where("createdAt", "<=", Timestamp.fromDate(filters.dateRange.end))
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leadsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];

        // Filtro de busca por texto (client-side)
        let filteredLeads = leadsData;
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredLeads = leadsData.filter(
            (lead) =>
              lead.name.toLowerCase().includes(searchTerm) ||
              lead.email?.toLowerCase().includes(searchTerm) ||
              lead.company?.toLowerCase().includes(searchTerm)
          );
        }

        setLeads(filteredLeads);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [filters]);

  // Criar lead
  const createLead = async (
    leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  ) => {
    try {
      const now = Timestamp.now();
      const newLead = {
        ...leadData,
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
      };

      const docRef = await addDoc(collection(db, "leads"), newLead);
      return docRef.id;
    } catch (err) {
      throw new Error(`Erro ao criar lead: ${err.message}`);
    }
  };

  // Atualizar lead
  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, {
        ...updates,
        updatedAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      });
    } catch (err) {
      throw new Error(`Erro ao atualizar lead: ${err.message}`);
    }
  };

  // Deletar lead
  const deleteLead = async (leadId: string) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await deleteDoc(leadRef);
    } catch (err) {
      throw new Error(`Erro ao deletar lead: ${err.message}`);
    }
  };

  // Mudar estágio do lead
  const changeLeadStage = async (leadId: string, stage: Lead["stage"]) => {
    try {
      await updateLead(leadId, { stage });
    } catch (err) {
      throw new Error(`Erro ao mudar estágio: ${err.message}`);
    }
  };

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    changeLeadStage,
  };
}
