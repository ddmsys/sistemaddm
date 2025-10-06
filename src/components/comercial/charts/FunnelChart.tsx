"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FunnelData {
  stage: string;
  count: number;
  value: number;
  conversion: number;
  color: string;
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
  new: { label: "Novos Leads", color: "#3b82f6" },
  contacted: { label: "Contatados", color: "#8b5cf6" },
  qualified: { label: "Qualificados", color: "#f59e0b" },
  proposal: { label: "Propostas", color: "#06b6d4" },
  negotiation: { label: "Negociação", color: "#f97316" },
  closed_won: { label: "Fechados", color: "#10b981" },
  closed_lost: { label: "Perdidos", color: "#ef4444" },
};

export function FunnelChart({
  data,
  title = "Funil de Vendas",
  showValues = true,
}: FunnelChartProps) {
  const chartData = useMemo(() => {
    const totalLeads = data.find((item) => item.status === "new")?.count || 0;

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-primary-900">{label}</p>
          <p className="text-sm text-primary-600">
            <span className="font-medium">{data.count}</span> leads
          </p>
          {showValues && data.value > 0 && (
            <p className="text-sm text-primary-600">
              Valor:{" "}
              <span className="font-medium">{formatCurrency(data.value)}</span>
            </p>
          )}
          <p className="text-sm text-primary-600">
            Taxa:{" "}
            <span className="font-medium">{data.conversion.toFixed(1)}%</span>
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
          <div className="text-sm font-normal text-primary-500">
            Taxa de Conversão
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
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
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-900">
              {chartData.length > 0 ? chartData[0].count : 0}
            </div>
            <div className="text-sm text-primary-600">Total de Leads</div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-700">
              {chartData
                .find((d) => d.stage.includes("Fechados"))
                ?.conversion.toFixed(1) || 0}
              %
            </div>
            <div className="text-sm text-emerald-600">Taxa de Conversão</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
