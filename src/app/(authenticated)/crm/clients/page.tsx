// src/app/(authenticated)/crm/clients/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { useClients } from "@/hooks/comercial/useClients";
import { Client } from "@/lib/types/comercial";
import {
  Plus,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Building,
  UserCheck,
  Briefcase,
} from "lucide-react";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null); // ✅ MUDOU PARA null
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    clients,
    loading: clientsLoading,
    createClient,
    updateClient,
    deleteClient,
  } = useClients();

  // ✅ FILTRO CORRIGIDO
  const filteredClients = clients.filter((client) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();

    // ✅ FUNÇÃO HELPER SEGURA
    const matchesField = (field: string | undefined | null) =>
      field?.toLowerCase().includes(searchLower) || false;

    return (
      matchesField(client.name) || // Nome (PF)
      matchesField(client.companyName) || // Razão Social (PJ)
      matchesField(client.email) || // Email
      matchesField(client.phone) || // Telefone
      matchesField(client.cpf) || // CPF
      matchesField(client.cnpj) || // CNPJ
      matchesField(client.contactPerson) || // Contato (PJ)
      matchesField(client.rg) // RG
    );
  });

  const handleSave = async (clientData: any) => {
    // ✅ TIPO ANY TEMPORÁRIO
    setLoading(true);
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id!, clientData);
      } else {
        await createClient(clientData);
      }
      setIsModalOpen(false);
      setSelectedClient(null); // ✅ MUDOU PARA null
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;

    try {
      await deleteClient(clientId);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao deletar cliente");
    }
  };

  const getStatusColor = (status: Client["status"]) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      blocked: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: Client["status"]) => {
    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      blocked: "Bloqueado",
    };
    return labels[status] || status;
  };

  // ✅ FUNÇÃO PARA OBTER NOME PARA EXIBIÇÃO
  const getDisplayName = (client: Client) => {
    if (client.type === "company") {
      return client.companyName || "Empresa sem nome";
    }
    return client.name || "Cliente sem nome";
  };

  // ✅ FUNÇÃO PARA OBTER ÍCONE DO TIPO
  const getClientIcon = (client: Client) => {
    return client.type === "company" ? (
      <Building className="w-5 h-5 text-blue-600" />
    ) : (
      <User className="w-5 h-5 text-blue-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600">Gerencie sua base de clientes</p>
        </div>
        <Button
          onClick={() => {
            setSelectedClient(null); // ✅ MUDOU PARA null
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Buscar por nome, email, telefone, CPF, CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientsLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-600 mt-2">Carregando clientes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-600">
              {searchTerm.trim()
                ? "Nenhum cliente encontrado para essa busca"
                : "Nenhum cliente cadastrado"}
            </p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card
              key={client.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* ✅ HEADER DO CARD */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getClientIcon(client)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {getDisplayName(client)}
                      </h3>
                      <div className="flex items-center gap-2">
                        {client.number && (
                          <p className="text-sm text-slate-500">
                            #{client.number}
                          </p>
                        )}
                        <Badge className="text-xs bg-slate-100 text-slate-600">
                          {client.type === "company"
                            ? "Empresa"
                            : "Pessoa Física"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </div>

                {/* ✅ INFORMAÇÕES DO CLIENTE */}
                <div className="space-y-2">
                  {/* EMAIL */}
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={14} />
                      <span>{client.email}</span>
                    </div>
                  )}

                  {/* TELEFONE */}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} />
                      <span>{client.phone}</span>
                    </div>
                  )}

                  {/* INFORMAÇÕES ESPECÍFICAS POR TIPO */}
                  {client.type === "company" ? (
                    // PESSOA JURÍDICA
                    <>
                      {client.cnpj && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Briefcase size={14} />
                          <span>CNPJ: {client.cnpj}</span>
                        </div>
                      )}
                      {client.contactPerson && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <UserCheck size={14} />
                          <span>Contato: {client.contactPerson}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    // PESSOA FÍSICA
                    <>
                      {client.cpf && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User size={14} />
                          <span>CPF: {client.cpf}</span>
                        </div>
                      )}
                      {client.birthDate && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <UserCheck size={14} />
                          <span>
                            Aniversário:{" "}
                            {new Date(client.birthDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ✅ BOTÕES DE AÇÃO */}
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(client)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(client.id!)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ✅ MODAL CORRIGIDO */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null); // ✅ USAR null
        }}
        client={selectedClient} // ✅ JÁ É Client | null
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}
