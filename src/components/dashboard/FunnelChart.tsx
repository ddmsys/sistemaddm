// src/components/dashboard/FunnelChart.tsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FunnelChartProps {
  stages: { stage: string; count: number }[];
}

export function FunnelChart({ stages }: FunnelChartProps) {
  const data = {
    labels: stages.map((s) => s.stage),
    datasets: [
      {
        label: "Número de Leads",
        data: stages.map((s) => s.count),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // azul DDM
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Funil de Vendas",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
