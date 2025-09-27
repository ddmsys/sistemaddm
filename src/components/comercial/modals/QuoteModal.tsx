"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Quote } from "@/lib/types/comercial";
import { useLeads } from "@/hooks/comercial/useLeads";
import { useClients } from "@/hooks/comercial/useClients";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  onSave: (data: any) => Promise<void>;
  loading?: boolean;
}

export function QuoteModal({
  isOpen,
  onClose,
  quote,
  onSave,
  loading = false,
}: QuoteModalProps) {
  // ✅ HOOKS PARA BUSCAR DADOS (IGUAL CLIENTE)
  const { leads } = useLeads();
  const { clients } = useClients();

  // ✅ FORM STATE (SIMPLIFICADO COMO CLIENTE)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientType: "client" as "client" | "lead",
    clientId: "",
    leadId: "",
    validUntil: "",
    status: "draft" as "draft" | "sent" | "approved" | "rejected",
    total: "",
    terms: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ POPULATE FORM WHEN EDITING (IGUAL CLIENTE)
  useEffect(() => {
    if (quote) {
      setFormData({
        title: quote.title || "",
        description: quote.description || "",
        clientType: quote.clientId ? "client" : "lead",
        clientId: quote.clientId || "",
        leadId: quote.leadId || "",
        validUntil: "", // ✅ SEMPRE VAZIO PARA EVITAR ERRO
        status: "draft", // ✅ SEMPRE DRAFT PARA EVITAR ERRO
        total: "", // ✅ SEMPRE VAZIO PARA EVITAR ERRO
        terms: "", // ✅ SEMPRE VAZIO PARA EVITAR ERRO
        notes: "", // ✅ SEMPRE VAZIO PARA EVITAR ERRO
      });
    } else {
      setFormData({
        title: "",
        description: "",
        clientType: "client",
        clientId: "",
        leadId: "",
        validUntil: "",
        status: "draft",
        total: "",
        terms: "",
        notes: "",
      });
    }
    setErrors({});
  }, [quote, isOpen]);

  // ✅ VALIDATION (IGUAL CLIENTE)
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // ✅ CAMPOS OBRIGATÓRIOS
    if (!formData.title?.trim()) newErrors.title = "Título é obrigatório";

    if (formData.clientType === "client" && !formData.clientId) {
      newErrors.clientId = "Selecione um cliente";
    }
    if (formData.clientType === "lead" && !formData.leadId) {
      newErrors.leadId = "Selecione um lead";
    }

    // ✅ VALIDAÇÃO DE TOTAL
    if (formData.total && isNaN(Number(formData.total))) {
      newErrors.total = "Valor deve ser um número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT (IGUAL CLIENTE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      // ✅ PREPARAR DADOS PARA SALVAR (IGUAL CLIENTE)
      const quoteData: any = {
        title: formData.title,
        status: formData.status,
      };

      // ✅ DEFINIR CLIENTE OU LEAD
      if (formData.clientType === "client") {
        quoteData.clientId = formData.clientId;
      } else {
        quoteData.leadId = formData.leadId;
      }

      // ✅ ADICIONAR CAMPOS SE PREENCHIDOS (IGUAL CLIENTE)
      if (formData.description?.trim())
        quoteData.description = formData.description;
      if (formData.validUntil?.trim())
        quoteData.validUntil = formData.validUntil;
      if (formData.total?.trim()) quoteData.total = Number(formData.total);
      if (formData.terms?.trim()) quoteData.terms = formData.terms;
      if (formData.notes?.trim()) quoteData.notes = formData.notes;

      await onSave(quoteData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
    }
  };

  // ✅ CLOSE HANDLER (IGUAL CLIENTE)
  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      clientType: "client",
      clientId: "",
      leadId: "",
      validUntil: "",
      status: "draft",
      total: "",
      terms: "",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {quote ? "Editar Orçamento" : "Novo Orçamento"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ INFORMAÇÕES BÁSICAS */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Orçamento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Orçamento para Website"
                error={errors.title}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Descreva o orçamento..."
                rows={4}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* ✅ VINCULAÇÃO CLIENTE/LEAD */}
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <Label>Vinculação</Label>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="clientType"
                  value="client"
                  checked={formData.clientType === "client"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientType: "client",
                      clientId: "",
                      leadId: "",
                    }))
                  }
                  className="text-blue-500"
                />
                <span>Cliente Existente</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="clientType"
                  value="lead"
                  checked={formData.clientType === "lead"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientType: "lead",
                      clientId: "",
                      leadId: "",
                    }))
                  }
                  className="text-blue-500"
                />
                <span>Lead (Potencial)</span>
              </label>
            </div>

            {formData.clientType === "client" ? (
              <div>
                <Label htmlFor="clientId">Cliente *</Label>
                <select
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientId: e.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name || client.companyName || "Cliente sem nome"}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-sm text-red-600 mt-1">{errors.clientId}</p>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="leadId">Lead *</Label>
                <select
                  id="leadId"
                  value={formData.leadId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, leadId: e.target.value }))
                  }
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Selecione um lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} - {lead.company || "Sem empresa"}
                    </option>
                  ))}
                </select>
                {errors.leadId && (
                  <p className="text-sm text-red-600 mt-1">{errors.leadId}</p>
                )}
              </div>
            )}
          </div>

          {/* ✅ VALORES E STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total">Valor Total (R$)</Label>
              <Input
                id="total"
                type="number"
                min="0"
                step="0.01"
                value={formData.total}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, total: e.target.value }))
                }
                placeholder="0.00"
                error={errors.total}
              />
            </div>

            <div>
              <Label htmlFor="validUntil">Válido até</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    validUntil: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="draft">Rascunho</option>
                <option value="sent">Enviado</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
          </div>

          {/* ✅ TERMOS E OBSERVAÇÕES */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="terms">Termos e Condições</Label>
              <textarea
                id="terms"
                value={formData.terms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, terms: e.target.value }))
                }
                placeholder="Pagamento 50% antecipado, prazo 30 dias..."
                rows={3}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações Internas</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Observações que não aparecerão no orçamento..."
                rows={2}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* ✅ BUTTONS (IGUAL CLIENTE) */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Salvando...
                </div>
              ) : quote ? (
                "Atualizar"
              ) : (
                "Criar Orçamento"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
