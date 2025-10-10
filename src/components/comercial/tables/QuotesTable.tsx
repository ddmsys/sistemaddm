// src/components/comercial/tables/QuotesTable.tsx
'use client';

import React, { useState } from 'react';

import { Quote, QuoteFilters, QuoteStatus } from '@/lib/types/quotes';
import { formatCurrency } from '@/lib/utils';

// ================ INTERFACES ================
interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface QuotesTableProps {
  quotes: Quote[];
  onEdit?: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  onView?: (quote: Quote) => void;
  // onSign removido - não existe mais
}

// ================ COMPONENTE ================
export function QuotesTable({ quotes, onEdit, onDelete, onView }: QuotesTableProps) {
  // ================ STATES ================
  const [filters, setFilters] = useState<Partial<QuoteFilters>>({
    status: [],
    search: '',
  });

  const [loading, setLoading] = useState(false);

  // ================ HANDLERS ================
  const handleFiltersChange = (newFilters: Partial<QuoteFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearchChange = (value: string) => {
    handleFiltersChange({ search: value });
  };

  const handleStatusChange = (status: QuoteStatus) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status];

    handleFiltersChange({ status: newStatus });
  };

  // FUNÇÃO SIMPLIFICADA PARA DATA
  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    if (!value) return; // Se não tiver valor, sair

    const newDate = new Date(value);
    const currentRange = filters.dateRange;

    let newDateRange;

    if (field === 'start') {
      newDateRange = {
        start: newDate,
        end: currentRange?.end || newDate, // Se não tem end, usar mesmo valor
      };
    } else {
      newDateRange = {
        start: currentRange?.start || newDate, // Se não tem start, usar mesmo valor
        end: newDate,
      };
    }

    handleFiltersChange({ dateRange: newDateRange });
  };

  // ================ COLUNAS (SEM WIDTH!) ================
  const columns: TableColumn<Quote>[] = [
    {
      key: 'number',
      title: 'Número',
      sortable: true,
      // width removido!
    },
    {
      key: 'projectTitle',
      title: 'Projeto',
      sortable: true,
      // width removido!
    },
    {
      key: 'clientName',
      title: 'Cliente',
      sortable: true,
      // width removido!
    },
    {
      key: 'status',
      title: 'Status',
      // width removido!
      render: (status: QuoteStatus) => (
        <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(status)}`}>
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      key: 'totals',
      title: 'Total',
      // width removido!
      render: (totals, quote) => {
        const total = totals?.total || quote.grandTotal || 0;
        return formatCurrency(total);
      },
    },
    {
      key: 'id',
      title: 'Ações',
      // width removido!
      render: (_, quote) => (
        <div className="flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(quote)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(quote)}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(quote.id!)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Excluir
            </button>
          )}
        </div>
      ),
    },
  ];

  // ================ FUNÇÕES AUXILIARES ================
  const getStatusColor = (status: QuoteStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: QuoteStatus) => {
    const labels = {
      draft: 'Rascunho',
      sent: 'Enviado',
      viewed: 'Visualizado',
      signed: 'Assinado',
      rejected: 'Rejeitado',
      expired: 'Expirado',
    };
    return labels[status] || status;
  };

  // ================ FILTROS ================
  const filteredQuotes = quotes.filter((quote) => {
    // Filtro de status
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(quote.status)) return false;
    }

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        quote.projectTitle?.toLowerCase().includes(searchLower) ||
        quote.clientName?.toLowerCase().includes(searchLower) ||
        quote.number?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Filtro de data (se implementado)
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const quoteDate =
        quote.createdAt instanceof Date ? quote.createdAt : quote.createdAt?.toDate();

      if (quoteDate) {
        if (quoteDate < filters.dateRange.start || quoteDate > filters.dateRange.end) {
          return false;
        }
      }
    }

    return true;
  });

  // ================ RENDER ================
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Busca */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Buscar</label>
            <input
              type="text"
              placeholder="Título, cliente, número..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleStatusChange(e.target.value as QuoteStatus);
                }
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Adicionar status...</option>
              <option value="draft">Rascunho</option>
              <option value="sent">Enviado</option>
              <option value="viewed">Visualizado</option>
              <option value="signed">Assinado</option>
              <option value="rejected">Rejeitado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          {/* Data Range */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Data início</label>
              <input
                type="date"
                value={
                  filters.dateRange?.start
                    ? filters.dateRange.start instanceof Date
                      ? filters.dateRange.start.toISOString().split('T')[0]
                      : ''
                    : ''
                }
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Data fim</label>
              <input
                type="date"
                value={
                  filters.dateRange?.end
                    ? filters.dateRange.end instanceof Date
                      ? filters.dateRange.end.toISOString().split('T')[0]
                      : ''
                    : ''
                }
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Status selecionados */}
        {filters.status && filters.status.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.status.map((status) => (
              <span
                key={status}
                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                {getStatusLabel(status)}
                <button
                  onClick={() => handleStatusChange(status)}
                  className="ml-1 text-blue-600 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Carregando...</div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Nenhum orçamento encontrado</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(quote[column.key], quote)
                          : String(quote[column.key] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info da tabela */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Mostrando {filteredQuotes.length} de {quotes.length} orçamentos
        </div>
      </div>
    </div>
  );
}
