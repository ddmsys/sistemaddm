'use client';

import { toast } from 'sonner';

import { BudgetsList } from '@/components/comercial/list/Budgestslist';
import { useBudgets } from '@/hooks/comercial/useBudgets';
import { useLeads } from '@/hooks/comercial/useLeads';
import { useAuth } from '@/hooks/useAuth';
import { approveBudget } from '@/lib/firebase/budgets/approveBudget';

export default function BudgetsPage() {
  const { user } = useAuth();
  const { leads } = useLeads();
  const { budgets, loading, createBudget, updateBudget, deleteBudget } = useBudgets({
    realtime: true,
  });

  const handleApprove = async (budgetId: string) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const result = await approveBudget(budgetId, user.id);
      toast.success(`Aprovado! Código: ${result.catalogCode}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (budgetId: string) => {
    try {
      await updateBudget(budgetId, { status: 'rejected' });
      toast.success('Orçamento recusado');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Faça login para continuar</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BudgetsList
        budgets={budgets}
        leads={leads}
        loading={loading}
        onCreate={async (data) => {
          await createBudget(data);
        }}
        onUpdate={updateBudget}
        onDelete={deleteBudget}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
