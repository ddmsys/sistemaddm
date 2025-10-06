"use client";

import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { Client, ClientFormData } from "@/lib/types";
import {
  Building2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function ClientsPage() {
  const [clients] = useState<Client[]>([]); // Hook real aqui
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const mockClients: Client[] = [
    {
      id: "1",
      client_number: "CLI-2025-001",
      name: "Editora Exemplo Ltda",
      email: "contato@exemplo.com",
      phone: "(11) 3333-4444",
      document: "12.345.678/0001-90",
      company_name: "Editora Exemplo",
      contact_person: "João Silva",
      is_active: true,
      total_projects: 5,
      total_revenue: 45000,
      tags: ["editora", "parceiro"],
      address: {
        street: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zip_code: "00000-000",
        country: "Brasil",
      },
      created_at: { toDate: () => new Date() } as any,
      updated_at: { toDate: () => new Date() } as any,
    },
    // Mais clientes mock...
  ];

  const handleCreateClient = async (data: ClientFormData) => {
    console.log("Criando cliente:", data);
    // Implementar criação real
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Clientes</h1>
            <p className="text-primary-600 mt-2">
              Gerencie sua base de clientes
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedClient(null);
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Buscar clientes
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-primary-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Nome, email ou número do cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary-900">
                {filteredClients.length} clientes encontrados
              </h2>
              <div className="flex items-center space-x-4 text-sm text-primary-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span>
                    Ativos: {mockClients.filter((c) => c.is_active).length}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Total: {mockClients.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  {searchTerm
                    ? "Nenhum cliente encontrado"
                    : "Nenhum cliente cadastrado"}
                </h3>
                <p className="text-primary-600 mb-6">
                  {searchTerm
                    ? "Tente ajustar os termos de busca."
                    : "Comece cadastrando seu primeiro cliente."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setShowModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Cadastrar Primeiro Cliente
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white border border-primary-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {client.company_name ? (
                            <Building2 className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Users className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary-900 leading-tight">
                            {client.name}
                          </h3>
                          <p className="text-xs text-primary-500">
                            {client.client_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            client.is_active ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        ></div>
                        <button className="text-primary-400 hover:text-primary-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-primary-600">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center text-sm text-primary-600">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.contact_person && (
                        <div className="flex items-center text-sm text-primary-600">
                          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {client.contact_person}
                          </span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center text-sm text-primary-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {client.address.city}, {client.address.state}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-primary-50 rounded-lg">
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
                      <div className="flex flex-wrap gap-1 mb-4">
                        {client.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {client.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                            +{client.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div className="text-xs text-primary-500">
                        Cliente desde {client.created_at.toDate().getFullYear()}
                      </div>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
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
