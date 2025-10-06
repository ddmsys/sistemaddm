'use client';

import React from 'react';

// Mesmo componente KPI inline
interface KPIData {
  label: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' };
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

export function FinanceDashboard() {
  const financeMetrics: KPIData[] = [
    {
      label: 'Contas a Receber',
      value: 85000,
      change: { value: 5, type: 'decrease' },
      icon: '📥',
      color: '#3b82f6',
    },
    {
      label: 'Contas a Pagar',
      value: 32000,
      change: { value: 8, type: 'increase' },
      icon: '📤',
      color: '#ef4444',
    },
    {
      label: 'Fluxo de Caixa',
      value: 53000,
      change: { value: 12, type: 'increase' },
      icon: '💹',
      color: '#10b981',
    },
    {
      label: 'Margem Lucro',
      value: '28%',
      change: { value: 2, type: 'increase' },
      icon: '📊',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Financeiro</h1>
        <p className="text-slate-600">Controle financeiro e fluxo de caixa</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financeMetrics.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Próximos Recebimentos</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Projeto ABC</span>
              <span className="text-sm font-medium">R$ 15.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Projeto XYZ</span>
              <span className="text-sm font-medium">R$ 8.500</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Próximos Pagamentos</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Fornecedor A</span>
              <span className="text-sm font-medium">R$ 5.200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Fornecedor B</span>
              <span className="text-sm font-medium">R$ 3.800</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Resumo do Mês</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Entradas:</span>
              <span className="text-sm font-medium text-emerald-600">R$ 95.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Saídas:</span>
              <span className="text-sm font-medium text-red-600">R$ 67.000</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-sm font-semibold">Saldo:</span>
              <span className="text-sm font-semibold text-emerald-600">R$ 28.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
