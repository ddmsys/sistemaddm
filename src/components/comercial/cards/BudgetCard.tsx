import { Calendar, DollarSign, Eye, FileText, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Budget } from "@/lib/types/budgets";

interface BudgetCardProps {
  budget: Budget;

  onView?: (budget: Budget) => void;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

// 🔥 FUNÇÃO HELPER PARA FORMATAR DATAS
const formatDate = (date: any): string => {
  if (!date) return "-";

  // Se já é Date
  if (date instanceof Date) {
    return date.toLocaleDateString("pt-BR");
  }

  // Se é Timestamp do Firebase
  if (date.toDate && typeof date.toDate === "function") {
    return date.toDate().toLocaleDateString("pt-BR");
  }

  // Se é string ou número
  return new Date(date).toLocaleDateString("pt-BR");
};
// 🔥 ADICIONAR JUNTO COM formatDate
const getClientDisplay = (budget: Budget): string => {
  if (!budget.clientName) return "-";

  // Se tiver número do catálogo (ex: 0456), mostrar junto
  if (budget.clientId) {
    // Aqui você pode buscar o número do cliente se tiver
    return budget.clientName;
  }

  return budget.clientName;
};

const statusConfig = {
  draft: { label: "Rascunho", color: "bg-gray-100 text-gray-800" },
  sent: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
  approved: { label: "Aprovado", color: "bg-green-100 text-green-800" },
  rejected: { label: "Recusado", color: "bg-red-100 text-red-800" },
  expired: { label: "Expirado", color: "bg-orange-100 text-orange-800" },
};

export function BudgetCard({
  budget,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: BudgetCardProps) {
  const status = statusConfig[budget.status];

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">{budget.number}</h3>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {budget.projectData?.title || budget.projectTitle}
            </p>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações principais */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">Cliente/Lead</p>
            <p className="text-sm text-gray-900">{getClientDisplay(budget)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Valor Total</p>
            <p className="text-sm font-semibold text-green-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(budget.total)}
            </p>
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-4 border-t pt-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Emissão</p>
              <p className="text-sm text-gray-900">{formatDate(budget.issueDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Validade</p>
              <p className="text-sm text-gray-900">{formatDate(budget.expiryDate)}</p>
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="border-t pt-3">
          <p className="mb-2 text-xs text-gray-500">Itens do orçamento</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>{budget.items.length} item(ns)</span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 border-t pt-3">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(budget)} className="flex-1">
              <Eye className="mr-1 h-4 w-4" />
              Ver
            </Button>
          )}

          {onEdit && budget.status === "draft" && (
            <Button variant="outline" size="sm" onClick={() => onEdit(budget)} className="flex-1">
              Editar
            </Button>
          )}

          {onApprove && budget.status === "sent" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(budget.id!)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Aprovar
            </Button>
          )}

          {onReject && budget.status === "sent" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(budget.id!)}
              className="flex-1"
            >
              Recusar
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(budget.id!)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
