"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Target,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface KPICardsProps {
  kpis: {
    totalClients: number;
    activeLeads: number;
    totalQuotes: number;
    conversionRate: number;
    quotesWon: number;
    totalRevenue: number;
    avgTicket: number;
  };
}

export function KPICards({ kpis }: KPICardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const cards = [
    {
      title: "Clientes Ativos",
      value: kpis.totalClients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Base de clientes",
    },
    {
      title: "Leads Ativos",
      value: kpis.activeLeads,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Em negociação",
    },
    {
      title: "Taxa de Conversão",
      value: formatPercentage(kpis.conversionRate),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Leads → Vendas",
    },
    {
      title: "Orçamentos",
      value: `${kpis.quotesWon}/${kpis.totalQuotes}`,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Assinados/Total",
    },
    {
      title: "Receita Total",
      value: formatCurrency(kpis.totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Orçamentos assinados",
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(kpis.avgTicket),
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Valor médio por lead",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <p className="text-xs text-gray-500">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
