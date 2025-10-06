"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  ComercialFilters,
  Quote,
  QuoteFormData,
  QuoteItem,
} from "@/lib/types/quotes";
import { AsyncState } from "@/lib/types/shared";
import { getErrorMessage } from "@/lib/utils/errors";
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
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function useQuotes() {
  const { user } = useAuth();

  const [quotes, setQuotes] = useState<AsyncState<Quote[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // =================== FETCH QUOTES ===================
  const fetchQuotes = useCallback(
    async (filters?: ComercialFilters) => {
      if (!user) return;

      setQuotes((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let quotesQuery = query(
          collection(db, "quotes"),
          orderBy("createdAt", "desc")
        );

        if (filters?.status?.length) {
          quotesQuery = query(
            quotesQuery,
            where("status", "in", filters.status)
          );
        }

        const snapshot = await getDocs(quotesQuery);
        const quotesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Quote)
        );

        let filteredQuotes = quotesData;

        // Filtro por data
        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          filteredQuotes = filteredQuotes.filter((quote) => {
            const createdAt = quote.createdAt
              ? quote.createdAt instanceof Timestamp
                ? quote.createdAt.toDate()
                : new Date(quote.createdAt)
              : null;
            const start = filters.dateRange?.start
              ? new Date(filters.dateRange.start)
              : null;
            const end = filters.dateRange?.end
              ? new Date(filters.dateRange.end)
              : null;
            if (!createdAt) return false;
            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        // Filtro por busca
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredQuotes = filteredQuotes.filter(
            (quote) =>
              quote.projectTitle?.toLowerCase().includes(searchLower) ||
              quote.number?.toLowerCase().includes(searchLower) ||
              quote.client?.name?.toLowerCase().includes(searchLower)
          );
        }

        setQuotes({
          data: filteredQuotes,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao buscar orçamentos:", error);
        setQuotes({ data: null, loading: false, error: errorMessage });
        toast.error("Erro ao carregar orçamentos");
      }
    },
    [user]
  );

  // =================== GET SINGLE QUOTE ===================
  const getQuote = useCallback(async (id: string): Promise<Quote | null> => {
    try {
      const docRef = doc(db, "quotes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Quote;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      toast.error("Erro ao carregar orçamento");
      return null;
    }
  }, []);

  // =================== CREATE QUOTE ===================
  const createQuote = useCallback(
    async (data: QuoteFormData): Promise<string | null> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return null;
      }

      try {
        const processedItems: QuoteItem[] = data.items.map((item, index) => ({
          ...item,
          id: item.id || `item_${index + 1}`,
          totalPrice: item.quantity * (item.unitPrice || 0),
        }));

        const subtotal = processedItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        const taxes = subtotal * 0.1; // 10% impostos
        const grandTotal = subtotal + taxes - (data.discount ?? 0);

        const quoteData: Omit<Quote, "id" | "number"> = {
          leadId: data.leadId,
          clientId: data.clientId,
          clientName: data.client?.name || "Cliente", // Adicionando clientName obrigatório
          client: data.client, // agora é um objeto, se quiser só o nome: client: { name: data.clientName ?? "" }
          projectTitle: data.title,
          quoteType: "producao",
          issueDate: new Date().toISOString(),
          validityDays: 30,
          expiryDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          items: processedItems,
          totals: {
            subtotal,
            discount: data.discount || 0,
            discountType: "fixed",
            freight: 0,
            taxes,
            total: grandTotal,
          },
          productionTime: undefined,
          terms: undefined,
          notes: data.notes,
          pdfUrl: undefined,
          status: "draft",
          ownerId: user.uid,
          ownerName: user.displayName ?? "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "quotes"), quoteData);
        
        // Aguardar um pouco para a Cloud Function processar a numeração
        setTimeout(async () => {
          await fetchQuotes();
        }, 2000);
        
        toast.success("Orçamento criado com sucesso!");
        return docRef.id;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao criar orçamento:", error);
        toast.error(`Erro ao criar orçamento: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchQuotes]
  );

  // =================== UPDATE QUOTE ===================
  const updateQuote = useCallback(
    async (id: string, data: Partial<QuoteFormData>): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }
      try {
        const docRef = doc(db, "quotes", id);

        // Prepare update fields somente com os que vieram alterados
        const updateData: Partial<Quote> = {
          updatedAt: Timestamp.now(),
        };

        if (data.title) updateData.projectTitle = data.title;
        if (data.client) updateData.client = data.client;
        if (data.notes) updateData.notes = data.notes;
        if (data.discount !== undefined)
          if (data.items) {
            const processedItems: QuoteItem[] = data.items.map(
              (item, index) => ({
                ...item,
                id: item.id || `item_${index + 1}`,
                totalPrice: item.quantity * (item.unitPrice || 0),
              })
            );
            updateData.items = processedItems;

            updateData.totals = {
              subtotal: processedItems.reduce(
                (sum, item) => sum + item.totalPrice,
                0
              ),
              discount: data.discount ?? 0,
              discountType: "fixed",
              freight: 0,
              taxes:
                processedItems.reduce((sum, item) => sum + item.totalPrice, 0) *
                0.1,
              total:
                processedItems.reduce((sum, item) => sum + item.totalPrice, 0) *
                  1.1 -
                (data.discount ?? 0),
            };
          }

        await updateDoc(docRef, updateData);
        toast.success("Orçamento atualizado com sucesso!");
        await fetchQuotes();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao atualizar orçamento:", error);
        toast.error(`Erro ao atualizar orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes]
  );

  // =================== SIGN QUOTE ===================
  const signQuote = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }
      try {
        const docRef = doc(db, "quotes", id);
        await updateDoc(docRef, {
          status: "signed",
          signedAt: Timestamp.now(),
          signedBy: user?.uid || "dev-user-123",
          updatedAt: Timestamp.now(),
        });
        toast.success("Orçamento assinado com sucesso!");
        await fetchQuotes();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao assinar orçamento:", error);
        toast.error(`Erro ao assinar orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes]
  );

  // =================== DELETE QUOTE ===================
  const deleteQuote = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error("Usuário não autenticado");
        return false;
      }
      try {
        await deleteDoc(doc(db, "quotes", id));
        toast.success("Orçamento excluído com sucesso!");
        await fetchQuotes();
        return true;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao excluir orçamento:", error);
        toast.error(`Erro ao excluir orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes]
  );

  // =================== EFEITO - INICIAL ===================
  useEffect(() => {
    if (user) {
      void fetchQuotes();
    }
  }, [user, fetchQuotes]);

  return {
    quotes: quotes.data || [],
    loading: quotes.loading,
    error: quotes.error,
    fetchQuotes,
    getQuote,
    createQuote,
    updateQuote,
    signQuote,
    deleteQuote,
    refetch: fetchQuotes,
  };
}
