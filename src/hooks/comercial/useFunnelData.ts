import { useEffect, useMemo, useState } from "react";

interface FunnelStage {
  stage: string;
  label: string;
  count: number;
  value: number;
  color: string;
  percentage: number; // ✅ ADICIONAR PERCENTAGE
  conversionRate?: number;
}

export function useFunnelData(period?: { start: Date; end: Date }) {
  const [rawFunnelData, setRawFunnelData] = useState<
    Omit<FunnelStage, "percentage">[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ DADOS MOCKADOS SEM PERCENTAGE (será calculado)
        const mockData: Omit<FunnelStage, "percentage">[] = [
          {
            stage: "primeiro_contato",
            label: "Primeiro Contato",
            count: 150,
            value: 750000,
            color: "#64748b",
            conversionRate: 100,
          },
          {
            stage: "qualificado",
            label: "Qualificado",
            count: 95,
            value: 570000,
            color: "#2e71f6",
            conversionRate: 63.3,
          },
          {
            stage: "proposta_enviada",
            label: "Proposta Enviada",
            count: 68,
            value: 408000,
            color: "#8b5cf4",
            conversionRate: 71.6,
          },
          {
            stage: "negociacao",
            label: "Negociação",
            count: 45,
            value: 270000,
            color: "#FFB347",
            conversionRate: 66.2,
          },
          {
            stage: "fechado_ganho",
            label: "Fechado Ganho",
            count: 28,
            value: 168000,
            color: "#20B2AA",
            conversionRate: 62.2,
          },
          {
            stage: "fechado_perdido",
            label: "Fechado Perdido",
            count: 17,
            value: 0,
            color: "#CD5C5C",
            conversionRate: 0,
          },
        ];

        setRawFunnelData(mockData);
      } catch (err) {
        console.error("Erro ao buscar dados do funil:", err);
        setError("Erro ao carregar dados do funil");
      } finally {
        setLoading(false);
      }
    };

    fetchFunnelData();
  }, [period]);

  // ✅ CALCULAR PERCENTAGE COM useMemo
  const funnelData = useMemo((): FunnelStage[] => {
    if (rawFunnelData.length === 0) return [];

    const totalCount = rawFunnelData.reduce(
      (sum, stage) => sum + stage.count,
      0
    );

    return rawFunnelData.map((stage) => ({
      ...stage,
      percentage: totalCount > 0 ? (stage.count / totalCount) * 100 : 0, // ✅ CALCULAR PERCENTAGE
    }));
  }, [rawFunnelData]);

  // ✅ ESTATÍSTICAS CALCULADAS
  const stats = useMemo(() => {
    const totalLeads = funnelData.reduce((sum, stage) => sum + stage.count, 0);
    const totalValue = funnelData
      .filter((stage) => stage.stage !== "fechado_perdido")
      .reduce((sum, stage) => sum + stage.value, 0);

    const wonDeals =
      funnelData.find((s) => s.stage === "fechado_ganho")?.count || 0;
    const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

    return {
      totalLeads,
      totalValue,
      conversionRate,
      wonDeals,
      averageDealValue: wonDeals > 0 ? totalValue / wonDeals : 0,
    };
  }, [funnelData]);

  return {
    funnelData, // ✅ AGORA COM PERCENTAGE
    loading,
    error,
    ...stats, // ✅ SPREAD DAS ESTATÍSTICAS
  };
}
