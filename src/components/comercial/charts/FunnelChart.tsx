"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface FunnelData {
  stage: string;
  label: string;
  count: number;
  value: number;
  color: string;
  conversionRate?: number;
}

interface FunnelChartProps {
  data?: FunnelData[]; // ✅ OPCIONAL
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
  loading?: boolean;
}

export function FunnelChart({
  data = [], // ✅ DEFAULT ARRAY VAZIO
  height = 300,
  showValues = true,
  showPercentages = true,
  loading = false,
}: FunnelChartProps) {
  if (loading) {
    return (
      <div className="h-[200px] flex justify-center items-center">
        Carregando funil...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex justify-center items-center text-slate-500">
        Sem dados de funil
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1); // ✅ EVITA DIVISÃO POR ZERO

  return (
    <div className="w-full">
      <div
        className="flex flex-row gap-4 justify-between items-end"
        style={{ height }}
      >
        {data.map((stage, idx) => {
          const percent = stage.count / maxCount; // ✅ USA maxCount
          return (
            <div
              key={stage.stage}
              className="flex flex-col items-center justify-end w-[100px]"
            >
              <div
                style={{
                  height: `${Math.max(20, percent * (height - 60))}px`, // ✅ ALTURA MÍNIMA
                  backgroundColor: stage.color || "#3b82f6",
                  width: "52px",
                  borderRadius: "16px 16px 0 0",
                  transition: "height 0.2s",
                }}
                className="mb-2 flex items-center justify-center"
                title={`${stage.label}: ${stage.count} leads`}
              >
                {showValues && (
                  <span className="text-white text-sm font-bold">
                    {stage.count}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-700 font-medium text-center mb-1">
                {stage.label}
              </span>
              {showPercentages && stage.conversionRate !== undefined && (
                <span className="text-xs text-slate-500">
                  {stage.conversionRate.toFixed(1)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
