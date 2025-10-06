//src/app/(authenticated/crm/leads/[id]/page.tsx//

'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ClientModal } from '@/components/comercial/modals/ClientModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { Client } from '@/lib/types';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadClient = useCallback(async () => {
    if (!params?.id || typeof params.id !== 'string') return;

    try {
      const clientRef = doc(db, 'clients', params.id);
      const clientSnap = await getDoc(clientRef);

      if (clientSnap.exists()) {
        setClient({ id: clientSnap.id, ...clientSnap.data() } as Client);
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      void loadClient();
    }
  }, [params?.id, loadClient]);

  const handleSave = async () => {
    await loadClient();
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="mb-4 text-slate-500">Cliente não encontrado</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <Badge variant={client.status === 'ativo' ? 'success' : 'default'}>
              {client.status}
            </Badge>
          </div>
          <p className="text-slate-600">Cliente #{client.clientNumber || 'N/A'}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>Editar Cliente</Button>
        </div>
      </div>

      {/* Informações principais */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Dados do Cliente</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-700">Email</p>
            <p className="text-slate-900">{client.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Telefone</p>
            <p className="text-slate-900">{client.phone || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Documento</p>
            <p className="text-slate-900">{client.cpf || client.cnpj || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Empresa</p>
            <p className="text-slate-900">{client.company || 'Não informado'}</p>
          </div>
        </div>

        {client.address && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="mb-2 text-sm font-medium text-slate-700">Endereço</p>
            <p className="text-slate-900">
              {client.address.street}, {client.address.number}
              {client.address.complement && ` - ${client.address.complement}`}
              <br />
              {client.address.neighborhood} - {client.address.city}/{client.address.state}
              <br />
              CEP: {client.address.zipCode}
            </p>
          </div>
        )}

        {client.notes && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="mb-2 text-sm font-medium text-slate-700">Observações</p>
            <p className="whitespace-pre-wrap text-slate-900">{client.notes}</p>
          </div>
        )}
      </Card>

      {/* Modal de edição */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
        onSubmit={handleSave}
      />
    </div>
  );
}
