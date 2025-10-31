"use client";

import { Building, Edit, Mail, MapPin, MoreHorizontal, Phone, Trash2, User } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Client, ClientStatus } from "@/lib/types/clients";
import { formatDate } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
  onView?: (client: Client) => void;
  onClick?: (client: Client) => void;
}

// ================ CONFIGURAÇÕES ================
const getStatusConfig = (status: ClientStatus) => {
  const configs = {
    active: {
      label: "Ativo",
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-400",
    },
    inactive: {
      label: "Inativo",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      dot: "bg-gray-400",
    },
    blocked: {
      label: "Bloqueado",
      color: "bg-red-100 text-red-800 border-red-200",
      dot: "bg-red-400",
    },
  };
  return configs[status] || configs.active;
};

const getTypeConfig = (type: "individual" | "company") => {
  const configs = {
    individual: {
      label: "Pessoa Física",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    company: {
      label: "Pessoa Jurídica",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  };
  return configs[type];
};

export function ClientCard({ client, onEdit, onDelete, onView, onClick }: ClientCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = getStatusConfig(client.status);
  const typeConfig = getTypeConfig(client.type);
  const IconComponent = typeConfig.icon;

  const handleCardClick = (e: React.MouseEvent) => {
    // Não executar onClick se clicou no menu de ações
    if (e.target === e.currentTarget || !e.currentTarget.contains(e.target as Node)) {
      return;
    }

    const target = e.target as HTMLElement;
    if (!target.closest("[data-menu]")) {
      onClick?.(client);
    }
  };

  return (
    <Card
      className={`group relative transition-all duration-200 hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* Avatar/Icon */}
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${typeConfig.bgColor}`}
            >
              <IconComponent className={`h-6 w-6 ${typeConfig.color}`} />
            </div>

            {/* Info Principal */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-gray-900">{client.name}</h3>
                <div className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
              </div>

              <div className="mb-2 flex items-center gap-3 text-sm text-gray-500">
                <span>#{client.clientNumber}</span>
                <span className="text-xs">•</span>
                <span>{typeConfig.label}</span>
              </div>

              <Badge className={`text-xs ${statusConfig.color}`}>{statusConfig.label}</Badge>
            </div>
          </div>

          {/* Menu de Ações */}
          <div className="relative" data-menu>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {showMenu && (
              <>
                {/* Overlay para fechar menu */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />

                {/* Menu */}
                <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                  {onView && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(client);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <User className="h-4 w-4" />
                      Ver Detalhes
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(client);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(client.id!);
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="mb-4 space-y-3">
          {client.document && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-4 w-4 items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
              </div>
              <span className="text-gray-600">{client.type === "company" ? "CNPJ:" : "CPF:"}</span>
              <span className="font-mono text-gray-900">{client.document}</span>
            </div>
          )}

          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="truncate text-gray-900">{client.email}</span>
            </div>
          )}

          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-900">{client.phone}</span>
            </div>
          )}

          {client.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div className="leading-relaxed text-gray-600">
                <div>
                  {client.address.city}, {client.address.state}
                </div>
                {client.address.neighborhood && (
                  <div className="text-xs text-gray-500">{client.address.neighborhood}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {client.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-xs text-gray-600"
                >
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 3 && (
                <Badge variant="secondary" className="bg-gray-100 text-xs text-gray-500">
                  +{client.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Cadastrado em {formatDate(client.createdAt.toDate())}</span>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
              <span className="capitalize">{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de hover/click */}
      {onClick && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-blue-50 opacity-0 transition-opacity group-hover:opacity-10" />
      )}
    </Card>
  );
}
