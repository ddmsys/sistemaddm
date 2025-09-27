"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/comercial/modals/LeadModal";
import { DonutChart } from "@/components/comercial/charts/DonutChart"; // ✅ NOVO IMPORT
import { RevenueChart } from "@/components/comercial/charts/RevenueChart";
import { ActivityFeed } from "@/components/comercial/ActivityFeed";
import { QuickActions } from "@/components/comercial/QuickActions";
import { DateRangePicker } from "@/components/comercial/filters/DateRangePicker";
import { useFunnelData } from "@/hooks/comercial/useFunnelData";
import { useCommercialMetrics } from "@/hooks/comercial/useCommercialMetrics";
import { Lead } from "@/lib/types/comercial";

// KPI Component inline
interface KPIData {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  color?: string;
}

function KPICard({ metric }: { metric: KPIData }) {
  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
      return `R$ ${value.toLocaleString("pt-BR")}`;
    }
    return value.toString();
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">
            {metric.label}
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatValue(metric.value)}
          </p>
          {metric.change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                metric.change.type === "increase"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              <span className="mr-1">
                {metric.change.type === "increase" ? "↗" : "↘"}
              </span>
              <span>{Math.abs(metric.change.value)}% vs mês anterior</span>
            </div>
          )}
        </div>
        {metric.icon && (
          <div className="flex-shrink-0 ml-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: metric.color || "#3b82f6" + "20" }}
            >
              {metric.icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function CommercialDashboard() {
  const router = useRouter();

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { funnelData, loading: funnelLoading } = useFunnelData(dateRange);
  const { metrics, loading: metricsLoading } = useCommercialMetrics(dateRange);

  // ✅ CONVERTER DADOS DO FUNIL PARA DONUT
  const donutData = funnelData.map((item, index) => {
    const colors = [
      "#64748b", // primeiro-contato - slate
      "#3b82f6", // qualificado - blue
      "#8b5cf4", // proposta-enviada - purple
      "#FFB347", // negociacao - amber
      "#20B2AA", // fechado-ganho - emerald
      "#CD5C5C", // fechado-perdido - red
    ];

    return {
      stage: item.stage,
      label: item.label,
      value: item.count,
      percentage: item.percentage,
      color: colors[index] || "#6b7280",
    };
  });

  // Preparar dados dos KPIs
  const kpiData: KPIData[] = metrics
    ? [
        {
          label: "Receita do Mês",
          value: metrics.monthlyRevenue || 0,
          change: {
            value: metrics.revenueGrowth || 0,
            type: (metrics.revenueGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="text-2xl">💰</span>,
          color: "#20B2AA",
        },
        {
          label: "Taxa de Conversão",
          value: `${(metrics.conversionRate || 0).toFixed(1)}%`,
          change: {
            value: metrics.conversionGrowth || 0,
            type:
              (metrics.conversionGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="text-2xl">📈</span>,
          color: "#3b82f6",
        },
        {
          label: "Leads Ativos",
          value: metrics.activeLeads || 0,
          change: {
            value: metrics.leadsGrowth || 0,
            type: (metrics.leadsGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="text-2xl">👥</span>,
          color: "#8b5cf6",
        },
        {
          label: "Ticket Médio",
          value: metrics.averageTicket || 0,
          change: {
            value: metrics.ticketGrowth || 0,
            type: (metrics.ticketGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="text-2xl">🎯</span>,
          color: "#FFB347",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Comercial
          </h1>
          <p className="text-slate-600">Visão geral das vendas e pipeline</p>
        </div>

        <div className="flex gap-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />

          {/* ✅ BOTÕES CORRIGIDOS - SÓ NAVEGAR */}
          <Button variant="outline" onClick={() => router.push("/crm/clients")}>
            Clientes
          </Button>

          <Button variant="outline" onClick={() => router.push("/crm/quotes")}>
            Orçamentos
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/crm/projects")}
          >
            Projetos
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/crm/leads")} // ✅ IR PARA LISTA DE LEADS
          >
            Leads
          </Button>

          <Button variant="outline">Exportar Relatório</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* ✅ FUNIL COM DONUT CHART */}
        <Card className="lg:col-span-2 xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Funil de Vendas
            </h2>
            <Button variant="ghost" size="sm">
              Ver Detalhes
            </Button>
          </div>
          <DonutChart
            data={donutData}
            height={300}
            showValues={true}
            showPercentages={true}
            loading={funnelLoading}
          />
        </Card>

        {/* ✅ AÇÕES RÁPIDAS CORRIGIDAS */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <Button
              className="w-full justify-start bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                setSelectedLead(null);
                setModalOpen(true);
              }}
            >
              <span className="text-xl mr-3">👤</span>
              Novo Lead
            </Button>

            <Button
              className="w-full justify-start bg-green-500 hover:bg-green-600"
              onClick={() => router.push("/crm/clients?action=new")}
            >
              <span className="text-xl mr-3">🏢</span>
              Novo Cliente
            </Button>

            <Button
              className="w-full justify-start bg-purple-500 hover:bg-purple-600"
              onClick={() => router.push("/crm/quotes?action=new")}
            >
              <span className="text-xl mr-3">📄</span>
              Novo Orçamento
            </Button>

            <Button
              className="w-full justify-start bg-orange-500 hover:bg-orange-600"
              onClick={() => router.push("/crm/projects?action=new")}
            >
              <span className="text-xl mr-3">🛠️</span>
              Novo Projeto
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/crm/clients")}
            >
              <span className="text-xl mr-3">📋</span>
              Ver Clientes
            </Button>
          </div>
        </Card>

        {/* Receita Mensal */}
        <Card className="lg:col-span-2 xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Receita vs Meta
            </h2>
            <Button variant="ghost" size="sm">
              Configurar Meta
            </Button>
          </div>
          <RevenueChart data={metrics?.revenueData} height={300} />
        </Card>

        {/* Feed de Atividades */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Atividades Recentes
          </h2>
          <ActivityFeed />
        </Card>
      </div>

      {/* ✅ MODAL PARA CRIAR LEAD */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSave={async (leadData) => {
          console.log("Lead salvo:", leadData);
          setModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}
