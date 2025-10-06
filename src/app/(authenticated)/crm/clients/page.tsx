'use client';

import { Timestamp } from 'firebase/firestore';
import { Building2, Mail, MapPin, MoreHorizontal, Phone, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

import { ClientModal } from '@/components/comercial/modals/ClientModal';
import { Client, ClientFormData } from '@/lib/types';

export default function ClientsPage() {
  const [_clients] = useState<Client[]>([]); // Hook real aqui
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockClients: Client[] = [
    {
      id: '1',
      client_number: 'CLI-2025-001',
      name: 'Editora Exemplo Ltda',
      email: 'contato@exemplo.com',
      phone: '(11) 3333-4444',
      document: '12.345.678/0001-90',
      company_name: 'Editora Exemplo',
      contact_person: 'João Silva',
      is_active: true,
      total_projects: 5,
      total_revenue: 45000,
      tags: ['editora', 'parceiro'],
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '00000-000',
        country: 'Brasil',
      },
      created_at: { toDate: () => new Date() } as Timestamp,
      updated_at: { toDate: () => new Date() } as Timestamp,
    },
    // Mais clientes mock...
  ];

  const handleCreateClient = async (data: ClientFormData) => {
    console.log('Criando cliente:', data);
    // Implementar criação real
  };

  const _handleCreateNew = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const _handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_number.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Clientes</h1>
            <p className="mt-2 text-primary-600">Gerencie sua base de clientes</p>
          </div>

          <button
            onClick={() => {
              setSelectedClient(null);
              setShowModal(true);
            }}
            className="mt-4 flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:mt-0"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Cliente
          </button>
        </div>

        {/* Search */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-primary-700">
                Buscar clientes
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-primary-400" />
                <input
                  type="text"
                  className="h-12 w-full rounded-lg border border-primary-200 pl-10 pr-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome, email ou número do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {filteredClients.length} clientes encontrados
              </h2>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span>Ativos: {mockClients.filter((c) => c.is_active).length}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>Total: {mockClients.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredClients.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-primary-300" />
                <h3 className="mb-2 text-lg font-medium text-primary-900">
                  {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                </h3>
                <p className="mb-6 text-primary-600">
                  {searchTerm
                    ? 'Tente ajustar os termos de busca.'
                    : 'Comece cadastrando seu primeiro cliente.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setShowModal(true);
                    }}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Cadastrar Primeiro Cliente
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="cursor-pointer rounded-lg border border-primary-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                          {client.company_name ? (
                            <Building2 className="h-6 w-6 text-blue-600" />
                          ) : (
                            <Users className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold leading-tight text-primary-900">
                            {client.name}
                          </h3>
                          <p className="text-xs text-primary-500">{client.client_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            client.is_active ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <button className="text-primary-400 hover:text-primary-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-sm text-primary-600">
                        <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center text-sm text-primary-600">
                          <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.contact_person && (
                        <div className="flex items-center text-sm text-primary-600">
                          <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{client.contact_person}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center text-sm text-primary-600">
                          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {client.address.city}, {client.address.state}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-primary-50 p-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-900">
                          {client.total_projects}
                        </div>
                        <div className="text-xs text-primary-600">Projetos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-600">
                          R$ {(client.total_revenue / 1000).toFixed(0)}k
                        </div>
                        <div className="text-xs text-primary-600">Receita</div>
                      </div>
                    </div>

                    {client.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1">
                        {client.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {client.tags.length > 3 && (
                          <span className="rounded bg-primary-100 px-2 py-1 text-xs text-primary-700">
                            +{client.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-primary-100 pt-4">
                      <div className="text-xs text-primary-500">
                        Cliente desde {client.created_at.toDate().getFullYear()}
                      </div>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <ClientModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
          onSubmit={handleCreateClient}
          client={selectedClient}
        />
      </div>
    </div>
  );
}
