"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Lead } from "@/lib/types";

const STAGES = [
  { id: "primeiro_contato", name: "Primeiro Contato", color: "bg-gray-100" },
  { id: "proposta_enviada", name: "Proposta Enviada", color: "bg-blue-100" },
  { id: "negociacao", name: "Negociação", color: "bg-yellow-100" },
  { id: "fechado_ganho", name: "Fechado - Ganho", color: "bg-green-100" },
  { id: "fechado_perdido", name: "Fechado - Perdido", color: "bg-red-100" },
];

export function LeadsKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Lead)
      );

      setLeads(leadsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateLeadStage = async (leadId: string, newStage: Lead["stage"]) => {
    try {
      await updateDoc(doc(db, "leads", leadId), {
        stage: newStage,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
    }
  };

  const getLeadsByStage = (stage: Lead["stage"]) => {
    return leads.filter((lead) => lead.stage === stage);
  };

  if (loading) {
    return <div className="p-4">Carregando leads...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Funil de Vendas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id as Lead["stage"]);

          return (
            <div key={stage.id} className={`${stage.color} p-4 rounded-lg`}>
              <h3 className="font-semibold mb-3 text-center">
                {stage.name} ({stageLeads.length})
              </h3>

              <div className="space-y-2">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white p-3 rounded shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-sm">{lead.name}</h4>
                    {lead.email && (
                      <p className="text-xs text-gray-600">{lead.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {lead.source && `Origem: ${lead.source}`}
                    </p>

                    {/* Botões para mover entre estágios */}
                    <div className="flex gap-1 mt-2">
                      {STAGES.map((targetStage) => {
                        if (targetStage.id === stage.id) return null;

                        return (
                          <button
                            key={targetStage.id}
                            onClick={() =>
                              updateLeadStage(
                                lead.id!,
                                targetStage.id as Lead["stage"]
                              )
                            }
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          >
                            → {targetStage.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
