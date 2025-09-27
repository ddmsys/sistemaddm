import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Quote } from "@/lib/types/comercial";

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ BUSCAR ORÇAMENTOS
  useEffect(() => {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const quotesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Quote[];

        console.log("✅ Orçamentos carregados:", quotesData.length);
        setQuotes(quotesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("❌ Erro ao buscar orçamentos:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // ✅ CRIAR ORÇAMENTO COM LIMPEZA DE DADOS
  const createQuote = async (quoteData: any) => {
    try {
      console.log("🚀 Dados originais do orçamento:", quoteData);

      // ✅ LIMPAR E PREPARAR DADOS
      const cleanedData = {
        ...quoteData,
        // ✅ GARANTIR QUE ARRAYS EXISTEM
        items: quoteData.items || [],

        // ✅ CONVERTER VALORES PARA NÚMEROS
        total: Number(quoteData.total) || 0,
        subtotal: Number(quoteData.subtotal) || 0,
        discount: Number(quoteData.discount) || 0,

        // ✅ LIMPAR ITEMS SE EXISTIR
        ...(quoteData.items && {
          items: quoteData.items.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || 0,
            totalPrice: Number(item.totalPrice) || 0,
          })),
        }),
      };

      const now = Timestamp.now();
      const newQuote = {
        ...cleanedData,
        number: `ORC-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };

      console.log("📝 Dados limpos para Firebase:", newQuote);

      const docRef = await addDoc(collection(db, "quotes"), newQuote);

      console.log("✅ Orçamento criado! ID:", docRef.id);
      return docRef.id;
    } catch (err: any) {
      console.error("❌ ERRO DETALHADO ao criar orçamento:");
      console.error("❌ Mensagem:", err.message);
      console.error("❌ Código:", err.code);
      console.error("❌ Stack:", err.stack);
      console.error("❌ Dados que falharam:", quoteData);

      throw new Error(`Erro ao criar orçamento: ${err.message}`);
    }
  };

  // ✅ ATUALIZAR ORÇAMENTO
  const updateQuote = async (quoteId: string, updates: any) => {
    try {
      console.log("🔄 Atualizando orçamento:", quoteId, updates);

      // ✅ LIMPAR DADOS DE UPDATE TAMBÉM
      const cleanedUpdates = {
        ...updates,
        ...(updates.total !== undefined && {
          total: Number(updates.total) || 0,
        }),
        ...(updates.items && {
          items: updates.items.map((item: any) => ({
            ...item,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice) || 0,
            totalPrice: Number(item.totalPrice) || 0,
          })),
        }),
        updatedAt: Timestamp.now(),
      };

      const quoteRef = doc(db, "quotes", quoteId);
      await updateDoc(quoteRef, cleanedUpdates);

      console.log("✅ Orçamento atualizado:", quoteId);
    } catch (err: any) {
      console.error("❌ Erro ao atualizar orçamento:", err);
      throw new Error(`Erro ao atualizar orçamento: ${err.message}`);
    }
  };

  // ✅ DELETAR ORÇAMENTO
  const deleteQuote = async (quoteId: string) => {
    try {
      const quoteRef = doc(db, "quotes", quoteId);
      await deleteDoc(quoteRef);

      console.log("✅ Orçamento deletado:", quoteId);
    } catch (err: any) {
      console.error("❌ Erro ao deletar orçamento:", err);
      throw new Error(`Erro ao deletar orçamento: ${err.message}`);
    }
  };

  return {
    quotes,
    loading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
  };
}
