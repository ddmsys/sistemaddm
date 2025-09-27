import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Lead, Quote } from "@/lib/types/comercial";

interface ConversionData {
  period: string;
  leadsCreated: number;
  leadsQualified: number;
  quotesGenerated: number;
  quotesSigned: number;
  leadsToQuotesRate: number;
  quotesToSignedRate: number;
  overallConversionRate: number;
  averageDaysToConvert: number;
  totalValue: number;
  averageTicket: number;
}

interface ConversionRateFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  source?: Lead["source"][];
  ownerId?: string[];
  granularity?: "daily" | "weekly" | "monthly";
}

// ✅ INTERFACE CORRIGIDA
interface SourceStats {
  source: Lead["source"];
  conversionRate: number;
  count: number;
  value: number;
}

// ✅ INTERFACE CORRIGIDA
interface OwnerStats {
  ownerId: string;
  ownerName: string;
  conversionRate: number;
  count: number;
  value: number;
}

interface ConversionRateStats {
  current: ConversionData;
  previous: ConversionData;
  growth: {
    leadsToQuotes: number;
    quotesToSigned: number;
    overall: number;
    averageTicket: number;
  };
  topSources: SourceStats[]; // ✅ TIPAGEM CORRIGIDA
  topOwners: OwnerStats[]; // ✅ TIPAGEM CORRIGIDA
}

