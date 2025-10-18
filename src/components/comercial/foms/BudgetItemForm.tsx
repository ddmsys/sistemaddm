import { X } from "lucide-react";
import React, { useState } from "react";

import { BudgetItem, EditorialServiceType, ExtraType } from "@/lib/types/budgets";

interface BudgetItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<BudgetItem, "id" | "totalPrice">) => void;
  initialData?: Partial<BudgetItem>;
  title?: string;
}

export default function BudgetItemForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Novo Item",
}: BudgetItemFormProps) {
  const [type, setType] = useState<"editorial_service" | "printing" | "extra">(
    initialData?.type || "editorial_service",
  );

  const [description, setDescription] = useState(initialData?.description || "");
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [unitPrice, setUnitPrice] = useState(initialData?.unitPrice || 0);
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Campos específicos para editorial_service
  const [service, setService] = useState<EditorialServiceType>(
    (initialData as any)?.service || EditorialServiceType.REVISION,
  );
  const [estimatedDays, setEstimatedDays] = useState((initialData as any)?.estimatedDays || 0);

  // Campos específicos para printing
  const [printRun, setPrintRun] = useState((initialData as any)?.printRun || 100);
  const [productionDays, setProductionDays] = useState((initialData as any)?.productionDays || 0);

  // Campos específicos para extra
  const [extraType, setExtraType] = useState<ExtraType>(
    (initialData as any)?.extraType || ExtraType.PROOFS,
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Criar item baseado no tipo usando union types corretos
    if (type === "editorial_service") {
      const item = {
        type: "editorial_service" as const,
        description,
        quantity,
        unitPrice,
        notes,
        service, // ✅ Campo correto para editorial_service
        customService: service === EditorialServiceType.CUSTOM ? description : undefined,
        estimatedDays,
      };
      onSubmit(item);
    } else if (type === "printing") {
      const item = {
        type: "printing" as const,
        description,
        quantity,
        unitPrice,
        notes,
        printRun, // ✅ Campo correto para printing
        useBookSpecs: true,
        productionDays,
      };
      onSubmit(item);
    } else {
      const item = {
        type: "extra" as const,
        description,
        quantity,
        unitPrice,
        notes,
        extraType, // ✅ Campo correto para extra
        customExtra: extraType === ExtraType.CUSTOM ? description : undefined,
      };
      onSubmit(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Tipo */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo *</label>
            <select
              required
              className="w-full rounded-md border border-gray-300 p-2"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "editorial_service" | "printing" | "extra")
              }
            >
              <option value="editorial_service">Serviço Editorial</option>
              <option value="printing">Impressão</option>
              <option value="extra">Extra</option>
            </select>
          </div>

          {/* Campos específicos por tipo */}
          {type === "editorial_service" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Serviço *</label>
              <select
                required
                className="w-full rounded-md border border-gray-300 p-2"
                value={service}
                onChange={(e) => setService(e.target.value as EditorialServiceType)}
              >
                {Object.values(EditorialServiceType).map((serviceType) => (
                  <option key={serviceType} value={serviceType}>
                    {serviceType}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === "printing" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiragem *</label>
              <input
                type="number"
                required
                min="1"
                className="w-full rounded-md border border-gray-300 p-2"
                value={printRun}
                onChange={(e) => setPrintRun(parseInt(e.target.value))}
              />
            </div>
          )}

          {type === "extra" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tipo de Extra *
              </label>
              <select
                required
                className="w-full rounded-md border border-gray-300 p-2"
                value={extraType}
                onChange={(e) => setExtraType(e.target.value as ExtraType)}
              >
                {Object.values(ExtraType).map((extra) => (
                  <option key={extra} value={extra}>
                    {extra}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Descrição *</label>
            <textarea
              required
              rows={2}
              className="w-full rounded-md border border-gray-300 p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Quantidade *</label>
            <input
              type="number"
              required
              min="1"
              className="w-full rounded-md border border-gray-300 p-2"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          {/* Preço unitário */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Preço Unitário (R$) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full rounded-md border border-gray-300 p-2"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
            />
          </div>

          {/* Dias de produção (para serviços) */}
          {type === "editorial_service" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dias Estimados</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-gray-300 p-2"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(parseInt(e.target.value))}
              />
            </div>
          )}

          {type === "printing" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Dias de Produção
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-gray-300 p-2"
                value={productionDays}
                onChange={(e) => setProductionDays(parseInt(e.target.value))}
              />
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              rows={2}
              className="w-full rounded-md border border-gray-300 p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Preview do valor total */}
          <div className="rounded-md bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Valor Total:</div>
            <div className="text-lg font-semibold">
              R${" "}
              {(quantity * unitPrice).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
