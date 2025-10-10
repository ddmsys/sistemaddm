// src/app/(authenticated)/crm/quotes/page.tsx
'use client';

import { Timestamp } from 'firebase/firestore';
import { FileText, Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { QuoteCard } from '@/components/comercial/cards/QuoteCard';
import QuoteModal from '@/components/comercial/modals/QuoteModal'; // Corrigido import
import { useFirestore } from '@/hooks/useFirestore'; // Corrigido import
import { Client, Quote, QuoteFormData, QuoteStatus } from '@/lib/types/quotes'; // Corrigido import

interface FilterState {
  status: QuoteStatus | '';
  search: string;
}

export default function QuotesPage() {
  // ================ HOOKS ================
  const { data: quotes, loading, create, update, remove } = useFirestore<Quote>('quotes');

  const { data: clientsData } = useFirestore<Client>('clients');
  const clients = (clientsData || []).filter((c: Client) => c.status === 'active'); // Corrigido

  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    search: '',
  });

  // ================ HANDLERS ================
  const handleCreateQuote = async (data: QuoteFormData) => {
    try {
      if (selectedQuote) {
        // Editando - CORREÇÃO: usar apenas campos válidos de Quote
        await update(selectedQuote.id!, {
          projectTitle: data.title || data.projectTitle,
          description: data.description,
          clientId: data.clientId,
          clientName: data.client?.name || data.clientName || 'Cliente',
          status: data.status || selectedQuote.status,

          // Campos simples válidos
          discount: data.discount || 0,
          notes: data.notes,

          // Validar data antes de converter
          validUntil: data.validUntil
            ? Timestamp.fromDate(new Date(data.validUntil))
            : selectedQuote.validUntil,

          // Timestamps obrigatórios
          updatedAt: Timestamp.now(),
        });
      } else {
        // Resto do código de criação permanece igual...
        const subtotal = data.items.reduce(
          (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
          0,
        );
        const taxes = subtotal * 0.1;
        const discount = data.discount || 0;
        const total = subtotal + taxes - discount;

        const quoteData: Omit<Quote, 'id'> = {
          // ... resto da criação permanece igual
          leadId: data.leadId,
          clientId: data.clientId,
          clientName: data.client?.name || data.clientName || 'Cliente',
          projectTitle: data.title || data.projectTitle,
          description: data.description,
          quoteType: data.quoteType || 'producao',
          issueDate: new Date().toISOString(),
          validityDays: 30,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: data.status || 'draft',
          items: data.items.map((item, index) => ({
            ...item,
            id: item.id || `item_${index + 1}`,
            kind: 'etapa',
            value: (item.unitPrice || 0) * item.quantity,
            totalPrice: (item.unitPrice || 0) * item.quantity,
            qty: item.quantity,
          })),
          totals: {
            subtotal,
            discount,
            discountType: 'fixed',
            freight: 0,
            taxes,
            total,
          },
          subtotal,
          taxes,
          discount,
          grandTotal: total,
          validUntil: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
          notes: data.notes,
          number: 'Processando...',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await create(quoteData);
      }

      setShowModal(false);
      setSelectedQuote(null);
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      throw error;
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await remove(quoteId);
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const handleStatusChange = async (quoteId: string, status: QuoteStatus) => {
    try {
      await update(quoteId, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  // ================ CONFIGURAÇÕES ================
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'draft', label: 'Rascunho' },
    { value: 'sent', label: 'Enviado' },
    { value: 'viewed', label: 'Visualizado' },
    { value: 'signed', label: 'Assinado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'expired', label: 'Expirado' },
  ];

  // ================ FILTROS ================
  const displayQuotes = (quotes || []).filter((quote: Quote) => {
    if (filters.status && quote.status !== filters.status) return false;
    if (
      filters.search &&
      !quote.projectTitle.toLowerCase().includes(filters.search.toLowerCase()) &&
      !quote.clientName?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !quote.number?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
          <p className="mt-2 text-gray-600">Gerencie seus orçamentos</p>
        </div>
        <button
          onClick={() => {
            setSelectedQuote(null);
            setShowModal(true);
          }}
          className="mt-4 flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:mt-0"
        >
          <Plus className="mr-2 h-5 w-5" />
          Novo Orçamento
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Buscar orçamentos</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Título, cliente, número..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as QuoteStatus | '',
              })
            }
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loading ? 'Carregando...' : `${displayQuotes.length} orçamentos encontrados`}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Assinados: {(quotes || []).filter((q: Quote) => q.status === 'signed').length}
          </span>
          <span>Total: {quotes?.length || 0}</span>
        </div>
      </div>

      {/* Quotes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Carregando orçamentos...</div>
        </div>
      ) : displayQuotes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Nenhum orçamento encontrado</h3>
          <p className="mt-2 text-gray-600">Comece criando seu primeiro orçamento.</p>
          <button
            onClick={() => {
              setSelectedQuote(null);
              setShowModal(true);
            }}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Criar Primeiro Orçamento
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayQuotes.map((quote: Quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onStatusChange={handleStatusChange}
              onEdit={handleEditQuote}
              onDelete={handleDeleteQuote}
              onConvert={(quoteId) => {
                // Implementar conversão para projeto
                console.log('Converter para projeto:', quoteId);
              }}
              onDownload={(quoteId) => {
                // Implementar download do PDF
                console.log('Download PDF:', quoteId);
              }}
              onSend={(quoteId) => {
                handleStatusChange(quoteId, 'sent');
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <QuoteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedQuote(null);
        }}
        onSubmit={handleCreateQuote}
        quote={selectedQuote}
        clients={clients}
      />
    </div>
  );
}
