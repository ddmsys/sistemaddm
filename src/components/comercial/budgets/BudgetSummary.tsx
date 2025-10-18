"use client";

import { Calculator, CreditCard, DollarSign, Percent } from "lucide-react";

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
  discount = 0,
  discountPercentage = 0,
  total,
  paymentMethods = [],
  validityDays,
  compact = false,
}: BudgetSummaryProps) {
  const discountAmount = discountPercentage ? (subtotal * discountPercentage) / 100 : discount;

  if (compact) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-3xl font-bold text-blue-600">
              R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
          R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Desconto */}
      {discountAmount > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 py-2">
          <div className="flex items-center gap-2 text-green-700">
            <Percent className="h-4 w-4" />
            <span className="font-medium">Desconto</span>
            {discountPercentage > 0 && (
              <span className="text-xs text-gray-500">({discountPercentage}%)</span>
            )}
          </div>
          <span className="text-lg font-semibold text-green-600">
            - R$ {discountAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="-mx-6 mt-4 flex items-center justify-between border-t-2 border-blue-200 bg-blue-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">Total</span>
        </div>
        <span className="text-3xl font-bold text-blue-600">
          R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Formas de Pagamento */}
      {paymentMethods.length > 0 && (
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

      {/* Validade */}
      {validityDays && (
        <div className="text-center text-xs text-gray-500">
          Proposta válida por {validityDays} dias
        </div>
      )}
    </div>
  );
}
