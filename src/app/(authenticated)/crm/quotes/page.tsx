'use client';

import { Timestamp } from 'firebase/firestore';
import { Calendar, FileText, Filter, Plus, Search, User } from 'lucide-react';
import { useState } from 'react';

import { QuoteModal } from '@/components/comercial/modals/QuoteModal';
import { useFirestore } from '@/hooks/useFirestore';
import { Client, Quote, QuoteFormData, QuoteStatus } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface FilterState {
  status: QuoteStatus | '';
  search: string;
}

export default function QuotesPage() {
  const { data: quotes, loading, create, update, remove } = useFirestore<Quote>('quotes');
  const { data: clients } = useFirestore<Client>('clients');
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    search: '',
  });

  const handleCreateQuote = async (data: QuoteFormData) => {
    try {
      if (selectedQuote) {
        await update(selectedQuote.id, {
          ...data,
          valid_until: Timestamp.fromDate(new Date(data.valid_until)),
        });
      } else {
        // Encontrar cliente para pegar o nome
        const client = clients.find((c) => c.id === data.client_id);

        await create({
          ...data,
          quote_number: `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          status: 'draft' as QuoteStatus,
          client_name: client?.name || '',
          subtotal: data.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0),
          discount_amount:
            data.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) *
            (data.discount_percentage / 100),
          total:
            data.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) *
            (1 - data.discount_percentage / 100),
          valid_until: Timestamp.fromDate(new Date(data.valid_until)),
          pdf_url: '',
        });
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

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'draft', label: 'Rascunho' },
    { value: 'sent', label: 'Enviado' },
    { value: 'viewed', label: 'Visualizado' },
    { value: 'signed', label: 'Assinado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'expired', label: 'Expirado' },
  ];

  const getStatusColor = (status: QuoteStatus) => {
    const colors = {
      draft: 'bg-gray-50 text-gray-700 border-gray-200',
      sent: 'bg-blue-50 text-blue-700 border-blue-200',
      viewed: 'bg-amber-50 text-amber-700 border-amber-200',
      signed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      expired: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[status];
  };

  const getStatusLabel = (status: QuoteStatus) => {
    const labels = {
      draft: 'Rascunho',
      sent: 'Enviado',
      viewed: 'Visualizado',
      signed: 'Assinado',
      rejected: 'Rejeitado',
      expired: 'Expirado',
    };
    return labels[status];
  };

  const displayQuotes = quotes.filter((quote) => {
    if (filters.status && quote.status !== filters.status) return false;
    if (
      filters.search &&
      !quote.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !quote.client_name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !quote.quote_number.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Orçamentos</h1>
            <p className="mt-2 text-primary-600">Gerencie seus orçamentos e propostas</p>
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
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-primary-700">
                Buscar orçamentos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-primary-400" />
                <input
                  type="text"
                  className="h-12 w-full rounded-lg border border-primary-200 pl-10 pr-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Título, número ou cliente..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="mb-2 block text-sm font-medium text-primary-700">Status</label>
              <select
                className="h-12 w-full rounded-lg border border-primary-200 px-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
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

            <button className="flex items-center rounded-lg border border-primary-300 px-4 py-3 text-primary-700 transition-colors hover:bg-primary-50">
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {loading ? 'Carregando...' : `${displayQuotes.length} orçamentos encontrados`}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span>Assinados: {quotes.filter((q) => q.status === 'signed').length}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" />
                  <span>Total: {quotes.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <span className="ml-2 text-primary-600">Carregando orçamentos...</span>
              </div>
            ) : displayQuotes.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-primary-300" />
                <h3 className="mb-2 text-lg font-medium text-primary-900">
                  Nenhum orçamento encontrado
                </h3>
                <p className="mb-6 text-primary-600">Comece criando seu primeiro orçamento.</p>
                <button
                  onClick={() => {
                    setSelectedQuote(null);
                    setShowModal(true);
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Criar Primeiro Orçamento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayQuotes.map((quote) => {
                  const isExpired =
                    quote.valid_until && new Date(quote.valid_until.seconds * 1000) < new Date();

                  return (
                    <div
                      key={quote.id}
                      className={`rounded-lg border p-6 transition-all hover:shadow-md ${getStatusColor(
                        quote.status,
                      )} ${isExpired && 'opacity-75'}`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold leading-tight text-primary-900">
                              {quote.title}
                            </h3>
                            <p className="text-xs text-primary-500">{quote.quote_number}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="rounded-full border px-2 py-1 text-xs font-medium">
                            {getStatusLabel(quote.status)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-center text-sm text-primary-600">
                          <User className="mr-2 h-4 w-4" />
                          <span className="truncate">{quote.client_name}</span>
                        </div>
                        <div className="flex items-center text-sm text-primary-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            Válido até: {formatDate(new Date(quote.valid_until.seconds * 1000))}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 rounded-md bg-primary-100 py-2 text-center">
                        <div className="text-lg font-bold text-primary-900">
                          {formatCurrency(quote.total)}
                        </div>
                        {quote.discount_amount > 0 && (
                          <div className="text-xs text-emerald-600">
                            Desconto: {formatCurrency(quote.discount_amount)}
                          </div>
                        )}
                      </div>

                      <div className="mb-4 text-xs text-primary-600">
                        <span className="font-medium">{quote.items.length}</span>
                        {quote.items.length === 1 ? ' item' : ' itens'}
                      </div>

                      <div className="flex items-center justify-between border-t border-white border-opacity-20 pt-4">
                        <div className="text-xs text-primary-500">
                          {quote.created_at &&
                            formatDate(new Date(quote.created_at.seconds * 1000))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditQuote(quote)}
                            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>

                      {isExpired && (
                        <div className="absolute -right-2 -top-2">
                          <span className="rounded-full border border-red-200 bg-red-100 px-2 py-1 text-xs text-red-700">
                            Expirado
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

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
    </div>
  );
}
