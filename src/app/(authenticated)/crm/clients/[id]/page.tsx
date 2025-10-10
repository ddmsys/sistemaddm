// src/app/(authenticated)/crm/clients/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useClients } from '@/hooks/comercial/useClients';
import { Client } from '@/lib/types/clients';

export default function ClientPage() {
  const router = useRouter();
  const params = useParams();
  const { clients } = useClients();
  const [client, setClient] = useState<Client | null>(null);

  const loadClient = useCallback(
    (id: string) => {
      const foundClient = clients.find((c) => c.id === id);
      if (foundClient) {
        setClient(foundClient);
      } else {
        setClient(null);
        router.push('/crm/clients');
      }
    },
    [clients, router],
  );

  useEffect(() => {
    if (!params || typeof params.id !== 'string') {
      router.push('/crm/clients');
      return;
    }

    const id = params.id as string;
    if (!id || typeof id !== 'string') {
      // Se id inválido, pode redirecionar ou mostrar erro simples
      router.push('/crm/clients');
      return;
    }
    loadClient(id);
  }, [params, loadClient, router]);

  if (!client) {
    return <p>Cliente não encontrado ou carregando...</p>;
  }

  return (
    <div>
      <h1>Cliente: {client.name}</h1>
      <p>Email: {client.email}</p>
      {/* mais campos aqui conforme seu tipo Client */}
    </div>
  );
}
