# 🎯 ROADMAP COMPLETO - SISTEMA DDM

**Versão:** 3.0 Final Integrada  
**Data de Criação:** 18 de outubro de 2025  
**Estimativa Total:** 15-21 semanas (≈ 4-5 meses)  
**Documento Base:** Consolidação de toda documentação existente

---

## 📋 ÍNDICE

1. [Visão Executiva](#-visão-executiva)
2. [Status Atual](#-status-atual)
3. [Problemas Críticos](#-problemas-críticos)
4. [Roadmap Detalhado](#️-roadmap-detalhado)
5. [Cronograma](#-cronograma)
6. [Próximos Passos](#-próximos-passos)
7. [Estrutura de Arquivos](#-estrutura-de-arquivos)
8. [Referências](#-referências)

---

## 📊 VISÃO EXECUTIVA

### Sistema DDM - Plataforma Completa de Gestão Empresarial

**6 MÓDULOS PRINCIPAIS:**

| Módulo                 | Funcionalidades                              | Status | Prioridade |
| ---------------------- | -------------------------------------------- | ------ | ---------- |
| 🏢 **Comercial (CRM)** | Leads, Budgets, Projects, Clients, Dashboard | 🟡 70% | 🔴 CRÍTICA |
| 🎨 **Produção**        | Queue, Proofs, Quality, Dashboard            | ⚪ 0%  | 🟠 ALTA    |
| 💰 **Financeiro**      | Invoices, Payments, Reports, Dashboard       | ⚪ 0%  | 🟠 ALTA    |
| 🛒 **Compras**         | Suppliers, Purchases, Dashboard              | ⚪ 0%  | 🟡 MÉDIA   |
| 🚚 **Logística**       | Shipments, Tracking, Dashboard               | ⚪ 0%  | 🟡 MÉDIA   |
| 📣 **Marketing**       | Campaigns, Creatives, Dashboard              | ⚪ 0%  | 🟢 BAIXA   |

**Total de Funcionalidades:** 22 áreas principais  
**Estimativa de Conclusão:** 15-20 semanas (3,5-5 meses)

---

## ✅ STATUS ATUAL

### **1. INFRAESTRUTURA (100%)**

**Backend (Firebase)**

- ✅ Firebase configurado (região São Paulo - `southamerica-east1`)
- ✅ Firestore Database
- ✅ Authentication
- ✅ Cloud Functions estruturadas
- ✅ Storage configurado

**Frontend (Next.js 14)**

- ✅ Next.js com App Router
- ✅ TypeScript 5.x
- ✅ Tailwind CSS + Shadcn UI
- ✅ Estrutura de pastas definida
- ✅ Sistema de rotas

### **2. TIPOS TYPESCRIPT (100%)**

**Interfaces Completas:**

- ✅ `Lead` - Prospecção comercial
- ✅ `Client` - Base de clientes (PF e PJ)
- ✅ `Budget` - Orçamentos (migrado de Quote)
- ✅ `Book` - Catálogo de livros
- ✅ `Order` - Pedidos de venda
- ✅ `ProductionProject` - Projetos em produção
- ✅ `Project` - Projetos CRM
- ✅ Enums de status (LeadStatus, BudgetStatus, etc)
- ✅ Tipos de formulários (LeadFormData, BudgetFormData)

### **3. HOOKS FIREBASE (100%)**

**Hooks Implementados:**

- ✅ `useAuth.ts` - Autenticação
- ✅ `useLeads.ts` - CRUD de leads
- ✅ `useClients.ts` - CRUD de clientes
- ✅ `useBudgets.ts` - CRUD de orçamentos
- ✅ `useProjects.ts` - CRUD de projetos
- ✅ `useFirestore.ts` - Hook genérico

### **4. MÓDULO COMERCIAL (70%)**

**✅ Páginas Criadas:**

- ✅ `/crm/leads` - Lista de leads
- ✅ `/crm/leads/[id]` - Detalhes do lead
- ✅ `/crm/clients` - Lista de clientes
- ✅ `/crm/projects` - Lista de projetos
- ✅ `//budgets` - Lista de orçamentos

**✅ Componentes Básicos:**

- ✅ `LeadModal` - Criar/editar leads
- ✅ `ClientModal` - Criar/editar clientes
- ✅ `ProjectModal` - Criar/editar projetos
- ✅ `LeadCard` - Card de exibição
- ✅ Cards de KPI básicos

**🟡 Componentes Incompletos:**

- 🟡 `BudgetModal` - Falta formulário completo de itens
- 🟡 Dashboard Comercial - Apenas estrutura básica
- ❌ Detalhes do Budget (`//budgets/[id]`)
- ❌ Gestão de Books (catálogo)
- ❌ Gestão de Orders (pedidos)

### **5. CLOUD FUNCTIONS (100%)**

**Functions Implementadas:**

- ✅ `onBudgetSigned` - Trigger de aprovação
  - Cria Cliente automaticamente
  - Cria Book (catálogo)
  - Cria Order (pedido)
  - Cria ProductionProject
  - Gera números sequenciais
- ✅ Geração de PDF de orçamentos
- ✅ Sistema de numeração automática

---

## 🔴 PROBLEMAS CRÍTICOS

### **IMPEDEM FUNCIONAMENTO - RESOLVER URGENTE**

#### **1. Nomenclatura Inconsistente**

```typescript
// ❌ PROBLEMA: Código usa onSave mas deveria ser onSubmit
<BudgetModal onSave={handleCreate} />

// ✅ SOLUÇÃO: Padronizar para onSubmit
<BudgetModal onSubmit={handleCreate} />
```

**Arquivos Afetados:**

- `src/components/comercial/modals/BudgetModal.tsx`
- `src/app/(app)//budgets/page.tsx`
- `src/hooks/comercial/useBudgets.ts`

**Ação:** Trocar todas as ocorrências de `onSave` por `onSubmit`

---

#### **2. Status Budget Inconsistente**

```typescript
// ❌ PROBLEMA: Código usa "approved" mas doc oficial usa "signed"
status: "approved" // ERRADO

// ✅ SOLUÇÃO: Usar apenas "signed"
status: "signed" // CORRETO
```

**Ação:** Padronizar para `"signed"` em todo o código

---

#### **3. BudgetModal Incompleto**

**Faltam:**

- ❌ Formulário de Serviços Editoriais
- ❌ Formulário de Impressão
- ❌ Formulário de Extras
- ❌ Cálculo automático de subtotais
- ❌ Validação de campos obrigatórios

**Ação:** Implementar todos os formulários de itens

---

#### **4. Fluxos Não Testados**

**Nunca foram testados:**

- ❌ Conversão Lead → Cliente
- ❌ Aprovação Budget → Criação automática
- ❌ Fluxo end-to-end completo

**Ação:** Testar fluxo completo antes de continuar

---

## 🗺️ ROADMAP DETALHADO

---

## 📅 FASE 0: CORREÇÕES URGENTES

**⏱️ Duração:** 3 dias  
**🎯 Objetivo:** Resolver problemas críticos que impedem funcionamento

### **Tarefa 0.1: Padronizar Nomenclaturas** (1 dia)

**Arquivos:**

```
src/components/comercial/modals/BudgetModal.tsx
src/app/(app)//budgets/page.tsx
src/hooks/comercial/useBudgets.ts
```

**Checklist:**

- [ ] Substituir `onSave` → `onSubmit` em todos os modais
- [ ] Padronizar status para `"signed"` (remover "approved")
- [ ] Verificar todos os imports/exports
- [ ] Atualizar documentação

**Critério de Aceitação:**

- ✅ Zero referências a `onSave`
- ✅ Apenas status válidos em uso
- ✅ Testes unitários passando

---

### **Tarefa 0.2: Verificar Compilação** (0.5 dia)

**Checklist:**

- [ ] `npm run build` sem erros
- [ ] `npm run type-check` sem erros
- [ ] `npm run lint` sem erros críticos
- [ ] Navegação entre páginas funcionando

---

### **Tarefa 0.3: Tirar Print do Firestore** (0.5 dia)

**Objetivo:** Documentar estado atual do banco

**Coleções a verificar:**

- [ ] `leads`
- [ ] `clients`
- [ ] `budgets`
- [ ] `books`
- [ ] `orders`
- [ ] `productionProjects`
- [ ] `projects`

**Entregar:** Screenshots + lista de documentos por coleção

---

## 📅 FASE 1: ESTABILIZAÇÃO

**⏱️ Duração:** 1-2 semanas  
**🎯 Objetivo:** Completar MVP Comercial funcional

---

### **Tarefa 1.1: Completar BudgetModal** (3 dias)

**Arquivo:** `src/components/comercial/modals/BudgetModal.tsx`

#### **1.1.1 Seção de Serviços Editoriais**

**Interface:**

```typescript
interface EditorialServiceItem {
  id: string;
  type: "editorial_service";
  service: EditorialServiceType;
  customService?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  estimatedDays?: number;
  notes?: string;
}

enum EditorialServiceType {
  REVISION = "Revisão",
  PREPARATION = "Preparação",
  COPYEDIT = "Copidesque",
  GRAPHIC_DESIGN = "Criação do projeto gráfico",
  LAYOUT = "Diagramação",
  COVER = "Capa",
  EBOOK_FORMAT = "Formatação eBook",
  KINDLE_CONVERSION = "Conversão Kindle",
  ISBN = "ISBN",
  CATALOG_CARD = "Ficha Catalográfica",
  CUSTOM = "Personalizado",
}
```

**Campos do Formulário:**

- [ ] Select: Tipo de serviço (enum acima)
- [ ] Input condicional: Se CUSTOM, mostrar campo texto
- [ ] Textarea: Descrição do serviço
- [ ] Number: Quantidade (ex: 300 páginas)
- [ ] Currency: Preço unitário (R$/página)
- [ ] Number (readonly): Total calculado automaticamente
- [ ] Number: Dias estimados (opcional)
- [ ] Textarea: Observações (opcional)

**Validações:**

- Serviço obrigatório
- Se CUSTOM, customService obrigatório
- Quantidade > 0
- UnitPrice > 0

---

#### **1.1.2 Seção de Impressão**

**Interface:**

```typescript
interface PrintingItem {
  id: string;
  type: "printing";
  description: string;
  printRun: number; // tiragem
  useBookSpecs: boolean;
  customSpecs?: Partial<BookSpecifications>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productionDays?: number;
  notes?: string;
}
```

**Campos do Formulário:**

- [ ] Number: Tiragem (quantidade de exemplares)
- [ ] Checkbox: Usar especificações do Book?
- [ ] Condicional: Se `useBookSpecs = false`, mostrar:
  - Select: Formato (14x21, 15x23, 16x23, A4, A5)
  - Number: Número de páginas
  - Select: Papel miolo (Offset 75g, 90g, Polen 80g, 90g)
  - Select: Papel capa (Cartão 250g, 300g, Supremo)
  - Select: Acabamento (Brochura, Capa dura, Wire-o)
  - Select: Impressão (P&B, Colorido, P&B+Capa Color)
- [ ] Currency: Preço unitário
- [ ] Number (readonly): Total = printRun × unitPrice
- [ ] Number: Dias de produção
- [ ] Textarea: Observações

**Validações:**

- Tiragem > 0
- Se useBookSpecs = false, todos os specs obrigatórios
- UnitPrice > 0

---

#### **1.1.3 Seção de Extras**

**Interface:**

```typescript
interface ExtraItem {
  id: string;
  type: "extra";
  extraType: ExtraType;
  customExtra?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

enum ExtraType {
  PROOFS = "Provas",
  SHIPPING = "Frete",
  CUSTOM = "Personalizado",
}
```

**Campos do Formulário:**

- [ ] Select: Tipo de extra
- [ ] Input condicional: Se CUSTOM, campo texto
- [ ] Textarea: Descrição
- [ ] Number: Quantidade
- [ ] Currency: Preço unitário
- [ ] Number (readonly): Total calculado
- [ ] Textarea: Observações

---

#### **1.1.4 Layout do BudgetModal**

**Estrutura:**

```tsx
<Dialog open={isOpen} onClose={onClose}>
  <DialogHeader>
    <DialogTitle>
      {mode === 'create' ? 'Novo Orçamento' : 'Editar Orçamento'}
    </DialogTitle>
  </DialogHeader>

  <form onSubmit={handleSubmit}>
    {/* SEÇÃO 1: DADOS BÁSICOS */}
    <section className="space-y-4">
      <h3>Dados Básicos</h3>

      {/* Lead OU Cliente (apenas um) */}
      <div className="grid grid-cols-2 gap-4">
        <Select label="Lead" />
        <Select label="Cliente" />
      </div>

      {/* Tipo de Projeto */}
      <Select label="Tipo de Projeto" options={ProjectCatalogType} />

      {/* Dados Temporários do Projeto */}
      <Input label="Título do Projeto" />
      <Input label="Subtítulo" />
      <Input label="Autor" />
      <Input label="Páginas Estimadas" type="number" />
    </section>

    {/* SEÇÃO 2: ITENS DO ORÇAMENTO */}
    <section className="space-y-4">
      <h3>Itens do Orçamento</h3>

      {/* Tabs para tipos de item */}
      <Tabs>
        <TabsList>
          <TabsTrigger value="editorial">Serviços Editoriais</TabsTrigger>
          <TabsTrigger value="printing">Impressão</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>

        <TabsContent value="editorial">
          <EditorialServiceForm onAdd={handleAddEditorialItem} />
        </TabsContent>

        <TabsContent value="printing">
          <PrintingForm onAdd={handleAddPrintingItem} />
        </TabsContent>

        <TabsContent value="extras">
          <ExtraForm onAdd={handleAddExtraItem} />
        </TabsContent>
      </Tabs>

      {/* Lista de itens adicionados */}
      <BudgetItemsList
        items={items}
        onRemove={handleRemoveItem}
        onEdit={handleEditItem}
      />
    </section>

    {/* SEÇÃO 3: RESUMO E CONDIÇÕES */}
    <section className="space-y-4">
      <h3>Resumo e Condições</h3>

      {/* Resumo financeiro */}
      <div className="bg-slate-100 p-4 rounded-lg">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span>Desconto:</span>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="%"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
            />
            <span>ou</span>
            <Input
              type="number"
              placeholder="R$"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between text-lg">
          <span className="font-bold">TOTAL:</span>
          <span className="font-bold text-green-600">
            R$ {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Condições comerciais */}
      <MultiSelect
        label="Formas de Pagamento"
        options={['PIX', 'Cartão', 'Boleto', 'Transferência']}
        value={paymentMethods}
        onChange={setPaymentMethods}
      />

      <Input
        label="Validade (dias)"
        type="number"
        value={validityDays}
        onChange={(e) => setValidityDays(e.target.value)}
      />

      <Input
        label="Prazo de Produção (dias)"
        type="number"
        value={productionDays}
        onChange={(e) => setProductionDays(e.target.value)}
      />

      <Checkbox
        label="Cliente fornecerá material?"
        checked={clientProvidedMaterial}
        onChange={(e) => setClientProvidedMaterial(e.target.checked)}
      />

      {clientProvidedMaterial && (
        <Textarea
          label="Descrição do Material"
          value={materialDescription}
          onChange={(e) => setMaterialDescription(e.target.value)}
        />
      )}

      <Textarea
        label="Observações"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </section>

    {/* FOOTER */}
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Orçamento'}
      </Button>
    </DialogFooter>
  </form>
</Dialog>
```

---

#### **1.1.5 Cálculos Automáticos**

**Funções:**

```typescript
// Calcular total de um item
function calculateItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

// Calcular subtotal (soma de todos os itens)
function calculateSubtotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

// Calcular total com desconto
function calculateTotal(
  subtotal: number,
  discount?: number,
  discountPercentage?: number
): number {
  if (discountPercentage) {
    return subtotal * (1 - discountPercentage / 100);
  }
  if (discount) {
    return subtotal - discount;
  }
  return subtotal;
}
```

**Atualização em Tempo Real:**

```typescript
// Sempre que quantity ou unitPrice mudar
useEffect(() => {
  const newTotal = calculateItemTotal(quantity, unitPrice);
  setTotalPrice(newTotal);
}, [quantity, unitPrice]);

// Sempre que items mudar
useEffect(() => {
  const newSubtotal = calculateSubtotal(items);
  setSubtotal(newSubtotal);
}, [items]);

// Sempre que subtotal, discount ou discountPercentage mudar
useEffect(() => {
  const newTotal = calculateTotal(subtotal, discount, discountPercentage);
  setTotal(newTotal);
}, [subtotal, discount, discountPercentage]);
```

---

#### **1.1.6 Validações**

**Antes de submeter:**

```typescript
function validateBudgetForm(data: BudgetFormData): string[] {
  const errors: string[] = [];

  // Lead OU Cliente obrigatório
  if (!data.leadId && !data.clientId) {
    errors.push('Selecione um Lead ou Cliente');
  }

  // Não pode ter ambos
  if (data.leadId && data.clientId) {
    errors.push('Selecione apenas Lead OU Cliente, não ambos');
  }

  // Pelo menos 1 item
  if (!data.items || data.items.length === 0) {
    errors.push('Adicione pelo menos 1 item ao orçamento');
  }

  // Validar cada item
  data.items.forEach((item, index) => {
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantidade deve ser maior que 0`);
    }
    if (item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Preço unitário deve ser maior que 0`);
    }
  });

  // Formas de pagamento
  if (!data.paymentMethods || data.paymentMethods.length === 0) {
    errors.push('Selecione pelo menos 1 forma de pagamento');
  }

  // Validade
  if (!data.validityDays || data.validityDays <= 0) {
    errors.push('Informe a validade do orçamento');
  }

  return errors;
}
```

**Exibir erros:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const errors = validateBudgetForm(formData);

  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return;
  }

  await onSubmit(formData);
};
```

---

### **Tarefa 1.2: Criar Página de Detalhes do Budget** (2 dias)

**Arquivo:** `src/app/(app)//budgets/[id]/page.tsx`

**Estrutura Completa:**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBudgets } from '@/hooks/comercial/useBudgets';
import { Budget, BudgetStatus } from '@/lib/types/budgets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Mail,
  Edit,
  Copy,
  Trash2,
  Check,
  X
} from 'lucide-react';

export default function BudgetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getBudgetById, approveBudget, rejectBudget, deleteBudget } = useBudgets();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudget();
  }, [params.id]);

  const loadBudget = async () => {
    try {
      const data = await getBudgetById(params.id as string);
      setBudget(data);
    } catch (error) {
      toast.error('Erro ao carregar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Aprovar este orçamento?')) return;

    try {
      await approveBudget(budget!.id!);
      toast.success('Orçamento aprovado! Criando Cliente, Book, Order...');
      router.push('//budgets');
    } catch (error) {
      toast.error('Erro ao aprovar orçamento');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Rejeitar este orçamento?')) return;

    try {
      await rejectBudget(budget!.id!);
      toast.success('Orçamento rejeitado');
      loadBudget();
    } catch (error) {
      toast.error('Erro ao rejeitar orçamento');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!budget) return <div>Orçamento não encontrado</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Orçamento #{budget.number}</h1>
          <p className="text-slate-500">
            Versão {budget.version}
          </p>
        </div>

        <div className="flex gap-2">
          <StatusBadge status={budget.status} />

          {budget.status === 'sent' && (
            <>
              <Button
                variant="success"
                onClick={handleApprove}
              >
                <Check className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
              >
                <X className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </>
          )}

          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Gerar PDF
          </Button>

          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>

          {budget.status === 'draft' && (
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}

          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>

          <Button variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* INFORMAÇÕES PRINCIPAIS */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informações</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-slate-500">Emissão</span>
            <p className="font-medium">
              {budget.issueDate.toDate().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Validade</span>
            <p className="font-medium">
              {budget.expiryDate.toDate().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Cliente/Lead</span>
            <p className="font-medium">
              {budget.clientId ? (
                <Link href={`/crm/clients/${budget.clientId}`}>
                  Ver Cliente
                </Link>
              ) : (
                <Link href={`/crm/leads/${budget.leadId}`}>
                  Ver Lead
                </Link>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* TABELA DE ITENS */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Itens do Orçamento</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Descrição</th>
              <th className="text-right p-2">Qtd</th>
              <th className="text-right p-2">Valor Unit.</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {budget.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <Badge variant="outline">
                    {item.type === 'editorial_service' ? 'Serviço' :
                     item.type === 'printing' ? 'Impressão' : 'Extra'}
                  </Badge>
                </td>
                <td className="p-2">{item.description}</td>
                <td className="text-right p-2">{item.quantity}</td>
                <td className="text-right p-2">
                  R$ {item.unitPrice.toFixed(2)}
                </td>
                <td className="text-right p-2 font-medium">
                  R$ {item.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* RESUMO FINANCEIRO */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Resumo</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">
              R$ {budget.subtotal.toFixed(2)}
            </span>
          </div>

          {budget.discount && (
            <div className="flex justify-between text-red-600">
              <span>Desconto:</span>
              <span>- R$ {budget.discount.toFixed(2)}</span>
            </div>
          )}

          {budget.discountPercentage && (
            <div className="flex justify-between text-red-600">
              <span>Desconto ({budget.discountPercentage}%):</span>
              <span>
                - R$ {(budget.subtotal * budget.discountPercentage / 100).toFixed(2)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-xl font-bold text-green-600">
            <span>TOTAL:</span>
            <span>R$ {budget.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t space-y-2">
          <div>
            <span className="text-sm text-slate-500">Formas de Pagamento:</span>
            <p>{budget.paymentMethods.join(', ')}</p>
          </div>
          <div>
            <span className="text-sm text-slate-500">Prazo de Produção:</span>
            <p>{budget.productionDays} dias</p>
          </div>
        </div>
      </Card>

      {/* INFORMAÇÕES ADICIONAIS */}
      {(budget.clientProvidedMaterial || budget.notes) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Observações</h2>

          {budget.clientProvidedMaterial && (
            <div className="mb-4">
              <span className="text-sm font-medium">Material fornecido pelo cliente:</span>
              <p className="text-slate-600">{budget.materialDescription}</p>
            </div>
          )}

          {budget.notes && (
            <div>
              <span className="text-sm font-medium">Observações gerais:</span>
              <p className="text-slate-600">{budget.notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* HISTÓRICO */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Histórico</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Criado em:</span>
            <span>
              {budget.createdAt.toDate().toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Última atualização:</span>
            <span>
              {budget.updatedAt.toDate().toLocaleString('pt-BR')}
            </span>
          </div>
          {budget.approvalDate && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Aprovado em:</span>
              <span className="text-green-600">
                {budget.approvalDate.toDate().toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
```

**Componente StatusBadge:**

```tsx
// components/comercial/StatusBadge.tsx
export function StatusBadge({ status }: { status: BudgetStatus }) {
  const variants = {
    draft: { color: 'slate', label: 'Rascunho' },
    sent: { color: 'blue', label: 'Enviado' },
    signed: { color: 'green', label: 'Aprovado' },
    rejected: { color: 'red', label: 'Rejeitado' },
    expired: { color: 'orange', label: 'Expirado' },
  };

  const { color, label } = variants[status];

  return (
    <Badge variant={color}>
      {label}
    </Badge>
  );
}
```

---

### **Tarefa 1.3: Testar Fluxo End-to-End** (1 dia)

**Cenário de Teste Completo:**

#### **Passo 1: Criar Lead**

- [ ] Ir em `/crm/leads`
- [ ] Clicar em "Novo Lead"
- [ ] Preencher:
  - Nome: "João da Silva"
  - Email: "joao@email.com"
  - Telefone: "(11) 99999-9999"
  - Origem: "Indicação"
  - Status: "primeiro_contato"
  - Interesse: "Publicar livro de ficção"
- [ ] Salvar
- [ ] Verificar apareceu na lista

#### **Passo 2: Qualificar Lead**

- [ ] Abrir detalhes do lead criado
- [ ] Mudar status para "qualificado"
- [ ] Adicionar observação: "Cliente tem interesse real"
- [ ] Salvar
- [ ] Verificar atualização

#### **Passo 3: Converter em Cliente**

- [ ] Clicar em "Converter em Cliente"
- [ ] Preencher dados adicionais:
  - Tipo: Pessoa Física
  - CPF: 123.456.789-00
  - Endereço completo
- [ ] Salvar
- [ ] **VERIFICAR:** Cliente criado com `clientNumber` automático
- [ ] **VERIFICAR:** Lead marcado com `clientId`

#### **Passo 4: Criar Budget**

- [ ] Ir em `/budgets`
- [ ] Clicar em "Novo Orçamento"
- [ ] Selecionar o cliente "João da Silva"
- [ ] Tipo de projeto: "Livro Impresso"
- [ ] Dados do projeto:
  - Título: "As Aventuras de João"
  - Autor: "João da Silva"
  - Páginas: 200

**Adicionar Serviço Editorial:**

- [ ] Aba "Serviços Editoriais"
- [ ] Serviço: Revisão
- [ ] Descrição: "Revisão ortográfica e gramatical"
- [ ] Quantidade: 200 (páginas)
- [ ] Preço unitário: R$ 5,00
- [ ] **VERIFICAR:** Total = R$ 1.000,00
- [ ] Clicar "Adicionar"

**Adicionar Impressão:**

- [ ] Aba "Impressão"
- [ ] Tiragem: 100 exemplares
- [ ] Não usar specs do book (customizar)
- [ ] Formato: 14x21
- [ ] Páginas: 200
- [ ] Papel miolo: Offset 75g
- [ ] Papel capa: Cartão 250g
- [ ] Acabamento: Brochura
- [ ] Impressão: P&B
- [ ] Preço unitário: R$ 15,00
- [ ] **VERIFICAR:** Total = R$ 1.500,00
- [ ] Clicar "Adicionar"

**Adicionar Extra:**

- [ ] Aba "Extras"
- [ ] Tipo: Frete
- [ ] Descrição: "Frete via Correios"
- [ ] Quantidade: 1
- [ ] Preço: R$ 150,00
- [ ] **VERIFICAR:** Total = R$ 150,00
- [ ] Clicar "Adicionar"

**Resumo:**

- [ ] **VERIFICAR:** Subtotal = R$ 2.650,00
- [ ] Aplicar desconto: 10%
- [ ] **VERIFICAR:** Total = R$ 2.385,00

**Condições:**

- [ ] Formas de pagamento: PIX, Cartão
- [ ] Validade: 30 dias
- [ ] Prazo de produção: 15 dias
- [ ] Material do cliente: Não
- [ ] Observações: "Primeira impressão do cliente"

- [ ] **Salvar como RASCUNHO**
- [ ] Verificar na lista de budgets

#### **Passo 5: Enviar Budget**

- [ ] Abrir budget criado
- [ ] Clicar em "Editar"
- [ ] Mudar status para "enviado"
- [ ] Salvar
- [ ] **VERIFICAR:** Data de validade calculada automaticamente
- [ ] **VERIFICAR:** Budget aparece como "Enviado"

#### **Passo 6: Aprovar Budget** 🔥 **CRÍTICO**

- [ ] Abrir budget
- [ ] Clicar em "Aprovar"
- [ ] Confirmar
- [ ] **AGUARDAR** processamento da Cloud Function (~5-10 segundos)
- [ ] **VERIFICAR** status mudou para "signed"
- [ ] **VERIFICAR** data de aprovação preenchida

#### **Passo 7: Verificar Criações Automáticas** 🔥 **CRÍTICO**

**No Firestore Console:**

**Verificar Book:**

- [ ] Abrir coleção `books`
- [ ] Encontrar book criado
- [ ] **VERIFICAR:**
  - `catalogCode` presente (ex: "LV-0001")
  - `clientId` = ID do cliente
  - `budgetId` = ID do budget
  - `title` = "As Aventuras de João"
  - `author` = "João da Silva"
  - `specifications` preenchidas

**Verificar Order:**

- [ ] Abrir coleção `orders`
- [ ] Encontrar order criado
- [ ] **VERIFICAR:**
  - `number` presente (ex: "PED-0001")
  - `clientId` = ID do cliente
  - `budgetId` = ID do budget
  - `bookId` = ID do book criado
  - `items` = mesmo do budget
  - `total` = R$ 2.385,00
  - `status` = "pending"

**Verificar ProductionProject:**

- [ ] Abrir coleção `productionProjects`
- [ ] Encontrar projeto criado
- [ ] **VERIFICAR:**
  - `orderId` = ID do order
  - `bookId` = ID do book
  - `clientId` = ID do cliente
  - `status` = "aguardando_inicio"
  - `title` = "As Aventuras de João"

**Verificar Relacionamentos:**

```
Budget (aprovado)
  ↓
  ├─→ Client (se não existia, criado)
  ├─→ Book (criado com catalogCode)
  ├─→ Order (criado com número sequencial)
  └─→ ProductionProject (criado, status aguardando)
```

#### **Passo 8: Validação Final**

- [ ] Todos os relacionamentos corretos (IDs batem)
- [ ] Números sequenciais únicos
- [ ] Timestamps corretos
- [ ] Status corretos
- [ ] Dados copiados corretamente
- [ ] Sem erros no console do Firebase Functions

**Critérios de Sucesso:**

- ✅ Fluxo completo sem erros
- ✅ Todas as criações automáticas funcionando
- ✅ Dados consistentes entre coleções
- ✅ Números sequenciais corretos
- ✅ Timestamps corretos
- ✅ Sistema pronto para uso real

---

## 🎯 ENTREGA DA FASE 1

- ✅ BudgetModal 100% funcional
- ✅ Página de detalhes do Budget
- ✅ Fluxo end-to-end testado e validado
- ✅ Sistema estável e pronto para evolução

---

## 📅 FASE 2: COMPLETAR MÓDULO COMERCIAL

**⏱️ Duração:** 2-3 semanas  
**🎯 Objetivo:** Finalizar 100% do CRM

### **Tarefa 2.1: Gestão de Books** (3 dias)

**Página:** `src/app/(app)/crm/books/page.tsx`

**Funcionalidades:**

- [ ] Lista de todos os books (catálogo)
- [ ] Filtros: cliente, tipo, status
- [ ] Card exibindo: código, título, cliente, specs básicas
- [ ] Modal de criação/edição
- [ ] Integração com Budget e Order

**Componentes:**

```
components/comercial/books/
  ├── BooksList.tsx
  ├── BookCard.tsx
  ├── BookModal.tsx
  └── BookSpecificationsForm.tsx
```

**Hook:**

```typescript
// hooks/comercial/useBooks.ts
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => { /* ... */ };
  const createBook = async (data: BookFormData) => { /* ... */ };
  const updateBook = async (id: string, data: Partial<Book>) => { /* ... */ };
  const deleteBook = async (id: string) => { /* ... */ };

  return { books, loading, createBook, updateBook, deleteBook };
}
```

---

### **Tarefa 2.2: Gestão de Orders** (4 dias)

**Páginas:**

- `src/app/(app)/crm/orders/page.tsx` - Lista
- `src/app/(app)/crm/orders/[id]/page.tsx` - Detalhes

**Funcionalidades:**

**Lista:**

- [ ] Tabela: número, cliente, data, status, valor, ações
- [ ] Filtros: status, cliente, período, valor
- [ ] Busca por número

**Detalhes:**

- [ ] Header (número, status, cliente)
- [ ] Dados do budget/book vinculado
- [ ] Itens do pedido
- [ ] Resumo financeiro
- [ ] Gestão de pagamentos:
  - Registrar pagamento
  - Gerar boleto/link
  - Marcar como pago
  - Histórico de pagamentos
- [ ] Timeline de status
- [ ] Arquivos anexados

**Componentes:**

```
components/comercial/orders/
  ├── OrdersList.tsx
  ├── OrderCard.tsx
  ├── OrderDetails.tsx
  ├── OrderModal.tsx
  ├── PaymentModal.tsx
  └── OrderTimeline.tsx
```

**Hook:**

```typescript
// hooks/comercial/useOrders.ts
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const createOrder = async (data: OrderFormData) => { /* ... */ };
  const updateOrder = async (id: string, data: Partial<Order>) => { /* ... */ };
  const addPayment = async (orderId: string, payment: Payment) => { /* ... */ };
  const updateOrderStatus = async (id: string, status: OrderStatus) => { /* ... */ };

  return { orders, loading, createOrder, updateOrder, addPayment, updateOrderStatus };
}
```

---

### **Tarefa 2.3: Dashboard Comercial** (5 dias)

**Página:** `src/app/(app)/crm/dashboard/page.tsx`

**Seções:**

**KPIs (Topo):**

- [ ] Leads Ativos
- [ ] Taxa de Conversão
- [ ] Receita do Mês
- [ ] Budgets Pendentes

**Gráficos:**

- [ ] Funil de Vendas (visualização interativa)
- [ ] Receita (linha, evolução mensal)
- [ ] Budgets por Status (pizza/donut)
- [ ] Top Clientes (tabela)
- [ ] Projetos Críticos (lista com alertas)
- [ ] Atividades Recentes (timeline)

**Componentes:**

```
components/dashboards/comercial/
  ├── CommercialDashboard.tsx
  ├── KPICard.tsx
  ├── FunnelChart.tsx
  ├── RevenueChart.tsx
  ├── BudgetStatusChart.tsx
  ├── TopClients.tsx
  ├── CriticalProjects.tsx
  └── RecentActivities.tsx
```

**Hook:**

```typescript
// hooks/comercial/useCommercialMetrics.ts
export function useCommercialMetrics() {
  const [metrics, setMetrics] = useState<CommercialMetrics>({});
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    // Buscar dados do Firestore
    // Calcular KPIs
    // Processar para gráficos
  };

  return { metrics, loading, fetchMetrics };
}
```

---

### **Tarefa 2.4: Sistema de Notificações** (3 dias)

**Tipos de Notificações:**

- [ ] Novo lead atribuído
- [ ] Budget prestes a expirar
- [ ] Budget aprovado/rejeitado
- [ ] Novo comentário
- [ ] Pagamento recebido
- [ ] Projeto atrasado

**Componente:**

```tsx
// components/layout/NotificationCenter.tsx
<NotificationCenter>
  <NotificationBell count={unreadCount} />
  <NotificationList>
    {notifications.map(notif => (
      <NotificationItem
        key={notif.id}
        notification={notif}
        onClick={handleClick}
        onDismiss={handleDismiss}
      />
    ))}
  </NotificationList>
</NotificationCenter>
```

**Cloud Function:**

```typescript
// functions/src/notifications/sendNotification.ts
export const sendNotification = functions.firestore
  .document('{collection}/{docId}')
  .onCreate(async (snap, context) => {
    // Determinar tipo
    // Identificar destinatários
    // Criar em 'notifications'
    // Enviar email (opcional)
  });
```

**Hook:**

```typescript
// hooks/useNotifications.ts
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const markAsRead = async (id: string) => { /* ... */ };
  const dismissNotification = async (id: string) => { /* ... */ };
  const markAllAsRead = async () => { /* ... */ };

  return { notifications, unreadCount, markAsRead, dismissNotification, markAllAsRead };
}
```

---

## 🎯 ENTREGA DA FASE 2

- ✅ Módulo Comercial 100% completo
- ✅ Books e Orders totalmente funcionais
- ✅ Dashboard executivo com métricas
- ✅ Sistema de notificações em tempo real

---

## 📅 FASE 3: MÓDULO DE PRODUÇÃO

**⏱️ Duração:** 3-4 semanas  
**🎯 Objetivo:** Gestão completa de produção

### **Tarefa 3.1: Dashboard de Produção** (3 dias)

**KPIs:**

- Projetos em produção
- Projetos atrasados
- Taxa de aprovação de provas
- Tempo médio de produção
- Capacidade utilizada

**Gráficos:**

- Projetos por status (Kanban visual)
- Timeline de projetos
- Distribuição por tipo
- Performance por membro

---

### **Tarefa 3.2: Fila de Produção (Kanban)** (5 dias)

**Colunas:**

- Aguardando início
- Em andamento
- Aguardando prova
- Aprovado
- Finalizado

**Funcionalidades:**

- [ ] Drag & drop
- [ ] Filtros (cliente, prazo, responsável)
- [ ] Atribuição de responsáveis
- [ ] Alertas de atraso

---

### **Tarefa 3.3: Gestão de Provas** (4 dias)

**Funcionalidades:**

- [ ] Upload (PDF, imagens, InDesign)
- [ ] Versionamento automático
- [ ] Envio para cliente
- [ ] Portal de aprovação/rejeição
- [ ] Sistema de comentários
- [ ] Marcações visuais
- [ ] Histórico completo

---

### **Tarefa 3.4: Controle de Qualidade** (3 dias)

**Checklist:**

- Revisão ortográfica
- Conferência de imagens
- Verificação de margens
- Cores (CMYK)
- Fontes
- Numeração de páginas
- Quebras de linha

**Funcionalidades:**

- [ ] Registro de não conformidades
- [ ] Aprovação final
- [ ] Assinatura digital

---

### **Tarefa 3.5: Integração Produção ↔ Financeiro** (2 dias)

**Cloud Function:**

```typescript
export const onProductionComplete = functions.firestore
  .document('productionProjects/{projectId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();

    if (after.status === 'completed') {
      // Gerar fatura automaticamente
      await createInvoice({ /* ... */ });

      // Notificar financeiro
      await sendNotification({ /* ... */ });
    }
  });
```

---

## 🎯 ENTREGA DA FASE 3

- ✅ Módulo de Produção completo
- ✅ Fila visual (Kanban)
- ✅ Gestão de provas
- ✅ Controle de qualidade

---

## 📅 FASE 4: MÓDULO FINANCEIRO

**⏱️ Duração:** 2-3 semanas  
**🎯 Objetivo:** Controle financeiro completo

### **Tarefa 4.1: Dashboard Financeiro** (3 dias)

**KPIs:**

- Receita do mês
- Despesas do mês
- Lucro líquido
- Contas a receber
- Contas a pagar
- Fluxo de caixa

**Gráficos:**

- Receita vs Despesas
- Fluxo de caixa
- Despesas por categoria
- Receita por cliente

---

### **Tarefa 4.2: Gestão de Faturas** (4 dias)

**Funcionalidades:**

- [ ] Criar fatura manual
- [ ] Fatura automática (via Order)
- [ ] Geração de PDF
- [ ] Integração com gateway:
  - PIX
  - Cartão
  - Boleto
- [ ] Parcelamento
- [ ] Conciliação bancária
- [ ] Notas fiscais (opcional)

---

### **Tarefa 4.3: Contas a Receber** (2 dias)

**Funcionalidades:**

- [ ] Lista de faturas pendentes
- [ ] Alertas de vencimento
- [ ] Envio de lembrete automático
- [ ] Registro de recebimento
- [ ] Relatório de inadimplência

---

### **Tarefa 4.4: Relatórios Financeiros** (3 dias)

**Tipos:**

- [ ] DRE
- [ ] Fluxo de caixa projetado
- [ ] Receita por cliente/projeto
- [ ] Despesas por categoria
- [ ] Lucro por projeto

**Exportação:**

- PDF
- Excel
- CSV

---

### **Tarefa 4.5: Contas a Pagar** (2 dias)

**Funcionalidades:**

- [ ] Registrar despesa
- [ ] Categorias (Gráfica, Fornecedores, Salários, etc)
- [ ] Pagamento recorrente
- [ ] Anexar comprovante
- [ ] Alertas de vencimento

---

## 🎯 ENTREGA DA FASE 4

- ✅ Módulo Financeiro completo
- ✅ Faturas + Pagamentos
- ✅ Contas a receber/pagar
- ✅ Relatórios financeiros

---

## 📅 FASE 5: MÓDULOS SECUNDÁRIOS

**⏱️ Duração:** 2-3 semanas

### **Tarefa 5.1: Módulo de Compras** (5 dias)

- Cadastro de fornecedores
- Cotações de preços
- Comparação de cotações
- Ordem de compra
- Controle de estoque básico

### **Tarefa 5.2: Módulo de Logística** (5 dias)

- Cadastro de transportadoras
- Registro de envios
- Rastreamento
- Integração Correios API
- Custo de frete

### **Tarefa 5.3: Módulo de Marketing** (5 dias)

- Gestão de campanhas
- Criativos
- ROI por canal
- Tracking de leads
- Email marketing

---

## 📅 FASE 6: FUNCIONALIDADES AVANÇADAS

**⏱️ Duração:** 2-3 semanas

### **Tarefa 6.1: Sistema de Permissões (RBAC)** (3 dias)

**Perfis:**

- Admin (acesso total)
- Comercial (CRM)
- Produção (projetos, provas)
- Financeiro (faturas, relatórios)
- Cliente (portal limitado)

---

### **Tarefa 6.2: Portal do Cliente** (4 dias)

**Funcionalidades:**

- [ ] Visualizar projetos
- [ ] Acompanhar status
- [ ] Aprovar/rejeitar provas
- [ ] Comentários
- [ ] Visualizar faturas
- [ ] Download de arquivos finais

---

### **Tarefa 6.3: Busca Global** (2 dias)

**Atalho:** Cmd/Ctrl + K

**Buscar em:**

- Leads, Clientes, Projetos, Budgets, Orders, Books

**Funcionalidades:**

- Fuzzy search
- Filtros rápidos
- Histórico

---

### **Tarefa 6.4: Exportação de Relatórios** (2 dias)

**Formatos:** PDF, Excel, CSV

**Funcionalidades:**

- Exportar listas filtradas
- Agendar relatórios automáticos
- Enviar por email

---

### **Tarefa 6.5: Integração com Email** (3 dias)

**Provider:** SendGrid ou Mailgun

**Emails:**

- Envio de orçamentos
- Envio de provas
- Faturas
- Notificações
- Lembretes

---

### **Tarefa 6.6: Histórico de Atividades** (2 dias)

**Registrar:**

- Criação/edição/exclusão
- Mudança de status
- Upload de arquivos
- Envio de emails

**Funcionalidades:**

- Timeline
- Filtros
- Logs de auditoria

---

## 📅 FASE 7: TESTES E OTIMIZAÇÃO

**⏱️ Duração:** 1-2 semanas

### **Tarefa 7.1: Testes de Integração** (3 dias)

**Fluxos:**

- Lead → Cliente → Budget → Order → Produção → Entrega
- Aprovação de prova
- Geração de fatura
- Notificações
- Portal do cliente

---

### **Tarefa 7.2: Otimização** (2 dias)

**Ações:**

- Índices Firestore
- Paginação
- Lazy loading
- Cache
- Compressão de imagens

---

### **Tarefa 7.3: Segurança** (2 dias)

**Verificações:**

- Firestore Security Rules
- Validação de inputs
- Proteção XSS
- Permissões
- Criptografia

---

### **Tarefa 7.4: UX** (2 dias)

**Melhorias:**

- Loading states
- Mensagens de erro
- Feedback visual
- Responsividade
- Acessibilidade

---

## 📅 FASE 8: DEPLOY E DOCUMENTAÇÃO

**⏱️ Duração:** 1 semana

### **Tarefa 8.1: Preparação** (2 dias)

**Checklist:**

- [ ] Variáveis de ambiente
- [ ] Domínio personalizado
- [ ] SSL/HTTPS
- [ ] Backup automático
- [ ] Monitoramento (Sentry)
- [ ] Analytics

---

### **Tarefa 8.2: Deploy** (1 dia)

**Plataformas:**

- Frontend → Vercel
- Functions → Firebase
- Rules → Firebase

---

### **Tarefa 8.3: Documentação** (2 dias)

**Entregas:**

- Manual do usuário (PDF)
- Vídeos tutoriais
- FAQ
- Documentação técnica
- Guia de deploy

---

## 📊 CRONOGRAMA CONSOLIDADO

| Fase       | Descrição                 | Duração           | Acumulado       |
| ---------- | ------------------------- | ----------------- | --------------- |
| **Fase 0** | Correções Urgentes        | 3 dias            | 3 dias          |
| **Fase 1** | Estabilização             | 1-2 semanas       | 2 semanas       |
| **Fase 2** | Completar CRM             | 2-3 semanas       | 5 semanas       |
| **Fase 3** | Produção                  | 3-4 semanas       | 9 semanas       |
| **Fase 4** | Financeiro                | 2-3 semanas       | 12 semanas      |
| **Fase 5** | Módulos Secundários       | 2-3 semanas       | 15 semanas      |
| **Fase 6** | Funcionalidades Avançadas | 2-3 semanas       | 18 semanas      |
| **Fase 7** | Testes e Otimização       | 1-2 semanas       | 20 semanas      |
| **Fase 8** | Deploy                    | 1 semana          | 21 semanas      |
| **TOTAL**  |                           | **15-21 semanas** | **≈ 4-5 meses** |

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### **🔴 FAZER AGORA (Esta Semana)**

1. ✅ Corrigir `onSave` → `onSubmit`
2. ✅ Padronizar status `"signed"`
3. ✅ Completar BudgetModal
4. ✅ Criar página detalhes Budget
5. ✅ Testar fluxo end-to-end

### **🟠 Próximas 2-3 Semanas**

1. Gestão de Books
2. Gestão de Orders
3. Dashboard Comercial
4. Notificações

### **🟡 Próximos 1-2 Meses**

1. Módulo Produção
2. Módulo Financeiro
3. Portal do Cliente

### **🟢 Próximos 3-5 Meses**

1. Módulos Secundários
2. Funcionalidades Avançadas
3. Testes + Deploy

---

## 📁 ESTRUTURA DE ARQUIVOS COMPLETA

```
sistemaddm/
├── docs/
│   ├── 00-OVERVIEW.md
│   ├── 01-TYPES-COMPLETE.md
│   ├── 02-FIREBASE-HOOKS.md
│   ├── 03-CRM-MODULE.md
│   ├── 04-COMPONENTS-GUIDE.md
│   ├── 05-QUICK-START-EXAMPLES.md
│   ├── PLANO-MESTRE-INTEGRADO-COMPLETO.md
│   ├── TYPES-REFERENCE-COMPLETE.md
│   ├── Plano_Mestre_IA.md
│   ├── INSTRUCOES-IA.md
│   └── ROADMAP-COMPLETO-SISTEMA-DDM.md  ← ESTE ARQUIVO
│
├── functions/
│   ├── src/
│   │   ├── clients/
│   │   │   ├── assignClientNumber.ts
│   │   │   └── createClient.ts
│   │   ├── budgets/
│   │   │   ├── createBudgetPdf.ts
│   │   │   └── onBudgetSigned.ts
│   │   ├── projects/
│   │   ├── pdfs/
│   │   ├── notifications/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── (authenticated)/
│   │   │   ├── crm/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── leads/
│   │   │   │   ├── clients/
│   │   │   │   ├── budgets/
│   │   │   │   ├── projects/
│   │   │   │   ├── books/         ← A CRIAR
│   │   │   │   └── orders/        ← A CRIAR
│   │   │   ├── production/        ← A CRIAR
│   │   │   ├── finance/           ← A CRIAR
│   │   │   ├── purchases/         ← A CRIAR
│   │   │   ├── logistics/         ← A CRIAR
│   │   │   └── marketing/         ← A CRIAR
│   │   ├── portal/                ← A CRIAR (Cliente)
│   │   ├── login/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── comercial/
│   │   │   ├── modals/
│   │   │   │   ├── LeadModal.tsx
│   │   │   │   ├── ClientModal.tsx
│   │   │   │   ├── BudgetModal.tsx     ← COMPLETAR
│   │   │   │   └── ProjectModal.tsx
│   │   │   ├── cards/
│   │   │   ├── tables/
│   │   │   └── forms/
│   │   ├── production/            ← A CRIAR
│   │   ├── finance/               ← A CRIAR
│   │   ├── dashboards/
│   │   ├── layout/
│   │   │   └── NotificationCenter.tsx  ← A CRIAR
│   │   └── shared/
│   │
│   ├── hooks/
│   │   ├── comercial/
│   │   │   ├── useLeads.ts
│   │   │   ├── useBudgets.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useClients.ts
│   │   │   ├── useBooks.ts        ← A CRIAR
│   │   │   ├── useOrders.ts       ← A CRIAR
│   │   │   └── useCommercialMetrics.ts  ← A CRIAR
│   │   ├── production/            ← A CRIAR
│   │   ├── finance/               ← A CRIAR
│   │   └── shared/
│   │       ├── useAuth.ts
│   │       ├── usePermissions.ts
│   │       └── useNotifications.ts  ← A CRIAR
│   │
│   ├── lib/
│   │   ├── types/
│   │   │   ├── leads.ts
│   │   │   ├── clients.ts
│   │   │   ├── budgets.ts
│   │   │   ├── books.ts
│   │   │   ├── orders.ts
│   │   │   ├── projects.ts
│   │   │   └── production.ts
│   │   ├── firebase.ts
│   │   ├── validations.ts
│   │   └── utils.ts
│   │
│   └── styles/
│       └── globals.css
│
├── .env.local
├── firebase.json
├── package.json
└── tsconfig.json
```

---

## ✅ CRITÉRIOS DE CONCLUSÃO

O projeto será considerado **100% concluído** quando:

- ✅ Todos os 6 módulos funcionais
- ✅ Todos os fluxos end-to-end testados
- ✅ Sistema de permissões implementado
- ✅ Portal do cliente funcional
- ✅ Relatórios completos
- ✅ Testes de integração passando
- ✅ Performance otimizada
- ✅ Segurança validada
- ✅ Documentação completa
- ✅ Sistema em produção

---

## 📚 REFERÊNCIAS

**Documentos Principais:**

1. `Plano_Mestre_IA.md` - Estrutura simplificada
2. `PLANO-MESTRE-INTEGRADO-COMPLETO.md` - Plano detalhado
3. `01-TYPES-COMPLETE.md` - Tipos TypeScript
4. `02-FIREBASE-HOOKS.md` - Hooks Firebase
5. `03-CRM-MODULE.md` - Módulo CRM
6. `04-COMPONENTS-GUIDE.md` - Componentes
7. `TYPES-REFERENCE-COMPLETE.md` - Referência de tipos
8. `INSTRUCOES-IA.md` - Instruções para IA

**Stack Tecnológica:**

- Next.js 14 + App Router
- TypeScript 5.x
- Firebase (Firestore + Auth + Functions + Storage)
- Tailwind CSS + Shadcn UI
- Região: `southamerica-east1` (São Paulo)

---

## 🎉 CONCLUSÃO

Este roadmap fornece:

✅ **Visão 360°** do projeto completo  
✅ **Status atual** detalhado e honesto  
✅ **Problemas** identificados com soluções  
✅ **Roadmap** estruturado em 8 fases  
✅ **Cronograma** realista (4-5 meses)  
✅ **Tarefas** granulares com estimativas  
✅ **Critérios** de aceitação claros  
✅ **Próximos passos** priorizados

**Próxima ação:** Começar pela **Fase 0** (Correções Urgentes) e seguir o roadmap fase por fase! 🚀

---

**Versão:** 1.0  
**Última Atualização:** 18 de outubro de 2025  
**Responsável:** Equipe de Desenvolvimento Sistema DDM
