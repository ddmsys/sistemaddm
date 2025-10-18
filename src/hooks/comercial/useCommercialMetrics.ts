import { useEffect, useState } from 'react';

interface RevenueDataPoint {
  date: string;
  value: number;
  goal?: number;
}

interface CriticalProject {
  id: string;
  title: string;
  clientName: string;
  daysToDeadline: number;
  status: string;
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
  revenueData: RevenueDataPoint[];
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
        revenueData: [
          { date: '01/09', value: 17000, goal: 15000 },
          { date: '05/09', value: 26000, goal: 20000 },
          { date: '10/09', value: 45000, goal: 40000 },
          { date: '22/09', value: 32000, goal: 23000 },
        ],
        criticalProjects: [
          {
            id: 'p001',
            title: 'Livro Biologia',
            clientName: 'Editora ABC',
            daysToDeadline: 5,
            status: 'Review',
          },
          {
            id: 'p002',
            title: 'Livro História',
            clientName: 'Editora XYZ',
            daysToDeadline: 2,
            status: 'Design',
          },
        ],
      };

      setMetrics(mockMetrics);
      setLoading(false);
    }, 800);
  }, [period]);

  return { metrics, loading };
}
