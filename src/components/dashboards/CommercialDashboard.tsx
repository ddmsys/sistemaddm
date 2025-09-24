"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  FaUsers,
  FaChartLine,
  FaProjectDiagram,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaHandshake,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

type StageName =
  | "Primeiro Contato"
  | "Proposta Enviada"
  | "Negociação"
  | "Fechado Ganho"
  | "Fechado Perdido";

type Lead = {
  id: string;
  name: string;
  stage: StageName;
};

function mapStatusToStage(status: string): StageName {
  switch (status) {
    case "new":
      return "Primeiro Contato";
    case "contacted":
      return "Proposta Enviada";
    case "qualified":
      return "Negociação";
    case "converted":
      return "Fechado Ganho";
    case "lost":
      return "Fechado Perdido";
    default:
      return "Primeiro Contato";
  }
}

const initialFunnelStages = [
  {
    stage: "Primeiro Contato",
    count: 0,
    icon: <FaPhone className="text-blue-500 w-5 h-5" />,
  },
  {
    stage: "Proposta Enviada",
    count: 0,
    icon: <FaEnvelope className="text-yellow-500 w-5 h-5" />,
  },
  {
    stage: "Negociação",
    count: 0,
    icon: <FaHandshake className="text-purple-500 w-5 h-5" />,
  },
  {
    stage: "Fechado Ganho",
    count: 0,
    icon: <FaCheckCircle className="text-green-500 w-5 h-5" />,
  },
  {
    stage: "Fechado Perdido",
    count: 0,
    icon: <FaTimesCircle className="text-red-500 w-5 h-5" />,
  },
];

export default function CommercialDashboard() {
  const [kpis, setKpis] = useState({
    totalClientes: 0,
    leadsAtivos: 0,
    projetosAndamento: 0,
    receitaMensal: 0,
  });

  const [funnelStages, setFunnelStages] = useState(initialFunnelStages);

  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    async function fetchKpis() {
      // Buscar dados do Firestore
      const clientsSnapshot = await getDocs(collection(db, "clients"));
      const leadsSnapshot = await getDocs(collection(db, "leads"));
      const projectsSnapshot = await getDocs(collection(db, "projects"));

      // Contar clientes, leads ativos e projetos
      setKpis({
        totalClientes: clientsSnapshot.size,
        leadsAtivos: leadsSnapshot.docs.filter((doc) => {
          const data = doc.data();
          return data.status !== "lost" && data.status !== "converted";
        }).length,
        projetosAndamento: projectsSnapshot.docs.filter((doc) => {
          const data = doc.data();
          return data.status === "in_progress";
        }).length,
        receitaMensal: 12345, // ajuste conforme seu cálculo real
      });

      // Atualizar funil
      const stagesCount: Record<StageName, number> = {
        "Primeiro Contato": 0,
        "Proposta Enviada": 0,
        Negociação: 0,
        "Fechado Ganho": 0,
        "Fechado Perdido": 0,
      };

      leadsSnapshot.docs.forEach((doc) => {
        const data = doc.data() as { status?: string };
        if (data.status) {
          const stage = mapStatusToStage(data.status);
          stagesCount[stage] = (stagesCount[stage] || 0) + 1;
        }
      });

      setFunnelStages(
        initialFunnelStages.map((stage) => ({
          ...stage,
          count: stagesCount[stage.stage as StageName] || 0,
        }))
      );

      // Atualizar últimos leads
      const recent = leadsSnapshot.docs
        .map((doc) => {
          const data = doc.data() as { name?: string; status?: string };
          return {
            id: doc.id,
            name: data.name || "",
            stage: data.status
              ? mapStatusToStage(data.status)
              : "Primeiro Contato",
          };
        })
        .filter((lead) => lead.name && lead.stage)
        .slice(0, 5);

      setRecentLeads(recent);
    }
    fetchKpis();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="text-center p-6 flex flex-col items-center space-y-2">
          <FaUsers className="text-blue-600 w-6 h-6" />
          <CardTitle>Total de Clientes</CardTitle>
          <CardContent className="text-4xl font-bold">
            {kpis.totalClientes.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="text-center p-6 flex flex-col items-center space-y-2">
          <FaChartLine className="text-green-600 w-6 h-6" />
          <CardTitle>Leads Ativos</CardTitle>
          <CardContent className="text-4xl font-bold">
            {kpis.leadsAtivos.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="text-center p-6 flex flex-col items-center space-y-2">
          <FaProjectDiagram className="text-purple-600 w-6 h-6" />
          <CardTitle>Projetos em Andamento</CardTitle>
          <CardContent className="text-4xl font-bold">
            {kpis.projetosAndamento.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="text-center p-6 flex flex-col items-center space-y-2">
          <FaDollarSign className="text-yellow-500 w-6 h-6" />
          <CardTitle>Receita Mensal (R$)</CardTitle>
          <CardContent className="text-4xl font-bold">
            {kpis.receitaMensal.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Funil e Leads */}
      <Tabs defaultValue="funil">
        <TabsList>
          <TabsTrigger value="funil">Funil de Vendas</TabsTrigger>
          <TabsTrigger value="leads">Leads Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="funil">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {funnelStages.map(({ stage, count, icon }) => (
                  <li key={stage} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {icon}
                      <span>{stage}</span>
                    </div>
                    <Badge variant="default">{count}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Leads Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {recentLeads.map(({ id, name, stage }) => (
                  <li key={id} className="py-2 flex justify-between">
                    <span>{name}</span>
                    <Badge variant="outline">{stage}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
