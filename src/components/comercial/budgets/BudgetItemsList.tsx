"use client";

import { Edit2, FileText, Gift, Package, Trash2 } from "lucide-react";

import { BudgetItem, EditorialServiceType, ExtraType } from "@/lib/types/budgets";

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
      case "editorial_service":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "printing":
        return <Package className="h-5 w-5 text-green-600" />;
      case "extra":
        return <Gift className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case "editorial_service":
        return "Serviço Editorial";
      case "printing":
        return "Impressão";
      case "extra":
        return "Extra";
      default:
        return type;
    }
  };

  const getServiceName = (item: BudgetItem) => {
    if (item.type === "editorial_service") {
      return item.service === EditorialServiceType.CUSTOM
        ? item.customService || "Serviço Personalizado"
        : item.service;
    }
    if (item.type === "extra") {
      return item.extraType === ExtraType.CUSTOM
        ? item.customExtra || "Extra Personalizado"
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
          <div className="col-span-1 flex items-center">{getItemIcon(item.type)}</div>

          <div className="col-span-4">
            <p className="font-medium text-gray-900">{item.description || getServiceName(item)}</p>
            <p className="text-xs text-gray-500">{getItemTypeName(item.type)}</p>
            {item.notes && <p className="mt-1 text-xs italic text-gray-400">{item.notes}</p>}
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">{item.quantity}</span>
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
          <p className="text-2xl font-bold text-blue-600">R$ {totalValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
