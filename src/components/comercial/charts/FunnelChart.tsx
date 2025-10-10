'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface FunnelData {
  status: string;
  count: number;
  label: string;
  color?: string;
}

interface FunnelChartProps {
  data: {
    status: LeadStatus;
    count: number;
    value?: number;
  }[];
  title?: string;
  showValues?: boolean;
}

const stageConfig = {
  new: { label: 'Novos Leads', color: '#3b82f6' },
  primeiro_contato: { label: 'Primeiro Contato', color: '#8b5cf6' },
  qualificado: { label: 'Qualificado', color: '#f59e0b' },
  proposta_enviada: { label: 'Proposta Enviada', color: '#06b6d4' },
  negociacao: { label: 'Negociação', color: '#f97316' },
  fechado_ganho: { label: 'Fechado - Ganhou', color: '#10b981' },
  fechado_perdido: { label: 'Fechado - Perdido', color: '#ef4444' },
};

export function FunnelChart({
  data,
  title = 'Funil de Vendas',
  showValues = true,
}: FunnelChartProps) {
  const chartData = useMemo(() => {
    const totalLeads = data.find((item) => item.status === 'primeiro_contato')?.count || 0;

    return Object.entries(stageConfig)
      .map(([status, config]) => {
        const item = data.find((d) => d.status === (status as LeadStatus));
        const count = item?.count || 0;
        const value = item?.value || 0;
        const conversion = totalLeads > 0 ? (count / totalLeads) * 100 : 0;

        return {
          stage: config.label,
          count,
          value,
          conversion,
          color: config.color,
        };
      })
      .filter((item) => item.count > 0);
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload || payload[0];
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-medium text-primary-900">{item.label}</p>
          <p className="text-sm text-primary-600">
            <span className="font-medium">{item.count}</span> leads
          </p>
          {showValues && item.value > 0 && (
            <p className="text-sm text-primary-600">
              Valor: <span className="font-medium">{formatCurrency(item.value)}</span>
            </p>
          )}
          <p className="text-sm text-primary-600">
            Taxa: <span className="font-medium">{item.conversion.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <div className="text-sm font-normal text-primary-500">Taxa de Conversão</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Summary */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-primary-50 p-3 text-center">
            <div className="text-2xl font-bold text-primary-900">
              {chartData.length > 0 ? chartData[0].count : 0}
            </div>
            <div className="text-sm text-primary-600">Total de Leads</div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {chartData.find((d) => d.stage.includes('Fechados'))?.conversion.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-emerald-600">Taxa de Conversão</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
