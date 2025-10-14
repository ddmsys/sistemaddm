// src/components/budgets/BudgetCard.tsx

'use client';

import { Building2, Calendar, Clock, DollarSign, FileText, User } from 'lucide-react';
import Link from 'next/link';

import { Budget, getBudgetStatusLabel } from '@/lib/types/budgets';
import { formatCurrency } from '@/lib/utils/formatters';

interface BudgetCardProps {
  budget: Budget;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BudgetCard({ budget, onApprove, onReject, onEdit, onDelete }: BudgetCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-orange-100 text-orange-800',
  };

  const statusColor = statusColors[budget.status] || statusColors.draft;

  const isExpired = budget.status === 'sent' && budget.expiryDate.toMillis() < Date.now();

  const canApprove = budget.status === 'sent' && !isExpired;
  const canEdit = budget.status === 'draft';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              {budget.projectData?.title || 'Sem título'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Orçamento {budget.number} (v{budget.version})
          </p>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
          {getBudgetStatusLabel(budget.status)}
        </span>
      </div>

      {/* Info Grid */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* Cliente/Lead */}
        <div className="flex items-start gap-2">
          {budget.clientId ? (
            <Building2 className="mt-0.5 h-4 w-4 text-gray-400" />
          ) : (
            <User className="mt-0.5 h-4 w-4 text-gray-400" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">{budget.clientId ? 'Cliente' : 'Lead'}</p>
            <p className="truncate text-sm text-gray-900">
              {budget.clientId ? 'Cliente Existente' : 'Novo Cliente'}
            </p>
          </div>
        </div>

        {/* Valor Total */}
        <div className="flex items-start gap-2">
          <DollarSign className="mt-0.5 h-4 w-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Valor Total</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(budget.total)}</p>
          </div>
        </div>

        {/* Data de Emissão */}
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Emissão</p>
            <p className="text-sm text-gray-900">
              {budget.issueDate.toDate().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Validade */}
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Validade</p>
            <p className={`text-sm ${isExpired ? 'font-semibold text-red-600' : 'text-gray-900'}`}>
              {budget.expiryDate.toDate().toLocaleDateString('pt-BR')}
              {isExpired && ' (Expirado)'}
            </p>
          </div>
        </div>
      </div>

      {/* Itens Summary */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="mb-1 text-xs text-gray-500">Itens do Orçamento</p>
        <p className="text-sm text-gray-900">
          {budget.items.length} {budget.items.length === 1 ? 'item' : 'itens'} • Subtotal:{' '}
          {formatCurrency(budget.subtotal)}
          {budget.discount && ` • Desconto: ${formatCurrency(budget.discount)}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
        <Link
          href={`/budgets/${budget.id}`}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Ver Detalhes
        </Link>

        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(budget.id!)}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            Editar
          </button>
        )}

        {canApprove && onApprove && (
          <button
            onClick={() => onApprove(budget.id!)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Aprovar
          </button>
        )}

        {budget.status === 'sent' && onReject && (
          <button
            onClick={() => onReject(budget.id!)}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
          >
            Recusar
          </button>
        )}

        {canEdit && onDelete && (
          <button
            onClick={() => onDelete(budget.id!)}
            className="px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:text-red-800"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
