// src/app/(authenticated)/crm/leads/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LeadModal } from "@/components/comercial/modals/LeadModal";
import { useLeads } from "@/hooks/comercial/useLeads";
import { Lead } from "@/lib/types/comercial";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    leads,
    loading: leadsLoading,
    createLead,
    updateLead,
    deleteLead,
    changeLeadStage,
  } = useLeads();

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ...existing code...

  const handleSave = async (
    leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  ): Promise<void> => {
    setLoading(true);
    try {
      if (selectedLead?.id) {
        // Para atualização, combine os dados existentes com os novos
        await updateLead(selectedLead.id, {
          ...selectedLead,
          ...leadData,
        });
      } else {
        // Para criação, use os dados do formulário
        await createLead(leadData as Lead);
      }
      setIsModalOpen(false);
      setSelectedLead(undefined);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      alert("Erro ao salvar lead");
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Tem certeza que deseja deletar este lead?")) return;

    try {
      await deleteLead(leadId);
    } catch (error) {
      console.error("Erro ao deletar lead:", error);
      alert("Erro ao deletar lead");
    }
  };

  const getStageColor = (stage: Lead["stage"]) => {
    const colors = {
      "primeiro-contato": "bg-gray-100 text-gray-800",
      qualificado: "bg-blue-100 text-blue-800",
      "proposta-enviada": "bg-purple-100 text-purple-800",
      negociacao: "bg-yellow-100 text-yellow-800",
      "fechado-ganho": "bg-green-100 text-green-800",
      "fechado-perdido": "bg-red-100 text-red-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const getStageLabel = (stage: Lead["stage"]) => {
    const labels = {
      "primeiro-contato": "Primeiro Contato",
      qualificado: "Qualificado",
      "proposta-enviada": "Proposta Enviada",
      negociacao: "Negociação",
      "fechado-ganho": "Fechado Ganho",
      "fechado-perdido": "Fechado Perdido",
    };
    return labels[stage] || stage;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600">
            Gerencie seus leads e oportunidades de vendas
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedLead(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Leads */}
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {leadsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 mt-2">Carregando leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum lead encontrado</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          {lead.name}
                        </h3>
                        <Badge className={getStageColor(lead.stage)}>
                          {getStageLabel(lead.stage)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Email:</span>
                          <p>{lead.email || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span>
                          <p>{lead.phone || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Empresa:</span>
                          <p>{lead.company || "Não informado"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Valor Potencial:</span>
                          <p>
                            {lead.value
                              ? `R$ ${lead.value.toLocaleString("pt-BR")}`
                              : "Não informado"}
                          </p>
                        </div>
                      </div>

                      {lead.notes && (
                        <div className="mt-3 text-sm text-slate-600">
                          <span className="font-medium">Observações:</span>
                          <p className="mt-1">{lead.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(lead.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(undefined);
        }}
        lead={selectedLead}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}
