# Sistema DDM - Guia de Componentes

> **📅 Última Atualização:** 10 de outubro de 2025
> **🎯 Objetivo:** Referência rápida de componentes e suas props

## 🎨 MODAIS (Formulários)

### ⚠️ IMPORTANTE: Tipos de Export

```typescript
// ✅ NAMED EXPORT (usa chaves no import)
import { LeadModal } from '@/components/comercial/modals/LeadModal';

// ✅ DEFAULT EXPORT (sem chaves)
import ClientModal from '@/components/comercial/modals/ClientModal';
import ProjectModal from '@/components/comercial/modals/ProjectModal';
import BudgetModal from '@/components/comercial/modals/BudgetModal';
```

---

### 1. LeadModal (Named Export)

```typescript
import { LeadModal } from '@/components/comercial/modals/LeadModal';
import { Lead, LeadFormData } from '@/lib/types/leads';

// Props Interface
interface LeadModalProps {
  lead?: Lead | null;           // Lead existente (edição)
  onClose: () => void;          // Fechar modal
  onSubmit: (data: LeadFormData) => Promise<void>;  // Salvar
}

// Exemplo de Uso
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { createLead, updateLead } = useLeads();

  const handleSave = async (data: LeadFormData) => {
    if (selectedLead) {
      await updateLead(selectedLead.id!, data);
    } else {
      await createLead(data);
    }
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Novo Lead</Button>

      {showModal && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}
    </>
  );
}
```

**Campos do Formulário:**

```typescript
{
  name: string;              // ✅ Obrigatório
  email?: string;            // Opcional
  phone?: string;            // Opcional
  company?: string;          // Opcional
  source: LeadSource;        // ✅ Obrigatório - Select
  status: LeadStatus;        // ✅ Obrigatório - Select
  indication?: string;       // Opcional
  value?: number;            // Opcional
  probability?: number;      // Opcional (0-100)
  notes?: string;            // Opcional - Textarea
  tags?: string[];           // Opcional - Input com split
}
```

---

### 2. ClientModal (Default Export)

```typescript
import ClientModal from '@/components/comercial/modals/ClientModal';
import { Client, ClientFormData } from '@/lib/types/clients';

// Props Interface
interface ClientModalProps {
  client?: Client | null;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  initialData?: Partial<ClientFormData>;  // Dados pré-preenchidos
}

// Exemplo de Uso
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const { createClient } = useClients();

  const handleCreate = async (data: ClientFormData) => {
    await createClient(data);
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Novo Cliente</Button>

      {showModal && (
        <ClientModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          initialData={{
            name: 'João Silva',
            email: 'joao@example.com',
          }}
        />
      )}
    </>
  );
}
```

**Campos do Formulário:**

```typescript
{
  type: 'individual' | 'company';  // ✅ Obrigatório - Radio
  name: string;                    // ✅ Obrigatório
  email?: string;                  // Opcional
  phone?: string;                  // Opcional
  document: string;                // ✅ Obrigatório - CPF/CNPJ
  address?: {                      // Opcional - Seção expandível
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  tags?: string[];                 // Opcional
}
```

---

### 3. ProjectModal (Default Export)

```typescript
import ProjectModal from '@/components/comercial/modals/ProjectModal';
import { Project, ProjectFormData } from '@/lib/types/projects';
import { Client } from '@/lib/types/clients';

// Props Interface
interface ProjectModalProps {
  project?: Project | null;
  clients: Client[];           // ⚠️ OBRIGATÓRIO - Lista de clientes
  users?: User[];              // Opcional - Lista de usuários para team
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

// Exemplo de Uso
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const { clients } = useClients();
  const { createProject } = useProjects();

  const handleCreate = async (data: ProjectFormData) => {
    await createProject(data);
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Novo Projeto</Button>

      {showModal && (
        <ProjectModal
          clients={clients}  // ⚠️ Passar lista de clientes
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  );
}
```

**Campos do Formulário:**

```typescript
{
  name: string;                    // ✅ Obrigatório
  description?: string;            // Opcional - Textarea
  clientId: string;                // ✅ Obrigatório - Select
  status: ProjectStatus;           // ✅ Obrigatório - Select
  priority: ProjectPriority;       // ✅ Obrigatório - Select
  startDate: Date;                 // ✅ Obrigatório - DatePicker
  endDate?: Date;                  // Opcional - DatePicker
  budget?: number;                 // Opcional
  teamMembers: ProjectMember[];    // ✅ Obrigatório - Multi-select
  notes?: string;                  // Opcional - Textarea
  tags?: string[];                 // Opcional
}
```

