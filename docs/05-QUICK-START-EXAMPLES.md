# Sistema DDM - Guia Rápido e Exemplos

> **📅 Última Atualização:** 10 de outubro de 2025
> **🎯 Para:** Continuar desenvolvimento rapidamente

## 🚀 INÍCIO RÁPIDO

### Setup Inicial

```bash
# 1. Clone e instale
git clone <repo>
cd sistemaddm
npm install

# 2. Configure Firebase
cp .env.example .env.local
# Preencha as variáveis do Firebase

# 3. Rode o projeto
npm run dev
# Abra http://localhost:3000
```

---

## 📝 EXEMPLOS COMPLETOS

### 1. Criar Página de CRUD Completa

```typescript
// filepath: src/app/(authenticated)/crm/leads/page.tsx

'use client';

import { useState } from 'react';
import { useLeads } from '@/hooks/comercial/useLeads';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '@/lib/types/leads';
import { LeadModal } from '@/components/comercial/modals/LeadModal';
import { LeadCard } from '@/components/comercial/cards/LeadCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LeadsPage() {
  // 1️⃣ Estados
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

  // 2️⃣ Hook com funções CRUD
  const {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    updateLeadStage,
    deleteLead,
  } = useLeads();

  // 3️⃣ Filtros
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 4️⃣ Handlers
  const handleCreate = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleSave = async (data: LeadFormData) => {
    try {
      if (selectedLead) {
        await updateLead(selectedLead.id!, data);
      } else {
        await createLead(data);
      }
      setShowModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar lead!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este lead?')) return;

    try {
      await deleteLead(id);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar lead!');
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await updateLeadStage(id, status);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status!');
    }
  };

  // 5️⃣ Loading/Error States
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erro ao carregar leads: {error.message}</div>
      </div>
    );
  }

  // 6️⃣ Render
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button onClick={handleCreate}>
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="primeiro_contato">Primeiro Contato</SelectItem>
            <SelectItem value="qualificado">Qualificado</SelectItem>
            <SelectItem value="proposta_enviada">Proposta Enviada</SelectItem>
            <SelectItem value="negociacao">Negociação</SelectItem>
            <SelectItem value="fechado_ganho">Fechado Ganho</SelectItem>
            <SelectItem value="fechado_perdido">Fechado Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Nenhum lead encontrado
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={() => handleEdit(lead)}
              onDelete={() => handleDelete(lead.id!)}
              onStatusChange={(status) => handleStatusChange(lead.id!, status)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <LeadModal
          lead={selectedLead}
          onClose={() => {
            setShowModal(false);
            setSelectedLead(null);
          }}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
```

---

### 2. Integrar Dashboard com Métricas

```typescript
// filepath: src/app/(authenticated)/dashboard/page.tsx

'use client';

import { useCommercialMetrics } from '@/hooks/comercial/useCommercialMetrics';
import { KPICards } from '@/components/comercial/KPICards';
import { RevenueChart } from '@/components/comercial/charts/RevenueChart';
import { FunnelChart } from '@/components/comercial/charts/FunnelChart';
import { DonutChart } from '@/components/comercial/charts/DonutChart';

export default function DashboardPage() {
  const { metrics, loading } = useCommercialMetrics();

  if (loading || !metrics) {
    return <div>Carregando métricas...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Comercial</h1>

      {/* KPIs */}
      <KPICards
        revenue={metrics.monthlyRevenue}
        leads={metrics.activeLeads}
        quotes={metrics.totalQuotes}
        conversionRate={metrics.conversionRate}
      />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics.revenueData} height={300} />
        <FunnelChart data={metrics.funnelData} height={300} />
        <DonutChart
          data={metrics.leadsBySource}
          title="Leads por Fonte"
          height={300}
        />
        <DonutChart
          data={metrics.quotesByStatus}
          title="Orçamentos por Status"
          height={300}
        />
      </div>
    </div>
  );
}
```

---

### 3. Converter Lead em Cliente

```typescript
// filepath: src/app/(authenticated)/crm/leads/[id]/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useLeads } from '@/hooks/comercial/useLeads';
import { Lead } from '@/lib/types/leads';
import { ClientFormData } from '@/lib/types/clients';
import ClientModal from '@/components/comercial/modals/ClientModal';
import { Button } from '@/components/ui/button';

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);

  const { getById } = useFirestore<Lead>('leads');
  const { convertToClient } = useLeads();

  // Buscar lead
  useEffect(() => {
    const fetchLead = async () => {
      if (!leadId) {
        router.push('/crm/leads');
        return;
      }

      try {
        const leadData = await getById(leadId);
        if (leadData) {
          setLead(leadData);
        } else {
          router.push('/crm/leads');
        }
      } catch {
        router.push('/crm/leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  // Converter
  const handleConvert = async (clientData: ClientFormData) => {
    try {
      await convertToClient(leadId, clientData);
      alert('Lead convertido em cliente com sucesso!');
      router.push('/crm/clients');
    } catch (error) {
      console.error('Erro ao converter:', error);
      alert('Erro ao converter lead!');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!lead) return <div>Lead não encontrado</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{lead.name}</h1>
        {lead.status !== 'fechado_perdido' && (
          <Button onClick={() => setShowClientModal(true)}>
            Converter em Cliente
          </Button>
        )}
      </div>

      {/* Detalhes */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{lead.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">{lead.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Empresa</p>
            <p className="font-medium">{lead.company || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{lead.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fonte</p>
            <p className="font-medium">{lead.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor Estimado</p>
            <p className="font-medium">
              {lead.value
                ? `R$ ${lead.value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}`
                : '-'}
            </p>
          </div>
        </div>

        {lead.notes && (
          <div>
            <p className="text-sm text-gray-500">Observações</p>
            <p className="mt-1">{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Modal de Conversão */}
      {showClientModal && (
        <ClientModal
          onClose={() => setShowClientModal(false)}
          onSubmit={handleConvert}
          initialData={{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            type: 'individual',
            document: '',
          }}
        />
      )}
    </div>
  );
}
```

