'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface RevenueData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  title?: string;
  type?: 'line' | 'area';
}

export function RevenueChart({
  data = [],
  title = 'Receita vs Despesas',
  type = 'area',
}: RevenueChartProps) {
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="mb-2 font-medium text-primary-900">{label}</p>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const Chart = type === 'area' ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {type === 'area' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Receita"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Despesas"
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Receita"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Despesas"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Lucro"
                  />
                </>
              )}
            </Chart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <div className="text-lg font-bold text-emerald-700">
              {formatCurrency(
                Array.isArray(data) ? data.reduce((sum, item) => sum + item.revenue, 0) : 0,
              )}
            </div>
            <div className="text-sm text-emerald-600">Receita Total</div>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <div className="text-lg font-bold text-red-700">
              {formatCurrency(
                Array.isArray(data) ? data.reduce((sum, item) => sum + item.expenses, 0) : 0,
              )}
            </div>
            <div className="text-sm text-red-600">Despesas Totais</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(
                Array.isArray(data) ? data.reduce((sum, item) => sum + item.profit, 0) : 0,
              )}
            </div>
            <div className="text-sm text-blue-600">Lucro Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
