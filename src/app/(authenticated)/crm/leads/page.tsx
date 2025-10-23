// src/app/(authenticated)/crm/leads/page.tsx
"use client";
import { Filter, Plus, Search } from "lucide-react";
import { useState } from "react";

import { LeadModal } from "@/components/comercial/modals/LeadModal"; // named import corrigido
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeads } from "@/hooks/comercial/useLeads"; // caminho correto e hooks corretos
import { Lead, LeadFormData, LeadSource, LeadStatus } from "@/lib/types/leads";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");

  const { leads, createLead, updateLead, updateLeadStage, deleteLead } = useLeads();

  // CORRIGIDO: Status colors com nomes corretos
  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      primeiro_contato: "bg-blue-100 text-blue-800",
      qualificado: "bg-yellow-100 text-yellow-800", // CORRIGIDO: não é 'primeiro_contato'
      proposta_enviada: "bg-purple-100 text-purple-800",
      negociacao: "bg-orange-100 text-orange-800",
      fechado_ganho: "bg-emerald-100 text-emerald-800",
      fechado_perdido: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.primeiro_contato; // CORRIGIDO: retorna cor válida
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

  // CORRIGIDO: Tipagem explícita dos leads
  const displayLeads = leads.filter((lead: Lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

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

  const handleSaveLead = async (leadData: LeadFormData) => {
    try {
      if (selectedLead) {
        await updateLead(selectedLead.id!, leadData);
      } else {
        await createLead(leadData);
      }
      setShowModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    }
  };

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      await updateLeadStage(leadId, status);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  const handleConvertLead = async (leadId: string) => {
    // Implementar conversão para cliente/projeto
    console.log("Converting lead:", leadId);
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Gerencie seus leads e oportunidades</p>
        </div>
        <Button onClick={handleCreateLead}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
          <div className="text-sm text-gray-600">Total de Leads</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-blue-600">
            {leads.filter((l: Lead) => l.status === "primeiro_contato").length}
          </div>
          <div className="text-sm text-gray-600">Novos</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {leads.filter((l: Lead) => l.status === "qualificado").length}
          </div>
          <div className="text-sm text-gray-600">Em Contato</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-purple-600">
            {leads.filter((l: Lead) => l.status === "proposta_enviada").length}
          </div>
          <div className="text-sm text-gray-600">Propostas</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-emerald-600">
            {leads.filter((l: Lead) => l.status === "fechado_ganho").length}
          </div>
          <div className="text-sm text-gray-600">Convertidos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as fontes</option>
            <option value="website">Website</option>
            <option value="socialmedia">Redes Sociais</option>
            <option value="referral">Indicação</option>
            <option value="advertising">Publicidade</option>
            <option value="email">Email Marketing</option>
            <option value="event">Eventos</option>
            <option value="coldcall">Cold Call</option>
            <option value="phone">Telefone</option>
            <option value="other">Outros</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{displayLeads.length} resultados</span>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayLeads.map((lead: Lead) => (
          <div
            key={lead.id}
            className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="truncate text-lg font-semibold text-gray-900">{lead.name}</h3>
                {lead.company && <p className="truncate text-sm text-gray-500">{lead.company}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    getStatusColor(lead.status),
                  )}
                >
                  {getStatusLabel(lead.status)}
                </span>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id!, e.target.value as LeadStatus)}
                  className="rounded border px-1 py-1 text-xs"
                >
                  <option value="primeiro_contato">Primeiro Contato</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="proposta_enviada">Proposta Enviada</option>
                  <option value="negociacao">Negociação</option>
                  <option value="fechado_ganho">Fechado - Ganho</option>
                  <option value="fechado_perdido">Fechado - Perdido</option>
                </select>
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <p className="truncate text-sm text-gray-600">{lead.email}</p>
              {lead.phone && <p className="text-sm text-gray-600">{lead.phone}</p>}
            </div>

            {/* Tags - CORRIGIDO: verificação de undefined */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {lead.tags.slice(0, 2).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {lead.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{lead.tags.length - 2}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditLead(lead)}
                className="flex-1"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConvertLead(lead.id!)}
                className="flex-1"
              >
                Converter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteLead(lead.id!)}
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
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-500">Nenhum lead encontrado</div>
          <Button variant="outline" onClick={handleCreateLead}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Lead
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <LeadModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSaveLead}
          lead={selectedLead}
        />
      )}
    </div>
  );
}
