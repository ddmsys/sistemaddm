// src/app/(authenticated)/crm/quotes/[id]/page.tsx
'use client';

import { Timestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import QuoteModal from '@/components/comercial/modals/QuoteModal'; // Corrigido import
import { useFirestore } from '@/hooks/useFirestore';
import { Client, Quote, QuoteFormData } from '@/lib/types/quotes'; // Corrigido - só types de quotes
import { formatCurrency } from '@/lib/utils';

export default function QuoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params?.id as string;

  const [quote, setQuote] = useState<Quote | null>(null); // Corrigido tipo
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const { update, getById } = useFirestore<Quote>('quotes');
  const { data: clientsData } = useFirestore<Client>('clients');
  const clients = clientsData || [];

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) {
        router.push('/crm/quotes');
        return;
      }

      try {
        setLoading(true);
        const quoteData = await getById(quoteId);
        if (quoteData) {
          setQuote(quoteData as Quote); // Cast para Quote correto
        } else {
          console.error('Orçamento não encontrado');
          router.push('/crm/quotes');
        }
      } catch (error) {
        console.error('Erro ao carregar orçamento:', error);
        router.push('/crm/quotes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId, getById, router]);

  const handleUpdateQuote = async (updatedData: QuoteFormData) => {
    if (!quote?.id) return;

    try {
      // Atualizar só campos válidos do Quote
      await update(quote.id, {
        projectTitle: updatedData.projectTitle,
        description: updatedData.description,
        items: updatedData.items,
        discount: updatedData.discount,
        notes: updatedData.notes,
        validUntil: updatedData.validUntil
          ? Timestamp.fromDate(new Date(updatedData.validUntil))
          : quote.validUntil,
        updatedAt: Timestamp.now(),
      });

      // Recarregar dados
      const refreshedQuote = await getById(quote.id);
      if (refreshedQuote) {
        setQuote(refreshedQuote as Quote);
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Carregando orçamento...</div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Orçamento não encontrado</h2>
          <p className="mt-2 text-gray-600">O orçamento solicitado não existe ou foi removido.</p>
          <button
            onClick={() => router.push('/crm/quotes')}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Voltar aos Orçamentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quote.projectTitle}</h1>
          <p className="text-sm text-gray-600">{quote.number || 'Número em processamento...'}</p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Editar Orçamento
        </button>
      </div>

      {/* Resto da página com dados do quote... */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Informações</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Cliente:</span>
              <p className="font-medium">{quote.clientName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <p className="font-medium">{quote.status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Total:</span>
              <p className="text-lg font-medium text-blue-600">
                {formatCurrency(quote.totals?.total || quote.grandTotal || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateQuote}
        quote={quote}
        clients={clients}
      />
    </div>
  );
}
