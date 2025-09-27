"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuoteModal } from "@/components/comercial/modals/QuoteModal"; // ✅ IMPORT CORRETO
import { useQuotes } from "@/hooks/comercial/useQuotes";
import { Quote } from "@/lib/types/comercial";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";

// ✅ FUNÇÃO FORMATDATE CORRIGIDA
const formatDate = (dateValue: any): string => {
  if (!dateValue) return "Sem data";

  try {
    // Se for Timestamp do Firestore
    if (dateValue && typeof dateValue === "object" && "toMillis" in dateValue) {
      return new Date(dateValue.toMillis()).toLocaleDateString("pt-BR");
    }

    // Se for Timestamp com seconds
    if (dateValue && typeof dateValue === "object" && "seconds" in dateValue) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString("pt-BR");
    }

    // Se for Date ou string
    return new Date(dateValue).toLocaleDateString("pt-BR");
  } catch (error) {
    console.warn("Erro ao formatar data:", dateValue, error);
    return "Data inválida";
  }
};

export default function QuotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    quotes,
    loading: quotesLoading,
    createQuote,
    updateQuote,
    deleteQuote,
  } = useQuotes();

  // ✅ FILTRAR QUOTES
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredQuotes(quotes);
      return;
    }

    const filtered = quotes.filter((quote) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        quote.title.toLowerCase().includes(searchLower) ||
        (quote.description &&
          quote.description.toLowerCase().includes(searchLower)) ||
        (quote.number && quote.number.toLowerCase().includes(searchLower)) ||
        (quote.id && quote.id.toLowerCase().includes(searchLower))
      );
    });

    setFilteredQuotes(filtered);
  }, [quotes, searchTerm]);

  const handleSave = async (
    quoteData: Omit<Quote, "id" | "number" | "createdAt" | "updatedAt">
  ): Promise<void> => {
    setLoading(true);
    try {
      if (selectedQuote?.id) {
        await updateQuote(selectedQuote.id, quoteData);
      } else {
        await createQuote(quoteData);
      }
      setIsModalOpen(false);
      setSelectedQuote(null);
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleDelete = async (quoteId: string) => {
    if (!confirm("Tem certeza que deseja deletar este orçamento?")) return;

    try {
      await deleteQuote(quoteId);
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
      alert("Erro ao deletar orçamento");
    }
  };

  const getStatusColor = (status: Quote["status"]) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      signed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: Quote["status"]) => {
    const labels = {
      draft: "Rascunho",
      sent: "Enviado",
      signed: "Assinado",
      rejected: "Rejeitado",
      expired: "Expirado",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orçamentos</h1>
          <p className="text-slate-600">Gerencie suas propostas comerciais</p>
        </div>
        <Button
          onClick={() => {
            setSelectedQuote(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Orçamento
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Buscar orçamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Orçamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quotesLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-600 mt-2">Carregando orçamentos...</p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhum orçamento encontrado
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm
                ? "Tente uma busca diferente"
                : "Comece criando seu primeiro orçamento"}
            </p>
            <Button
              onClick={() => {
                setSelectedQuote(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Orçamento
            </Button>
          </Card>
        ) : (
          filteredQuotes.map((quote) => (
            <Card
              key={quote.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {quote.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        #{quote.number || "N/A"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      quote.status
                    )}`}
                  >
                    {getStatusLabel(quote.status)}
                  </span>
                </div>

                {quote.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {quote.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign size={14} />
                    <div>
                      <p className="font-medium">Total</p>
                      <p>
                        R${" "}
                        {(quote.grandTotal || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={14} />
                    <div>
                      <p className="font-medium">Válido até</p>
                      <p>
                        {formatDate(quote.validUntil)} {/* ✅ CORRIGIDO */}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <p>
                    <span className="font-medium">Itens:</span>{" "}
                    {quote.items?.length || 0}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(quote)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(quote.id!)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuote(null);
        }}
        quote={selectedQuote}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}
