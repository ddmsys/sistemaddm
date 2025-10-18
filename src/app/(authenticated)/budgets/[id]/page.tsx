"use client";

import { ArrowLeft, CheckCircle, Download, Edit, FileText, Loader2, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { BudgetItemsList } from "@/components/comercial/budgets/BudgetItemsList";
import { BudgetSummary } from "@/components/comercial/budgets/BudgetSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgets } from "@/hooks/comercial/useBudgets";
import { useClients } from "@/hooks/comercial/useClients";
import { useLeads } from "@/hooks/comercial/useLeads";

export default function BudgetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const budgetId = (params?.id || "") as string;

  const { budgets, loading, error, approveBudget, rejectBudget } = useBudgets();
  const { leads } = useLeads();
  const { clients } = useClients();

  const [actionLoading, setActionLoading] = useState(false);
  const budget = budgets.find((b) => b.id === budgetId);
  const clientName = useMemo(() => {
    if (budget?.clientId) {
      const client = clients.find((c) => c.id === budget.clientId);
      return client?.name;
    }
    if (budget?.leadId) {
      const lead = leads.find((l) => l.id === budget.leadId);
      return lead?.name;
    }
    return null;
  }, [budget, clients, leads]);

  useEffect(() => {
    if (!budgetId) {
      router.push("/budgets");
    }
  }, [budgetId, router]);

  // Status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Status label
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Rascunho",
      sent: "Enviado",
      approved: "Aprovado",
      rejected: "Recusado",
      expired: "Expirado",
    };
    return labels[status] || status;
  };

  // Handle approve
  const handleApprove = async () => {
    if (!budget?.id) return;

    setActionLoading(true);
    try {
      await approveBudget(budget.id);
      toast.success("Orçamento aprovado com sucesso!");
      router.push("/budgets");
    } catch (error) {
      toast.error("Erro ao aprovar orçamento");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!budget?.id) return;

    setActionLoading(true);
    try {
      await rejectBudget(budget.id);
      toast.success("Orçamento recusado");
      router.push("/budgets");
    } catch (error) {
      toast.error("Erro ao recusar orçamento");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit
  const handleEdit = () => {
    router.push(`/budgets/${budgetId}/edit`);
  };

  // Handle download PDF
  const handleDownloadPDF = async () => {
    toast("Download de PDF em desenvolvimento", {
      icon: "📄",
      duration: 3000,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <XCircle className="h-16 w-16 text-red-500" />
        <p className="text-red-600">Erro: {error}</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  // Not found
  if (!budget) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <FileText className="h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900">Orçamento não encontrado</h2>
        <p className="text-gray-600">O orçamento solicitado não existe ou foi removido.</p>
        <Button onClick={() => router.push("/budgets")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Orçamentos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* ... Header ... */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orçamento #{budget.number}</h1>
            <p className="mt-1 text-gray-600">{budget.projectData?.title || "Sem título"}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(budget.status)}`}
            >
              {getStatusLabel(budget.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                {/* ✅ USAR clientName calculado */}
                <p className="font-medium">{clientName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lead/Cliente</p>
                <p className="font-medium">
                  {budget.leadId ? "Lead" : budget.clientId ? "Cliente" : "N/A"}
                </p>
              </div>
              {budget.projectData?.subtitle && (
                <div>
                  <p className="text-sm text-gray-600">Subtítulo</p>
                  <p className="font-medium">{budget.projectData.subtitle}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetItemsList items={budget.items} readOnly={true} showActions={false} />
            </CardContent>
          </Card>

          {/* Notes */}
          {budget.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{budget.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetSummary
                subtotal={budget.subtotal}
                discount={budget.discount}
                total={budget.total}
                paymentMethods={budget.paymentMethods}
                validityDays={budget.validityDays}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {budget.status === "draft" && (
                <Button onClick={handleEdit} className="w-full" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              )}

              {budget.status === "sent" && (
                <>
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Aprovar
                  </Button>

                  <Button
                    onClick={handleReject}
                    className="w-full"
                    variant="destructive"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Recusar
                  </Button>
                </>
              )}

              <Button onClick={handleDownloadPDF} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {/* ✅ USAR issueDate ao invés de sentAt */}
              {budget.issueDate && (
                <div>
                  <p className="text-gray-600">Emitido em</p>
                  <p className="font-medium">
                    {new Date(budget.issueDate.toDate()).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              {budget.updatedAt && (
                <div>
                  <p className="text-gray-600">Atualizado em</p>
                  <p className="font-medium">
                    {new Date(budget.updatedAt.toDate()).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              {budget.issueDate && (
                <div>
                  <p className="text-gray-600">Emitido em</p>
                  <p className="font-medium">
                    {new Date(budget.issueDate.toDate()).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              {budget.approvalDate && (
                <div>
                  <p className="text-gray-600">Aprovado em</p>
                  <p className="font-medium text-green-600">
                    {new Date(budget.approvalDate.toDate()).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
