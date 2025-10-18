'use client';

import React from 'react';

// Componente KPI inline para evitar problemas de import
interface KPIData {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: string;
  color?: string;
}

function KPICard({ metric }: { metric: KPIData }) {
  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
    return value.toString();
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-slate-600">{metric.label}</p>
          <p className="text-2xl font-bold text-slate-900">{formatValue(metric.value)}</p>
          {metric.change && (
            <div
              className={`mt-2 flex items-center text-sm ${
                metric.change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              <span className="mr-1">{metric.change.type === 'increase' ? '↗' : '↘'}</span>
              <span>{Math.abs(metric.change.value)}% vs mês anterior</span>
            </div>
          )}
        </div>
        {metric.icon && (
          <div className="ml-4 flex-shrink-0">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
              style={{ backgroundColor: metric.color + '20' || '#3b82f620' }}
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
      label: 'Receita Total',
      value: 450000,
      change: { value: 12, type: 'increase' },
      icon: '💰',
      color: '#10b981',
    },
    {
      label: 'Projetos Ativos',
      value: 28,
      change: { value: 5, type: 'increase' },
      icon: '🚀',
      color: '#3b82f6',
    },
    {
      label: 'Taxa Conversão',
      value: '32%',
      change: { value: 3, type: 'increase' },
      icon: '📈',
      color: '#8b5cf6',
    },
    {
      label: 'ROI Médio',
      value: '285%',
      change: { value: 8, type: 'increase' },
      icon: '🎯',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Executivo</h1>
        <p className="text-slate-600">Visão estratégica do negócio</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {executiveMetrics.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Resumo Financeiro</h2>
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

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Metas vs Realizado</h2>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between">
                <span>Vendas</span>
                <span>85%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>Projetos</span>
                <span>92%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
