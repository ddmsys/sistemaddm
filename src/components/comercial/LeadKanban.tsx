"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  FileText,
  Handshake,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  DollarSign,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { Lead } from "@/lib/types/leads";
import { useLeads } from "@/hooks/comercial/useLeads";

interface LeadKanbanProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export function LeadKanban({ leads, onLeadClick }: LeadKanbanProps) {
  const { moveLeadStage } = useLeads();
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const columns = [
    {
      id: "primeiro_contato",
      name: "Primeiro Contato",
      icon: Phone,
      color: "border-blue-200 bg-blue-50",
      headerColor: "text-blue-700 bg-blue-100",
    },
    {
      id: "proposta_enviada",
      name: "Proposta Enviada",
      icon: FileText,
      color: "border-yellow-200 bg-yellow-50",
      headerColor: "text-yellow-700 bg-yellow-100",
    },
    {
      id: "negociacao",
      name: "Negociação",
      icon: Handshake,
      color: "border-orange-200 bg-orange-50",
      headerColor: "text-orange-700 bg-orange-100",
    },
    {
      id: "fechado_ganho",
      name: "Fechado Ganho",
      icon: CheckCircle,
      color: "border-green-200 bg-green-50",
      headerColor: "text-green-700 bg-green-100",
    },
    {
      id: "fechado_perdido",
      name: "Fechado Perdido",
      icon: XCircle,
      color: "border-red-200 bg-red-50",
      headerColor: "text-red-700 bg-red-100",
    },
  ];

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();

    if (draggedLead && draggedLead.stage !== newStage) {
      try {
        await moveLeadStage(draggedLead.id!, newStage as Lead["stage"]);
      } catch (error) {
        console.error("Erro ao mover lead:", error);
      }
    }

    setDraggedLead(null);
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter((lead) => lead.stage === stage);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date?: Date | any) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Kanban de Leads</h2>
        <div className="text-sm text-gray-600">
          {leads.length} leads no total
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((column) => {
          const columnLeads = getLeadsByStage(column.id);
          const Icon = column.icon;
          const totalValue = columnLeads.reduce(
            (sum, lead) => sum + (lead.expectedValue || 0),
            0
          );

          return (
            <div
              key={column.id}
              className={`min-w-[300px] border-2 rounded-lg ${column.color} min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Header da coluna */}
              <div className={`p-4 rounded-t-lg ${column.headerColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-semibold">{column.name}</h3>
                  </div>
                  <Badge variant="secondary">{columnLeads.length}</Badge>
                </div>

                {totalValue > 0 && (
                  <div className="text-sm font-medium">
                    {formatCurrency(totalValue)}
                  </div>
                )}
              </div>

              {/* Leads da coluna */}
              <div className="p-2 space-y-3">
                {columnLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onClick={() => onLeadClick(lead)}
                  >
                    <CardContent className="p-4">
                      {/* Nome e prioridade */}
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-sm leading-tight pr-2">
                          {lead.name}
                        </h4>
                        {lead.priority && (
                          <Badge
                            variant={
                              lead.priority === "high"
                                ? "destructive"
                                : lead.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {lead.priority}
                          </Badge>
                        )}
                      </div>

                      {/* Informações de contato */}
                      <div className="space-y-2 mb-3">
                        {lead.email && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Valor esperado */}
                      {lead.expectedValue && (
                        <div className="flex items-center text-sm font-medium text-green-600 mb-2">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatCurrency(lead.expectedValue)}
                        </div>
                      )}

                      {/* Data esperada de fechamento */}
                      {lead.expectedCloseDate && (
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          Previsão: {formatDate(lead.expectedCloseDate)}
                        </div>
                      )}

                      {/* Origem */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {lead.source.replace("_", " ")}
                        </Badge>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Notas */}
                      {lead.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <p className="line-clamp-2">{lead.notes}</p>
                        </div>
                      )}

                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {lead.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {lead.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Botão para adicionar novo lead */}
                {column.id === "primeiro_contato" && (
                  <Button
                    variant="ghost"
                    className="w-full border-2 border-dashed border-gray-300 h-16 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    onClick={() => onLeadClick({} as Lead)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Lead
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estatísticas do Kanban */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {getLeadsByStage("primeiro_contato").length}
              </div>
              <div className="text-sm text-gray-600">Novos Contatos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {getLeadsByStage("negociacao").length}
              </div>
              <div className="text-sm text-gray-600">Em Negociação</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {getLeadsByStage("fechado_ganho").length}
              </div>
              <div className="text-sm text-gray-600">Convertidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  leads.reduce(
                    (sum, lead) => sum + (lead.expectedValue || 0),
                    0
                  )
                )}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
