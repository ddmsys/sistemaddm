"use client";

import React from "react";

// Componente KPI inline para evitar problemas de import
interface KPIData {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: string;
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

export function ExecutiveDashboard() {
  const executiveMetrics: KPIData[] = [
    {
      label: "Receita Total",
      value: 450000,
      change: { value: 12, type: "increase" },
      icon: "💰",
      color: "#10b981",
    },
    {
      label: "Projetos Ativos",
      value: 28,
      change: { value: 5, type: "increase" },
      icon: "🚀",
      color: "#3b82f6",
    },
    {
      label: "Taxa Conversão",
      value: "32%",
      change: { value: 3, type: "increase" },
      icon: "📈",
      color: "#8b5cf6",
    },
    {
      label: "ROI Médio",
      value: "285%",
      change: { value: 8, type: "increase" },
      icon: "🎯",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Executivo
        </h1>
        <p className="text-slate-600">Visão estratégica do negócio</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {executiveMetrics.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Receita Mensal:</span>
              <span className="font-medium">R$ 120.000</span>
            </div>
            <div className="flex justify-between">
              <span>Custos:</span>
              <span className="font-medium">R$ 85.000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Lucro Líquido:</span>
              <span className="font-semibold text-emerald-600">R$ 35.000</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Metas vs Realizado</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Vendas</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Projetos</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
