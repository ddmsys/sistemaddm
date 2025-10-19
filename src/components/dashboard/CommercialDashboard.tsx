"use client";

import { Timestamp } from "firebase/firestore";
import { Plus, RefreshCw, TrendingUp } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

// Componentes existentes
import { BudgetCard } from "@/components/comercial/cards/BookCard"; // Arquivo BookCard.tsx exporta BudgetCard
import { LeadCard } from "@/components/comercial/cards/LeadCard";
import { DonutChart } from "@/components/comercial/charts/DonutChart";
import { FunnelChart } from "@/components/comercial/charts/FunnelChart";
import { RevenueChart } from "@/components/comercial/charts/RevenueChart";
import { KPICards } from "@/components/comercial/KPICards";
// Modals existentes
import BookModal from "@/components/comercial/modals/BookModal";
import { BudgetModal } from "@/components/comercial/modals/BudgetModal";
import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { LeadModal } from "@/components/comercial/modals/LeadModal";
// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBooks } from "@/hooks/comercial/useBooks";
import { useBudgets } from "@/hooks/comercial/useBudgets";
import { useClients } from "@/hooks/comercial/useClients";
import { useLeads } from "@/hooks/comercial/useLeads";
// Types
import { Book } from "@/lib/types/books";
import { Budget, BudgetFormData } from "@/lib/types/budgets";
import { Lead, LeadStatus } from "@/lib/types/leads";
import { formatDate, formatDateTime } from "@/lib/utils";

// Filtros de período
type PeriodFilter = "7d" | "30d" | "90d" | "1y" | "all";

interface DashboardMetrics {
  totalClients: number;
  activeLeads: number;
  totalBudgets: number;
  conversionRate: number;
  budgetsWon: number;
  totalRevenue: number;
  avgTicket: number;
}

// ✅ Função auxiliar para converter Timestamp/Date para Date
function getJSDate(date: Date | Timestamp | undefined): Date {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  if (typeof (date as Timestamp).toDate === "function") {
    return (date as Timestamp).toDate();
  }
  return new Date();
}

// Componente Select simples
function SimpleSelect({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {children}
    </select>
  );
}

