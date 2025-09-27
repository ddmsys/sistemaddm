"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { Label } from "@/components/ui/label";
import { Lead } from "@/lib/types/comercial";
import {
  validateEmail,
  validatePhone,
  checkPhoneUniqueness,
  checkEmailUniqueness,
} from "@/lib/validation/commonValidation";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSave: (data: any) => Promise<void>;
  loading?: boolean;
}

export function LeadModal({
  isOpen,
  onClose,
  lead,
  onSave,
  loading = false,
}: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website" as const,
    notes: "",
    probability: 50,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ POPULATE FORM WHEN EDITING
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source || "website",
        notes: lead.notes || "",
        probability: lead.probability || 50,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        notes: "",
        probability: 50,
      });
    }
    setErrors({});
  }, [lead]);

  // ✅ SMART VALIDATION WITH GLOBAL FUNCTIONS
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // ✅ NOME OBRIGATÓRIO
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";

    // ✅ EMAIL OBRIGATÓRIO + VALIDAÇÃO + DUPLICIDADE
    const emailError = validateEmail(formData.email, true);
    if (emailError) {
      newErrors.email = emailError;
    } else {
      const emailDuplicateError = await checkEmailUniqueness(
        formData.email,
        lead?.id
      );
      if (emailDuplicateError) newErrors.email = emailDuplicateError;
    }

    // ✅ TELEFONE OBRIGATÓRIO + VALIDAÇÃO + DUPLICIDADE
    const phoneError = validatePhone(formData.phone, true);
    if (phoneError) {
      newErrors.phone = phoneError;
    } else {
      const phoneDuplicateError = await checkPhoneUniqueness(
        formData.phone,
        lead?.id
      );
      if (phoneDuplicateError) newErrors.phone = phoneDuplicateError;
    }

    // ✅ EMPRESA OBRIGATÓRIA
    if (!formData.company.trim()) newErrors.company = "Empresa é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "website",
      notes: "",
      probability: 50,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {lead ? "Editar Lead" : "Novo Lead"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ NOME */}
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="João Silva"
              error={errors.name}
            />
          </div>

          {/* ✅ EMAIL E TELEFONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="joao@empresa.com"
                error={errors.email}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <MaskedInput
                id="phone"
                mask="phone"
                value={formData.phone}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, phone: value }))
                }
                error={errors.phone}
              />
            </div>
          </div>

          {/* ✅ EMPRESA E FONTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="Empresa LTDA"
                error={errors.company}
              />
            </div>

            <div>
              <Label htmlFor="source">Fonte</Label>
              <select
                id="source"
                value={formData.source}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: e.target.value as any,
                  }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="website">Website</option>
                <option value="referral">Indicação</option>
                <option value="social">Redes Sociais</option>
                <option value="ads">Anúncios</option>
                <option value="cold">Prospecção</option>
                <option value="event">Evento</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>

          {/* ✅ PROBABILIDADE */}
          <div>
            <Label htmlFor="probability">Probabilidade (%)</Label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="probability"
                min="0"
                max="100"
                step="10"
                value={formData.probability}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    probability: parseInt(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="font-semibold text-blue-600 w-12">
                {formData.probability}%
              </span>
            </div>
          </div>

          {/* ✅ OBSERVAÇÕES */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Detalhes sobre o lead..."
              rows={3}
              className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* ✅ BUTTONS */}
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
              ) : lead ? (
                "Atualizar"
              ) : (
                "Criar Lead"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
