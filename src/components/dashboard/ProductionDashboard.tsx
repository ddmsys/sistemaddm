'use client';

import React from 'react';

// Componente KPI inline
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
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toLocaleString('pt-BR');
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

export function ProductionDashboard() {
  // Métricas de produção
  const productionMetrics: KPIData[] = [
    {
      label: 'Projetos em Andamento',
      value: 18,
      change: { value: 3, type: 'increase' },
      icon: '⚙️',
      color: '#3b82f6',
    },
    {
      label: 'Aprovações Pendentes',
      value: 7,
      change: { value: 2, type: 'decrease' },
      icon: '⏳',
      color: '#f59e0b',
    },
    {
      label: 'Provas em Revisão',
      value: 12,
      change: { value: 1, type: 'increase' },
      icon: '🔍',
      color: '#8b5cf6',
    },
    {
      label: 'Tempo Médio/Etapa',
      value: '4.2 dias',
      change: { value: 8, type: 'decrease' },
      icon: '⏱️',
      color: '#10b981',
    },
  ];

  // Dados simulados para projetos críticos
  const criticalProjects = [
    {
      id: 'DDM2024001',
      title: 'Livro História do Brasil',
      client: 'Editora ABC',
      dueDate: '2 dias',
      status: 'review',
      priority: 'urgent',
    },
    {
      id: 'DDM2024002',
      title: 'Revista Ciências',
      client: 'Editora XYZ',
      dueDate: '5 dias',
      status: 'design',
      priority: 'high',
    },
    {
      id: 'DDM2024003',
      title: 'Catálogo Produtos',
      client: 'Empresa 123',
      dueDate: '1 semana',
      status: 'production',
      priority: 'medium',
    },
  ];

  // Aprovações pendentes
  const pendingApprovals = [
    {
      id: '1',
      project: 'Livro Matemática',
      client: 'Editora Alpha',
      type: 'Primeira Prova',
      waitingDays: 3,
    },
    {
      id: '2',
      project: 'Revista Tech',
      client: 'Editora Beta',
      type: 'Revisão Final',
      waitingDays: 1,
    },
    {
      id: '3',
      project: 'Manual Técnico',
      client: 'Empresa Gamma',
      type: 'Arte Final',
      waitingDays: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-amber-100 text-amber-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🚨';
      case 'high':
        return '⚡';
      case 'medium':
        return '📋';
      default:
        return '📝';
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Produção</h1>
        <p className="text-slate-600">Gestão de projetos e controle de qualidade</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {productionMetrics.map((metric, index) => (
          <KPICard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Projetos Críticos */}
        <div className="rounded-lg border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Projetos Críticos</h2>
            <span className="text-sm text-slate-500">Por prazo de entrega</span>
          </div>
          <div className="space-y-4">
            {criticalProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getPriorityIcon(project.priority)}</span>
                  <div>
                    <h3 className="font-medium text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-600">
                      {project.client} • {project.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      project.priority,
                    )}`}
                  >
                    Vence em {project.dueDate}
                  </div>
                  <p className="mt-1 text-xs capitalize text-slate-500">{project.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aprovações Pendentes */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Aprovações Pendentes</h2>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border-l-4 border-amber-400 pl-4">
                <h3 className="font-medium text-slate-900">{approval.project}</h3>
                <p className="text-sm text-slate-600">{approval.client}</p>
                <p className="text-sm font-medium text-amber-600">{approval.type}</p>
                <p className="text-xs text-slate-500">Aguardando há {approval.waitingDays} dias</p>
              </div>
            ))}
          </div>
        </div>

        {/* Capacidade vs Demanda */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Capacidade vs Demanda</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">Design</span>
                <span className="text-sm text-slate-600">85%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">Revisão</span>
                <span className="text-sm text-slate-600">65%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium">Produção</span>
                <span className="text-sm text-slate-600">92%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-red-500" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status de Provas */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Status de Provas</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Em Revisão</span>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                12
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Aguardando Cliente</span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                7
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Aprovadas</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                24
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Correções</span>
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Timeline de Produção */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Tempo Médio por Etapa</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Design Inicial:</span>
              <span className="text-sm font-medium">3.2 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Primeira Revisão:</span>
              <span className="text-sm font-medium">2.1 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Aprovação Cliente:</span>
              <span className="text-sm font-medium text-amber-600">5.8 dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Arte Final:</span>
              <span className="text-sm font-medium">1.8 dias</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold">Total Médio:</span>
              <span className="text-sm font-semibold">12.9 dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
