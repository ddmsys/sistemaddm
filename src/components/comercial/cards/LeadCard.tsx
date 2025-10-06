'use client';

import { Building2, Calendar, Mail, MoreHorizontal, Phone, Star, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/Modal';
import { Lead, LeadStatus } from '@/lib/types';
import { cn, formatRelativeTime } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (leadId: string) => void;
}

const statusConfig = {
  new: {
    label: 'Novo',
    color: 'info',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  contacted: {
    label: 'Contatado',
    color: 'warning',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  qualified: {
    label: 'Qualificado',
    color: 'success',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  proposal: {
    label: 'Proposta',
    color: 'info',
    class: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  negotiation: {
    label: 'Negociação',
    color: 'warning',
    class: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  closed_won: {
    label: 'Ganho',
    color: 'success',
    class: 'bg-green-50 text-green-700 border-green-200',
  },
  closed_lost: {
    label: 'Perdido',
    color: 'destructive',
    class: 'bg-red-50 text-red-700 border-red-200',
  },
};

const sourceConfig = {
  website: { label: 'Website', icon: '🌐' },
  social_media: { label: 'Redes Sociais', icon: '📱' },
  referral: { label: 'Indicação', icon: '👥' },
  advertising: { label: 'Publicidade', icon: '📢' },
  email_marketing: { label: 'Email Marketing', icon: '📧' },
  event: { label: 'Evento', icon: '🎪' },
  cold_call: { label: 'Cold Call', icon: '📞' },
  other: { label: 'Outro', icon: '❓' },
};

export function LeadCard({ lead, onStatusChange, onEdit, onDelete, onConvert }: LeadCardProps) {
  const [showActions, setShowActions] = useState(false);
  const status = statusConfig[lead.status];
  const source = sourceConfig[lead.source];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <>
      <Card
        variant="interactive"
        className={cn('group relative transition-all duration-200 hover:shadow-lg', status.class)}
      >
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-primary-900">{lead.name}</h3>
                <p className="truncate text-xs text-primary-500">{lead.lead_number}</p>
                {lead.company && (
                  <p className="mt-1 flex items-center truncate text-xs text-primary-600">
                    <Building2 className="mr-1 h-3 w-3" />
                    {lead.company}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  status.color as
                    | 'default'
                    | 'secondary'
                    | 'success'
                    | 'warning'
                    | 'destructive'
                    | 'info'
                    | 'outline'
                }
                size="sm"
              >
                {status.label}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setShowActions(true)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 px-4 pb-4">
          {/* Contact Info */}
          <div className="space-y-1">
            {lead.email && (
              <div className="flex items-center text-xs text-primary-600">
                <Mail className="mr-2 h-3 w-3" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center text-xs text-primary-600">
                <Phone className="mr-2 h-3 w-3" />
                <span>{lead.phone}</span>
              </div>
            )}
          </div>

          {/* Source & Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-primary-500">
              <span className="mr-1">{source.icon}</span>
              {source.label}
            </div>

            <div className="flex items-center space-x-1">
              <Star className={cn('h-3 w-3', getScoreColor(lead.score))} />
              <span className={cn('text-xs font-medium', getScoreColor(lead.score))}>
                {lead.score}
              </span>
            </div>
          </div>

          {/* Interest & Budget */}
          {(lead.interest_area || lead.budget_range) && (
            <div className="space-y-1 text-xs">
              {lead.interest_area && (
                <div className="text-primary-600">
                  <span className="font-medium">Interesse:</span> {lead.interest_area}
                </div>
              )}
              {lead.budget_range && (
                <div className="text-primary-600">
                  <span className="font-medium">Orçamento:</span> {lead.budget_range}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-0 text-xs">
                  {tag}
                </Badge>
              ))}
              {lead.tags.length > 3 && (
                <Badge variant="secondary" className="px-2 py-0 text-xs">
                  +{lead.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Last Activity */}
          <div className="flex items-center justify-between border-t border-primary-100 pt-2 text-xs text-primary-500">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              {lead.last_contact ? formatRelativeTime(lead.last_contact.toDate()) : 'Sem contato'}
            </div>

            {lead.activities.length > 0 && (
              <div className="flex items-center">
                <span>{lead.activities.length} atividades</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 px-4 pb-3 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="sm" variant="outline" className="text-xs" onClick={() => onEdit?.(lead)}>
            Editar
          </Button>

          {lead.status !== 'closed_won' && (
            <Button
              size="sm"
              variant="default"
              className="text-xs"
              onClick={() => onConvert?.(lead.id)}
            >
              Converter
            </Button>
          )}
        </div>
      </Card>

      {/* Actions Modal */}
      <Modal
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Lead"
        size="sm"
      >
        <div className="space-y-2">
          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={lead.status === key ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(lead.id, key as LeadStatus);
                setShowActions(false);
              }}
            >
              Marcar como {config.label}
            </Button>
          ))}

          <hr className="my-2" />

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

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={() => {
              onDelete?.(lead.id);
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