---

### 4. BudgetModal (Default Export)

```typescript
import BudgetModal from '@/components/comercial/modals/BudgetModal';
import { Budget, BudgetFormData, BudgetItem } from '@/lib/types/budgets';
import { Client } from '@/lib/types/clients';

// Props Interface
interface BudgetModalProps {
  budget?: Budget | null;
  clients: Client[];           // ⚠️ OBRIGATÓRIO
  projects?: Project[];        // Opcional
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => Promise<void>;
}

// Exemplo de Uso
function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const { clients } = useClients();
  const { projects } = useProjects();
  const { createBudget } = useBudgets();

  const handleCreate = async (data: BudgetFormData) => {
    await createBudget(data);
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Novo Orçamento</Button>

      {showModal && (
        <BudgetModal
          clients={clients}
          projects={projects}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  );
}
```

**Campos do Formulário:**

```typescript
{
  clientId: string;            // ✅ Obrigatório - Select
  projectId?: string;          // Opcional - Select
  items: BudgetItem[];          // ✅ Obrigatório - Tabela dinâmica
  discount: number;            // Padrão: 0
  tax: number;                 // Padrão: 0
  validUntil: Date;            // ✅ Obrigatório - DatePicker
  notes?: string;              // Opcional - Textarea
  terms?: string;              // Opcional - Textarea
}

// BudgetItem Structure
interface BudgetItem {
  id: string;                  // UUID gerado
  description: string;         // ✅ Obrigatório
  quantity: number;            // ✅ Obrigatório - Min: 1
  unitPrice: number;           // ✅ Obrigatório - Min: 0
  total: number;               // Calculado: quantity * unitPrice
  notes?: string;              // Opcional
}
```

---

## 📊 CHARTS (Gráficos)

### 1. RevenueChart (Receita)

```typescript
import { RevenueChart } from '@/components/comercial/charts/RevenueChart';
import { RevenueData } from '@/lib/types/metrics';

// Props
interface RevenueChartProps {
  data: RevenueData[];
  height?: number;  // Padrão: 300
}

// Exemplo
const data: RevenueData[] = [
  { period: 'Jan', revenue: 50000, expenses: 30000, profit: 20000 },
  { period: 'Fev', revenue: 60000, expenses: 35000, profit: 25000 },
  { period: 'Mar', revenue: 55000, expenses: 32000, profit: 23000 },
];

<RevenueChart data={data} height={400} />
```

---

### 2. FunnelChart (Funil de Vendas)

```typescript
import { FunnelChart } from '@/components/comercial/charts/FunnelChart';
import { FunnelData } from '@/lib/types/metrics';
import { LeadStatus } from '@/lib/types/leads';

// Props
interface FunnelChartProps {
  data: FunnelData[];
  height?: number;  // Padrão: 400
}

// Exemplo
const data: FunnelData[] = [
  {
    status: 'primeiro_contato' as LeadStatus,
    count: 100,
    value: 500000,
    percentage: 100,
  },
  {
    status: 'qualificado' as LeadStatus,
    count: 75,
    value: 375000,
    percentage: 75,
  },
  {
    status: 'proposta_enviada' as LeadStatus,
    count: 50,
    value: 250000,
    percentage: 50,
  },
];

<FunnelChart data={data} />
```

---

### 3. DonutChart (Gráfico de Rosca)

```typescript
import { DonutChart } from '@/components/comercial/charts/DonutChart';
import { DonutData } from '@/lib/types/metrics';

// Props
interface DonutChartProps {
  data: DonutData[];
  title: string;
  height?: number;  // Padrão: 300
}

// Exemplo
const data: DonutData[] = [
  { name: 'Website', value: 45, color: '#3b82f6', percentage: 45 },
  { name: 'Redes Sociais', value: 30, color: '#10b981', percentage: 30 },
  { name: 'Indicação', value: 25, color: '#f59e0b', percentage: 25 },
];

<DonutChart
  data={data}
  title="Leads por Fonte"
  height={350}
/>
```

---

## 📋 LISTAS (Tabelas/Cards)

### 1. LeadCard

