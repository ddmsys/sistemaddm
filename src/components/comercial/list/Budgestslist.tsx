// src/components/budgets/BudgetsList.tsx

'use client';

import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { BudgetCard } from '@/components/comercial/cards/BudgetCard';
import { BudgetModal } from '@/components/comercial/modals/BudgetModal';
import { Lead } from '@/lib/types';
import { Budget, BudgetFormData, BudgetStatus } from '@/lib/types/budgets';

interface BudgetsListProps {
  budgets: Budget[];
  leads?: Lead[];
  loading?: boolean;
  onCreate: (data: BudgetFormData) => Promise<void>;
  onUpdate: (id: string, data: Partial<Budget>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export function BudgetsList({
  budgets,
  leads = [],
  loading = false,
  onCreate,
  onUpdate,
  onDelete,
  onApprove,
  onReject,
}: BudgetsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'all'>('all');

  // Filtered budgets
  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      searchTerm === '' ||
      budget.projectData?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: budgets.length,
    draft: budgets.filter((b) => b.status === 'draft').length,
    sent: budgets.filter((b) => b.status === 'sent').length,
    approved: budgets.filter((b) => b.status === 'approved').length,
    rejected: budgets.filter((b) => b.status === 'rejected').length,
    totalValue: budgets.reduce((sum, b) => sum + b.total, 0),
    approvedValue: budgets
      .filter((b) => b.status === 'approved')
      .reduce((sum, b) => sum + b.total, 0),
  };

  const handleOpenCreateModal = () => {
    setSelectedBudget(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setSelectedBudget(budget);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleSave = async (data: BudgetFormData) => {
    if (modalMode === 'create') {
      await onCreate(data);
    } else if (selectedBudget) {
      await onUpdate(selectedBudget.id!, data as any);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total de Orçamentos</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Enviados</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Aprovados</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Valor Aprovado</p>
          <p className="text-2xl font-bold text-gray-900">
            R$ {stats.approvedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BudgetStatus | 'all')}
              className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Recusado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Orçamento</span>
          </button>
        </div>
      </div>

      {/* Budgets Grid */}
      {filteredBudgets.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Nenhum orçamento encontrado</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onApprove={onApprove}
              onReject={onReject}
              onEdit={handleOpenEditModal}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        budget={selectedBudget}
        leads={leads}
        mode={modalMode}
      />
    </div>
  );
}
