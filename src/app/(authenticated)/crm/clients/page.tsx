"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react"; //

import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { useClients } from "@/hooks/comercial/useClients";
import { Client, ClientFilters, ClientStatus } from "@/lib/types/clients";

export default function ClientsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "all">("all");

  const filters: ClientFilters | undefined = useMemo(() => {
    if (!searchTerm && statusFilter === "all") return undefined;

    return {
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? [statusFilter] : undefined,
    };
  }, [searchTerm, statusFilter]); // ← Só recria quando mudar

  const { clients, loading, createClient, updateClient, deleteClient } = useClients(filters);

  // Estatísticas
  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    inactive: clients.filter((c) => c.status === "inactive").length,
    blocked: clients.filter((c) => c.status === "blocked").length,
  };

  const handleCreateOrUpdate = async (data: any): Promise<string | null> => {
    if (selectedClient) {
      // EDITAR - updateClient retorna boolean
      const success = await updateClient(selectedClient.id!, data);
      if (success) {
        setShowModal(false);
        setSelectedClient(null);
        return selectedClient.id!; // Retorna o ID existente
      }
      return null;
    } else {
      // CRIAR - createClient retorna string | null
      const newId = await createClient(data);
      if (newId) {
        setShowModal(false);
        setSelectedClient(null);
      }
      return newId;
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Tem certeza que deseja deletar o cliente "${client.name}"?`)) {
      await deleteClient(client.id!);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="mt-2 text-gray-600">Gerencie sua base de clientes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Novo Cliente
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
            <p className="mt-1 text-sm text-gray-500">Total de Clientes</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-green-600">{stats.active}</h3>
            <p className="mt-1 text-sm text-gray-500">Ativos: {stats.active}</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-red-600">{stats.inactive}</h3>
            <p className="mt-1 text-sm text-gray-500">Inativos</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-3xl font-bold text-gray-900">{stats.blocked}</h3>
            <p className="mt-1 text-sm text-gray-500">Bloqueados</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClientStatus | "all")}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="blocked">Bloqueados</option>
          </select>
          <span className="text-sm text-gray-500">{clients.length} resultados</span>
        </div>

        {/* Lista de Clientes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">
                    {client.clientNumber || client.id?.substring(0, 8)}
                  </p>
                </div>
                <div
                  className={`h-3 w-3 rounded-full ${
                    client.status === "active"
                      ? "bg-green-500"
                      : client.status === "inactive"
                        ? "bg-red-500"
                        : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>{client.email}</p>
                {client.phone && <p>{client.phone}</p>}
                {client.document && <p>{client.document}</p>}
                {client.address?.city && client.address?.state && (
                  <p>
                    {client.address.city}, {client.address.state}
                  </p>
                )}
              </div>

              {client.status && (
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : client.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {client.status === "active"
                      ? "Ativo"
                      : client.status === "inactive"
                        ? "Inativo"
                        : "Bloqueado"}
                  </span>
                </div>
              )}

              {client.tags && client.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {client.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* BOTÕES EDITAR E DELETAR */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">Nenhum cliente encontrado</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Criar primeiro cliente
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ClientModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdate}
          client={selectedClient}
        />
      )}
    </div>
  );
}
