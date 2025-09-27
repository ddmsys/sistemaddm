"use client";

import React from "react";

// Componente KPI inline
interface KPIData {
  label: string;
  value: string | number;
  change?: { value: number; type: "increase" | "decrease" };
  icon?: string;
  color?: string;
}

function KPICard({ metric }: { metric: KPIData }) {
  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toLocaleString("pt-BR");
    }
    return value.toString();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
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
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: metric.color + "20" || "#3b82f620" }}
            >
              {metric.icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MarketingDashboard() {
  // Métricas de marketing baseadas na documentação
  const marketingMetrics: KPIData[] = [
    {
      label: "Campanhas Ativas",
      value: 8,
      change: { value: 2, type: "increase" },
      icon: "📢",
      color: "#8b5cf6",
    },
    {
      label: "ROI Médio",
      value: "285%",
      change: { value: 15, type: "increase" },
      icon: "💎",
      color: "#10b981",
    },
    {
      label: "Leads Gerados",
      value: 156,
      change: { value: 22, type: "increase" },
      icon: "👥",
      color: "#3b82f6",
    },
    {
      label: "Taxa Conversão",
      value: "18.5%",
      change: { value: 3, type: "increase" },
      icon: "🎯",
      color: "#f59e0b",
    },
  ];

  // Campanhas ativas com progresso
  const activeCampaigns = [
    {
      id: "1",
      name: "Livros Educacionais 2024",
      status: "active",
      progress: 75,
      budget: 15000,
      spent: 11250,
      leads: 42,
      conversions: 8,
      startDate: "2024-01-15",
      endDate: "2024-12-31",
    },
    {
      id: "2",
      name: "Revistas Técnicas",
      status: "active",
      progress: 60,
      budget: 8000,
      spent: 4800,
      leads: 28,
      conversions: 5,
      startDate: "2024-03-01",
      endDate: "2024-09-30",
    },
    {
      id: "3",
      name: "Catálogos Corporativos",
      status: "planning",
      progress: 25,
      budget: 12000,
      spent: 3000,
      leads: 15,
      conversions: 3,
      startDate: "2024-04-01",
      endDate: "2024-11-30",
    },
    {
      id: "4",
      name: "Material Didático 2025",
      status: "paused",
      progress: 40,
      budget: 18000,
      spent: 7200,
      leads: 22,
      conversions: 4,
      startDate: "2024-02-15",
      endDate: "2025-01-31",
    },
  ];

  // Status de criativos (kanban style) - expandido
  const creativesStatus = [
    {
      status: "briefing",
      count: 5,
      items: [
        "Banner Facebook Livros",
        "Email Marketing Q4",
        "Landing Page Revistas",
        "Campanha LinkedIn B2B",
        "Material Feira do Livro",
      ],
    },
    {
      status: "design",
      count: 8,
      items: [
        "Anúncio Google Ads",
        "Post Instagram Stories",
        "Material Gráfico Feira",
        "Vídeo YouTube",
        "Newsletter Template",
        "Banner Display",
        "Folder Digital",
        "Infográfico Educação",
      ],
    },
    {
      status: "review",
      count: 3,
      items: [
        "Vídeo Promocional 60s",
        "Folder Impresso A4",
        "Campanha Email Nurturing",
      ],
    },
    {
      status: "approved",
      count: 12,
      items: [
        "Campanha Email Semanal",
        "Posts Redes Sociais Setembro",
        "Banner Site Principal",
        "Material POS Livrarias",
        "Anúncio Revista Especializada",
        "Template Proposta",
        "Assinatura Email",
        "Logo Evento 2024",
      ],
    },
  ];

  // Performance por canal - expandido
  const channelPerformance = [
    {
      channel: "Google Ads",
      cpc: "R$ 2.40",
      ctr: "3.2%",
      conversions: 45,
      roi: "320%",
      impressions: "125.4K",
      clicks: "4.01K",
      spend: "R$ 9.624",
    },
    {
      channel: "Facebook Ads",
      cpc: "R$ 1.80",
      ctr: "2.8%",
      conversions: 32,
      roi: "280%",
      impressions: "89.2K",
      clicks: "2.50K",
      spend: "R$ 4.500",
    },
    {
      channel: "LinkedIn Ads",
      cpc: "R$ 4.20",
      ctr: "1.9%",
      conversions: 18,
      roi: "250%",
      impressions: "45.8K",
      clicks: "870",
      spend: "R$ 3.654",
    },
    {
      channel: "Email Marketing",
      cpc: "R$ 0.15",
      ctr: "8.5%",
      conversions: 28,
      roi: "420%",
      impressions: "28.9K",
      clicks: "2.46K",
      spend: "R$ 369",
    },
    {
      channel: "Instagram Ads",
      cpc: "R$ 2.10",
      ctr: "4.1%",
      conversions: 24,
      roi: "195%",
      impressions: "67.3K",
      clicks: "2.76K",
      spend: "R$ 5.796",
    },
  ];

  // Leads por fonte - novo
  const leadsBySource = [
    { source: "Orgânico", count: 89, percentage: 32.1, trend: "up" },
    { source: "Google Ads", count: 67, percentage: 24.2, trend: "up" },
    { source: "Facebook", count: 45, percentage: 16.2, trend: "stable" },
    { source: "Email", count: 38, percentage: 13.7, trend: "up" },
    { source: "LinkedIn", count: 23, percentage: 8.3, trend: "down" },
    { source: "Outros", count: 15, percentage: 5.4, trend: "stable" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getCreativeStatusColor = (status: string) => {
    switch (status) {
      case "briefing":
        return "border-slate-300 bg-slate-50";
      case "design":
        return "border-blue-300 bg-blue-50";
      case "review":
        return "border-amber-300 bg-amber-50";
      case "approved":
        return "border-emerald-300 bg-emerald-50";
      default:
        return "border-slate-300 bg-slate-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Marketing
        </h1>
        <p className="text-slate-600">
          Campanhas, criativos e performance de marketing
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketingMetrics.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Campanhas Ativas */}
        <div className="xl:col-span-2 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Campanhas Ativas
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded-md">
              Nova Campanha
            </button>
          </div>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status === "active"
                          ? "Ativa"
                          : campaign.status === "planning"
                          ? "Planejamento"
                          : campaign.status === "paused"
                          ? "Pausada"
                          : "Finalizada"}
                      </div>
                      <span className="text-xs text-slate-500">
                        {campaign.startDate} - {campaign.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      R$ {campaign.spent.toLocaleString()} / R${" "}
                      {campaign.budget.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {campaign.progress}% executado
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${
                      campaign.status === "active"
                        ? "bg-blue-500"
                        : campaign.status === "paused"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>

                {/* Métricas detalhadas */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Leads:</span>
                    <span className="ml-1 font-medium">{campaign.leads}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Conversões:</span>
                    <span className="ml-1 font-medium">
                      {campaign.conversions}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Taxa:</span>
                    <span className="ml-1 font-medium">
                      {((campaign.conversions / campaign.leads) * 100).toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">CPA:</span>
                    <span className="ml-1 font-medium">
                      R$ {(campaign.spent / campaign.conversions).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status dos Criativos - Kanban Style */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Status dos Criativos
          </h2>
          <div className="space-y-4">
            {creativesStatus.map((stage) => (
              <div
                key={stage.status}
                className={`border-l-4 rounded-r-lg p-3 ${getCreativeStatusColor(
                  stage.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize text-slate-900">
                    {stage.status === "briefing"
                      ? "Briefing"
                      : stage.status === "design"
                      ? "Design"
                      : stage.status === "review"
                      ? "Revisão"
                      : "Aprovado"}
                  </h3>
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
                    {stage.count}
                  </span>
                </div>
                <div className="space-y-1">
                  {stage.items.slice(0, 3).map((item, idx) => (
                    <p key={idx} className="text-xs text-slate-600">
                      • {item}
                    </p>
                  ))}
                  {stage.items.length > 3 && (
                    <p className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">
                      + {stage.items.length - 3} mais itens
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads por Fonte */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Leads por Fonte
          </h2>
          <div className="space-y-4">
            {leadsBySource.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getTrendIcon(source.trend)}</span>
                  <span className="text-sm font-medium">{source.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {source.percentage}%
                  </span>
                  <span className="text-sm font-medium">{source.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs Spend */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Orçamento vs Gasto
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Total Orçado</span>
                <span className="text-sm font-medium">R$ 53.000</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Total Gasto</span>
                <span className="text-sm">R$ 26.250</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "49.5%" }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                49.5% do orçamento utilizado
              </p>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Por Canal:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Google Ads:</span>
                  <span>R$ 9.624 (36.7%)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Instagram:</span>
                  <span>R$ 5.796 (22.1%)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Facebook:</span>
                  <span>R$ 4.500 (17.1%)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>LinkedIn:</span>
                  <span>R$ 3.654 (13.9%)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Email:</span>
                  <span>R$ 369 (1.4%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance por Canal */}
        <div className="xl:col-span-3 bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Performance Detalhada por Canal
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-slate-900">
                    Canal
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    Impressões
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    Cliques
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    CTR
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    CPC
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    Gasto
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    Conversões
                  </th>
                  <th className="text-left py-3 font-medium text-slate-900">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((channel, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="py-3 font-medium text-slate-900">
                      {channel.channel}
                    </td>
                    <td className="py-3 text-slate-600">
                      {channel.impressions}
                    </td>
                    <td className="py-3 text-slate-600">{channel.clicks}</td>
                    <td className="py-3 text-slate-600">{channel.ctr}</td>
                    <td className="py-3 text-slate-600">{channel.cpc}</td>
                    <td className="py-3 font-medium">{channel.spend}</td>
                    <td className="py-3 font-medium">{channel.conversions}</td>
                    <td className="py-3 font-medium text-emerald-600">
                      {channel.roi}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-slate-50">
                <tr>
                  <td className="py-3 font-semibold">Total</td>
                  <td className="py-3 font-semibold">356.6K</td>
                  <td className="py-3 font-semibold">12.66K</td>
                  <td className="py-3 font-semibold">3.6%</td>
                  <td className="py-3 font-semibold">R$ 2.07</td>
                  <td className="py-3 font-semibold">R$ 23.943</td>
                  <td className="py-3 font-semibold">147</td>
                  <td className="py-3 font-semibold text-emerald-600">294%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