---

### 4. Criar Novo Hook Personalizado

```typescript
// filepath: src/hooks/comercial/useCustomData.ts

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useCustomData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Query personalizada
        const q = query(
          collection(db, 'leads'),
          where('status', '==', 'qualificado')
        );

        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(items);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
```

---

## 🎯 RECEITAS RÁPIDAS

### Formatar Moeda

```typescript
// Opção 1: Função utilitária
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Uso
const formatted = formatCurrency(1500.50);
// "R$ 1.500,50"

// Opção 2: Inline
const formatted = value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
```

---

### Formatar Data

```typescript
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// De Timestamp para string
export function formatDate(timestamp: Timestamp): string {
  return format(timestamp.toDate(), 'dd/MM/yyyy', { locale: ptBR });
}

// Com hora
export function formatDateTime(timestamp: Timestamp): string {
  return format(timestamp.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

// Relativo
export function formatRelative(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  return format(date, 'dd/MM/yyyy');
}
```

---

### Validar CPF/CNPJ

```typescript
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;

  // Validação completa do CPF
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;

  // Implementar validação CNPJ
  return true;
}
```

---

### Calcular Totais de Orçamento

```typescript
import { QuoteItem } from '@/lib/types/quotes';

export function calculateQuoteTotals(
  items: QuoteItem[],
  discount: number = 0,
  tax: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discount;
  const taxAmount = tax;
  const total = subtotal - discountAmount + taxAmount;

  return {
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    total,
  };
}

// Uso
const items: QuoteItem[] = [
  { id: '1', description: 'Item 1', quantity: 2, unitPrice: 100, total: 200 },
  { id: '2', description: 'Item 2', quantity: 1, unitPrice: 300, total: 300 },
];

const totals = calculateQuoteTotals(items, 50, 25);
// { subtotal: 500, discount: 50, tax: 25, total: 475 }
```

---

## 🔍 DEBUGGING

### Console Logs Úteis

```typescript
// Ver estrutura do objeto
console.log('Lead:', JSON.stringify(lead, null, 2));

// Ver tipo
console.log('Tipo de createdAt:', typeof lead.createdAt);
console.log('É Timestamp?', lead.createdAt instanceof Timestamp);

// Ver props do hook
const hookData = useLeads();
console.table(hookData.leads);
```

---

### Verificar Erros Comuns

```typescript
// 1. Verificar se existe antes de acessar
if (lead?.email) {
  console.log(lead.email);
}

// 2. Verificar array vazio
if (leads.length === 0) {
  console.log('Sem leads');
}

// 3. Verificar Timestamp
if (lead.createdAt && lead.createdAt.toDate) {
  const date = lead.createdAt.toDate();
  console.log(date);
}

// 4. Try/Catch em operações async
try {
  await createLead(data);
} catch (error) {
  console.error('Erro detalhado:', error);
  if (error instanceof Error) {
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
  }
}
```

---

## 📋 CHECKLIST ANTES DE COMMITAR

- [ ] Todos os tipos estão corretos?
- [ ] Imports corretos (default vs named)?
- [ ] Campos obrigatórios preenchidos?
- [ ] Error handling implementado?
- [ ] Loading states funcionando?
- [ ] Console.logs removidos?
- [ ] TypeScript sem erros? (`npm run type-check`)
- [ ] ESLint sem warnings? (`npm run lint`)
- [ ] Testado no navegador?

---

## 🚨 ERROS COMUNS E SOLUÇÕES

### Erro: "Cannot read property 'id' of undefined"

```typescript
// ❌ Problema
lead.id  // Se lead for null

// ✅ Solução
lead?.id || 'sem-id'
```

---

### Erro: "X is not assignable to type Y"

```typescript
// ❌ Problema
const status: LeadStatus = 'new';  // 'new' não existe

// ✅ Solução
const status: LeadStatus = 'primeiro_contato';  // Usar enum correto
```

---

### Erro: "Expected 1 argument but got 0"

```typescript
// ❌ Problema
<ProjectModal
  onClose={() => setShowModal(false)}
  onSubmit={handleCreate}
/>

// ✅ Solução - Passar prop obrigatória
<ProjectModal
  clients={clients}  // ⚠️ Obrigatório!
  onClose={() => setShowModal(false)}
  onSubmit={handleCreate}
/>
```

---

## 🎓 RECURSOS ADICIONAIS

### Documentação Oficial

- **Next.js:** https://nextjs.org/docs
- **Firebase:** https://firebase.google.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Tailwind:** https://tailwindcss.com/docs
- **Recharts:** https://recharts.org/en-US/api

### Comandos Úteis

```bash
# Verificar tipos
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Limpar cache
rm -rf .next node_modules
npm install

# Ver logs Firebase
firebase emulators:start --only firestore
```

---

> **🎯 FIM DO GUIA RÁPIDO**
>
> Com estes 6 documentos, você tem TUDO para continuar o desenvolvimento do Sistema DDM!
