'use client';

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline';
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends { id?: string | number }>({
  title,
  data = [],
  columns,
  actions = [],
  searchable = true,
  filterable = false,
  sortable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'Nenhum item encontrado',
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Dados processados
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Busca
    if (searchable && searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item as any).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }

    // Ordenação
    if (sortable && sortKey && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortKey];
        const bValue = (b as any)[sortKey];

        if (aValue === bValue) return 0;

        const result = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? result : -result;
      });
    }

    return filtered;
  }, [data, searchTerm, sortKey, sortDirection, searchable, sortable]);

  // Paginação
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = pagination
    ? processedData.slice(startIndex, startIndex + pageSize)
    : processedData;

  // Função de ordenação
  const handleSort = (columnKey: keyof T | string) => {
    if (sortKey === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  // Renderizar célula
  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }

    const value = (item as any)[column.key];

    if (value === null || value === undefined) {
      return <span className="text-slate-400">-</span>;
    }

    return value.toString();
  };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <div className="text-slate-500">Carregando...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {/* Header */}
      {(title || searchable || filterable) && (
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {title && <CardTitle className="text-lg">{title}</CardTitle>}

            <div className="flex flex-col gap-2 sm:flex-row">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:w-64"
                  />
                </div>
              )}

              {filterable && (
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 sm:w-40"
                >
                  <option value="all">Todos</option>
                  {/* Adicionar outras opções conforme necessário */}
                </select>
              )}
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        {/* Tabela Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500 ${
                      column.width ? column.width : ''
                    } ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                    }`}
                  >
                    {column.sortable && sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-1 hover:text-slate-700"
                      >
                        {column.header}
                        {sortKey === column.key &&
                          (sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((item, index) => (
                <tr
                  key={(item.id as string) || index}
                  className={`hover:bg-slate-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`whitespace-nowrap px-6 py-4 text-sm ${
                        column.align === 'center'
                          ? 'text-center'
                          : column.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                      }`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {actions
                          .filter((action) => !action.show || action.show(item))
                          .map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              size="sm"
                              variant={action.variant || 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(item);
                              }}
                            >
                              {action.icon && <action.icon className="mr-1 h-4 w-4" />}
                              {action.label}
                            </Button>
                          ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards Mobile */}
        <div className="space-y-4 p-4 md:hidden">
          {paginatedData.map((item, index) => (
            <div
              key={(item.id as string) || index}
              className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${
                onRowClick ? 'cursor-pointer hover:shadow-md' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="flex items-center justify-between border-b border-slate-100 py-2 last:border-b-0"
                >
                  <span className="text-sm font-medium text-slate-600">{column.header}:</span>
                  <span className="text-sm text-slate-900">{renderCell(item, column)}</span>
                </div>
              ))}

              {actions.length > 0 && (
                <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  {actions
                    .filter((action) => !action.show || action.show(item))
                    .map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        size="sm"
                        variant={action.variant || 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item);
                        }}
                      >
                        {action.icon && <action.icon className="mr-1 h-4 w-4" />}
                        {action.label}
                      </Button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-lg text-slate-500">{emptyMessage}</div>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
                Limpar busca
              </Button>
            )}
          </div>
        )}

        {/* Paginação */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <div className="text-sm text-slate-500">
              Mostrando {startIndex + 1} até {Math.min(startIndex + pageSize, processedData.length)}{' '}
              de {processedData.length} resultados
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
