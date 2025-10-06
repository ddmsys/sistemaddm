'use client';

import {
  CheckCircle,
  DollarSign,
  FileText,
  Handshake,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLeads } from '@/hooks/comercial/useLeads';
import { Lead } from '@/lib/types/comercial';

interface LeadKanbanProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export function LeadKanban({ leads, onLeadClick }: LeadKanbanProps) {
  const { updateLead: _updateLead } = useLeads();
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const columns = [
    {
      id: 'primeiro_contato',
      name: 'Primeiro Contato',
      icon: Phone,
      color: 'border-blue-200 bg-blue-50',
      headerColor: 'text-blue-700 bg-blue-100',
    },
    {
      id: 'proposta_enviada',
      name: 'Proposta Enviada',
      icon: FileText,
      color: 'border-yellow-200 bg-yellow-50',
      headerColor: 'text-yellow-700 bg-yellow-100',
    },
    {
      id: 'negociacao',
      name: 'Negociação',
      icon: Handshake,
      color: 'border-orange-200 bg-orange-50',
      headerColor: 'text-orange-700 bg-orange-100',
    },
    {
      id: 'fechado_ganho',
      name: 'Fechado Ganho',
      icon: CheckCircle,
      color: 'border-green-200 bg-green-50',
      headerColor: 'text-green-700 bg-green-100',
    },
    {
      id: 'fechado_perdido',
      name: 'Fechado Perdido',
      icon: XCircle,
      color: 'border-red-200 bg-red-50',
      headerColor: 'text-red-700 bg-red-100',
    },
  ];

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();

    if (draggedLead && draggedLead.status !== newStage) {
      try {
        const _leadData = {
          // Usar apenas campos que existem em LeadFormData
          notes: `Status alterado para ${newStage}`,
        };
        // Usar updateLeadStage se disponível, senão usar uma abordagem alternativa
        // Por enquanto, vamos comentar até termos a função correta
        // await updateLead(draggedLead.id!, leadData);
        console.log(`Lead ${draggedLead.id} movido para ${newStage}`);
      } catch (error) {
        console.error('Erro ao mover lead:', error);
      }
    }

    setDraggedLead(null);
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter((lead) => lead.status === stage);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const _formatDate = (date?: Date | string | number) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Kanban de Leads</h2>
        <div className="text-sm text-gray-600">{leads.length} leads no total</div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {columns.map((column) => {
          const columnLeads = getLeadsByStage(column.id);
          const Icon = column.icon;
          const totalValue = columnLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

          return (
            <div
              key={column.id}
              className={`min-w-[300px] rounded-lg border-2 ${column.color} min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                void handleDrop(e, column.id);
              }}
            >
              {/* Header da coluna */}
              <div className={`rounded-t-lg p-4 ${column.headerColor}`}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-semibold">{column.name}</h3>
                  </div>
                  <Badge variant="secondary">{columnLeads.length}</Badge>
                </div>

                {totalValue > 0 && (
                  <div className="text-sm font-medium">{formatCurrency(totalValue)}</div>
                )}
              </div>

              {/* Leads da coluna */}
              <div className="space-y-3 p-2">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="cursor-move rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onClick={() => onLeadClick(lead)}
                  >
                    <div className="p-4">
                      {/* Nome */}
                      <div className="mb-3 flex items-start justify-between">
                        <h4 className="pr-2 text-sm font-medium leading-tight">{lead.name}</h4>
                      </div>

                      {/* Informações de contato */}
                      <div className="mb-3 space-y-2">
                        {lead.email && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Mail className="mr-2 h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="mr-2 h-3 w-3 flex-shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Valor esperado */}
                      {lead.value && (
                        <div className="mb-2 flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {formatCurrency(lead.value)}
                        </div>
                      )}

                      {/* Origem */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {lead.source.replace('_', ' ')}
                        </Badge>

                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Notas */}
                      {lead.notes && (
                        <div className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-600">
                          <p className="line-clamp-2">{lead.notes}</p>
                        </div>
                      )}

                      {/* Tags */}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {lead.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
                    </div>
                  </div>
                ))}

                {/* Botão para adicionar novo lead */}
                {column.id === 'primeiro_contato' && (
                  <Button
                    variant="ghost"
                    className="h-16 w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    onClick={() => onLeadClick({} as Lead)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
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
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {getLeadsByStage('primeiro_contato').length}
              </div>
              <div className="text-sm text-gray-600">Novos Contatos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {getLeadsByStage('negociacao').length}
              </div>
              <div className="text-sm text-gray-600">Em Negociação</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {getLeadsByStage('fechado_ganho').length}
              </div>
              <div className="text-sm text-gray-600">Convertidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(leads.reduce((sum, lead) => sum + (lead.value || 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
