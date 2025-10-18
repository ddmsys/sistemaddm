'use client';

import { AlertCircle, Briefcase, DollarSign, FileText, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface KPIData {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data - substituir por dados reais
  const kpis: KPIData[] = [
    {
      title: 'Leads Ativos',
      value: 42,
      change: 12.5,
      trend: 'up',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Projetos em Andamento',
      value: 18,
      change: -2.1,
      trend: 'down',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Receita do Mês',
      value: 'R$ 125.400',
      change: 8.7,
      trend: 'up',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Orçamentos Pendentes',
      value: 7,
      change: 0,
      trend: 'stable',
      icon: FileText,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      title: 'Novo lead cadastrado',
      description: 'Maria Silva - Livro de receitas',
      time: '5 min atrás',
      icon: Users,
    },
    {
      id: 2,
      type: 'project',
      title: 'Projeto atualizado',
      description: 'Romance do João - Revisão concluída',
      time: '1h atrás',
      icon: Briefcase,
    },
    {
      id: 3,
      type: 'quote',
      title: 'Orçamento aprovado',
      description: 'Biografia corporativa - R$ 15.000',
      time: '2h atrás',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Dashboard Executivo</h1>
            <p className="mt-2 text-primary-600">Visão geral do Sistema DDM</p>
          </div>

          <div className="mt-4 flex items-center space-x-3 sm:mt-0">
            <button
              onClick={() => setTimeRange('7d')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'border border-primary-300 bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'border border-primary-300 bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === '90d'
                  ? 'bg-blue-600 text-white'
                  : 'border border-primary-300 bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              90 dias
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className={`rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${kpi.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-lg bg-white bg-opacity-50 p-2">
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="text-sm opacity-75">{kpi.title}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {kpi.trend === 'up' && <TrendingUp className="mr-1 h-4 w-4 text-emerald-600" />}
                {kpi.trend === 'down' && (
                  <TrendingUp className="mr-1 h-4 w-4 rotate-180 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    kpi.trend === 'up'
                      ? 'text-emerald-600'
                      : kpi.trend === 'down'
                        ? 'text-red-600'
                        : 'text-primary-600'
                  }`}
                >
                  {kpi.trend === 'stable' ? 'Estável' : `${Math.abs(kpi.change)}%`}
                </span>
                <span className="ml-1 text-xs text-primary-500">
                  {timeRange === '7d'
                    ? 'vs semana anterior'
                    : timeRange === '30d'
                      ? 'vs mês anterior'
                      : 'vs trimestre anterior'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Atividades Recentes */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold text-primary-900">Atividades Recentes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center rounded-lg bg-primary-50 p-4 transition-colors hover:bg-primary-100"
                    >
                      <div className="mr-4 rounded-lg bg-blue-100 p-2">
                        <activity.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-900">{activity.title}</h3>
                        <p className="text-sm text-primary-600">{activity.description}</p>
                      </div>
                      <div className="text-xs text-primary-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="w-full py-2 font-medium text-blue-600 hover:text-blue-700">
                    Ver todas as atividades
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div>
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold text-primary-900">Ações Rápidas</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="flex w-full items-center rounded-lg bg-blue-50 p-4 text-blue-700 transition-colors hover:bg-blue-100">
                    <Users className="mr-3 h-5 w-5" />
                    <span className="font-medium">Novo Lead</span>
                  </button>
                  <button className="flex w-full items-center rounded-lg bg-purple-50 p-4 text-purple-700 transition-colors hover:bg-purple-100">
                    <FileText className="mr-3 h-5 w-5" />
                    <span className="font-medium">Novo Orçamento</span>
                  </button>
                  <button className="flex w-full items-center rounded-lg bg-emerald-50 p-4 text-emerald-700 transition-colors hover:bg-emerald-100">
                    <Briefcase className="mr-3 h-5 w-5" />
                    <span className="font-medium">Novo Projeto</span>
                  </button>
                  <button className="flex w-full items-center rounded-lg bg-amber-50 p-4 text-amber-700 transition-colors hover:bg-amber-100">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    <span className="font-medium">Relatórios</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Alertas */}
            <div className="mt-6 rounded-lg border bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="flex items-center text-xl font-semibold text-primary-900">
                  <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                  Alertas
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-800">3 projetos atrasados</p>
                    <p className="mt-1 text-xs text-red-600">Requer atenção imediata</p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-medium text-amber-800">
                      5 orçamentos próximos do vencimento
                    </p>
                    <p className="mt-1 text-xs text-amber-600">Vencem em 3 dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
