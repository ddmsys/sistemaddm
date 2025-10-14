# Sistema DDM - Módulo CRM Completo

> **📅 Última Atualização:** 14 de outubro de 2025  
> **⚠️ MIGRAÇÃO:** Quotes foi renomeado para Budgets. Ver [Documento 08](Progress/08-DOCUMENTO%20DE%20MIGRAÇÃO%20E%20PADRONIZAÇÃO.md)

## 🎯 Visão Geral do Módulo CRM

O módulo CRM (Customer Relationship Management) é responsável por gerenciar todo o ciclo comercial, desde leads até projetos finalizados.

### Fluxo Completo

```
Lead → Qualificação → Cliente → Budget (Orçamento) → Aprovação →
  ├─→ Client (criado)
  ├─→ Book (catálogo)
  ├─→ Order (pedido)
  └─→ ProductionProject (produção)
```

---

## 📊 1. GESTÃO DE LEADS

### 1.1 Página de Leads

**Localização:** `/src/app/(authenticated)/crm/leads/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useLeads } from '@/hooks/comercial/useLeads';
import { Lead, LeadStatus, LeadSource } from '@/lib/types/leads';
import { LeadModal } from '@/components/comercial/modals/LeadModal';
import { LeadCard } from '@/components/comercial/cards/LeadCard';
import { Button } from '@/components/ui/button';

export default function LeadsPage() {
  const { leads, loading, createLead, updateLead, updateLeadStage, deleteLead } = useLeads();
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleCreate = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleSave = async (data: LeadFormData) => {
    if (selectedLead) {
      await updateLead(selectedLead.id!, data);
    } else {
      await createLead(data);
    }
    setShowModal(false);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button onClick={handleCreate}>Novo Lead</Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
          className="px-4 py-2 border rounded"
        >
          <option value="all">Todos os Status</option>
          <option value="primeiro_contato">Primeiro Contato</option>
          <option value="qualificado">Qualificado</option>
          <option value="proposta_enviada">Proposta Enviada</option>
          <option value="negociacao">Negociação</option>
          <option value="fechado_ganho">Fechado Ganho</option>
          <option value="fechado_perdido">Fechado Perdido</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as LeadSource | 'all')}
          className="px-4 py-2 border rounded"
        >
          <option value="all">Todas as Fontes</option>
          <option value="website">Website</option>
          <option value="socialmedia">Redes Sociais</option>
          <option value="referral">Indicação</option>
          <option value="advertising">Publicidade</option>
          <option value="email">Email</option>
          <option value="phone">Telefone</option>
          <option value="coldcall">Cold Call</option>
          <option value="event">Evento</option>
          <option value="other">Outro</option>
        </select>
      </div>

      {/* Lista de Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onEdit={() => handleEdit(lead)}
            onDelete={() => deleteLead(lead.id!)}
            onStatusChange={(status) => updateLeadStage(lead.id!, status)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
```

### 1.2 Página de Detalhes do Lead

