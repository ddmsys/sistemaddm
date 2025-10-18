import { useEffect, useState } from "react";

import { LeadStatus } from "@/lib/types/leads";

interface RevenueData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface CriticalProject {
  id: string;
  title: string;
  clientName: string;
  daysToDeadline: number;
  status: string;
}

interface DonutData {
  stage: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface FunnelData {
  status: LeadStatus;
  count: number;
  value?: number;
}

interface Metrics {
  monthlyRevenue: number;
  revenueGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
  activeLeads: number;
  leadsGrowth: number;
  averageTicket: number;
  ticketGrowth: number;
  totalBudgets: number;
  revenueData: RevenueData[];
  funnelData: FunnelData[];
  leadsBySource: DonutData[];
  budgetsbyStatus: DonutData[];
  criticalProjects: CriticalProject[];
}

export function useCommercialMetrics(period?: { start: Date; end: Date }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular busca de dados
    setLoading(true);

    setTimeout(() => {
      const mockMetrics: Metrics = {
        monthlyRevenue: 120000,
        revenueGrowth: 8,
        conversionRate: 28,
        conversionGrowth: 2,
        activeLeads: 162,
        leadsGrowth: 4,
        averageTicket: 4300,
        ticketGrowth: 7,
        totalBudgets: 48,
        revenueData: [
          { period: "01/09", revenue: 17000, expenses: 12000, profit: 5000 },
          { period: "05/09", revenue: 26000, expenses: 18000, profit: 8000 },
          { period: "10/09", revenue: 45000, expenses: 32000, profit: 13000 },
          { period: "22/09", revenue: 32000, expenses: 25000, profit: 7000 },
        ],
        funnelData: [
          { status: "primeiro_contato", count: 48 },
          { status: "qualificado", count: 32 },
          { status: "proposta_enviada", count: 24 },
          { status: "negociacao", count: 18 },
          { status: "fechado_ganho", count: 12 },
        ],
        leadsBySource: [
          { stage: "website", label: "Website", value: 35, percentage: 40, color: "#3b82f6" },
          { stage: "referral", label: "Indicação", value: 28, percentage: 32, color: "#8b5cf6" },
          {
            stage: "socialmedia",
            label: "Redes Sociais",
            value: 22,
            percentage: 25,
            color: "#f59e0b",
          },
          { stage: "email", label: "Email", value: 15, percentage: 17, color: "#06b6d4" },
        ],
        budgetsbyStatus: [
          { stage: "sent", label: "Pendentes", value: 12, percentage: 52, color: "#f59e0b" },
          { stage: "approved", label: "Aprovados", value: 8, percentage: 35, color: "#10b981" },
          { stage: "rejected", label: "Rejeitados", value: 3, percentage: 13, color: "#ef4444" },
        ],
        criticalProjects: [
          {
            id: "p001",
            title: "Livro Biologia",
            clientName: "Editora ABC",
            daysToDeadline: 5,
            status: "Review",
          },
          {
            id: "p002",
            title: "Livro História",
            clientName: "Editora XYZ",
            daysToDeadline: 2,
            status: "Design",
          },
        ],
      };

      setMetrics(mockMetrics);
      setLoading(false);
    }, 800);
  }, [period]);

  return { metrics, loading };
}
