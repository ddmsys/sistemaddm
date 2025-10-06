"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/Modal";
import { Lead, LeadStatus } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Building2,
  Calendar,
  Mail,
  MoreHorizontal,
  Phone,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";

interface LeadCardProps {
  lead: Lead;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onConvert?: (leadId: string) => void;
}

const statusConfig = {
  new: {
    label: "Novo",
    color: "info",
    class: "bg-blue-50 text-blue-700 border-blue-200",
  },
  contacted: {
    label: "Contatado",
    color: "warning",
    class: "bg-amber-50 text-amber-700 border-amber-200",
  },
  qualified: {
    label: "Qualificado",
    color: "success",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  proposal: {
    label: "Proposta",
    color: "info",
    class: "bg-purple-50 text-purple-700 border-purple-200",
  },
  negotiation: {
    label: "Negociação",
    color: "warning",
    class: "bg-orange-50 text-orange-700 border-orange-200",
  },
  closed_won: {
    label: "Ganho",
    color: "success",
    class: "bg-green-50 text-green-700 border-green-200",
  },
  closed_lost: {
    label: "Perdido",
    color: "destructive",
    class: "bg-red-50 text-red-700 border-red-200",
  },
};

const sourceConfig = {
  website: { label: "Website", icon: "🌐" },
  social_media: { label: "Redes Sociais", icon: "📱" },
  referral: { label: "Indicação", icon: "👥" },
  advertising: { label: "Publicidade", icon: "📢" },
  email_marketing: { label: "Email Marketing", icon: "📧" },
  event: { label: "Evento", icon: "🎪" },
  cold_call: { label: "Cold Call", icon: "📞" },
  other: { label: "Outro", icon: "❓" },
};

export function LeadCard({
  lead,
  onStatusChange,
  onEdit,
  onDelete,
  onConvert,
}: LeadCardProps) {
  const [showActions, setShowActions] = useState(false);
  const status = statusConfig[lead.status];
  const source = sourceConfig[lead.source];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <>
      <Card
        variant="interactive"
        className={cn(
          "relative group hover:shadow-lg transition-all duration-200",
          status.class
        )}
      >
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-primary-900 truncate">
                  {lead.name}
                </h3>
                <p className="text-xs text-primary-500 truncate">
                  {lead.lead_number}
                </p>
                {lead.company && (
                  <p className="text-xs text-primary-600 truncate flex items-center mt-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    {lead.company}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={status.color as any} size="sm">
                {status.label}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowActions(true)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 space-y-3">
          {/* Contact Info */}
          <div className="space-y-1">
            {lead.email && (
              <div className="flex items-center text-xs text-primary-600">
                <Mail className="w-3 h-3 mr-2" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center text-xs text-primary-600">
                <Phone className="w-3 h-3 mr-2" />
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
              <Star className={cn("w-3 h-3", getScoreColor(lead.score))} />
              <span
                className={cn("text-xs font-medium", getScoreColor(lead.score))}
              >
                {lead.score}
              </span>
            </div>
          </div>

          {/* Interest & Budget */}
          {(lead.interest_area || lead.budget_range) && (
            <div className="text-xs space-y-1">
              {lead.interest_area && (
                <div className="text-primary-600">
                  <span className="font-medium">Interesse:</span>{" "}
                  {lead.interest_area}
                </div>
              )}
              {lead.budget_range && (
                <div className="text-primary-600">
                  <span className="font-medium">Orçamento:</span>{" "}
                  {lead.budget_range}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
              {lead.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{lead.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Last Activity */}
          <div className="flex items-center justify-between text-xs text-primary-500 pt-2 border-t border-primary-100">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {lead.last_contact
                ? formatRelativeTime(lead.last_contact.toDate())
                : "Sem contato"}
            </div>

            {lead.activities.length > 0 && (
              <div className="flex items-center">
                <span>{lead.activities.length} atividades</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => onEdit?.(lead)}
          >
            Editar
          </Button>

          {lead.status !== "closed_won" && (
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
              variant={lead.status === key ? "default" : "ghost"}
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
