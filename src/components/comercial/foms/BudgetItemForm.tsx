'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { BookSpecifications } from '@/lib/types/books';
import {
  BudgetItem,
  EditorialServiceType,
  ExtraType,
  calculateItemTotal,
} from '@/lib/types/budgets';

interface BudgetItemFormProps {
  onAdd: (item: Omit<BudgetItem, 'id' | 'totalPrice'>) => void;
  bookSpecs?: BookSpecifications;
}

export function BudgetItemForm({ onAdd, bookSpecs }: BudgetItemFormProps) {
  const [itemType, setItemType] = useState<'editorial_service' | 'printing' | 'extra'>(
    'editorial_service',
  );
  const [isOpen, setIsOpen] = useState(false);

  // Editorial Service
  const [service, setService] = useState<EditorialServiceType>(EditorialServiceType.REVISION);
  const [customService, setCustomService] = useState('');
  const [estimatedDays, setEstimatedDays] = useState<number>(0);

  // Printing
  const [printRun, setPrintRun] = useState<number>(100);
  const [useBookSpecs, setUseBookSpecs] = useState(true);
  const [productionDays, setProductionDays] = useState<number>(0);

  // Extra
  const [extraType, setExtraType] = useState<ExtraType>(ExtraType.PROOFS);
  const [customExtra, setCustomExtra] = useState('');

  // Common
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseItem = {
      description: description || getDefaultDescription(),
      quantity,
      unitPrice,
      notes: notes || undefined,
    };

    let item: Omit<BudgetItem, 'id' | 'totalPrice'>;

    if (itemType === 'editorial_service') {
      item = {
        ...baseItem,
        type: 'editorial_service',
        service,
        customService: service === EditorialServiceType.CUSTOM ? customService : undefined,
        estimatedDays: estimatedDays > 0 ? estimatedDays : undefined,
      };
    } else if (itemType === 'printing') {
      item = {
        ...baseItem,
        type: 'printing',
        printRun,
        useBookSpecs,
        customSpecs: useBookSpecs ? undefined : bookSpecs,
        productionDays: productionDays > 0 ? productionDays : undefined,
      };
    } else {
      item = {
        ...baseItem,
        type: 'extra',
        extraType,
        customExtra: extraType === ExtraType.CUSTOM ? customExtra : undefined,
      };
    }

    onAdd(item);
    resetForm();
    setIsOpen(false);
  };

  const getDefaultDescription = () => {
    if (itemType === 'editorial_service') {
      return service === EditorialServiceType.CUSTOM ? customService : service;
    }
    if (itemType === 'printing') {
      return `Impressão - Tiragem ${printRun}`;
    }
    return extraType === ExtraType.CUSTOM ? customExtra : extraType;
  };

  const resetForm = () => {
    setDescription('');
    setQuantity(1);
    setUnitPrice(0);
    setNotes('');
    setEstimatedDays(0);
    setProductionDays(0);
    setCustomService('');
    setCustomExtra('');
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-600 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
      >
        <Plus className="h-5 w-5" />
        Adicionar Item
      </button>
    );
  }

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Novo Item</h3>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            resetForm();
          }}
          className="rounded p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Item */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Item</label>
          <select
            value={itemType}
            onChange={(e) =>
              setItemType(e.target.value as 'editorial_service' | 'printing' | 'extra')
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="editorial_service">Serviço Editorial</option>
            <option value="printing">Impressão</option>
            <option value="extra">Extra</option>
          </select>
        </div>

        {/* Editorial Service */}
        {itemType === 'editorial_service' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Serviço</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as EditorialServiceType)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {Object.values(EditorialServiceType).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {service === EditorialServiceType.CUSTOM && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Serviço Personalizado
                </label>
                <input
                  type="text"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Dias Estimados (opcional)
              </label>
              <input
                type="number"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
                min="0"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </>
        )}

        {/* Printing */}
        {itemType === 'printing' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tiragem</label>
              <input
                type="number"
                value={printRun}
                onChange={(e) => setPrintRun(Number(e.target.value))}
                min="1"
                className="w-full rounded-lg border px-3 py-2"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useBookSpecs"
                checked={useBookSpecs}
                onChange={(e) => setUseBookSpecs(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="useBookSpecs" className="text-sm text-gray-700">
                Usar especificações do livro
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Dias de Produção (opcional)
              </label>
              <input
                type="number"
                value={productionDays}
                onChange={(e) => setProductionDays(Number(e.target.value))}
                min="0"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </>
        )}

        {/* Extra */}
        {itemType === 'extra' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Extra</label>
              <select
                value={extraType}
                onChange={(e) => setExtraType(e.target.value as ExtraType)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {Object.values(ExtraType).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {extraType === ExtraType.CUSTOM && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Extra Personalizado
                </label>
                <input
                  type="text"
                  value={customExtra}
                  onChange={(e) => setCustomExtra(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
              </div>
            )}
          </>
        )}

        {/* Common Fields */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={getDefaultDescription()}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Valor Unitário (R$)
            </label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Observações (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Total Preview */}
        <div className="rounded-lg bg-blue-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total do Item:</span>
            <span className="text-lg font-bold text-blue-600">
              R$ {calculateItemTotal(quantity, unitPrice).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
