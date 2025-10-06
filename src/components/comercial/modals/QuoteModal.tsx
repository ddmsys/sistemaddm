'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { Client, Quote, QuoteFormData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  quote?: Quote | null;
  clients: Client[];
}

export function QuoteModal({ isOpen, onClose, onSubmit, quote, clients }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    client_id: quote?.client_id || '',
    title: quote?.title || '',
    description: quote?.description || '',
    discount_percentage: quote?.discount_percentage || 0,
    valid_until: quote?.valid_until
      ? (quote.valid_until as any).seconds
        ? new Date(quote.valid_until.seconds * 1000).toISOString().split('T')[0]
        : new Date(quote.valid_until).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: quote?.notes || '',
    terms_conditions: quote?.terms_conditions || '',
  });

  const [items, setItems] = useState<QuoteItem[]>(
    quote?.items?.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })) || [{ description: '', quantity: 1, unit_price: 0 }],
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index] = { ...newItems[index], [field]: Number(value) || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const discountAmount = (subtotal * formData.discount_percentage) / 100;
  const total = subtotal - discountAmount;

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_id) newErrors.client_id = 'Cliente é obrigatório';
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.valid_until) newErrors.valid_until = 'Data de validade é obrigatória';

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

      const submitData: QuoteFormData = {
        ...formData,
        items: items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      await onSubmit(submitData);
      onClose();

      // Reset form
      setFormData({
        client_id: '',
        title: '',
        description: '',
        discount_percentage: 0,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
        terms_conditions: '',
      });
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-primary-900">
            {quote ? 'Editar Orçamento' : 'Novo Orçamento'}
          </h2>
          <button onClick={handleClose} className="p-1 text-primary-400 hover:text-primary-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            {/* Dados Básicos */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Cliente *</label>
                <select
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.client_id}
                  onChange={(e) => {
                    setFormData({ ...formData, client_id: e.target.value });
                    if (errors.client_id) setErrors({ ...errors, client_id: '' });
                  }}
                >
                  <option value="">Selecione o cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.client_number})
                    </option>
                  ))}
                </select>
                {errors.client_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Válido até *
                </label>
                <input
                  type="date"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.valid_until}
                  onChange={(e) => {
                    setFormData({ ...formData, valid_until: e.target.value });
                    if (errors.valid_until) setErrors({ ...errors, valid_until: '' });
                  }}
                />
                {errors.valid_until && (
                  <p className="mt-1 text-sm text-red-600">{errors.valid_until}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-700">
                Título do orçamento *
              </label>
              <input
                type="text"
                className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="Ex: Impressão de livro infantil"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-700">Descrição</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-primary-200 px-3 py-2 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do projeto..."
              />
            </div>

            {/* Itens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-primary-900">Itens do Orçamento</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </button>
              </div>

              {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 items-end gap-2 rounded-lg bg-primary-50 p-3"
                  >
                    <div className="col-span-5">
                      <label className="mb-1 block text-xs font-medium text-primary-700">
                        Descrição
                      </label>
                      <input
                        type="text"
                        className="h-10 w-full rounded-md border border-primary-200 px-2 text-sm focus:ring-1 focus:ring-blue-500"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Descrição do item"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="mb-1 block text-xs font-medium text-primary-700">Qtd</label>
                      <input
                        type="number"
                        min="1"
                        className="h-10 w-full rounded-md border border-primary-200 px-2 text-sm focus:ring-1 focus:ring-blue-500"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="mb-1 block text-xs font-medium text-primary-700">
                        Preço Unit.
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-10 w-full rounded-md border border-primary-200 px-2 text-sm focus:ring-1 focus:ring-blue-500"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                      />
                    </div>

                    <div className="col-span-1 text-center">
                      <div className="mb-1 text-xs text-primary-700">Total</div>
                      <div className="text-sm font-medium">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </div>
                    </div>

                    <div className="col-span-1 text-center">
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

              {/* Totais */}
              <div className="space-y-2 rounded-lg bg-primary-100 p-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>Desconto:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="h-8 w-16 rounded border border-primary-200 px-2 text-sm"
                      value={formData.discount_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percentage: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <span>%</span>
                  </div>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-primary-300 pt-2 text-lg font-bold text-primary-900">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Observações
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-primary-200 px-3 py-2 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações internas..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Termos e Condições
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-primary-200 px-3 py-2 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.terms_conditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      terms_conditions: e.target.value,
                    })
                  }
                  placeholder="Termos específicos deste orçamento..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-primary-50 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-primary-300 px-4 py-2 text-primary-700 transition-colors hover:bg-primary-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            )}
            {quote ? 'Salvar Alterações' : 'Criar Orçamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
