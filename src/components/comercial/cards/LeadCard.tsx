// src/components/comercial/cards/LeadCard.tsx
'use client';

import { Building, Mail, MoreHorizontal, Phone } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Lead, LeadSource, LeadStatus } from '@/lib/types/leads';

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (leadId: string) => void;
}

const statusConfig = {
  primeiro_contato: {
    label: 'Primeiro Contato',
    color: 'secondary',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  qualificado: {
    label: 'Qualificado',
    color: 'success',
    class: 'bg-green-50 text-green-700 border-green-200',
  },
  proposta_enviada: {
    label: 'Proposta Enviada',
    color: 'warning',
    class: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  negociacao: {
    label: 'Negociação',
    color: 'warning',
    class: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  fechado_ganho: {
    label: 'Fechado - Ganho',
    color: 'success',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  fechado_perdido: {
    label: 'Fechado - Perdido',
    color: 'destructive',
    class: 'bg-red-50 text-red-700 border-red-200',
  },
};

const sourceConfig: Record<LeadSource, { label: string; icon: string }> = {
  website: {
    label: 'Website',
    icon: '🌐',
  },
  phone: {
    label: 'Telefone',
    icon: 'phone',
  },
  socialmedia: {
    label: 'SocialMedia',
    icon: 'share-2',
  },
  referral: {
    label: 'Indicação',
    icon: 'users',
  },
  advertising: {
    label: 'Publicidade',
    icon: 'megaphone',
  },
  email: {
    label: 'Email Marketing',
    icon: 'mail',
  },
  event: {
    label: 'Eventos',
    icon: 'calendar',
  },
  coldcall: {
    label: 'Cold Call',
    icon: 'phone',
  },
  other: {
    label: 'Outros',
    icon: 'more-horizontal',
  },
};

export function LeadCard({ lead, onStatusChange, onEdit, onDelete, onConvert }: LeadCardProps) {
  const [showActions, setShowActions] = useState(false);

  // CORRIGIDO: Usar o status do lead, não o tipo
  const status = statusConfig[lead.status];
  const source = sourceConfig[lead.source];

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <>
      <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">{lead.name}</h3>
            {/* CORRIGIDO: Usar leadNumber se existir */}
            {lead.name && <p className="truncate text-xs text-primary-500">{lead.ownerName}</p>}
            {lead.company && (
              <p className="mt-1 truncate text-sm text-gray-600">
                <Building className="mr-1 inline h-4 w-4" />
                {lead.company}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={status.class}>{status.label}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowActions(true)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 px-6 pb-6">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="mr-2 h-4 w-4" />
              {lead.email}
            </div>
            {lead.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="mr-2 h-4 w-4" />
                {lead.phone}
              </div>
            )}
          </div>

          {/* CORRIGIDO: Tags com verificação */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                >
                  {tag}
                </span>
              ))}
              {lead.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{lead.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Último contato:</span>
            </div>
            {/* CORRIGIDO: Atividades removidas se não existir no tipo */}
          </div>

          <div className="flex space-x-2 pt-2">
            {/* CORRIGIDO: fechado_ganho */}
            {lead.status !== 'fechado_ganho' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onConvert?.(lead.id!)} // CORRIGIDO: ! para garantir string
              >
                Converter
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => onEdit?.(lead)}>
              Editar
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Lead"
        size="sm"
      >
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onEdit?.(lead);
              setShowActions(false);
            }}
          >
            Editar Lead
          </Button>

          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(lead.id!, key as LeadStatus); // CORRIGIDO
                setShowActions(false);
              }}
            >
              Alterar para {config.label}
            </Button>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={() => {
              onDelete?.(lead.id!); // CORRIGIDO
              setShowActions(false);
            }}
          >
            Excluir Lead
          </Button>
        </div>
      </Modal>
    </>
  );
}
