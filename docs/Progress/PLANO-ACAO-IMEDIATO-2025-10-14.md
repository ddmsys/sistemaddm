# 🎯 PLANO DE AÇÃO IMEDIATO - Próximos Passos

**Data:** 14 de outubro de 2025  
**Objetivo:** Completar sistema de Budgets para MVP funcional  
**Prazo:** 3-4 dias de trabalho

---

## 📊 STATUS ATUAL

### ✅ O QUE JÁ TEMOS (85%)
- ✅ Documentação completa e atualizada (100%)
- ✅ Cloud Functions migradas (100%)
- ✅ Types e interfaces (100%)
- ✅ Hooks funcionais (100%)
- ✅ Função de aprovação (100%)
- ⚠️ Componentes básicos (70%)
- ⚠️ Páginas básicas (60%)

### ❌ O QUE FALTA (15%)
1. ❌ Renomear Budgestslist.tsx
2. ❌ BudgetItemsList.tsx
3. ❌ BudgetSummary.tsx
4. ❌ /budgets/[id]/page.tsx
5. ❌ Melhorias em /budgets/page.tsx

---

## 🚀 FASE 1: CORREÇÕES URGENTES (30 min)

### 1. Renomear arquivo com typo ✅

```bash
cd /Users/daianadimorais/sistemaddm

# Renomear arquivo
git mv src/components/comercial/list/Budgestslist.tsx \
       src/components/comercial/list/BudgetsList.tsx

# Atualizar import em budgets/page.tsx
```

**Arquivo a editar:**
```tsx
// src/app/(authenticated)/budgets/page.tsx

// Linha 4 - ANTES:
import { BudgetsList } from '@/components/comercial/list/Budgestslist';

// Linha 4 - DEPOIS:
import { BudgetsList } from '@/components/comercial/list/BudgetsList';
```

---

## 🎨 FASE 2: COMPONENTES CRÍTICOS (4h)

### 2. Criar BudgetItemsList.tsx (2h)

**Arquivo:** `src/components/budgets/BudgetItemsList.tsx`

```tsx
'use client';

import { Trash2, Edit2, Package, FileText, Gift } from 'lucide-react';
import { BudgetItem, EditorialServiceType, ExtraType } from '@/lib/types/budgets';

interface BudgetItemsListProps {
  items: BudgetItem[];
  onRemove?: (index: number) => void;
  onEdit?: (index: number) => void;
  readOnly?: boolean;
  showActions?: boolean;
}

export function BudgetItemsList({
  items,
  onRemove,
  onEdit,
  readOnly = false,
  showActions = true,
}: BudgetItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">Nenhum item adicionado</p>
      </div>
    );
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'editorial_service':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'printing':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'extra':
        return <Gift className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case 'editorial_service':
        return 'Serviço Editorial';
      case 'printing':
        return 'Impressão';
      case 'extra':
        return 'Extra';
      default:
        return type;
    }
  };

  const getServiceName = (item: BudgetItem) => {
    if (item.type === 'editorial_service') {
      return item.service === EditorialServiceType.CUSTOM
        ? item.customService || 'Serviço Personalizado'
        : item.service;
    }
    if (item.type === 'extra') {
      return item.extraType === ExtraType.CUSTOM
        ? item.customExtra || 'Extra Personalizado'
        : item.extraType;
    }
    return item.description;
  };

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
        <div className="col-span-1">Tipo</div>
        <div className="col-span-4">Descrição</div>
        <div className="col-span-2 text-center">Qtd</div>
        <div className="col-span-2 text-right">Unit.</div>
        <div className="col-span-2 text-right">Total</div>
        {showActions && !readOnly && <div className="col-span-1"></div>}
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-gray-300"
        >
          <div className="col-span-1 flex items-center">
            {getItemIcon(item.type)}
          </div>

          <div className="col-span-4">
            <p className="font-medium text-gray-900">
              {item.description || getServiceName(item)}
            </p>
            <p className="text-xs text-gray-500">{getItemTypeName(item.type)}</p>
            {item.notes && (
              <p className="mt-1 text-xs italic text-gray-400">{item.notes}</p>
            )}
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">
              {item.quantity}
            </span>
          </div>

          <div className="col-span-2 flex items-center justify-end font-medium text-gray-700">
            R$ {item.unitPrice.toFixed(2)}
          </div>

          <div className="col-span-2 flex items-center justify-end font-bold text-blue-600">
            R$ {item.totalPrice.toFixed(2)}
          </div>

          {showActions && !readOnly && (
            <div className="col-span-1 flex items-center justify-end gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(index)}
                  className="rounded p-1 text-blue-600 hover:bg-blue-50"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-end rounded-lg bg-blue-50 px-4 py-3">
        <div className="text-right">
          <p className="text-sm text-gray-600">Subtotal dos Itens</p>
          <p className="text-2xl font-bold text-blue-600">
            R$ {totalValue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### 3. Criar BudgetSummary.tsx (1h)

**Arquivo:** `src/components/budgets/BudgetSummary.tsx`

```tsx
'use client';

