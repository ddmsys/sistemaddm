// src/components/budgets/BudgetModal.tsx

'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Lead } from '@/lib/types';
import { ProjectCatalogType } from '@/lib/types/books';
import {
  Budget,
  BudgetFormData,
  BudgetItem,
  calculateItemTotal,
  calculateTotal,
  EditorialServiceType,
} from '@/lib/types/budgets';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => Promise<void>;
  budget?: Budget | null;
  leads?: Lead[];
  mode?: 'create' | 'edit';
}

export function BudgetModal({
  isOpen,
  onClose,
  onSave,
  budget,
  leads = [],
  mode = 'create',
}: BudgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [leadId, setLeadId] = useState<string>('');
  const [projectType, setProjectType] = useState<ProjectCatalogType>(ProjectCatalogType.BOOK);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSubtitle, setProjectSubtitle] = useState('');
  const [projectAuthor, setProjectAuthor] = useState('');
  const [items, setItems] = useState<Omit<BudgetItem, 'id' | 'totalPrice'>[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['']);
  const [validityDays, setValidityDays] = useState(30);
  const [productionDays, setProductionDays] = useState<number | undefined>();
  const [clientProvidedMaterial, setClientProvidedMaterial] = useState(false);
  const [materialDescription, setMaterialDescription] = useState('');
  const [discount, setDiscount] = useState<number | undefined>();
  const [notes, setNotes] = useState('');

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice),
    0,
  );
  const total = calculateTotal(subtotal, discount, undefined);

  // Load budget data for edit mode
  useEffect(() => {
    if (budget && mode === 'edit') {
      setLeadId(budget.leadId || '');
      setProjectType(budget.projectType || ProjectCatalogType.BOOK);
      setProjectTitle(budget.projectData?.title || '');
      setProjectSubtitle(budget.projectData?.subtitle || '');
      setProjectAuthor(budget.projectData?.author || '');
      setItems(
        budget.items.map((item) => ({
          type: item.type,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          // Type-specific fields
          ...(item.type === 'editorial_service' && {
            service: item.service,
            customService: item.customService,
            estimatedDays: item.estimatedDays,
          }),
          ...(item.type === 'printing' && {
            printRun: item.printRun,
            useBookSpecs: item.useBookSpecs,
            customSpecs: item.customSpecs,
            productionDays: item.productionDays,
          }),
          ...(item.type === 'extra' && {
            extraType: item.extraType,
            customExtra: item.customExtra,
          }),
        })),
      );
      setPaymentMethods(budget.paymentMethods);
      setValidityDays(budget.validityDays);
      setProductionDays(budget.productionDays);
      setClientProvidedMaterial(budget.clientProvidedMaterial);
      setMaterialDescription(budget.materialDescription || '');
      setDiscount(budget.discount);
      setNotes(budget.notes || '');
    }
  }, [budget, mode]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        type: 'editorial_service',
        service: EditorialServiceType.REVISION,
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  const handleAddPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, '']);
  };

  const handleRemovePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handlePaymentMethodChange = (index: number, value: string) => {
    const newMethods = [...paymentMethods];
    newMethods[index] = value;
    setPaymentMethods(newMethods);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData: BudgetFormData = {
        leadId: leadId || undefined,
        projectType,
        projectData: {
          title: projectTitle,
          subtitle: projectSubtitle || undefined,
          author: projectAuthor || undefined,
        },
        items,
        paymentMethods: paymentMethods.filter((m) => m.trim() !== ''),
        validityDays,
        productionDays,
        clientProvidedMaterial,
        materialDescription: materialDescription || undefined,
        discount,
        notes: notes || undefined,
      };

      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar orçamento');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Novo Orçamento' : 'Editar Orçamento'}
          </h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              {error}
            </div>
          )}

          {/* Lead Selection */}
          {mode === 'create' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Lead (Opcional)
              </label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sem lead vinculado</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} - {lead.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Project Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipo de Projeto *
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectCatalogType)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value={ProjectCatalogType.BOOK}>Livro</option>
              <option value={ProjectCatalogType.EBOOK}>E-book</option>
              <option value={ProjectCatalogType.KINDLE}>Kindle</option>
              <option value={ProjectCatalogType.CD}>CD</option>
              <option value={ProjectCatalogType.DVD}>DVD</option>
              <option value={ProjectCatalogType.PRINTING}>Gráfica</option>
              <option value={ProjectCatalogType.PLATFORM}>Plataforma</option>
              <option value={ProjectCatalogType.ART_DESIGN}>Arte/Design</option>
            </select>
          </div>

          {/* Project Data */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título do Projeto *
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do livro/projeto"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Subtítulo</label>
              <input
                type="text"
                value={projectSubtitle}
                onChange={(e) => setProjectSubtitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Autor</label>
              <input
                type="text"
                value={projectAuthor}
                onChange={(e) => setProjectAuthor(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Itens do Orçamento *
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                + Adicionar Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Descrição</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Ex: Revisão de texto"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-gray-600">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', parseInt(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-gray-600">
                        Valor Unitário (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, 'unitPrice', parseFloat(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm text-gray-600">Total: </span>
                    <span className="text-sm font-semibold text-gray-900">
                      R$ {calculateItemTotal(item.quantity, item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Formas de Pagamento *
              </label>
              <button
                type="button"
                onClick={handleAddPaymentMethod}
                className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                + Adicionar
              </button>
            </div>

            <div className="space-y-2">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={method}
                    onChange={(e) => handlePaymentMethodChange(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 50% entrada + 50% entrega"
                  />
                  {paymentMethods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePaymentMethod(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Validity and Production */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Validade (dias) *
              </label>
              <input
                type="number"
                min="1"
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value))}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Prazo de Produção (dias)
              </label>
              <input
                type="number"
                min="1"
                value={productionDays || ''}
                onChange={(e) =>
                  setProductionDays(e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Client Provided Material */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={clientProvidedMaterial}
                onChange={(e) => setClientProvidedMaterial(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Material fornecido pelo cliente
              </span>
            </label>

            {clientProvidedMaterial && (
              <input
                type="text"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                placeholder="Descrição do material..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Desconto (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount || ''}
              onChange={(e) => setDiscount(e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">R$ {subtotal.toFixed(2)}</span>
            </div>
            {discount && discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Desconto:</span>
                <span className="font-medium text-red-600">- R$ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-gray-900">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Salvando...'
                : mode === 'create'
                  ? 'Criar Orçamento'
                  : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