```typescript
import { LeadCard } from '@/components/comercial/cards/LeadCard';
import { Lead, LeadStatus } from '@/lib/types/leads';

// Props
interface LeadCardProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: LeadStatus) => void;
  onConvert?: () => void;  // Opcional
}

// Exemplo
{leads.map(lead => (
  <LeadCard
    key={lead.id}
    lead={lead}
    onEdit={() => handleEdit(lead)}
    onDelete={() => handleDelete(lead.id!)}
    onStatusChange={(status) => handleStatusChange(lead.id!, status)}
    onConvert={() => handleConvert(lead)}
  />
))}
```

---

### 2. ClientList

```typescript
import { ClientList } from '@/components/comercial/ClientList';
import { Client } from '@/lib/types/clients';

// Props
interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onView?: (client: Client) => void;  // Opcional
}

// Exemplo
<ClientList
  clients={clients}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={(client) => router.push(`/crm/clients/${client.id}`)}
/>
```

---

### 3. ProjectList

```typescript
import { ProjectList } from '@/components/comercial/ProjectList';
import { Project } from '@/lib/types/projects';

// Props
interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onUpdateStatus?: (projectId: string, status: ProjectStatus) => void;
  onUpdateProgress?: (projectId: string, progress: number) => void;
}

// Exemplo
<ProjectList
  projects={projects}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onUpdateStatus={handleUpdateStatus}
  onUpdateProgress={handleUpdateProgress}
/>
```

---

### 4. BudgetList

```typescript
import { BudgetList } from '@/components/comercial/BudgetList';
import { Budget } from '@/lib/types/budgets';

// Props
interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
  onGeneratePDF: (budgetId: string) => void;
  onUpdateStatus?: (budgetId: string, status: BudgetStatus) => void;
}

// Exemplo
<BudgetList
  budgets={budgets}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onGeneratePDF={handleGeneratePDF}
  onUpdateStatus={handleUpdateStatus}
/>
```

---

## 🎯 KPICards (Métricas)

```typescript
import { KPICards } from '@/components/comercial/KPICards';

// Props
interface KPICardsProps {
  revenue: number;           // Receita total
  leads: number;             // Total de leads
  budgets: number;            // Total de orçamentos
  conversionRate: number;    // Taxa de conversão (%)
}

// Exemplo
<KPICards
  revenue={150000}
  leads={45}
  budgets={12}
  conversionRate={23.5}
/>
```

---

## 🎨 UI Components (Shadcn/Radix)

### Button

```typescript
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

---

### Select

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Input

```typescript
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Digite algo..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

<Input type="email" placeholder="email@example.com" />
<Input type="number" min={0} max={100} />
<Input type="date" />
```

---

### Textarea

```typescript
import { Textarea } from '@/components/ui/textarea';

<Textarea
  placeholder="Digite suas observações..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={4}
/>
```

---

## ⚠️ ARMADILHAS COMUNS

### 1. Imports Incorretos

```typescript
// ❌ ERRADO
import LeadModal from '@/components/comercial/modals/LeadModal';

// ✅ CORRETO
import { LeadModal } from '@/components/comercial/modals/LeadModal';
```

### 2. Props Obrigatórias Faltando

```typescript
// ❌ ERRADO - Faltando 'clients'
<ProjectModal
  onClose={() => setShowModal(false)}
  onSubmit={handleCreate}
/>

// ✅ CORRETO
<ProjectModal
  clients={clients}  // ⚠️ Obrigatório!
  onClose={() => setShowModal(false)}
  onSubmit={handleCreate}
/>
```

### 3. Timestamps vs Date

```typescript
// ❌ ERRADO - Passar Date para Timestamp
const lead: Lead = {
  createdAt: new Date(),  // ❌
};

// ✅ CORRETO
import { Timestamp } from 'firebase/firestore';

const lead: Lead = {
  createdAt: Timestamp.now(),  // ✅
};
```

### 4. Status Inválidos

```typescript
// ❌ ERRADO
lead.status = 'new';  // Não existe!
lead.status = 'closedWon';  // Não existe!

// ✅ CORRETO
lead.status = 'primeiro_contato';
lead.status = 'fechado_ganho';
```

---

## 📋 CHECKLIST DE COMPONENTES

Ao criar/usar um componente, verificar:

- [ ] Import correto (default vs named)?
- [ ] Todas as props obrigatórias passadas?
- [ ] Tipos corretos (Timestamp, enums)?
- [ ] Handlers de eventos definidos?
- [ ] Loading states implementados?
- [ ] Error handling presente?
- [ ] Acessibilidade (a11y) considerada?

---

> **💡 DICA:** Sempre consulte este guia antes de usar um componente!