import { Calculator, Percent, DollarSign, CreditCard } from 'lucide-react';

interface BudgetSummaryProps {
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  total: number;
  paymentMethods?: string[];
  validityDays?: number;
  compact?: boolean;
}

export function BudgetSummary({
  subtotal,
  discount,
  discountPercentage,
  total,
  paymentMethods,
  validityDays,
  compact = false,
}: BudgetSummaryProps) {
  const hasDiscount = (discount && discount > 0) || (discountPercentage && discountPercentage > 0);

  if (compact) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-3xl font-bold text-blue-600">
              R$ {total.toFixed(2)}
            </p>
          </div>
          <Calculator className="h-12 w-12 text-blue-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Resumo Financeiro</h3>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-gray-700">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">Subtotal</span>
        </div>
        <span className="text-lg font-semibold text-gray-900">
          R$ {subtotal.toFixed(2)}
        </span>
      </div>

      {/* Discount */}
      {hasDiscount && (
        <div className="flex items-center justify-between border-t border-gray-100 py-2">
          <div className="flex items-center gap-2 text-green-700">
            <Percent className="h-4 w-4" />
            <span className="font-medium">Desconto</span>
            {discountPercentage && (
              <span className="text-xs text-gray-500">({discountPercentage}%)</span>
            )}
          </div>
          <span className="text-lg font-semibold text-green-600">
            - R$ {(discount || 0).toFixed(2)}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between border-t-2 border-blue-200 bg-blue-50 -mx-6 px-6 py-4 mt-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">Total</span>
        </div>
        <span className="text-3xl font-bold text-blue-600">
          R$ {total.toFixed(2)}
        </span>
      </div>

      {/* Payment Methods */}
      {paymentMethods && paymentMethods.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Formas de Pagamento:</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Validity */}
      {validityDays && (
        <div className="text-center text-xs text-gray-500">
          Proposta válida por {validityDays} dias
        </div>
      )}
    </div>
  );
}
```

---

### 4. Criar /budgets/[id]/page.tsx (3h)

**Arquivo:** `src/app/(authenticated)/budgets/[id]/page.tsx`

```tsx
'use client';

import { ArrowLeft, CheckCircle, XCircle, Send, Edit, FileText, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { BudgetItemsList } from '@/components/budgets/BudgetItemsList';
import { BudgetSummary } from '@/components/budgets/BudgetSummary';
import { useBudgets } from '@/hooks/comercial/useBudgets';
import { useLeads } from '@/hooks/comercial/useLeads';
import { useAuth } from '@/hooks/useAuth';
import { approveBudget } from '@/lib/firebase/budgets/approveBudget';
import { Budget } from '@/lib/types/budgets';

export default function BudgetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const budgetId = params.id as string;

  const { getBudgetById, sendBudget, rejectBudget, deleteBudget } = useBudgets();
  const { leads } = useLeads();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  // Load budget
  useEffect(() => {
    if (budgetId) {
      loadBudget();
    }
  }, [budgetId]);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const data = await getBudgetById(budgetId);
      setBudget(data);
    } catch (error: any) {
      toast.error('Erro ao carregar orçamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!user?.id || !budget) return;

    try {
      const result = await approveBudget(budget.id!, user.id);
      toast.success(`Aprovado! Código: ${result.catalogCode}`);
      router.push(`/production/${result.productionProjectId}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    if (!budget) return;

    if (confirm('Tem certeza que deseja recusar este orçamento?')) {
      try {
        await rejectBudget(budget.id!);
        toast.success('Orçamento recusado');
        router.push('/budgets');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleSend = async () => {
    if (!budget) return;

    try {
      await sendBudget(budget.id!);
      toast.success('Orçamento enviado');
      await loadBudget();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!budget) return;

    if (confirm('Tem certeza que deseja deletar este orçamento? Esta ação não pode ser desfeita.')) {
      try {
        await deleteBudget(budget.id!);
        toast.success('Orçamento deletado');
        router.push('/budgets');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando orçamento...</p>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Orçamento não encontrado</p>
        <button
          onClick={() => router.push('/budgets')}
          className="text-blue-600 hover:underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  const lead = leads.find((l) => l.id === budget.leadId);

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
    };

    const labels = {
      draft: 'Rascunho',
      sent: 'Enviado',
      approved: 'Aprovado',
      rejected: 'Recusado',
      expired: 'Expirado',
    };

    return (
      <span className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/budgets')}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Orçamento {budget.number}
              </h1>
              <p className="text-sm text-gray-500">
                Criado em {budget.createdAt.toDate().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          {getStatusBadge(budget.status)}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {budget.status === 'draft' && (
            <>
              <button
                onClick={() => router.push(`/budgets/${budget.id}/edit`)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={handleSend}
                className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </>
          )}
          
          {(budget.status === 'sent' || budget.status === 'draft') && (
            <>
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Aprovar
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Recusar
              </button>
            </>
          )}
          
          <button
            className="ml-auto flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            Gerar PDF
          </button>

          {budget.status === 'draft' && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Deletar
            </button>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-6">
            {/* Project Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Informações do Projeto</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Título</label>
                  <p className="font-medium">{budget.projectData?.title || 'N/A'}</p>
                </div>
                {budget.projectData?.subtitle && (
                  <div>
                    <label className="text-sm text-gray-600">Subtítulo</label>
                    <p className="font-medium">{budget.projectData.subtitle}</p>
                  </div>
                )}
                {budget.projectData?.author && (
                  <div>
                    <label className="text-sm text-gray-600">Autor</label>
                    <p className="font-medium">{budget.projectData.author}</p>
                  </div>
                )}
                {budget.projectType && (
                  <div>
                    <label className="text-sm text-gray-600">Tipo</label>
                    <p className="font-medium">{budget.projectType}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Itens do Orçamento</h2>
              <BudgetItemsList items={budget.items} readOnly />
            </div>

            {/* Conditions */}
            {budget.notes && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">Observações</h2>
                <p className="text-gray-700">{budget.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <BudgetSummary
              subtotal={budget.subtotal}
              discount={budget.discount}
              discountPercentage={budget.discountPercentage}
              total={budget.total}
              paymentMethods={budget.paymentMethods}
              validityDays={budget.validityDays}
            />

            {/* Lead Info */}
            {lead && (
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="mb-2 font-semibold">Lead Vinculado</h3>
                <p className="text-sm">{lead.name}</p>
                {lead.email && <p className="text-xs text-gray-500">{lead.email}</p>}
              </div>
            )}

            {/* Dates */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <h3 className="mb-2 font-semibold">Datas</h3>
              <div className="space-y-1 text-gray-600">
                <p>Emissão: {budget.issueDate.toDate().toLocaleDateString('pt-BR')}</p>
                <p>Validade: {budget.expiryDate.toDate().toLocaleDateString('pt-BR')}</p>
                {budget.approvalDate && (
                  <p>Aprovação: {budget.approvalDate.toDate().toLocaleDateString('pt-BR')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 FASE 3: MELHORIAS (2h)

### 5. Melhorar /budgets/page.tsx

Adicionar:
- ✅ Cards de estatísticas
- ✅ Filtros por status
- ✅ Busca por título/número
- ✅ Botão "Novo Orçamento" destacado

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Dia 1 (4h)
- [ ] Renomear Budgestslist.tsx → BudgetsList.tsx
- [ ] Criar BudgetItemsList.tsx
- [ ] Criar BudgetSummary.tsx
- [ ] Testar componentes isolados

### Dia 2 (4h)
- [ ] Criar /budgets/[id]/page.tsx
- [ ] Integrar BudgetItemsList
- [ ] Integrar BudgetSummary
- [ ] Testar fluxo completo

### Dia 3 (2h)
- [ ] Melhorar /budgets/page.tsx
- [ ] Adicionar filtros e busca
- [ ] Adicionar stat cards
- [ ] Polish final

---

## 🧪 TESTES NECESSÁRIOS

### Fluxo Completo
1. [ ] Criar orçamento novo
2. [ ] Adicionar múltiplos itens
3. [ ] Calcular totais corretamente
4. [ ] Salvar como rascunho
5. [ ] Visualizar detalhes
6. [ ] Editar orçamento
7. [ ] Enviar orçamento
8. [ ] Aprovar orçamento
9. [ ] Verificar criação automática (Client, Book, Order, Project)
10. [ ] Gerar PDF

---

## 📊 RESULTADO ESPERADO

Após completar todas as fases:
- ✅ Sistema 100% funcional
- ✅ UX polida e profissional
- ✅ Documentação 100% consistente com código
- ✅ Pronto para MVP/Beta

---

## 💡 DICAS DE IMPLEMENTAÇÃO

1. **Trabalhe em ordem** - Não pule etapas
2. **Teste constantemente** - A cada componente criado
3. **Commit frequente** - A cada funcionalidade pronta
4. **Use TypeScript** - Deixe ele te guiar
5. **Siga a documentação** - Ela está 100% atualizada

---

**Bom trabalho! 🚀**