export default function CommercialDashboard() {
  // ✅ CORREÇÃO 1: Desestruturar corretamente os hooks
  const { leads: leadsData = [], loading: leadsLoading, createLead, updateLeadStage } = useLeads();

  const { clients: clientsData = [], loading: clientsLoading, createClient } = useClients();

  const { books: booksData = [], loading: booksLoading } = useBooks();

  const { budgets: budgetsData = [], loading: budgetsLoading } = useBudgets();
  // Estados dos modals
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Estados para incrementos
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "books" | "budgets">(
    "overview",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ CORREÇÃO 2: Usar dados diretos, não acessar .data
  const metrics = useMemo((): DashboardMetrics => {
    const activeLeadsCount = leadsData.filter((lead: Lead) =>
      ["primeiro_contato", "qualificado", "proposta_enviada", "negociacao"].includes(lead.status),
    ).length;

    // ✅ CORREÇÃO 3: 'won' → 'signed'
    const wonBudgets = budgetsData.filter((budget: Budget) => budget.status === "approved").length;

    // ✅ CORREÇÃO 4: budget.total → budget.totals.total
    const totalRevenue = budgetsData
      .filter((budget: Budget) => budget.status === "approved")
      .reduce((sum: number, budget: Budget) => sum + (budget.totals?.total || 0), 0);

    const conversionRate =
      leadsData.length > 0
        ? (leadsData.filter((lead: Lead) => lead.status === "fechado_ganho").length /
            leadsData.length) *
          100
        : 0;

    return {
      totalClients: clientsData.length,
      activeLeads: activeLeadsCount,
      totalBudgets: budgetsData.length,
      conversionRate,
      budgetsWon: wonBudgets,
      totalRevenue,
      avgTicket: wonBudgets > 0 ? totalRevenue / wonBudgets : 0,
    };
  }, [leadsData, clientsData, budgetsData]);
  // Dados para gráficos
  const chartData = useMemo(() => {
    // Dados para o funil
    const funnelData = [
      {
        status: "primeiro_contato" as LeadStatus,
        count: leadsData.filter((l: Lead) => l.status === "primeiro_contato").length,
      },
      {
        status: "qualificado" as LeadStatus,
        count: leadsData.filter((l: Lead) => l.status === "qualificado").length,
      },
      {
        status: "proposta_enviada" as LeadStatus,
        count: leadsData.filter((l: Lead) => l.status === "proposta_enviada").length,
      },
      {
        status: "negociacao" as LeadStatus,
        count: leadsData.filter((l: Lead) => l.status === "negociacao").length,
      },
      {
        status: "fechado_ganho" as LeadStatus,
        count: leadsData.filter((l: Lead) => l.status === "fechado_ganho").length,
      },
    ];

    // ✅ CORREÇÃO 5: Status corretos para budgets
    const budgetStatusData = [
      {
        stage: "draft",
        label: "Rascunho",
        value: budgetsData.filter((q: Budget) => q.status === "draft").length,
        percentage: 0,
        color: "#64748b",
      },
      {
        stage: "sent",
        label: "Enviado",
        value: budgetsData.filter((q: Budget) => q.status === "sent").length,
        percentage: 0,
        color: "#3b82f6",
      },
      {
        stage: "approved",
        label: "Assinado",
        value: budgetsData.filter((q: Budget) => q.status === "approved").length,
        percentage: 0,
        color: "#10b981",
      },
      {
        stage: "rejected",
        label: "Rejeitado",
        value: budgetsData.filter((q: Budget) => q.status === "rejected").length,
        percentage: 0,
        color: "#ef4444",
      },
    ].map((item) => ({
      ...item,
      percentage: budgetsData.length > 0 ? (item.value / budgetsData.length) * 100 : 0,
    }));

    // Dados de receita (simulados)
    const revenueData = [
      { period: "Jan", revenue: 25000, expenses: 15000, profit: 10000 },
      { period: "Fev", revenue: 32000, expenses: 18000, profit: 14000 },
      { period: "Mar", revenue: 28000, expenses: 16000, profit: 12000 },
      { period: "Abr", revenue: 35000, expenses: 20000, profit: 15000 },
      { period: "Mai", revenue: 42000, expenses: 22000, profit: 20000 },
      { period: "Jun", revenue: 38000, expenses: 21000, profit: 17000 },
    ];

    return { funnelData, budgetStatusData, revenueData };
  }, [leadsData, budgetsData]);

  // ✅ CORREÇÃO 6: Usar getJSDate para datas
  const criticalBooks = useMemo(() => {
    return booksData
      .filter((book: Book) => {
        if (!book.dueDate) return false;
        const endDate = getJSDate(book.dueDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      })
      .slice(0, 5);
  }, [booksData]);

  // Atividades recentes
  // Atividades recentes
  const recentActivities = useMemo(() => {
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      time: Timestamp;
      color: string;
    }> = [];

    // Adicionar leads recentes
    leadsData.slice(0, 3).forEach((lead: Lead) => {
      activities.push({
        id: `lead-${lead.id}`,
        type: "lead",
        title: `Novo lead: ${lead.name}`,
        time: lead.createdAt,
        color: "bg-blue-100 text-blue-800",
      });
    });

    // Adicionar projetos recentes
    booksData.slice(0, 2).forEach((book: Book) => {
      activities.push({
        id: `book-${book.id}`,
        type: "book",
        title: `Projeto iniciado: ${book.title}`,
        time: book.createdAt,
        color: "bg-green-100 text-green-800",
      });
    });

    return activities.sort((a, b) => b.time.toMillis() - a.time.toMillis()).slice(0, 5);
  }, [leadsData, booksData]);

  // Função de refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const loading = leadsLoading || clientsLoading || booksLoading || budgetsLoading;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg text-slate-500">Carregando dashboard comercial...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Comercial</h1>
          <p className="mt-1 text-slate-500">Acompanhe suas métricas comerciais</p>
        </div>

        {/* Filtros e Ações */}
        <div className="flex flex-wrap items-center gap-3">
          <SimpleSelect
            value={periodFilter}
            onValueChange={(value) => setPeriodFilter(value as PeriodFilter)}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
            <option value="all">Todo período</option>
          </SimpleSelect>

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBudgetModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Orçamento
            </Button>
            <Button variant="outline" onClick={() => setShowClientModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Cliente
            </Button>
            <Button onClick={() => setShowLeadModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Lead
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <KPICards kpis={metrics} />

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Visão Geral", icon: TrendingUp },
            { id: "leads", label: "Leads", count: metrics.activeLeads },
            { id: "books", label: "Projetos", count: booksData.length },
            { id: "budgets", label: "Orçamentos", count: metrics.totalBudgets },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "leads" | "books" | "budgets")}
              className={`flex items-center border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
              {tab.count !== undefined && (
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo Overview */}
      {activeTab === "overview" && (
        <>
          {/* Gráficos Principais */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receita vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart data={chartData.revenueData} title="" type="area" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <FunnelChart data={chartData.funnelData} title="" showValues={true} />
              </CardContent>
            </Card>
          </div>

          {/* Gráficos Secundários */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status dos Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart data={chartData.budgetStatusData} height={300} showValues={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                  >
                    <div className={`h-2 w-2 rounded-full ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(getJSDate(activity.time))}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <p className="py-4 text-center text-slate-500">Nenhuma atividade recente</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Projetos Críticos */}
          {criticalBooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  Projetos Críticos ({criticalBooks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {criticalBooks.map((book: Book) => (
                    <div key={book.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <h4 className="font-medium text-red-800">{book.title}</h4>
                      <p className="mt-1 text-sm text-red-600">{book.clientName}</p>
                      <p className="mt-2 text-xs text-red-500">
                        Prazo: {book.dueDate ? formatDate(getJSDate(book.dueDate)) : "Não definido"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Tab de Leads */}
      {activeTab === "leads" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Leads Ativos</CardTitle>
            <Button size="sm" onClick={() => setShowLeadModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadsData.length > 0 ? (
                leadsData
                  .slice(0, 10)
                  .map((lead: Lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onStatusChange={updateLeadStage}
                      onEdit={(lead: Lead) => console.log("Edit lead:", lead)}
                    />
                  ))
              ) : (
                <p className="py-8 text-center text-slate-500">Nenhum lead encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab de Projetos */}
      {activeTab === "books" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Projetos Ativos</CardTitle>
            <Button size="sm" onClick={() => setShowBookModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booksData.length > 0 ? (
                booksData.slice(0, 10).map((book: Book) => (
                  <div key={book.id} className="rounded-lg border border-gray-200 bg-white p-4">
                    <h4 className="font-medium text-gray-800">{book.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{book.clientName}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Prazo: {book.dueDate ? formatDate(getJSDate(book.dueDate)) : "Não definido"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-slate-500">Nenhum projeto encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab de Orçamentos */}
      {activeTab === "budgets" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Orçamentos</CardTitle>
            <Button size="sm" onClick={() => setShowBudgetModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetsData.length > 0 ? (
                budgetsData
                  .slice(0, 10)
                  .map((budget: Budget) => (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      onEdit={() => console.log("Edit budget:", budget.id)}
                    />
                  ))
              ) : (
                <p className="py-8 text-center text-slate-500">Nenhum orçamento encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      {/* Modais */}
      {showLeadModal && (
        <LeadModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          onSubmit={async (data) => {
            await createLead?.(data);
            setShowLeadModal(false);
          }}
        />
      )}

      {showClientModal && (
        <ClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSubmit={async (data) => {
            await createClient?.(data);
            setShowClientModal(false);
          }}
        />
      )}
      {/* Book Modal - TODO: Corrigir props */}
      {showBookModal && (
        <BookModal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
          onSave={async () => {
            setShowBookModal(false);
          }}
        />
      )}

      {/* Budget Modal - TODO: Corrigir props */}
      {showBudgetModal && (
        <BudgetModal
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          onSubmit={async (data: BudgetFormData) => {
            console.log("Budget data:", data);
            setShowBudgetModal(false);
          }}
        />
      )}
    </div>
  );
}
