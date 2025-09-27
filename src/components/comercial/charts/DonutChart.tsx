"use client";

import React, { useMemo, useState, useEffect } from "react";

interface DonutData {
  stage: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  height?: number;
  showValues?: boolean;
  showPercentages?: boolean;
  loading?: boolean;
}

export function DonutChart({
  data,
  height = 500, // ✅ ALTURA MAIOR
  showValues = true,
  showPercentages = true,
  loading,
}: DonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const { processedData, total } = useMemo(() => {
    const validData = data.filter((item) => item.value > 0);
    const total = validData.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -90; // Começar no topo
    const processedData = validData.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle: currentAngle,
        angle,
      };
    });

    return { processedData, total };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-slate-500"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-sm">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  // ✅ TAMANHOS MUITO MAIORES
  const radius = 160; // Era 120, agora 160
  const innerRadius = 95; // Era 75, agora 95
  const centerX = 240; // Era 180, agora 240
  const centerY = 240; // Era 180, agora 240

  // Função para criar path do arco
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      endAngle
    );
    const innerEnd = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      startAngle
    );

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "z",
    ].join(" ");
  };

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  return (
    // ✅ LAYOUT VERTICAL - GRÁFICO GRANDE EM CIMA
    <div className="flex flex-col items-center space-y-8">
      {/* ✅ GRÁFICO DONUT MUITO MAIOR */}
      <div className="relative flex justify-center">
        <svg
          width={480} // Era 360, agora 480
          height={480} // Era 360, agora 480
          viewBox="0 0 480 480"
          className="drop-shadow-lg"
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={65} // Era 45, agora 65 (mais grosso)
            className="opacity-20"
          />

          {/* Segmentos do gráfico */}
          {processedData.map((item) => {
            const isHovered = hoveredSegment === item.stage;
            const currentRadius = isHovered ? radius + 6 : radius;

            return (
              <g key={item.stage}>
                {/* Sombra */}
                <path
                  d={createArcPath(
                    item.startAngle,
                    item.endAngle,
                    currentRadius + 3,
                    innerRadius
                  )}
                  fill="rgba(0,0,0,0.15)"
                  transform="translate(4,4)"
                  className="transition-all duration-300"
                />

                {/* Segmento principal */}
                <path
                  d={createArcPath(
                    item.startAngle,
                    item.endAngle,
                    currentRadius,
                    innerRadius
                  )}
                  fill={item.color}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered
                      ? "brightness(1.1) saturate(1.2)"
                      : "none",
                  }}
                  onMouseEnter={() => setHoveredSegment(item.stage)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              </g>
            );
          })}

          {/* Centro com total - MAIOR */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 15} // Mais espaço
            fill="white"
            className="drop-shadow-sm"
          />

          <text
            x={centerX}
            y={centerY - 15}
            textAnchor="middle"
            className="text-xl font-medium fill-slate-500" // Era text-lg, agora text-xl
          >
            Total
          </text>
          <text
            x={centerX}
            y={centerY + 20}
            textAnchor="middle"
            className="text-5xl font-bold fill-slate-900" // Era text-3xl, agora text-5xl
          >
            {total}
          </text>

          {hoveredSegment && (
            <text
              x={centerX}
              y={centerY + 55}
              textAnchor="middle"
              className="text-base fill-slate-600" // Era text-sm, agora text-base
            >
              {
                processedData.find((item) => item.stage === hoveredSegment)
                  ?.label
              }
            </text>
          )}
        </svg>
      </div>

      {/* ✅ LEGENDA HORIZONTAL EMBAIXO - MAIOR */}
      <div className="w-full px-4">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {" "}
          {/* Era gap-x-8, agora gap-x-12 */}
          {processedData.map((item) => {
            const isHovered = hoveredSegment === item.stage;

            return (
              <div
                key={item.stage}
                className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                  // Era gap-2, agora gap-3
                  isHovered ? "scale-110" : "hover:scale-105" // Era scale-105, agora scale-110
                }`}
                onMouseEnter={() => setHoveredSegment(item.stage)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                {/* Bolinha colorida - MAIOR */}
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    // Era w-3 h-3, agora w-4 h-4
                    isHovered ? "scale-125 shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor: item.color,
                    boxShadow: isHovered
                      ? `0 4px 12px ${item.color}40`
                      : "none",
                  }}
                />

                {/* Texto da legenda - MAIOR */}
                <span
                  className={`text-base transition-colors duration-200 ${
                    // Era text-sm, agora text-base
                    isHovered
                      ? "text-slate-900 font-semibold"
                      : "text-slate-700" // Era font-medium, agora font-semibold
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
