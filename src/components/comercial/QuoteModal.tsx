"use client";

import { useState, useEffect } from "react";
import { Quote } from "@/lib/types/quotes";
import { useQuotes } from "@/hooks/useQuotes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Package,
} from "lucide-react";

interface QuoteModalProps {
  quote: Quote | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuoteModal({ quote, onClose, onSuccess }: QuoteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { sendQuote, signQuote, updateQuote } = useQuotes();

  if (!quote) return null;

  const isNew = !quote.id;

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      viewed: "bg-purple-100 text-purple-800",
      signed: "bg-green-100 text-green-800",
      refused: "bg-red-100 text-red-800",
      expired: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusName = (status: string) => {
    const names = {
      draft: "Rascunho",
      sent: "Enviado",
      viewed: "Visualizado",
      signed: "Assinado",
      refused: "Recusado",
      expired: "Expirado",
    };
    return names[status as keyof typeof names] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: Edit,
      sent: Send,
      viewed: Eye,
      signed: CheckCircle,
      refused: XCircle,
      expired: Clock,
    };
    return icons[status as keyof typeof icons] || FileText;
  };

  const handleGeneratePDF = async () => {
    setIsLoading(true);
    try {
      console.log("Gerando PDF para quote:", quote.id);
      // Implementar chamada para Cloud Function
      // const response = await httpsCallable(functions, 'createQuotePdf')({ quoteId: quote.id })
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendQuote = async () => {
    if (!quote.id) return;
    setIsLoading(true);
    try {
      await sendQuote(quote.id);
      onSuccess();
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignQuote = async () => {
    if (!quote.id) return;
    const signedBy = prompt("Digite o nome de quem está assinando:");
    if (!signedBy) return;

    setIsLoading(true);
    try {
      await signQuote(quote.id, signedBy);
      onSuccess();
    } catch (error) {
      console.error("Erro ao assinar orçamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "-";
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const isExpired = quote.expiryDate && new Date(quote.expiryDate) < new Date();
  const StatusIcon = getStatusIcon(quote.status);

  if (isNew) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Novo Orçamento
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Formulário Completo em Desenvolvimento
            </h3>
            <p className="text-gray-600 mb-6">
              O formulário completo para criação de orçamentos será implementado
              na próxima versão. Por enquanto, você pode visualizar orçamentos
              existentes.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Funcionalidades planejadas:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Seleção de cliente existente ou criação de novo cliente
                </li>
                <li>• Adição de itens de produção e impressão</li>
                <li>• Cálculo automático de valores</li>
                <li>• Definição de prazos e condições</li>
                <li>• Geração automática de PDF</li>
                <li>• Envio por email</li>
              </ul>
            </div>
            <Button onClick={onClose} className="mt-6">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            Orçamento {quote.number}
            <Badge className={getStatusColor(quote.status)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {getStatusName(quote.status)}
            </Badge>
            {isExpired && (
              <Badge variant="destructive" className="ml-2">
                <Clock className="h-3 w-3 mr-1" />
                Expirado
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Cliente
              </label>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {quote.client?.name || "Cliente não definido"}
                  </p>
                  {quote.client?.email && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {quote.client.email}
                    </p>
                  )}
                  {quote.client?.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {quote.client.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Datas</label>
              <div className="space-y-1">
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Emissão: {formatDate(quote.issueDate)}
                </p>
                {quote.expiryDate && (
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      isExpired ? "text-red-600" : ""
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    Validade: {formatDate(quote.expiryDate)}
                  </p>
                )}
                {quote.sentAt && (
                  <p className="text-sm text-blue-600 flex items-center gap-1">
                    <Send className="h-3 w-3" />
                    Enviado: {formatDate(quote.sentAt)}
                  </p>
                )}
                {quote.signedAt && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Assinado: {formatDate(quote.signedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Projeto
              </label>
              <div>
                <p className="font-medium">{quote.projectTitle}</p>
                <Badge variant="outline" className="mt-1">
                  {quote.quoteType === "producao"
                    ? "Produção"
                    : quote.quoteType === "impressao"
                    ? "Impressão"
                    : "Misto"}
                </Badge>
                {quote.productionTime && (
                  <p className="text-sm text-gray-600 mt-1">
                    Prazo: {quote.productionTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Itens do orçamento */}
          {quote.items && quote.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itens e Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b font-medium">
                          Descrição
                        </th>
                        <th className="text-left p-3 border-b font-medium">
                          Tipo
                        </th>
                        <th className="text-center p-3 border-b font-medium">
                          Qtd
                        </th>
                        <th className="text-right p-3 border-b font-medium">
                          Valor Unit.
                        </th>
                        <th className="text-right p-3 border-b font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{item.description}</p>
                              {item.specifications && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {item.specifications}
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Obs: {item.notes}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                item.kind === "etapa" ? "default" : "secondary"
                              }
                            >
                              {item.kind === "etapa" ? "Etapa" : "Impressão"}
                            </Badge>
                            {item.category && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.category}
                              </p>
                            )}
                          </td>
                          <td className="p-3 text-center">{item.qty || 1}</td>
                          <td className="p-3 text-right">
                            {item.unitPrice
                              ? formatCurrency(item.unitPrice)
                              : "-"}
                          </td>
                          <td className="p-3 text-right font-medium">
                            {formatCurrency(item.value || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Totais */}
          {quote.totals && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-end">
                  <div className="w-80 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(quote.totals.subtotal || 0)}</span>
                    </div>

                    {quote.totals.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>
                          Desconto
                          {quote.totals.discountType === "percentage" &&
                            ` (${(
                              (quote.totals.discount / quote.totals.subtotal) *
                              100
                            ).toFixed(1)}%)`}
                          :
                        </span>
                        <span>- {formatCurrency(quote.totals.discount)}</span>
                      </div>
                    )}

                    {quote.totals.freight > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Frete:</span>
                        <span>{formatCurrency(quote.totals.freight)}</span>
                      </div>
                    )}

                    {quote.totals.taxes > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Impostos:</span>
                        <span>{formatCurrency(quote.totals.taxes)}</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-5 w-5" />
                          {formatCurrency(quote.totals.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Condições e Observações */}
          {quote.terms && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Condições Comerciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {quote.terms}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notas adicionais */}
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações Internas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">{quote.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Edit className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Orçamento criado</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(quote.createdAt || "")}
                      {quote.ownerName && ` por ${quote.ownerName}`}
                    </p>
                  </div>
                </div>

                {quote.sentAt && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Send className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Orçamento enviado</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(quote.sentAt)}
                      </p>
                    </div>
                  </div>
                )}

                {quote.viewedAt && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">
                        Orçamento visualizado
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(quote.viewedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {quote.signedAt && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Orçamento assinado</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(quote.signedAt)}
                        {quote.signedBy && ` por ${quote.signedBy}`}
                      </p>
                    </div>
                  </div>
                )}

                {quote.refusedAt && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Orçamento recusado</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(quote.refusedAt)}
                      </p>
                      {quote.refusedReason && (
                        <p className="text-xs text-red-600 mt-1">
                          Motivo: {quote.refusedReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="flex gap-2">
            {quote.status === "draft" && (
              <>
                <Button size="sm" variant="outline" disabled={isLoading}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendQuote}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </>
            )}

            {quote.status === "sent" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignQuote}
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Assinado
              </Button>
            )}

            {quote.status === "viewed" && (
              <Button size="sm" onClick={handleSignQuote} disabled={isLoading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Assinado
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGeneratePDF}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Baixar PDF
            </Button>
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
