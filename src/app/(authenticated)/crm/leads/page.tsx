// src/app/(authenticated)/crm/leads/page.tsx

"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { LeadModal } from "@/components/comercial/modals/LeadModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/comercial/useClients";
import { useLeads } from "@/hooks/comercial/useLeads";
import { ClientFormData } from "@/lib/types/clients";
import { Lead, LeadFormData, LeadSource, LeadStatus } from "@/lib/types/leads";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");

  const { leads, createLead, updateLead, deleteLead } = useLeads();
  const { createClient } = useClients();

  // Status colors
  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      primeiro_contato: "bg-blue-100 text-blue-800",
      qualificado: "bg-yellow-100 text-yellow-800",
      proposta_enviada: "bg-purple-100 text-purple-800",
      negociacao: "bg-orange-100 text-orange-800",
      fechado_ganho: "bg-emerald-100 text-emerald-800",
      fechado_perdido: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.primeiro_contato;
  };

  const getStatusLabel = (status: LeadStatus) => {
    const labels = {
      primeiro_contato: "Primeiro Contato",
      qualificado: "Qualificado",
      proposta_enviada: "Proposta Enviada",
      negociacao: "Negociação",
      fechado_ganho: "Fechado - Ganho",
      fechado_perdido: "Fechado - Perdido",
    };
    return labels[status] || labels.primeiro_contato;
  };

  // Filter leads
  const displayLeads = leads.filter((lead: Lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Handlers
  const handleCreateLead = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleSaveLead = async (leadData: LeadFormData): Promise<string | null> => {
    try {
      let leadId: string | null = null;

      if (selectedLead) {
        await updateLead(selectedLead.id!, leadData);
        leadId = selectedLead.id!;
      } else {
        leadId = await createLead(leadData);
      }

      setShowModal(false);
      setSelectedLead(null);
      return leadId;
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      return null;
    }
  };

  // 🔥 CORREÇÃO 1: Função de mudança de status CORRIGIDA
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLead(leadId, { status: newStatus } as any);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  // 🔥 CORREÇÃO 2: Botão Converter FUNCIONANDO
  const handleConvertLead = (lead: Lead) => {
    setLeadToConvert(lead);
    setShowClientModal(true);
  };

  const handleCreateClient = async (clientData: ClientFormData): Promise<string | null> => {
    const newClientId = await createClient(clientData);
    if (newClientId && leadToConvert) {
      // Atualizar lead como convertido
      await updateLead(leadToConvert.id!, { status: "fechado_ganho" } as any);
      setShowClientModal(false);
      setLeadToConvert(null);
    }
    return newClientId;
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este lead?")) {
      try {
        await deleteLead(leadId);
      } catch (error) {
        console.error("Erro ao excluir lead:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="mt-2 text-gray-600">Gerencie seus leads e oportunidades</p>
          </div>
          <Button onClick={handleCreateLead}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-gray-900">{leads.length}</h3>
            <p className="mt-1 text-sm text-gray-500">Total de Leads</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-blue-600">
              {leads.filter((l) => l.status === "primeiro_contato").length}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Novos</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-yellow-600">
              {leads.filter((l) => l.status === "qualificado").length}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Em Contato</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-purple-600">
              {leads.filter((l) => l.status === "proposta_enviada").length}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Propostas</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-emerald-600">
              {leads.filter((l) => l.status === "fechado_ganho").length}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Convertidos</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pl-10 text-base"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 md:w-48"
          >
            <option value="all">Todos os status</option>
            <option value="primeiro_contato">Primeiro Contato</option>
            <option value="qualificado">Qualificado</option>
            <option value="proposta_enviada">Proposta Enviada</option>
            <option value="negociacao">Negociação</option>
            <option value="fechado_ganho">Fechado - Ganho</option>
            <option value="fechado_perdido">Fechado - Perdido</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as LeadSource | "all")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 md:w-48"
          >
            <option value="all">Todas as fontes</option>
            <option value="website">Website</option>
            <option value="social_media">Redes Sociais</option>
            <option value="referral">Indicação</option>
            <option value="advertising">Publicidade</option>
            <option value="email">Email Marketing</option>
            <option value="event">Eventos</option>
            <option value="cold_call">Cold Call</option>
            <option value="phone">Telefone</option>
            <option value="other">Outros</option>
          </select>

          <span className="self-center text-sm text-gray-500">
            {displayLeads.length} resultados
          </span>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayLeads.map((lead: Lead) => (
            <div
              key={lead.id}
              className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                  {lead.company && <p className="text-sm text-gray-500">{lead.company}</p>}
                </div>
                <span
                  className={cn(
                    "text-s rounded-full px-3 py-1 font-medium",
                    getStatusColor(lead.status),
                  )}
                >
                  {getStatusLabel(lead.status)}
                </span>
              </div>

              {/* 🔥 CORREÇÃO: Select com stopPropagation */}
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id!, e.target.value as LeadStatus)}
                onClick={(e) => e.stopPropagation()}
                className="text-s mb-3 w-full rounded border px-2 py-2"
              >
                <option value="primeiro_contato">Primeiro Contato</option>
                <option value="qualificado">Qualificado</option>
                <option value="proposta_enviada">Proposta Enviada</option>
                <option value="negociacao">Negociação</option>
                <option value="fechado_ganho">Fechado - Ganho</option>
                <option value="fechado_perdido">Fechado - Perdido</option>
              </select>

              <div className="space-y-2 text-sm text-gray-600">
                <p>{lead.email}</p>
                {lead.phone && <p>{lead.phone}</p>}
              </div>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {lead.tags.slice(0, 2).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {lead.tags.length > 2 && (
                    <span className="text-s rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                      +{lead.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleEditLead(lead)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleConvertLead(lead)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Converter
                </Button>
                <Button
                  onClick={() => handleDeleteLead(lead.id!)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayLeads.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">Nenhum lead encontrado</p>
            <Button onClick={handleCreateLead} className="mt-4">
              Criar Primeiro Lead
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Lead */}
      {showModal && (
        <LeadModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSaveLead}
          lead={selectedLead}
        />
      )}

      {/* Modal de Cliente (Conversão) */}
      {showClientModal && leadToConvert && (
        <ClientModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false);
            setLeadToConvert(null);
          }}
          onSubmit={handleCreateClient}
          client={
            {
              type: leadToConvert.company ? "company" : "individual",
              name: leadToConvert.name,
              email: leadToConvert.email,
              phone: leadToConvert.phone || "",
              status: "active",
              document: "",
              company: leadToConvert.company || "",
              notes: leadToConvert.notes || "",
              source: leadToConvert.source || "",
            } as any
          }
        />
      )}
    </div>
  );
}
