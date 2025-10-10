// src/components/comercial/modals/QuoteModal.tsx
'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { Client, Quote, QuoteFormData, QuoteItem } from '@/lib/types/quotes';
import { formatCurrency } from '@/lib/utils';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  quote?: Quote | null;
  clients: Client[];
}

// Interface local para itens do form (simplificada)
interface FormQuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function QuoteModal({ isOpen, onClose, onSubmit, quote, clients }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    clientId: quote?.clientId || '',
    title: quote?.projectTitle || '', // Corrigido: projectTitle
    description: quote?.description || '',
    discount: quote?.discount || 0, // Corrigido: discount
    validUntil: quote?.validUntil
      ? quote.validUntil instanceof Date
        ? quote.validUntil.toISOString().split('T')[0]
        : quote.validUntil.toDate().toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: quote?.notes || '',
    terms: quote?.terms || '', // Corrigido: terms
  });

  const [items, setItems] = useState<FormQuoteItem[]>(
    quote?.items?.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice || item.value || 0, // Suporte aos dois campos
    })) || [{ description: '', quantity: 1, unitPrice: 0 }],
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof FormQuoteItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index] = { ...newItems[index], [field]: Number(value) || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: String(value) }; // Forçar string
    }
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = formData.discount || 0;
  const total = subtotal - discountAmount;

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.validUntil) newErrors.validUntil = 'Data de validade é obrigatória';

    const hasEmptyItems = items.some((item) => !item.description.trim());
    if (hasEmptyItems) {
      newErrors.items = 'Todos os itens devem ter descrição';
    }

    const hasInvalidQuantity = items.some((item) => item.quantity <= 0);
    if (hasInvalidQuantity) {
      newErrors.items = 'Quantidade deve ser maior que zero';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Montar dados compatíveis com QuoteFormData
      const submitData: QuoteFormData = {
        // Relacionamentos
        clientId: formData.clientId,
        clientName: clients.find((c) => c.id === formData.clientId)?.name || '',

        // Dados básicos
        title: formData.title, // Será mapeado para projectTitle no hook
        projectTitle: formData.title,
        description: formData.description,
        quoteType: 'producao', // Default

        // Datas
        issueDate: new Date().toISOString(),
        validUntil: formData.validUntil,

        // Status
        status: quote?.status || 'draft',

        // Itens - converter para QuoteItem
        items: items.map((item, index) => ({
          id: `item_${index + 1}`,
          description: item.description,
          kind: 'etapa',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          value: item.quantity * item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })) as QuoteItem[],

        // Campos opcionais
        discount: discountAmount,
        notes: formData.notes,
      };

      await onSubmit(submitData);
      onClose();

      // Reset form
      setFormData({
        clientId: '',
        title: '',
        description: '',
        discount: 0,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        terms: '',
      });
      setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      setErrors({ general: 'Erro ao salvar orçamento. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {quote ? 'Editar Orçamento' : 'Novo Orçamento'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Error Message */}
          {errors.general && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {errors.general}
            </div>
          )}

          {/* Dados Básicos */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Cliente */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Cliente *</label>
              <select
                value={formData.clientId}
                onChange={(e) => {
                  setFormData({ ...formData, clientId: e.target.value });
                  if (errors.clientId) setErrors({ ...errors, clientId: '' });
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.clientNumber && `(${client.clientNumber})`}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
            </div>

            {/* Válido até */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Válido até *</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => {
                  setFormData({ ...formData, validUntil: e.target.value });
                  if (errors.validUntil) setErrors({ ...errors, validUntil: '' });
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.validUntil && (
                <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>
              )}
            </div>

            {/* Título */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título do orçamento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="Ex: Impressão de livro infantil"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do projeto..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Itens */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Itens do Orçamento</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </button>
            </div>

            {errors.items && <p className="mb-4 text-sm text-red-600">{errors.items}</p>}

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-end gap-4 rounded-lg border border-gray-200 p-4"
                >
                  {/* Descrição */}
                  <div className="col-span-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Descrição do item"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Quantidade */}
                  <div className="col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Qtd</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Preço Unitário */}
                  <div className="col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Preço Unit.
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Total */}
                  <div className="col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Total</label>
                    <div className="rounded-lg bg-gray-50 px-3 py-2 font-medium">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-600 transition-colors hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totais */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Desconto:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-24 rounded border border-gray-300 px-2 py-1 text-center"
                  />
                  <span>R$</span>
                  <span className="text-red-600">-{formatCurrency(discountAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-2 text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações internas..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Termos e Condições
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms: e.target.value,
                  })
                }
                placeholder="Termos específicos deste orçamento..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 border-t pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading && (
                <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
              )}
              {quote ? 'Salvar Alterações' : 'Criar Orçamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
