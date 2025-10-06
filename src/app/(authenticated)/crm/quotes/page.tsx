"use client";

import { QuoteModal } from "@/components/comercial/modals/QuoteModal";
import { useFirestore } from "@/hooks/useFirestore";
import { Client, Quote, QuoteFormData, QuoteStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, FileText, Filter, Plus, Search, User } from "lucide-react";
import { useState } from "react";

interface FilterState {
  status: QuoteStatus | "";
  search: string;
}

export default function QuotesPage() {
  const {
    data: quotes,
    loading,
    create,
    update,
    remove,
  } = useFirestore<Quote>("quotes");
  const { data: clients } = useFirestore<Client>("clients");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    search: "",
  });

  const handleCreateQuote = async (data: QuoteFormData) => {
    try {
      if (selectedQuote) {
        await update(selectedQuote.id, {
          ...data,
          valid_until: new Date(data.valid_until) as any,
        });
      } else {
        // Encontrar cliente para pegar o nome
        const client = clients.find((c) => c.id === data.client_id);

        await create({
          ...data,
          quote_number: `QUO-${new Date().getFullYear()}-${String(
            Date.now()
          ).slice(-6)}`,
          status: "draft" as QuoteStatus,
          client_name: client?.name || "",
          subtotal: data.items.reduce(
            (sum, item) => sum + item.quantity * item.unit_price,
            0
          ),
          discount_amount:
            data.items.reduce(
              (sum, item) => sum + item.quantity * item.unit_price,
              0
            ) *
            (data.discount_percentage / 100),
          total:
            data.items.reduce(
              (sum, item) => sum + item.quantity * item.unit_price,
              0
            ) *
            (1 - data.discount_percentage / 100),
          valid_until: new Date(data.valid_until) as any,
          pdf_url: "",
        });
      }
      setShowModal(false);
      setSelectedQuote(null);
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      throw error;
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        await remove(quoteId);
      } catch (error) {
        console.error("Erro ao excluir orçamento:", error);
      }
    }
  };

  const statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "draft", label: "Rascunho" },
    { value: "sent", label: "Enviado" },
    { value: "viewed", label: "Visualizado" },
    { value: "signed", label: "Assinado" },
    { value: "rejected", label: "Rejeitado" },
    { value: "expired", label: "Expirado" },
  ];

  const getStatusColor = (status: QuoteStatus) => {
    const colors = {
      draft: "bg-gray-50 text-gray-700 border-gray-200",
      sent: "bg-blue-50 text-blue-700 border-blue-200",
      viewed: "bg-amber-50 text-amber-700 border-amber-200",
      signed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      expired: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[status];
  };

  const getStatusLabel = (status: QuoteStatus) => {
    const labels = {
      draft: "Rascunho",
      sent: "Enviado",
      viewed: "Visualizado",
      signed: "Assinado",
      rejected: "Rejeitado",
      expired: "Expirado",
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Orçamentos</h1>
            <p className="text-primary-600 mt-2">
              Gerencie seus orçamentos e propostas
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedQuote(null);
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Orçamento
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Buscar orçamentos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-primary-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Título, número ou cliente..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Status
              </label>
              <select
                className="w-full h-12 px-4 border border-primary-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as QuoteStatus | "",
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

            <button className="flex items-center px-4 py-3 text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {loading
                  ? "Carregando..."
                  : `${displayQuotes.length} orçamentos encontrados`}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span>
                    Assinados:{" "}
                    {quotes.filter((q) => q.status === "signed").length}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>Total: {quotes.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-primary-600">
                  Carregando orçamentos...
                </span>
              </div>
            ) : displayQuotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  Nenhum orçamento encontrado
                </h3>
                <p className="text-primary-600 mb-6">
                  Comece criando seu primeiro orçamento.
                </p>
                <button
                  onClick={() => {
                    setSelectedQuote(null);
                    setShowModal(true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Criar Primeiro Orçamento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayQuotes.map((quote) => {
                  const isExpired =
                    quote.valid_until &&
                    new Date(quote.valid_until.seconds * 1000) < new Date();

                  return (
                    <div
                      key={quote.id}
                      className={`rounded-lg border p-6 hover:shadow-md transition-all ${getStatusColor(
                        quote.status
                      )} ${isExpired && "opacity-75"}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary-900 leading-tight">
                              {quote.title}
                            </h3>
                            <p className="text-xs text-primary-500">
                              {quote.quote_number}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full border">
                            {getStatusLabel(quote.status)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-primary-600">
                          <User className="w-4 h-4 mr-2" />
                          <span className="truncate">{quote.client_name}</span>
                        </div>
                        <div className="flex items-center text-sm text-primary-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Válido até:{" "}
                            {formatDate(
                              new Date(quote.valid_until.seconds * 1000)
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="text-center py-2 bg-primary-100 rounded-md mb-4">
                        <div className="text-lg font-bold text-primary-900">
                          {formatCurrency(quote.total)}
                        </div>
                        {quote.discount_amount > 0 && (
                          <div className="text-xs text-emerald-600">
                            Desconto: {formatCurrency(quote.discount_amount)}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-primary-600 mb-4">
                        <span className="font-medium">
                          {quote.items.length}
                        </span>
                        {quote.items.length === 1 ? " item" : " itens"}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                        <div className="text-xs text-primary-500">
                          {quote.created_at &&
                            formatDate(
                              new Date(quote.created_at.seconds * 1000)
                            )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditQuote(quote)}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>

                      {isExpired && (
                        <div className="absolute -top-2 -right-2">
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full border border-red-200">
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
