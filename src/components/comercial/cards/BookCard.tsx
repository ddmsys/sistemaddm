// src/components/comercial/cards/BudgetCard.tsx
"use client";

import { Calendar, FileText, MoreHorizontal, Send, User } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/Modal";
import { Budget, BudgetStatus } from "@/lib/types/budgets";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

interface BudgetCardProps {
  budget: Budget;
  onStatusChange?: (budgetId: string, status: BudgetStatus) => void;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budgetId: string) => void;
  onSend?: (budgetId: string) => void;
}

const statusConfig: Record<
  BudgetStatus,
  {
    label: string;
    color: string;
    class: string;
    icon: typeof FileText;
  }
> = {
  draft: {
    label: "Rascunho",
    color: "secondary",
    class: "bg-gray-50 text-gray-700 border-gray-200",
    icon: FileText,
  },
  sent: {
    label: "Enviado",
    color: "info",
    class: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Send,
  },
  approved: {
    label: "Aprovado",
    color: "success",
    class: "bg-green-50 text-green-700 border-green-200",
    icon: FileText,
  },
  rejected: {
    label: "Rejeitado",
    color: "destructive",
    class: "bg-red-50 text-red-700 border-red-200",
    icon: FileText,
  },
  expired: {
    label: "Expirado",
    color: "destructive",
    class: "bg-gray-50 text-gray-500 border-gray-200",
    icon: Calendar,
  },
};

export function BudgetCard({ budget, onStatusChange, onEdit, onDelete, onSend }: BudgetCardProps) {
  const [showActions, setShowActions] = useState(false);

  const status = statusConfig[budget.status];
  const StatusIcon = status.icon;

  const isExpired = budget.expiryDate
    ? (budget.expiryDate instanceof Date ? budget.expiryDate : budget.expiryDate.toDate()) <
      new Date()
    : false;

  const daysUntilExpiry = budget.expiryDate
    ? Math.ceil(
        ((budget.expiryDate instanceof Date
          ? budget.expiryDate
          : budget.expiryDate.toDate()
        ).getTime() -
          new Date().getTime()) /
          (1000 * 3600 * 24),
      )
    : null;

  return (
    <>
      <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {budget.projectData?.title || "Sem título"}
            </h3>
            <p className="text-xs text-primary-500">{budget.number}</p>
            <p className="mt-1 truncate text-sm text-gray-600">
              <User className="mr-1 inline h-4 w-4" />
              {budget.leadId ? "Lead" : budget.clientId ? "Cliente" : "N/A"}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={status.class}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
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
          {budget.notes && <p className="line-clamp-2 text-sm text-gray-600">{budget.notes}</p>}

          <div className="space-y-2">
            <div className="text-lg font-bold text-primary-900">
              {formatCurrency(budget.total || 0)}
            </div>
            {(budget.discount || 0) > 0 && (
              <p className="text-sm text-gray-600">
                Desconto: {formatCurrency(budget.discount || 0)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Emitido:</span>
              <span className="block font-medium">
                {formatDate(
                  budget.createdAt instanceof Date
                    ? budget.createdAt
                    : budget.createdAt?.toDate() || new Date(),
                )}
              </span>
            </div>

            <div>
              <span className="text-gray-600">Válido até:</span>
              <div className="block">
                {budget.expiryDate
                  ? formatDate(
                      budget.expiryDate instanceof Date
                        ? budget.expiryDate
                        : budget.expiryDate.toDate(),
                    )
                  : "N/A"}
                {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                  <span className="ml-1 text-xs text-amber-600">({daysUntilExpiry}d)</span>
                )}
                {isExpired && <span className="ml-1 text-xs text-red-600">(Expirado)</span>}
              </div>
            </div>
          </div>

          {/* Datas opcionais */}
          {budget.approvalDate && (
            <div className="text-sm text-gray-600">
              <span>Aprovado em: </span>
              <span>
                {formatDateTime(
                  budget.approvalDate instanceof Date
                    ? budget.approvalDate
                    : budget.approvalDate.toDate(),
                )}
              </span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            {budget.status === "draft" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onSend?.(budget.id!)}
              >
                Enviar
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => onEdit?.(budget)}>
              Editar
            </Button>
          </div>

          {budget.status === "approved" && (
            <div className="text-center text-sm font-medium text-green-600">
              ✓ Orçamento Aprovado
            </div>
          )}
        </div>

        {isExpired && (
          <div className="absolute right-0 top-0 rounded-bl bg-red-500 px-2 py-1 text-xs text-white">
            Expirado
          </div>
        )}
      </Card>

      <Modal
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Ações do Orçamento"
        size="sm"
      >
        <div className="space-y-2">
          {budget.status === "draft" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onSend?.(budget.id!);
                setShowActions(false);
              }}
            >
              Enviar Orçamento
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onEdit?.(budget);
              setShowActions(false);
            }}
          >
            Editar Orçamento
          </Button>
          {Object.entries(statusConfig).map(([key, config]) => (
            <Button
              key={key}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                onStatusChange?.(budget.id!, key as BudgetStatus);
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
              onDelete?.(budget.id!);
              setShowActions(false);
            }}
          >
            Excluir Orçamento
          </Button>
          export default BookCard;
        </div>
      </Modal>
    </>
  );
}
