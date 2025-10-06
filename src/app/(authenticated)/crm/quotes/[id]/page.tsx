//src/app/(authenticated/crm/quotes/[id]/page.tsx//
"use client";

import { QuoteModal } from "@/components/comercial/modals/QuoteModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuotes } from "@/hooks/comercial/useQuotes";
import { Quote } from "@/lib/types/comercial";
import { formatDate } from "@/lib/utils/formatters";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getQuote, signQuote } = useQuotes();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigningLoading, setIsSigningLoading] = useState(false);

  const quoteId = params?.id as string | undefined;

  if (!quoteId) {
    return <div>Erro: ID do orçamento não encontrado</div>;
  }

  // ================ LOAD QUOTE ================
  useEffect(() => {
    const loadQuote = async () => {
      if (!quoteId) return;

      setLoading(true);
      try {
        const quoteData = await getQuote(quoteId);
        if (quoteData) {
          setQuote(quoteData);
        } else {
          toast.error("Orçamento não encontrado");
          router.push("/crm/quotes");
        }
      } catch (error) {
        console.error("Erro ao carregar orçamento:", error);
        toast.error("Erro ao carregar orçamento");
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId, getQuote, router]);

  // ================ HANDLERS ================
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSign = async () => {
    if (!quote) return;

    setIsSigningLoading(true);
    try {
      const success = await signQuote(quote.id ?? "");
      if (success) {
        // Recarregar dados
        const updatedQuote = await getQuote(quote.id ?? "");
        if (updatedQuote) {
          setQuote(updatedQuote);
        }
      }
    } finally {
      setIsSigningLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleShare = () => {
    if (quote?.pdfUrl) {
      window.open(quote.pdfUrl, "_blank");
    } else {
      toast.error("PDF não disponível");
    }
  };

  // ================ UTILS ================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 h-8 w-64 rounded animate-pulse" />
        <div className="bg-gray-200 h-64 rounded-lg animate-pulse" />
        <div className="bg-gray-200 h-96 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Orçamento não encontrado</p>
        <Button onClick={() => router.push("/crm/quotes")} className="mt-4">
          Voltar para orçamentos
        </Button>
      </div>
    );
  }

  const isExpired = quote.validUntil
    ? quote.validUntil.toDate() < new Date()
    : false;

  return (
    <div className="space-y-6">
      {/* ================ HEADER ================ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/crm/quotes")}
            leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.title}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <p className="text-sm text-gray-600 font-mono">{quote.number}</p>
              <Badge variant="info">{quote.status}</Badge>
              {isExpired && (
                <span className="text-sm text-red-600 font-medium">
                  (Expirado)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          {quote.pdfUrl && (
            <Button
              variant="outline"
              onClick={handleShare}
              leftIcon={<DocumentTextIcon className="w-4 h-4" />}
            >
              Ver PDF
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleEdit}
            disabled={quote.status === "signed"}
            leftIcon={<PencilIcon className="w-4 h-4" />}
          >
            Editar
          </Button>

          {quote.status === "sent" && (
            <Button
              onClick={handleSign}
              loading={isSigningLoading}
              leftIcon={<CheckCircleIcon className="w-4 h-4" />}
            >
              Assinar Orçamento
            </Button>
          )}
        </div>
      </div>

      {/* ================ INFORMAÇÕES BÁSICAS ================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Informações do Orçamento</h3>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {quote.clientName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Badge variant="info">{quote.status}</Badge>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Válido até
                </dt>
                <dd
                  className={`text-sm mt-1 ${
                    isExpired ? "text-red-600 font-medium" : "text-gray-900"
                  }`}
                >
                  {formatDate(quote.validUntil)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {formatDate(quote.createdAt)}
                </dd>
              </div>

              {quote.signedAt && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Assinado em
                    </dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {formatDate(quote.signedAt)}
                    </dd>
                  </div>
                </>
              )}

              {/* quote.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Descrição
                  </dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {quote.description}
                  </dd>
                </div>
              ) */}
            </dl>
          </CardContent>
        </Card>

        {/* ================ RESUMO FINANCEIRO ================ */}
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Resumo Financeiro</h3>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Subtotal</dt>
                <dd className="text-sm text-gray-900">
                  {formatCurrency(quote.subtotal ?? 0)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Impostos</dt>
                <dd className="text-sm text-gray-900">
                  {formatCurrency(quote.taxes ?? 0)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Desconto</dt>
                <dd className="text-sm text-red-600">
                  - {formatCurrency(quote.discount ?? 0)}
                </dd>
              </div>

              <hr />

              <div className="flex justify-between">
                <dt className="text-base font-medium text-gray-900">
                  Total Geral
                </dt>
                <dd className="text-base font-bold text-blue-600">
                  {formatCurrency(quote.grandTotal ?? 0)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* ================ ITENS DO ORÇAMENTO ================ */}
      <Card className="border shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qtd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatCurrency(item.unitPrice ?? 0)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ================ OBSERVAÇÕES ================ */}
      {quote.notes && (
        <Card className="border shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Observações</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {quote.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ================ MODAL ================ */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quote={quote}
      />
    </div>
  );
}
