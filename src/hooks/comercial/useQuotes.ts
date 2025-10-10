// src/hooks/useQuotes.ts
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
import { Quote, QuoteFilters, QuoteFormData, QuoteItem } from '@/lib/types/quotes'; // Importação corrigida
import { AsyncState } from '@/lib/types/shared';

function isError(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  return 'Erro desconhecido';
}

export function useQuotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<AsyncState<Quote[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // ================ FETCH QUOTES ================
  const fetchQuotes = useCallback(
    async (filters?: QuoteFilters) => {
      if (!user) return;

      setQuotes((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let quotesQuery = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));

        if (filters?.status?.length) {
          quotesQuery = query(quotesQuery, where('status', 'in', filters.status));
        }

        if (filters?.clientId?.length) {
          quotesQuery = query(quotesQuery, where('clientId', 'in', filters.clientId));
        }

        if (filters?.createdBy?.length) {
          quotesQuery = query(quotesQuery, where('ownerId', 'in', filters.createdBy));
        }

        const snapshot = await getDocs(quotesQuery);
        let quotesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Quote[];

        // Filtros client-side
        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          quotesData = quotesData.filter((quote) => {
            const createdAt =
              quote.createdAt instanceof Timestamp
                ? quote.createdAt.toDate()
                : new Date(quote.createdAt!);
            const start = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
            const end = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

            if (start && createdAt < start) return false;
            if (end && createdAt > end) return false;
            return true;
          });
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          quotesData = quotesData.filter(
            (quote) =>
              quote.projectTitle?.toLowerCase().includes(searchLower) ||
              quote.number?.toLowerCase().includes(searchLower) ||
              quote.clientName?.toLowerCase().includes(searchLower),
          );
        }

        setQuotes({
          data: quotesData,
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error('Erro ao buscar orçamentos:', errorMessage);
        setQuotes({
          data: null,
          loading: false,
          error: errorMessage,
        });
        toast.error(errorMessage);
      }
    },
    [user],
  );

  // ================ GET SINGLE QUOTE ================
  const getQuote = useCallback(async (id: string): Promise<Quote | null> => {
    try {
      const docRef = doc(db, 'quotes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Quote;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      toast.error('Erro ao carregar orçamento');
      return null;
    }
  }, []);

  // ================ CREATE QUOTE ================
  const createQuote = useCallback(
    async (data: QuoteFormData): Promise<string | null> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return null;
      }

      // Validações críticas
      if (!data.projectTitle) {
        toast.error('Título do projeto é obrigatório');
        return null;
      }

      if (!data.clientName && !data.client?.name) {
        toast.error('Nome do cliente é obrigatório');
        return null;
      }

      if (!data.items || data.items.length === 0) {
        toast.error('Pelo menos um item é obrigatório');
        return null;
      }

      try {
        // Processar itens
        const processedItems: QuoteItem[] = data.items.map((item, index) => ({
          ...item,
          id: item.id || `item_${index + 1}`,
          totalPrice: item.quantity * (item.unitPrice || item.value || 0),
          qty: item.quantity, // Compatibilidade
        }));

        // Calcular totais
        const subtotal = processedItems.reduce(
          (sum, item) => sum + (item.totalPrice || item.value),
          0,
        );
        const taxes = subtotal * 0.1; // 10% impostos
        const discountAmount = data.discount || 0;
        const grandTotal = subtotal + taxes - discountAmount;

        // Calcular data de expiração
        const issueDate = new Date();
        const expiryDate = new Date(
          issueDate.getTime() + (data.validityDays || 30) * 24 * 60 * 60 * 1000,
        );

        const quoteData: Omit<Quote, 'id'> = {
          // Relacionamentos
          leadId: data.leadId,
          clientId: data.clientId,
          clientName: data.client?.name || data.clientName || 'Cliente',

          // Dados básicos OBRIGATÓRIOS
          projectTitle: data.title || data.projectTitle,
          description: data.description,
          quoteType: data.quoteType || 'producao',

          // Datas OBRIGATÓRIAS
          issueDate: issueDate.toISOString(),
          validityDays: 30,
          expiryDate: expiryDate.toISOString(),

          // Status OBRIGATÓRIO
          status: data.status || 'draft',

          // Itens OBRIGATÓRIOS
          items: processedItems,

          // Totais OBRIGATÓRIOS
          totals: {
            subtotal,
            discount: discountAmount,
            discountType: data.discountType || 'fixed',
            freight: 0,
            taxes,
            total: grandTotal,
          },

          // Campos de compatibilidade
          subtotal,
          taxes,
          discount: discountAmount,
          grandTotal,
          validUntil: Timestamp.fromDate(expiryDate),

          // Campos opcionais
          productionTime: undefined,
          terms: undefined,
          notes: data.notes,
          pdfUrl: undefined,

          // Campos de usuário
          ownerId: user.uid,
          ownerName: user.displayName || 'Usuário',

          // Timestamps OBRIGATÓRIOS
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),

          // Auto-gerado pela Cloud Function
          number: 'Processando...',
        };

        console.log('💾 Salvando orçamento:', quoteData);
        const docRef = await addDoc(collection(db, 'quotes'), quoteData);

        // Aguardar Cloud Function processar numeração
        setTimeout(async () => {
          await fetchQuotes();
        }, 2000);

        toast.success('Orçamento criado com sucesso!');
        return docRef.id;
      } catch (error: unknown) {
        console.error('❌ ERRO AO CRIAR ORÇAMENTO:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(`Erro ao criar orçamento: ${errorMessage}`);
        return null;
      }
    },
    [user, fetchQuotes],
  );

  // ================ UPDATE QUOTE ================
  const updateQuote = useCallback(
    async (id: string, data: Partial<Quote>): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'quotes', id);
        const updateData: Partial<Quote> & { updatedAt: Timestamp } = {
          ...data,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);
        toast.success('Orçamento atualizado com sucesso!');
        await fetchQuotes();

        return true;
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        toast.error(`Erro ao atualizar orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes],
  );

  // ================ SIGN QUOTE ================
  const signQuote = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        const docRef = doc(db, 'quotes', id);
        await updateDoc(docRef, {
          status: 'signed',
          signedAt: Timestamp.now(),
          signedBy: user?.uid || 'dev-user-123',
          updatedAt: Timestamp.now(),
        });

        toast.success('Orçamento assinado com sucesso!');
        await fetchQuotes();

        return true;
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        toast.error(`Erro ao assinar orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes],
  );

  // ================ DELETE QUOTE ================
  const deleteQuote = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      try {
        await deleteDoc(doc(db, 'quotes', id));
        toast.success('Orçamento excluído com sucesso!');
        await fetchQuotes();

        return true;
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        toast.error(`Erro ao excluir orçamento: ${errorMessage}`);
        return false;
      }
    },
    [user, fetchQuotes],
  );

  // ================ EFFECTS ================
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
