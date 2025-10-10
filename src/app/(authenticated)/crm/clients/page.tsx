'use client';

import { Timestamp } from 'firebase/firestore';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { ClientModal } from '@/components/comercial/modals/ClientModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client, ClientStatus } from '@/lib/types/clients';
import { cn } from '@/lib/utils';

export default function ClientsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');

  // clientNumber corrigido para number
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Editora Exemplo',
      email: 'contato@editoraexemplo.com',
      phone: '(11) 99999-9999',
      document: '12.345.678/0001-90',
      status: 'active',
      clientNumber: 579,
      address: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil',
      },
      tags: ['editora', 'livros'],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: 'individual',
    },
    {
      id: '2',
      name: 'Gráfica Central',
      email: 'vendas@graficacentral.com',
      phone: '(11) 88888-8888',
      document: '98.765.432/0001-10',
      status: 'active',
      clientNumber: 875,
      address: {
        street: 'Av. Principal, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '20000-000',
        country: 'Brasil',
      },
      tags: ['grafica', 'impressao'],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: 'individual',
    },
    {
      id: '3',
      name: 'Autor Independente',
      email: 'autor@email.com',
      phone: '(11) 77777-7777',
      document: '123.456.789-00',
      status: 'inactive',
      clientNumber: 875,
      address: {
        street: 'Rua do Escritor, 789',
        city: 'Belo Horizonte',
        state: 'MG',
        zipCode: '30000-000',
        country: 'Brasil',
      },
      tags: undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: 'individual',
    },
  ];

  const filteredClients = mockClients.filter((client) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.clientNumber?.toString().includes(search); // converte para string aqui

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Outras funções e JSX seguem iguais, só corrigir o cn import
  const handleCreateClient = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  const handleSaveClient = async (clientData: any) => {
    console.log('Salvando cliente:', clientData);
    setShowModal(false);
    setSelectedClient(null);
  };

  const getStatusColor = (status: ClientStatus) => {
    const colors = {
      active: 'bg-emerald-500',
      inactive: 'bg-red-500',
      blocked: 'bg-gray-500',
    };
    return colors[status] || colors.inactive;
  };

  const getStatusLabel = (status: ClientStatus) => {
    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      blocked: 'Bloqueado',
    };
    return labels[status] || labels.inactive;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <Button onClick={handleCreateClient}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-gray-900">{mockClients.length}</div>
          <div className="text-sm text-gray-600">Total de Clientes</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-emerald-600">
            {mockClients.filter((c) => c.status === 'active').length} {/* CORRIGIDO */}
          </div>
          <div className="text-sm text-gray-600">
            <span>Ativos: {mockClients.filter((c) => c.status === 'active').length}</span>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-red-600">
            {mockClients.filter((c) => c.status === 'inactive').length}
          </div>
          <div className="text-sm text-gray-600">Inativos</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-2xl font-bold text-gray-600">
            {mockClients.filter((c) => c.status === 'blocked').length}
          </div>
          <div className="text-sm text-gray-600">Bloqueados</div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'all')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredClients.length} resultados</span>
          </div>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="truncate text-lg font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-500">{client.clientNumber}</p>
              </div>
              <div
                className={cn(
                  'h-3 w-3 rounded-full',
                  client.status === 'active' ? 'bg-emerald-500' : 'bg-red-500', // CORRIGIDO
                )}
              />
            </div>

            <div className="mb-4 space-y-2">
              <p className="truncate text-sm text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-600">{client.phone}</p>
              <p className="text-sm text-gray-600">{client.document}</p>
              {client.address && (
                <p className="truncate text-sm text-gray-600">
                  {client.address.city}, {client.address.state}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={client.status === 'active' ? 'success' : 'destructive'}>
                  {getStatusLabel(client.status)}
                </Badge>
              </div>

              {/* CORRIGIDO: Verificação de tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {client.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {client.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{client.tags.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClient(client)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Projetos
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-500">Nenhum cliente encontrado</div>
          <Button variant="outline" onClick={handleCreateClient}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Cliente
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ClientModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSaveClient}
          client={selectedClient}
        />
      )}
    </div>
  );
}
