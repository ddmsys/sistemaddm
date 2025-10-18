'use client';

import {
  CheckCircleIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ComercialFilters, Quote } from '@/lib/types/comercial';
import { SelectOption, TableColumn } from '@/lib/types/shared';

// Interface para Timestamp do Firestore
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

interface FirestoreTimestampSerialized {
  seconds: number;
  nanoseconds?: number;
}

interface QuotesTableProps {
  quotes: Quote[];
  loading?: boolean;
  onEdit: (quote: Quote) => void;
  onView: (quote: Quote) => void;
  onSign?: (id: string) => void;
  onCreateNew: () => void;
  onFiltersChange: (filters: ComercialFilters) => void;
}

export function QuotesTable({
  quotes,
  loading = false,
  onEdit,
  onView,
  onSign,
  onCreateNew,
  onFiltersChange,
}: QuotesTableProps) {
  const [filters, setFilters] = useState<ComercialFilters>({
    search: '',
    status: [],
    dateRange: { start: '', end: '' },
  });

  // ================ TABLE COLUMNS ================
  const columns: TableColumn<Quote>[] = [
    {
      key: 'number',
      label: 'Número',
      sortable: true,
      width: '120',
      render: (value: unknown) => (
        <span className="font-mono text-sm">
          {typeof value === 'string'
            ? value
            : typeof value === 'number'
              ? String(value)
              : value && typeof value === 'object'
                ? JSON.stringify(value)
                : value && typeof value === 'object'
                  ? JSON.stringify(value)
                  : 'N/A'}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Título',
      sortable: true,
      render: (value: unknown, quote: Quote) => (
        <div>
          <p className="truncate font-medium text-gray-900">{(value as string) || 'Sem título'}</p>
          <p className="text-sm text-gray-500">{quote.clientName}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120',
      render: (value: unknown, quote) => <Badge variant="info">{quote.status}</Badge>,
    },
    {
      key: 'grandTotal',
      label: 'Valor Total',
      sortable: true,
      width: '120',
      render: (value) => (
        <span className="font-semibold text-blue-600">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(value as number)}
        </span>
      ),
    },
    {
      key: 'validUntil',
      label: 'Válido até',
      sortable: true,
      width: '120',
      render: (value) => {
        // ✅ Verificação segura do tipo de valor
        if (!value) return <span className="text-gray-400">Não definido</span>;

        try {
          let date: Date;

          // Se for um Timestamp do Firestore
          if (value && typeof value === 'object' && 'toDate' in value) {
            const timestamp = value as FirestoreTimestamp;
            date = timestamp.toDate();
          }
          // Se for um objeto com seconds (Timestamp serializado)
          else if (value && typeof value === 'object' && 'seconds' in value) {
            const timestampObj = value as FirestoreTimestampSerialized;
            date = new Date(timestampObj.seconds * 1000);
          }
          // Se for Date ou string
          else {
            date = new Date(value as string | number | Date);
          }

          const isExpired = date < new Date();
          return (
            <span className={isExpired ? 'font-medium text-red-600' : 'text-gray-900'}>
              {date.toLocaleDateString('pt-BR')}
            </span>
          );
        } catch (error) {
          console.warn('Erro ao formatar data validUntil:', value, error);
          return <span className="text-red-400">Data inválida</span>;
        }
      },
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      width: '120',
      render: (value) => {
        if (!value) return <span className="text-gray-400">-</span>;

        try {
          let date: Date;

          if (value && typeof value === 'object' && 'toDate' in value) {
            const timestamp = value as FirestoreTimestamp;
            date = timestamp.toDate();
          } else if (value && typeof value === 'object' && 'seconds' in value) {
            const timestampObj = value as FirestoreTimestampSerialized;
            date = new Date(timestampObj.seconds * 1000);
          } else {
            date = new Date(value as string | number | Date);
          }

          return date.toLocaleDateString('pt-BR');
        } catch (error) {
          console.warn('Erro ao formatar data createdAt:', value, error);
          return <span className="text-red-400">Data inválida</span>;
        }
      },
    },
    {
      key: 'id' as keyof Quote, // Adicionando key para ações
      label: 'Ações',
      width: '160',
      render: (_, quote) => (
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" onClick={() => onView(quote)}>
            <EyeIcon className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(quote)}
            disabled={quote.status === 'signed'}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>

          {quote.pdfUrl && (
            <Button size="sm" variant="ghost" onClick={() => window.open(quote.pdfUrl, '_blank')}>
              <DocumentTextIcon className="h-4 w-4" />
            </Button>
          )}

          {quote.status === 'sent' && onSign && (
            <Button size="sm" variant="default" onClick={() => onSign(quote.id ?? '')}>
              <CheckCircleIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // ================ FILTER OPTIONS ================
  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Rascunho' },
    { value: 'sent', label: 'Enviado' },
    { value: 'viewed', label: 'Visualizado' },
    { value: 'signed', label: 'Assinado' },
    { value: 'rejected', label: 'Rejeitado' },
    { value: 'expired', label: 'Expirado' },
  ];

  // ================ HANDLERS ================
  const handleFiltersChange = (newFilters: Partial<ComercialFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleSearchChange = (value: string) => {
    handleFiltersChange({ search: value });
  };

  const handleStatusChange = (status: string) => {
    const currentStatus = filters.status || [];
    const newStatus = status
      ? currentStatus.includes(status)
        ? currentStatus.filter((s) => s !== status)
        : [...currentStatus, status]
      : [];

    handleFiltersChange({ status: newStatus });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    handleFiltersChange({
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ================ ACTIONS ================ */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Orçamentos</h2>
          <p className="text-sm text-gray-600">{quotes.length} orçamentos encontrados</p>
        </div>
        <Button onClick={onCreateNew}>Novo Orçamento</Button>
      </div>

      {/* ================ FILTERS ================ */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Filtros</h3>
        <Input
          label="Buscar"
          placeholder="Título, número ou cliente..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          placeholder="Todos os status"
          value={filters.status?.[0] || ''}
          onChange={(value) => handleStatusChange(value)}
        />

        <Input
          label="Data início"
          type="date"
          value={filters.dateRange?.start || ''}
          onChange={(e) => handleDateRangeChange('start', e.target.value)}
        />

        <Input
          label="Data fim"
          type="date"
          value={filters.dateRange?.end || ''}
          onChange={(e) => handleDateRangeChange('end', e.target.value)}
        />
      </div>

      {/* ================ TABLE ================ */}
      <div className="rounded-lg border bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : quotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum orçamento encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    {columns.map((column, index) => (
                      <td key={index} className="px-4 py-4 text-sm text-gray-900">
                        {column.render
                          ? column.render(quote[column.key], quote)
                          : quote[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