**Localização:** `/src/app/(authenticated)/crm/leads/[id]/page.tsx`

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useLeads } from '@/hooks/comercial/useLeads';
import { Lead } from '@/lib/types/leads';
import { ClientModal } from '@/components/comercial/modals/ClientModal';
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

  const handleConvertToClient = async (clientData: ClientFormData) => {
    try {
      await convertToClient(leadId, clientData);
      router.push('/crm/clients');
    } catch (error) {
      console.error('Erro ao converter lead:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!lead) return <div>Lead não encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{lead.name}</h1>
        <Button onClick={() => setShowClientModal(true)}>
          Converter em Cliente
        </Button>
      </div>

      {/* Detalhes do Lead */}
      <div className="bg-white p-6 rounded-lg shadow">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1">{lead.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Telefone</dt>
            <dd className="mt-1">{lead.phone || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Empresa</dt>
            <dd className="mt-1">{lead.company || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">{lead.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Fonte</dt>
            <dd className="mt-1">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Valor Estimado</dt>
            <dd className="mt-1">
              {lead.value ? `R$ ${lead.value.toLocaleString('pt-BR')}` : '-'}
            </dd>
          </div>
        </dl>
      </div>

      {/* Modal de Conversão */}
      {showClientModal && (
        <ClientModal
          onClose={() => setShowClientModal(false)}
          onSubmit={handleConvertToClient}
          initialData={{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
          }}
        />
      )}
    </div>
  );
}
```

---

## 👥 2. GESTÃO DE CLIENTES

### 2.1 Página de Clientes

**Localização:** `/src/app/(authenticated)/crm/clients/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useClients } from '@/hooks/comercial/useClients';
import ClientModal from '@/components/comercial/modals/ClientModal';
import { ClientList } from '@/components/comercial/ClientList';
import { Button } from '@/components/ui/button';

export default function ClientsPage() {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleCreate = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    if (selectedClient) {
      await updateClient(selectedClient.id, data);
    } else {
      await createClient(data);
    }
    setShowModal(false);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={handleCreate}>Novo Cliente</Button>
      </div>

      <ClientList
        clients={clients}
        onEdit={handleEdit}
        onDelete={deleteClient}
      />

      {showModal && (
        <ClientModal
          client={selectedClient}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
```

---

## 📁 3. GESTÃO DE PROJETOS

### 3.1 Página de Projetos

**Localização:** `/src/app/(authenticated)/crm/projects/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/comercial/useProjects';
import { useClients } from '@/hooks/comercial/useClients';
import ProjectModal from '@/components/comercial/modals/ProjectModal';
import { ProjectList } from '@/components/comercial/ProjectList';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCreate = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    if (selectedProject) {
      await updateProject(selectedProject.id, data);
    } else {
      await createProject(data);
    }
    setShowModal(false);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projetos</h1>
        <Button onClick={handleCreate}>Novo Projeto</Button>
      </div>

      <ProjectList
        projects={projects}
        onEdit={handleEdit}
        onDelete={deleteProject}
      />

      {showModal && (
        <ProjectModal
          project={selectedProject}
          clients={clients}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
```

---

## 💰 4. GESTÃO DE ORÇAMENTOS (BUDGETS)

> ✅ **ATUALIZADO** - Era "Quotes", agora é "Budgets"

### 4.1 Página de Orçamentos

**Localização:** `/src/app/(authenticated)/budgets/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useBudgets } from '@/hooks/comercial/useBudgets';
import { useClients } from '@/hooks/comercial/useClients';
import { BudgetModal } from '@/components/comercial/modals/BudgetModal';
import { BudgetsList } from '@/components/comercial/BudgetsList';
import { Button } from '@/components/ui/button';

export default function BudgetsPage() {
  const { budgets, loading, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { clients } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleCreate = () => {
    setSelectedBudget(null);
    setShowModal(true);
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    if (selectedBudget) {
      await updateBudget(selectedBudget.id, data);
    } else {
      await createBudget(data);
    }
    setShowModal(false);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button onClick={handleCreate}>Novo Orçamento</Button>
      </div>

      <BudgetsList
        budgets={budgets}
        onEdit={handleEdit}
        onDelete={deleteBudget}
      />

      {showModal && (
        <BudgetModal
          budget={selectedBudget}
          clients={clients}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
```

---

## 📊 5. DASHBOARD COMERCIAL

### 5.1 Visão Geral

O Dashboard Comercial agrega todas as métricas e dados do módulo CRM em uma única tela.

**Localização:** `/src/components/dashboard/CommercialDashboard.tsx`

### 5.2 Componentes do Dashboard

```typescript
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLeads } from '@/hooks/comercial/useLeads';
import { useClients } from '@/hooks/comercial/useClients';
import { useProjects } from '@/hooks/comercial/useProjects';
import { useBudgets } from '@/hooks/comercial/useBudgets';  // ✅ Atualizado
import { useCommercialMetrics } from '@/hooks/comercial/useCommercialMetrics';
import { LeadModal } from '@/components/comercial/modals/LeadModal';
import ClientModal from '@/components/comercial/modals/ClientModal';
import ProjectModal from '@/components/comercial/modals/ProjectModal';
import { BudgetModal } from '@/components/comercial/modals/BudgetModal';  // ✅ Atualizado
import { KPICards } from '@/components/comercial/KPICards';
import { RevenueChart } from '@/components/comercial/charts/RevenueChart';
import { FunnelChart } from '@/components/comercial/charts/FunnelChart';
import { DonutChart } from '@/components/comercial/charts/DonutChart';
import { Button } from '@/components/ui/button';

export default function CommercialDashboard() {
  const router = useRouter();
  const { metrics, loading } = useCommercialMetrics();
  const { createLead } = useLeads();
  const { createClient, clients } = useClients();
  const { createProject } = useProjects();
  const { createBudget } = useBudgets();  // ✅ Atualizado

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);  // ✅ Atualizado

  if (loading || !metrics) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Comercial</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBudgetModal(true)}>
            Novo Orçamento
          </Button>
          <Button variant="outline" onClick={() => setShowProjectModal(true)}>
            Novo Projeto
          </Button>
          <Button variant="outline" onClick={() => setShowClientModal(true)}>
            Novo Cliente
          </Button>
          <Button onClick={() => setShowLeadModal(true)}>
            Novo Lead
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <KPICards
        revenue={metrics.monthlyRevenue}
        leads={metrics.activeLeads}
        budgets={metrics.totalBudgets}  // ✅ Atualizado
        conversionRate={metrics.conversionRate}
      />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics.revenueData} />
        <FunnelChart data={metrics.funnelData} />
        <DonutChart
          data={metrics.leadsBySource}
          title="Leads por Fonte"
        />
        <DonutChart
          data={metrics.budgetsByStatus}  // ✅ Atualizado
          title="Orçamentos por Status"
        />
      </div>

      {/* Modais */}
      {showLeadModal && (
        <LeadModal
          onClose={() => setShowLeadModal(false)}
          onSubmit={async (data) => {
            await createLead(data);
            setShowLeadModal(false);
          }}
        />
      )}
      {showClientModal && (
        <ClientModal
          onClose={() => setShowClientModal(false)}
          onSubmit={async (data) => {
            await createClient(data);
            setShowClientModal(false);
          }}
        />
      )}
      {showProjectModal && (
        <ProjectModal
          clients={clients}
          onClose={() => setShowProjectModal(false)}
          onSubmit={async (data) => {
            await createProject(data);
            setShowProjectModal(false);
          }}
        />
      )}
      {showBudgetModal && (  // ✅ Atualizado
        <BudgetModal
          clients={clients}
          onClose={() => setShowBudgetModal(false)}
          onSubmit={async (data) => {
            await createBudget(data);
            setShowBudgetModal(false);
          }}
        />
      )}
    </div>
  );
}
```

---

## 🔄 Fluxo de Trabalho Completo

### 1. Criação de Lead

```
Usuário → Clica "Novo Lead" → Preenche formulário → Salva → Lead criado no Firebase
```

### 2. Qualificação de Lead

```
Lead → Primeiro Contato → Qualificado → Proposta Enviada → Negociação
```

### 3. Conversão em Cliente

```
Lead (Fechado Ganho) → Converter em Cliente → ClientModal → Cliente criado
```

### 4. Criação de Projeto

```
Cliente → Novo Projeto → Seleciona Cliente → Preenche dados → Projeto criado
```

### 5. Criação de Orçamento

```
Cliente/Projeto → Novo Orçamento → Adiciona Itens → Calcula Total → Orçamento criado
```

---

> **💡 IMPORTANTE:** Todos os componentes do CRM seguem a mesma estrutura e padrões!
