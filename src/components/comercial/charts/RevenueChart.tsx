"use client";

import React from "react";

interface RevenueDataPoint {
  date: string;
  value: number;
  goal?: number;
}

interface RevenueChartProps {
  data?: RevenueDataPoint[];
  height?: number;
  showGoals?: boolean;
  showLabels?: boolean;
  currency?: string;
}

export function RevenueChart({
  data = [],
  height = 200,
  showGoals = true,
  showLabels = true,
  currency = "BRL",
}: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex flex-col justify-center items-center text-slate-500">
        <div className="text-4xl mb-2">📊</div>
        <p>Sem dados de receita disponíveis</p>
        <p className="text-sm mt-1">
          Dados serão exibidos quando houver vendas
        </p>
      </div>
    );
  }

  // Calcular valores máximos e totais
  const maxValue = Math.max(
    ...data.map((d) => d.value),
    ...data.map((d) => d.goal || 0),
    1000 // Valor mínimo para escala
  );

  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0);
  const totalGoal = data.reduce((sum, d) => sum + (d.goal || 0), 0);
  const goalAchievement = totalGoal > 0 ? (totalRevenue / totalGoal) * 100 : 0;

  // Formatação de moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Formatação compacta para valores grandes
  const formatCompact = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="w-full">
      {/* Header com totais */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-slate-600">Total Período</p>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        {showGoals && totalGoal > 0 && (
          <div className="text-right">
            <p className="text-sm text-slate-600">
              Meta: {formatCurrency(totalGoal)}
            </p>
            <p
              className={`text-sm font-medium ${
                goalAchievement >= 100
                  ? "text-emerald-600"
                  : goalAchievement >= 80
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {goalAchievement.toFixed(0)}% da meta
            </p>
          </div>
        )}
      </div>

      {/* Gráfico */}
      <div className="relative">
        {/* Grid lines de fundo */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-slate-100 w-full" />
          ))}
        </div>

        {/* Labels do eixo Y */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 -ml-12">
          {[...Array(5)].map((_, i) => {
            const value = maxValue - (i * maxValue) / 4;
            return (
              <span key={i} className="transform -translate-y-1/2">
                {formatCompact(value)}
              </span>
            );
          })}
        </div>

        {/* Barras do gráfico */}
        <div
          className="flex gap-2 w-full items-end pl-4"
          style={{ height: `${height}px` }}
        >
          {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * (height - 40);
            const goalHeight = d.goal ? (d.goal / maxValue) * (height - 40) : 0;

            return (
              <div
                key={i}
                className="flex flex-col items-center justify-end flex-1 max-w-[60px] h-full group"
              >
                {/* Tooltip hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-16 bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                  <div>Receita: {formatCurrency(d.value)}</div>
                  {d.goal && <div>Meta: {formatCurrency(d.goal)}</div>}
                  <div className="text-slate-300">{d.date}</div>
                </div>

                {/* Linha da meta (se houver) */}
                {d.goal && showGoals && (
                  <div
                    className="w-full border-t-2 border-emerald-400 border-dashed absolute pointer-events-none"
                    style={{ bottom: `${goalHeight + 25}px` }}
                  />
                )}

                {/* Barra principal */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 hover:opacity-80 ${
                    d.goal && d.value >= d.goal
                      ? "bg-emerald-500"
                      : d.goal && d.value >= d.goal * 0.8
                      ? "bg-blue-500"
                      : "bg-slate-400"
                  }`}
                  style={{ height: `${Math.max(barHeight, 4)}px` }}
                />

                {/* Label da data */}
                {showLabels && (
                  <span className="text-xs text-slate-500 mt-2 truncate w-full text-center">
                    {d.date}
                  </span>
                )}

                {/* Valor acima da barra */}
                <div className="absolute text-xs font-medium text-slate-700 transform -translate-y-full -mt-1">
                  {formatCompact(d.value)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex justify-center items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-600">Receita</span>
        </div>
        {showGoals && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-emerald-400 border-dashed border-t-2"></div>
            <span className="text-slate-600">Meta</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-slate-600">Meta Atingida</span>
        </div>
      </div>

      {/* Resumo estatístico */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="text-center">
          <p className="text-xs text-slate-500">Média</p>
          <p className="font-medium">
            {formatCurrency(totalRevenue / data.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Maior</p>
          <p className="font-medium">
            {formatCurrency(Math.max(...data.map((d) => d.value)))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Menor</p>
          <p className="font-medium">
            {formatCurrency(Math.min(...data.map((d) => d.value)))}
          </p>
        </div>
      </div>
    </div>
  );
}
