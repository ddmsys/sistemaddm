'use client';

import { Building, Edit, Eye, Mail, MoreHorizontal, Phone, Trash2, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Client, ClientStatus } from '@/lib/types/clients';
import { formatDate } from '@/lib/utils';

interface ClientsTableProps {
  clients: Client[];
  loading?: boolean;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

interface ClientsTableFilters {
  search: string;
  status: ClientStatus[];
  type: ('individual' | 'company')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// ================ CONFIGURAÇÕES ================
const columns = [
  {
    key: 'clientNumber',
    title: 'Nº Cliente',
    sortable: true,
  },
  {
    key: 'name',
    title: 'Nome/Empresa',
    sortable: true,
    render: (name: string, client: Client) => (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            client.type === 'company' ? 'bg-blue-100' : 'bg-green-100'
          }`}
        >
          {client.type === 'company' ? (
            <Building className="h-4 w-4 text-blue-600" />
          ) : (
            <User className="h-4 w-4 text-green-600" />
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">
            {client.type === 'company' ? 'Empresa' : 'Pessoa Física'}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'document',
    title: 'CPF/CNPJ',
    render: (document: string) => <span className="font-mono text-sm">{document || '-'}</span>,
  },
  {
    key: 'contact',
    title: 'Contato',
    render: (_: unknown, client: Client) => (
      <div className="space-y-1">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="max-w-[150px] truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{client.phone}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'address',
    title: 'Localização',
    render: (address: Client['address']) => (
      <div className="text-sm text-gray-600">
        {address ? (
          <div>
            <div>
              {address.city}, {address.state}
            </div>
            <div className="text-gray-400">{address.zipCode}</div>
          </div>
        ) : (
          <span className="text-gray-400">Não informado</span>
        )}
      </div>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    render: (status: ClientStatus) => (
      <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
    ),
  },
  {
    key: 'createdAt',
    title: 'Cadastrado',
    sortable: true,
    render: (createdAt: any) => (
      <span className="text-sm text-gray-600">{formatDate(createdAt.toDate())}</span>
    ),
  },
  {
    key: 'id',
    title: 'Ações',
    render: (_: unknown, client: Client) => (
      <div className="flex items-center gap-2">
        {/* Dropdown de ações */}
        <ClientActionsDropdown client={client} />
      </div>
    ),
  },
];

// ================ FUNÇÕES AUXILIARES ================
const getStatusColor = (status: ClientStatus) => {
  const colors: Record<ClientStatus, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    blocked: 'bg-red-100 text-red-800',
  };
  return colors[status] || colors.active;
};

const getStatusLabel = (status: ClientStatus) => {
  const labels: Record<ClientStatus, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    blocked: 'Bloqueado',
  };
  return labels[status] || status;
};

// ================ COMPONENTE DE AÇÕES ================
function ClientActionsDropdown({
  client,
  onView,
  onEdit,
  onDelete,
}: {
  client: Client;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="h-8 w-8 p-0"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {showMenu && (
        <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          {onView && (
            <button
              onClick={() => {
                onView(client);
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              Ver Detalhes
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
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
              onClick={() => {
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
      )}
    </div>
  );
}

// ================ COMPONENTE PRINCIPAL ================
export function ClientsTable({
  clients,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  const [filters, setFilters] = useState<ClientsTableFilters>({
    search: '',
    status: [],
    type: [],
  });

  // ================ FILTROS ================
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleStatusFilter = (status: ClientStatus) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const handleTypeFilter = (type: 'individual' | 'company') => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type) ? prev.type.filter((t) => t !== type) : [...prev.type, type],
    }));
  };

  // ================ DADOS FILTRADOS ================
  const filteredClients = clients.filter((client) => {
    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        client.name.toLowerCase().includes(searchLower) ||
        client.document?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.phone?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Filtro de status
    if (filters.status.length > 0) {
      if (!filters.status.includes(client.status)) return false;
    }

    // Filtro de tipo
    if (filters.type.length > 0) {
      if (!filters.type.includes(client.type)) return false;
    }

    return true;
  });

  // ================ RENDER ================
  return (
    <Card className="w-full">
      {/* Filtros */}
      <div className="border-b border-gray-200 p-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtros por Status e Tipo */}
          <div className="flex flex-wrap gap-2">
            {/* Status */}
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusFilter('active')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.status.includes('active')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => handleStatusFilter('inactive')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.status.includes('inactive')
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Inativos
              </button>
              <button
                onClick={() => handleStatusFilter('blocked')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.status.includes('blocked')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Bloqueados
              </button>
            </div>

            {/* Tipo */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTypeFilter('individual')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.type.includes('individual')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pessoa Física
              </button>
              <button
                onClick={() => handleTypeFilter('company')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.type.includes('company')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Empresa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  Carregando...
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="whitespace-nowrap px-6 py-4">
                      {column.key === 'id' ? (
                        <ClientActionsDropdown
                          client={client}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ) : column.render ? (
                        column.render((client as any)[column.key], client)
                      ) : (
                        String((client as any)[column.key] || '')
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="space-y-4 p-4 lg:hidden">
        {loading ? (
          <div className="py-8 text-center">Carregando...</div>
        ) : filteredClients.length === 0 ? (
          <div className="py-8 text-center text-gray-500">Nenhum cliente encontrado</div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* Header do card */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      client.type === 'company' ? 'bg-blue-100' : 'bg-green-100'
                    }`}
                  >
                    {client.type === 'company' ? (
                      <Building className="h-5 w-5 text-blue-600" />
                    ) : (
                      <User className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">Cliente #{client.clientNumber}</div>
                  </div>
                </div>
                <ClientActionsDropdown
                  client={client}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>

              {/* Informações */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Documento:</span>
                  <span className="font-mono text-sm">{client.document || '-'}</span>
                </div>

                {client.email && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm">{client.email}</span>
                  </div>
                )}

                {client.phone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Telefone:</span>
                    <span className="text-sm">{client.phone}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <Badge className={getStatusColor(client.status)}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Cadastrado:</span>
                  <span className="text-sm">{formatDate(client.createdAt.toDate())}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info da tabela */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-500">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
      </div>
    </Card>
  );
}
