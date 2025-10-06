// src/components/dashboard/CommercialDashboard.tsx - VERSÃO OTIMIZADA
"use client";

import { ActivityFeed } from "@/components/comercial/ActivityFeed";
import { DonutChart } from "@/components/comercial/charts/DonutChart";
import { RevenueChart } from "@/components/comercial/charts/RevenueChart";
import { DateRangePicker } from "@/components/comercial/filters/DateRangePicker";
import { LeadModal } from "@/components/comercial/modals/LeadModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCommercialMetrics } from "@/hooks/comercial/useCommercialMetrics";
import { useFunnelData } from "@/hooks/comercial/useFunnelData";
import { Lead } from "@/lib/types/comercial";
import { useRouter } from "next/navigation";
import { useState } from "react";

// KPI Component com Design System
interface KPIData {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "purple" | "orange";
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

  // ✅ CORES DO DESIGN SYSTEM
  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case "success":
        return "bg-success-50 border-success-200";
      case "purple":
        return "bg-purple-50 border-purple-200";
      case "orange":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-primary-50 border-primary-200";
    }
  };

  const getIconColor = (variant?: string) => {
    switch (variant) {
      case "success":
        return "var(--color-success-600)";
      case "purple":
        return "var(--color-purple-600)";
      case "orange":
        return "var(--color-orange-600)";
      default:
        return "var(--color-primary-600)";
    }
  };

  return (
    <Card
      className={`p-6 hover:shadow-md transition-shadow duration-200 ${getVariantClasses(
        metric.variant
      )}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* ✅ CORES DO DESIGN SYSTEM */}
          <p className="text-sm font-medium text-secondary mb-1">
            {metric.label}
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatValue(metric.value)}
          </p>
          {metric.change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                metric.change.type === "increase"
                  ? "text-success"
                  : "text-error"
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
              style={{
                backgroundColor: getIconColor(metric.variant) + "20",
                border: `1px solid ${getIconColor(metric.variant)}30`,
              }}
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

  // ✅ CORES DO DESIGN SYSTEM PARA DONUT
  const donutData = funnelData.map((item, index) => {
    const colors = [
      "var(--color-gray-500)", // primeiro_contato
      "var(--color-primary-600)", // qualificado
      "var(--color-purple-600)", // proposta_enviada
      "var(--color-warning-600)", // negociacao
      "var(--color-success-600)", // fechado_ganho
      "var(--color-error-600)", // fechado_perdido
    ];

    return {
      stage: item.stage,
      label: item.label,
      value: item.count,
      percentage: item.percentage,
      color: colors[index] || "var(--color-gray-400)",
    };
  });

  // ✅ KPIs COM VARIANTS DO DESIGN SYSTEM
  const kpiData: KPIData[] = metrics
    ? [
        {
          label: "Receita do Mês",
          value: metrics.monthlyRevenue || 0,
          change: {
            value: metrics.revenueGrowth || 0,
            type: (metrics.revenueGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="teicon-rotate text-3xl">💰</span>,
          variant: "success", // ✅ USA VARIANT
        },
        {
          label: "Taxa de Conversão",
          value: `${(metrics.conversionRate || 0).toFixed(1)}%`,
          change: {
            value: metrics.conversionGrowth || 0,
            type:
              (metrics.conversionGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="icon-rotate text-3xl">📈</span>,
          variant: "primary", // ✅ USA VARIANT
        },
        {
          label: "Leads Ativos",
          value: metrics.activeLeads || 0,
          change: {
            value: metrics.leadsGrowth || 0,
            type: (metrics.leadsGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="icon-rotate text-3xl">👥</span>,
          variant: "purple", // ✅ USA VARIANT
        },
        {
          label: "Ticket Médio",
          value: metrics.averageTicket || 0,
          change: {
            value: metrics.ticketGrowth || 0,
            type: (metrics.ticketGrowth || 0) >= 0 ? "increase" : "decrease",
          },
          icon: <span className="icon-rotate text-3xl">🎯</span>,
          variant: "orange", // ✅ USA VARIANT
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ✅ HEADER COM THEME TOGGLE */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Dashboard Comercial
          </h1>
          <p className="text-secondary">Visão geral das vendas e pipeline</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* ✅ THEME TOGGLE */}
          <ThemeToggle />

          <DateRangePicker value={dateRange} onChange={setDateRange} />

          {/* ✅ BOTÕES MANTIDOS (já estão corretos) */}
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
          <Button variant="outline" onClick={() => router.push("/crm/leads")}>
            Leads
          </Button>
          <Button variant="outline">Exportar Relatório</Button>
        </div>
      </div>

      {/* ✅ KPI CARDS COM VARIANTS */}
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
            <h2 className="text-lg font-semibold text-primary">
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

        {/* ✅ AÇÕES RÁPIDAS (mantidas - já estão perfeitas) */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-primary mb-6">
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <Button
              variant="outline" // 🟢 VERDE
              className="justify-start"
              onClick={() => setModalOpen(true)}
            >
              <span className="icon-rotate text-3xl">👤</span>
              Novo Lead
            </Button>

            <Button
              variant="default" // 🔵 AZUL (corrigido de "default")
              className="justify-start"
              onClick={() => router.push("/crm/clients?action=new")}
            >
              <span className="text-xl mr-3">🏢</span>
              Novo Cliente
            </Button>

            <Button
              variant="secondary" // 🟣 ROXO
              className="justify-start"
              onClick={() => router.push("/crm/quotes?action=new")}
            >
              <span className="text-xl mr-3">📄</span>
              Novo Orçamento
            </Button>

            <Button
              variant="outline" // 🟠 LARANJA
              className="justify-start"
              onClick={() => router.push("/crm/projects?action=new")}
            >
              <span className="text-xl mr-3">🛠️</span>
              Novo Projeto
            </Button>

            <Button
              variant="outline" // ⚪ OUTLINE
              className="justify-start"
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
            <h2 className="text-lg font-semibold text-primary">
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
          <h2 className="text-lg font-semibold text-primary mb-6">
            Atividades Recentes
          </h2>
          <ActivityFeed />
        </Card>
      </div>

      {/* ✅ MODAL MANTIDO */}
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
