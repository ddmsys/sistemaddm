"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/MaskedInput"; // ✅ ADICIONAR PARA TELEFONE
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Lead } from "@/lib/types/comercial";
import {
  validateEmail,
  validatePhone,
  checkPhoneUniqueness,
  checkEmailUniqueness,
} from "@/lib/validation/commonValidation"; // ✅ VALIDAÇÕES GLOBAIS

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  ) => Promise<void>;
  loading?: boolean;
}

export function LeadModal({
  isOpen,
  onClose,
  lead,
  onSave,
  loading,
}: LeadModalProps) {
  const [formData, setFormData] = useState<
    Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastActivityAt">
  >({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website",
    stage: "primeiro-contato",
    value: 0,
    probability: 0,
    ownerId: "user1",
    ownerName: "Usuário Atual",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source,
        stage: lead.stage,
        value: lead.value || 0,
        probability: lead.probability || 0,
        ownerId: lead.ownerId,
        ownerName: lead.ownerName,
        notes: lead.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        stage: "primeiro-contato",
        value: 0,
        probability: 0,
        ownerId: "user1",
        ownerName: "Usuário Atual",
        notes: "",
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  // ✅ VALIDAÇÃO AVANÇADA COM DUPLICIDADE
  const validate = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // ✅ NOME OBRIGATÓRIO
    if (!formData.name?.trim()) {
      newErrors.name = "Nome obrigatório";
    }

    // ✅ EMAIL SE PREENCHIDO + DUPLICIDADE
    if (formData.email?.trim()) {
      const emailError = validateEmail(formData.email, false);
      if (emailError) {
        newErrors.email = emailError;
      } else {
        const emailDuplicateError = await checkEmailUniqueness(
          formData.email,
          lead?.id
        );
        if (emailDuplicateError) newErrors.email = emailDuplicateError;
      }
    }

    // ✅ TELEFONE SE PREENCHIDO + DUPLICIDADE
    if (formData.phone?.trim()) {
      const phoneError = validatePhone(formData.phone, false);
      if (phoneError) {
        newErrors.phone = phoneError;
      } else {
        const phoneDuplicateError = await checkPhoneUniqueness(
          formData.phone,
          lead?.id
        );
        if (phoneDuplicateError) newErrors.phone = phoneDuplicateError;
      }
    }

    // ✅ VALIDAÇÕES ORIGINAIS
    if (formData.value && formData.value < 0) {
      newErrors.value = "Valor não pode ser negativo";
    }
    if (
      formData.probability &&
      (formData.probability < 0 || formData.probability > 100)
    ) {
      newErrors.probability = "Probabilidade deve ser entre 0 e 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validate(); // ✅ ASYNC VALIDATION
    if (!isValid) return;
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    }
  };

  const sourceOptions = [
    { value: "website", label: "Website" },
    { value: "referral", label: "Indicação" },
    { value: "social-media", label: "Redes Sociais" },
    { value: "cold-call", label: "Cold Call" },
    { value: "event", label: "Evento" },
    { value: "advertising", label: "Publicidade" },
    { value: "other", label: "Outros" },
  ];

  const stageOptions = [
    { value: "primeiro-contato", label: "Primeiro Contato" },
    { value: "qualificado", label: "Qualificado" },
    { value: "proposta-enviada", label: "Proposta Enviada" },
    { value: "negociacao", label: "Negociação" },
    { value: "fechado-ganho", label: "Fechado Ganho" },
    { value: "fechado-perdido", label: "Fechado Perdido" },
  ];

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title={lead ? "Editar Lead" : "Novo Lead"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome *"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            error={errors.name}
            placeholder="Nome do lead"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            error={errors.email}
            placeholder="email@exemplo.com"
          />
          {/* ✅ TELEFONE COM MÁSCARA */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefone
            </label>
            <MaskedInput
              mask="phone"
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
              placeholder="(11) 99999-9999"
              error={errors.phone}
            />
          </div>
          <Input
            label="Empresa"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
            placeholder="Nome da empresa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Fonte"
            value={formData.source}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                source: e.target.value as Lead["source"],
              }))
            }
            options={sourceOptions}
          />

          <Select
            label="Estágio"
            value={formData.stage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stage: e.target.value as Lead["stage"],
              }))
            }
            options={stageOptions}
          />

          <Input
            label="Probabilidade (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                probability: parseInt(e.target.value) || 0,
              }))
            }
            error={errors.probability}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Valor Potencial (R$)"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                value: parseFloat(e.target.value) || 0,
              }))
            }
            error={errors.value}
            placeholder="0.00"
          />

          <Input
            label="Responsável"
            value={formData.ownerName}
            disabled
            placeholder="Usuário responsável"
          />
        </div>

        <Textarea
          label="Observações"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Adicione observações sobre este lead..."
          rows={4}
        />

        {/* ✅ PREVIEW DE DADOS VÁLIDOS */}
        {formData.name && (formData.phone || formData.email) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">Lead válido</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              {formData.name} • {formData.company || "Empresa"} •{" "}
              {formData.probability}% chance
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            {lead ? "Salvar Alterações" : "Criar Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
