// src/components/comercial/forms/QuoteForm.tsx - CORRIGIDO
'use client';

import { useForm, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface QuoteFormData {
  leadId: string;
  clientId?: string;
  title: string;
  description?: string;
  validUntil: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  discount: number;
  notes?: string;
}

interface QuoteFormProps {
  quote?: any;
  leadId?: string;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function QuoteForm({ quote, leadId, onSubmit, onCancel, loading = false }: QuoteFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    defaultValues: {
      leadId: leadId || quote?.leadId || '',
      clientId: quote?.clientId || '',
      title: quote?.title || '',
      description: quote?.description || '',
      validUntil: quote?.validUntil
        ? quote.validUntil.toDate().toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      // ✅ CORRIGIDO: Fallback para items undefined
      items: quote?.items?.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })) || [{ description: '', quantity: 1, unitPrice: 0 }],
      discount: quote?.discount || 0,
      notes: quote?.notes || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedDiscount = watch('discount');

  // Cálculos automáticos
  const subtotal = watchedItems.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  const taxes = subtotal * 0.1;
  const grandTotal = subtotal + taxes - (watchedDiscount || 0);

  const handleFormSubmit = async (data: QuoteFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Campos básicos */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Informações Básicas</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Título"
              error={errors.title?.message}
              {...register('title', { required: 'Título é obrigatório' })}
            />

            <Input
              label="Válido até"
              type="date"
              error={errors.validUntil?.message}
              {...register('validUntil', { required: 'Data é obrigatória' })}
            />
          </div>

          <Input
            label="Descrição"
            error={errors.description?.message}
            {...register('description')}
          />
        </CardContent>
      </Card>

      {/* Itens */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
        </CardHeader>
        <CardContent>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <Input
                  label="Descrição"
                  error={errors.items?.[index]?.description?.message}
                  {...register(`items.${index}.description`, {
                    required: 'Descrição é obrigatória',
                  })}
                />
              </div>

              <div className="col-span-2">
                <Input
                  label="Qtd"
                  type="number"
                  error={errors.items?.[index]?.quantity?.message}
                  {...register(`items.${index}.quantity`, {
                    required: 'Quantidade é obrigatória',
                    min: { value: 1, message: 'Mínimo 1' },
                  })}
                />
              </div>

              <div className="col-span-3">
                <Input
                  label="Valor Unit."
                  type="number"
                  step="0.01"
                  error={errors.items?.[index]?.unitPrice?.message}
                  {...register(`items.${index}.unitPrice`, {
                    required: 'Valor é obrigatório',
                    min: { value: 0, message: 'Valor deve ser positivo' },
                  })}
                />
              </div>

              <div className="col-span-2 flex items-end pb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
          >
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Totais */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Totais</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Desconto (R$)"
              type="number"
              step="0.01"
              error={errors.discount?.message}
              {...register('discount', {
                min: { value: 0, message: 'Desconto deve ser positivo' },
              })}
            />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos:</span>
                <span>R$ {taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>- R$ {(watchedDiscount || 0).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">R$ {Math.max(0, grandTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button type="submit" loading={loading}>
          {quote ? 'Atualizar' : 'Salvar'} Orçamento
        </Button>
      </div>
    </form>
  );
}
