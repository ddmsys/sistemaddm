// src/app/(authenticated)/crm/leads/[id]/page.tsx
"use client";

import { Timestamp } from "firebase/firestore";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ClientModal } from "@/components/comercial/modals/ClientModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFirestore } from "@/hooks/useFirestore";
import { Client, ClientFormData } from "@/lib/types/clients";
import { Lead } from "@/lib/types/leads";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);

  const { getById } = useFirestore<Lead>("leads");

  useEffect(() => {
    const fetchLead = async () => {
      if (!leadId) {
        router.push("/crm/leads");
        return;
      }

      try {
        setLoading(true);
        const leadData = await getById(leadId);
        if (leadData) {
          setLead(leadData);
        } else {
          router.push("/crm/leads");
        }
      } catch {
        router.push("/crm/leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId, getById, router]);

  const handleConvertToClient = () => {
    setShowClientModal(true);
  };

  const handleCreateClient = async (clientData: ClientFormData): Promise<string | null> => {
    try {
      const client: Omit<Client, "id"> = {
        type: "individual", // Adicionando o campo obrigatório
        name: lead?.name || clientData.name,
        email: lead?.email || clientData.email,
        phone: lead?.phone || clientData.phone,
        document: clientData.document || "A informar",
        status: "active",
        clientNumber: Number(Date.now()), // converter para number
        address: clientData.address,
        tags: lead?.tags,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      console.log("Criando cliente:", client);
      // Implementar criação do cliente
      setShowClientModal(false);
      return "client-id"; // Retornar o ID do cliente criado (ou null se falhar)
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Carregando lead...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Lead não encontrado</h2>
          <p className="mt-2 text-gray-600">O lead solicitado não existe ou foi removido.</p>
          <Button onClick={() => router.push("/crm/leads")} className="mt-4">
            Voltar aos Leads
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      primeiro_contato: "bg-blue-100 text-blue-800",
      qualificado: "bg-yellow-100 text-yellow-800",
      proposta_enviada: "bg-purple-100 text-purple-800",
      negociacao: "bg-orange-100 text-orange-800",
      fechado_ganho: "bg-emerald-100 text-emerald-800",
      fechado_perdido: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.primeiro_contato;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/crm/leads")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            {lead.company && <p className="text-gray-600">{lead.company}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Informações do Lead */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Informações de Contato</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{lead.email}</p>
              </div>
              {lead.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900">{lead.phone}</p>
                </div>
              )}
              {lead.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Empresa</label>
                  <p className="text-gray-900">{lead.company}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Fonte</label>
                <p className="text-gray-900">{lead.source}</p>
              </div>
            </div>
          </Card>

          {/* Outras informações */}
          {(lead.interestArea || lead.notes) && (
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Detalhes do Lead</h3>
              <div className="space-y-4">
                {lead.interestArea && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Área de Interesse
                    </label>
                    <p className="text-gray-900">{lead.interestArea}</p>
                  </div>
                )}
                {lead.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observações</label>
                    <p className="whitespace-pre-wrap text-gray-900">{lead.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Ações</h3>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleConvertToClient}
                disabled={lead.status === "fechado_ganho"}
              >
                Converter em Cliente
              </Button>
              <Button variant="outline" className="w-full">
                Criar Orçamento
              </Button>
              <Button variant="outline" className="w-full">
                Agendar Reunião
              </Button>
            </div>
          </Card>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Informações do Sistema */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Informações</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <p className="text-gray-900">
                  {formatDate(
                    lead.createdAt instanceof Date
                      ? lead.createdAt
                      : lead.createdAt?.toDate() || new Date(),
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Última atualização:</span>
                <p className="text-gray-900">
                  {formatDateTime(
                    lead.updatedAt instanceof Date
                      ? lead.updatedAt
                      : lead.updatedAt?.toDate() || new Date(),
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Cliente */}
      {showClientModal && lead && (
        <ClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSubmit={handleCreateClient}
          client={
            {
              type: lead.company ? "company" : "individual",
              name: lead.name,
              email: lead.email,
              phone: lead.phone || "",
              company: lead.company || "",
              document: "", // Campo obrigatório vazio para preenchimento
              status: "active", // Status obrigatório
              notes: lead.notes || "",
              source: lead.source || "",
              tags: [],
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            } as Client
          }
        />
      )}
    </div>
  );
}
