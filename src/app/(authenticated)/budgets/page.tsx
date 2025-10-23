"use client";

import { CheckCircle, FileText, TrendingUp, XCircle } from "lucide-react";
import { useEffect } from "react";

import { BudgetsList } from "@/components/comercial/budgets/BudgetsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgets } from "@/hooks/comercial/useBudgets";
import { useClients } from "@/hooks/comercial/useClients";
import { useLeads } from "@/hooks/comercial/useLeads";
import type { Budget, BudgetFormData } from "@/lib/types/budgets";

export default function BudgetsPage() {
  const {
    budgets,
    loading: budgetsLoading,
    error: budgetsError,
    createBudget,
    updateBudget,
    deleteBudget,
    updateBudgetStatus,
  } = useBudgets();

  const { leads, loading: leadsLoading } = useLeads();
  const { clients, loading: clientsLoading } = useClients();

  // 🔥 ADICIONAR ESTE DEBUG
  console.log("📊 Leads carregados:", leads);
  console.log("📊 Clientes carregados:", clients);

  // Combined loading state
  const loading = budgetsLoading || leadsLoading || clientsLoading;

  // Stats calculation
  const totalBudgets = budgets.length;
  const sentBudgets = budgets.filter((b) => b.status === "sent").length;
  const approvedBudgets = budgets.filter((b) => b.status === "approved").length;
  const rejectedBudgets = budgets.filter((b) => b.status === "rejected").length;

  const totalValue = budgets
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + b.total, 0);

  const conversionRate =
    sentBudgets > 0 ? ((approvedBudgets / sentBudgets) * 100).toFixed(1) : "0.0";

  // 🔥 ADICIONAR PARA DEBUGAR
  useEffect(() => {
    console.log("📊 Leads carregados:", leads);
    console.log("📊 Clientes carregados:", clients);
  }, [leads, clients]);

  const handleCreate = async (data: BudgetFormData) => {
    try {
      await createBudget(data);
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: Partial<Budget>) => {
    try {
      await updateBudget(id, data);
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateBudgetStatus(id, "approved");
    } catch (error) {
      console.error("Error approving budget:", error);
      throw error;
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateBudgetStatus(id, "rejected");
    } catch (error) {
      console.error("Error rejecting budget:", error);
      throw error;
    }
  };

  if (budgetsError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">Erro ao carregar orçamentos: {budgetsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
            <p className="mt-1 text-gray-600">Gerencie seus orçamentos e propostas comerciais</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-blue-600">Carregando dados...</p>
          </div>
        )}

        {/* Info Stats */}
        {!loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Orçamentos
                </CardTitle>
                <FileText className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBudgets}</div>
                <p className="mt-1 text-xs text-gray-500">{sentBudgets} enviados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Aprovados</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedBudgets}</div>
                <p className="mt-1 text-xs text-gray-500">Taxa: {conversionRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Recusados</CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{rejectedBudgets}</div>
                <p className="mt-1 text-xs text-gray-500">
                  {sentBudgets > 0 ? ((rejectedBudgets / sentBudgets) * 100).toFixed(1) : "0.0"}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Valor Total Aprovado
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalValue)}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Ticket médio:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(approvedBudgets > 0 ? totalValue / approvedBudgets : 0)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Budgets List */}
        <BudgetsList
          budgets={budgets}
          leads={leads}
          clients={clients}
          loading={loading}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
