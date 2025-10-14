'use client';

import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, CheckCircle, Edit, Trash2, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { BudgetModal } from '@/components/comercial/modals/BudgetModal';
import { useBudgets } from '@/hooks/comercial/useBudgets';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { approveBudget } from '@/lib/firebase/budgets/approveBudget';
import { Budget, BudgetItem } from '@/lib/types/budgets';
import { Client } from '@/lib/types/clients';
import { Lead } from '@/lib/types/leads';

export default function BudgetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { updateBudget, deleteBudget } = useBudgets();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [clientOrLead, setClientOrLead] = useState<Client | Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadBudget();
    }
  }, [params?.id]);

  const loadBudget = async () => {
    if (!params?.id) return;

    try {
      const budgetDoc = await getDoc(doc(db, 'budgets', params.id as string));

      if (!budgetDoc.exists()) {
        toast.error('Orçamento não encontrado');
        router.push('/budgets');
        return;
      }

      const budgetData = { id: budgetDoc.id, ...budgetDoc.data() } as Budget;
      setBudget(budgetData);

      // Buscar Lead ou Client
      if (budgetData.leadId) {
        const leadDoc = await getDoc(doc(db, 'leads', budgetData.leadId));
        if (leadDoc.exists()) {
          setClientOrLead({ id: leadDoc.id, ...leadDoc.data() } as Lead);
        }
      } else if (budgetData.clientId) {
        const clientDoc = await getDoc(doc(db, 'clients', budgetData.clientId));
        if (clientDoc.exists()) {
          setClientOrLead({ id: clientDoc.id, ...clientDoc.data() } as Client);
        }
      }
    } catch (error: any) {
      toast.error('Erro ao carregar orçamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!user?.id || !budget?.id) return;

    try {
      const result = await approveBudget(budget.id, user.id);
      toast.success(`Aprovado! Código: ${result.catalogCode}`);
      loadBudget();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    if (!budget?.id) return;

    try {
      await updateBudget(budget.id, { status: 'rejected' });
      toast.success('Orçamento recusado');
      loadBudget();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!budget?.id) return;
    if (!confirm('Deseja realmente excluir este orçamento?')) return;

    try {
      await deleteBudget(budget.id);
      toast.success('Orçamento excluído');
      router.push('/budgets');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Orçamento não encontrado</p>
      </div>
    );
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-orange-100 text-orange-800',
  };

  const statusLabels = {
    draft: 'Rascunho',
    sent: 'Enviado',
    approved: 'Aprovado',
    rejected: 'Recusado',
    expired: 'Expirado',
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/budgets')}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Orçamento #{budget.number}</h1>
            <p className="text-gray-600">{budget.projectData?.title || 'Sem título'}</p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[budget.status]}`}
        >
          {statusLabels[budget.status]}
        </span>
      </div>

      {/* Actions */}
      {budget.status === 'sent' && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-yellow-800">Aguardando aprovação do cliente</p>
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Aprovar
            </button>
            <button
              onClick={handleReject}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <XCircle className="h-4 w-4" />
              Recusar
            </button>
          </div>
        </div>
      )}

      {budget.status === 'draft' && (
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      )}

      {/* Cliente/Lead */}
      {clientOrLead && (
        <div className="mb-6 rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Cliente</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Nome:</span> {clientOrLead.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {clientOrLead.email}
            </p>
            <p>
              <span className="font-medium">Telefone:</span> {clientOrLead.phone}
            </p>
          </div>
        </div>
      )}

      {/* Dados do Projeto */}
      {budget.projectData && (
        <div className="mb-6 rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Dados do Projeto</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Tipo:</span> {budget.projectType || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Título:</span> {budget.projectData.title}
            </p>
            {budget.projectData.subtitle && (
              <p>
                <span className="font-medium">Subtítulo:</span> {budget.projectData.subtitle}
              </p>
            )}
            {budget.projectData.author && (
              <p>
                <span className="font-medium">Autor:</span> {budget.projectData.author}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Itens */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Itens do Orçamento</h2>
        <div className="space-y-3">
          {budget.items.map((item: BudgetItem, index: number) => (
            <div key={index} className="flex items-center justify-between rounded bg-gray-50 p-3">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} x R$ {item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">R$ {item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totais */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Resumo Financeiro</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>R$ {budget.subtotal.toFixed(2)}</span>
          </div>
          {(budget.discount || budget.discountPercentage) && (
            <div className="flex justify-between text-green-600">
              <span>
                Desconto {budget.discountPercentage && `(${budget.discountPercentage}%)`}:
              </span>
              <span>
                - R${' '}
                {(
                  (budget.discountPercentage
                    ? (budget.subtotal * budget.discountPercentage) / 100
                    : 0) + (budget.discount || 0)
                ).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-xl font-bold">
            <span>Total:</span>
            <span>R$ {budget.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Condições */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Condições Comerciais</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Formas de pagamento:</span>
          </p>
          <ul className="ml-4 list-inside list-disc">
            {budget.paymentMethods.map((method, index) => (
              <li key={index}>{method}</li>
            ))}
          </ul>
          {budget.productionDays && (
            <p>
              <span className="font-medium">Prazo de entrega:</span> {budget.productionDays} dias
            </p>
          )}
          <p>
            <span className="font-medium">Validade:</span> {budget.validityDays} dias
          </p>
          {budget.clientProvidedMaterial && (
            <p className="text-green-600">✓ Material fornecido pelo cliente</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && budget.id && (
        <BudgetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async (data) => {
            await updateBudget(budget.id!, data);
            setIsEditModalOpen(false);
            loadBudget();
          }}
          budget={budget}
          mode="edit"
        />
      )}
    </div>
  );
}