export function useConversionRate(filters?: ConversionRateFilters) {
  const [data, setData] = useState<ConversionData[]>([]);
  const [stats, setStats] = useState<ConversionRateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para calcular taxa de conversão
  const calculateConversionRate = (
    converted: number,
    total: number
  ): number => {
    if (total === 0) return 0;
    return (converted / total) * 100;
  };

  // Função para calcular diferença entre períodos
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Função para formatar período
  const formatPeriod = (
    date: Date,
    granularity: "daily" | "weekly" | "monthly" = "monthly"
  ): string => {
    switch (granularity) {
      case "daily":
        return date.toLocaleDateString("pt-BR");
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return `Sem ${weekStart.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        })}`;
      case "monthly":
        return date.toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        });
      default:
        return date.toLocaleDateString("pt-BR");
    }
  };

  useEffect(() => {
    const fetchConversionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Por enquanto, dados mockados - TODO: implementar com Firestore
        const currentDate = new Date();
        const previousMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const currentMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );

        // Simular dados do período atual
        const currentData: ConversionData = {
          period: formatPeriod(currentMonth, filters?.granularity),
          leadsCreated: 150,
          leadsQualified: 95,
          quotesGenerated: 68,
          quotesSigned: 28,
          leadsToQuotesRate: calculateConversionRate(68, 150),
          quotesToSignedRate: calculateConversionRate(28, 68),
          overallConversionRate: calculateConversionRate(28, 150),
          averageDaysToConvert: 21,
          totalValue: 168000,
          averageTicket: 6000,
        };

        // Simular dados do período anterior
        const previousData: ConversionData = {
          period: formatPeriod(previousMonth, filters?.granularity),
          leadsCreated: 135,
          leadsQualified: 82,
          quotesGenerated: 58,
          quotesSigned: 22,
          leadsToQuotesRate: calculateConversionRate(58, 135),
          quotesToSignedRate: calculateConversionRate(22, 58),
          overallConversionRate: calculateConversionRate(22, 135),
          averageDaysToConvert: 25,
          totalValue: 132000,
          averageTicket: 6000,
        };

        // Simular dados históricos (últimos 6 meses)
        const historicalData: ConversionData[] = [
          {
            period: "Abril 2024",
            leadsCreated: 120,
            leadsQualified: 78,
            quotesGenerated: 52,
            quotesSigned: 18,
            leadsToQuotesRate: calculateConversionRate(52, 120),
            quotesToSignedRate: calculateConversionRate(18, 52),
            overallConversionRate: calculateConversionRate(18, 120),
            averageDaysToConvert: 28,
            totalValue: 108000,
            averageTicket: 6000,
          },
          {
            period: "Maio 2024",
            leadsCreated: 125,
            leadsQualified: 80,
            quotesGenerated: 55,
            quotesSigned: 20,
            leadsToQuotesRate: calculateConversionRate(55, 125),
            quotesToSignedRate: calculateConversionRate(20, 55),
            overallConversionRate: calculateConversionRate(20, 125),
            averageDaysToConvert: 26,
            totalValue: 120000,
            averageTicket: 6000,
          },
          {
            period: "Junho 2024",
            leadsCreated: 130,
            leadsQualified: 85,
            quotesGenerated: 60,
            quotesSigned: 25,
            leadsToQuotesRate: calculateConversionRate(60, 130),
            quotesToSignedRate: calculateConversionRate(25, 60),
            overallConversionRate: calculateConversionRate(25, 130),
            averageDaysToConvert: 24,
            totalValue: 150000,
            averageTicket: 6000,
          },
          {
            period: "Julho 2024",
            leadsCreated: 140,
            leadsQualified: 88,
            quotesGenerated: 62,
            quotesSigned: 24,
            leadsToQuotesRate: calculateConversionRate(62, 140),
            quotesToSignedRate: calculateConversionRate(24, 62),
            overallConversionRate: calculateConversionRate(24, 140),
            averageDaysToConvert: 23,
            totalValue: 144000,
            averageTicket: 6000,
          },
          previousData,
          currentData,
        ];

        // ✅ ARRAYS CORRIGIDOS COM TIPAGEM ADEQUADA
        const topSources: SourceStats[] = [
          {
            source: "website" as Lead["source"],
            conversionRate: 22.5,
            count: 45,
            value: 270000,
          },
          {
            source: "referral" as Lead["source"],
            conversionRate: 28.0,
            count: 35,
            value: 210000,
          },
          {
            source: "social-media" as Lead["source"],
            conversionRate: 18.2,
            count: 28,
            value: 168000,
          },
          {
            source: "advertising" as Lead["source"],
            conversionRate: 15.8,
            count: 25,
            value: 150000,
          },
          {
            source: "event" as Lead["source"],
            conversionRate: 35.0,
            count: 12,
            value: 72000,
          },
        ];

        const topOwners: OwnerStats[] = [
          {
            ownerId: "user1",
            ownerName: "Ana Silva",
            conversionRate: 32.5,
            count: 40,
            value: 240000,
          },
          {
            ownerId: "user2",
            ownerName: "Carlos Santos",
            conversionRate: 28.0,
            count: 35,
            value: 210000,
          },
          {
            ownerId: "user3",
            ownerName: "Maria Costa",
            conversionRate: 25.5,
            count: 30,
            value: 180000,
          },
          {
            ownerId: "user4",
            ownerName: "João Oliveira",
            conversionRate: 22.0,
            count: 25,
            value: 150000,
          },
        ];

        // Calcular estatísticas comparativas
        const conversionStats: ConversionRateStats = {
          current: currentData,
          previous: previousData,
          growth: {
            leadsToQuotes: calculateGrowth(
              currentData.leadsToQuotesRate,
              previousData.leadsToQuotesRate
            ),
            quotesToSigned: calculateGrowth(
              currentData.quotesToSignedRate,
              previousData.quotesToSignedRate
            ),
            overall: calculateGrowth(
              currentData.overallConversionRate,
              previousData.overallConversionRate
            ),
            averageTicket: calculateGrowth(
              currentData.averageTicket,
              previousData.averageTicket
            ),
          },
          topSources: topSources.sort(
            (a, b) => b.conversionRate - a.conversionRate
          ),
          topOwners: topOwners.sort(
            (a, b) => b.conversionRate - a.conversionRate
          ),
        };

        setData(historicalData);
        setStats(conversionStats);
      } catch (err) {
        console.error("Erro ao buscar dados de conversão:", err);
        setError("Erro ao carregar dados de conversão");
      } finally {
        setLoading(false);
      }
    };

    fetchConversionData();
  }, [filters]);

  // Função para calcular conversão por período customizado
  const getConversionByPeriod = (
    startDate: Date,
    endDate: Date
  ): Promise<ConversionData> => {
    return new Promise((resolve) => {
      // Simular cálculo específico para o período
      setTimeout(() => {
        resolve({
          period: `${startDate.toLocaleDateString(
            "pt-BR"
          )} - ${endDate.toLocaleDateString("pt-BR")}`,
          leadsCreated: 75,
          leadsQualified: 48,
          quotesGenerated: 34,
          quotesSigned: 14,
          leadsToQuotesRate: calculateConversionRate(34, 75),
          quotesToSignedRate: calculateConversionRate(14, 34),
          overallConversionRate: calculateConversionRate(14, 75),
          averageDaysToConvert: 19,
          totalValue: 84000,
          averageTicket: 6000,
        });
      }, 500);
    });
  };

  // Função para exportar dados
  const exportData = async (
    format: "csv" | "excel" = "csv"
  ): Promise<string> => {
    return new Promise((resolve) => {
      // Simular exportação
      setTimeout(() => {
        const csvContent = [
          "Período,Leads Criados,Leads Qualificados,Orçamentos Gerados,Orçamentos Assinados,Taxa Conversão Geral,Ticket Médio",
          ...data.map(
            (d) =>
              `${d.period},${d.leadsCreated},${d.leadsQualified},${
                d.quotesGenerated
              },${d.quotesSigned},${d.overallConversionRate.toFixed(2)}%,R$ ${
                d.averageTicket
              }`
          ),
        ].join("\n");

        resolve(csvContent);
      }, 1000);
    });
  };

  return {
    data,
    stats,
    loading,
    error,
    getConversionByPeriod,
    exportData,
    // Dados úteis para componentes
    currentConversionRate: stats?.current.overallConversionRate || 0,
    previousConversionRate: stats?.previous.overallConversionRate || 0,
    conversionGrowth: stats?.growth.overall || 0,
    bestSource: stats?.topSources[0]?.source || "website",
    bestOwner: stats?.topOwners[0]?.ownerName || "N/A",
  };
}

// Hook especializado para componentes de dashboard
export function useConversionRateWidget() {
  const { stats, loading, currentConversionRate, conversionGrowth } =
    useConversionRate();

  return {
    conversionRate: currentConversionRate,
    growth: conversionGrowth,
    loading,
    isGrowthPositive: conversionGrowth >= 0,
    formattedRate: `${currentConversionRate.toFixed(1)}%`,
    formattedGrowth: `${Math.abs(conversionGrowth).toFixed(1)}%`,
  };
}
