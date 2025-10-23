"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { useFirestore } from "@/hooks/useFirestore";
import { Lead, LeadFormData, LeadSource, LeadStatus } from "@/lib/types/leads";
import { isValidEmail, maskPhone } from "@/lib/utils";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  lead?: Lead | null;
}

// Opções de origem do lead
const sourceOptions = [
  { value: "website", label: "Site" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Telefone" },
  { value: "referral", label: "Indicação" },
  { value: "socialmedia", label: "Redes Sociais" },
  { value: "coldcall", label: "Cold Call" },
  { value: "event", label: "Evento" },
  { value: "advertising", label: "Publicidade" },
  { value: "other", label: "Outro" },
];

export function LeadModal({ isOpen, onClose, onSubmit, lead }: LeadModalProps) {
  const { checkDuplicate } = useFirestore<Lead>("leads");
  const [formData, setFormData] = useState<LeadFormData>({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    source: (lead?.source as LeadSource) || "website",
    interestArea: lead?.interestArea || "",
    notes: lead?.notes || "",
    status: (lead?.status as LeadStatus) || "primeiro_contato", // ajuste para status correto!
    value: lead?.value,
    probability: lead?.probability,
    tags: lead?.tags || [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = async (): Promise<Record<string, string>> => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    } else {
      const isDuplicate = await checkDuplicate("email", formData.email, lead?.id);
      if (isDuplicate) {
        newErrors.email = "Este email já está cadastrado";
      }
    }
    if (formData.phone) {
      const cleaned = formData.phone.replace(/\D/g, "");
      if (cleaned.length < 10 || cleaned.length > 11) {
        newErrors.phone = "Telefone inválido";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationErrors = await validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      await onSubmit(formData);
      onClose();

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        interestArea: "",
        notes: "",
        status: "primeiro_contato",
        value: undefined,
        probability: undefined,
        tags: [],
      });
      setErrors({});
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      setErrors({ general: "Erro ao salvar lead. Tente novamente." });
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-primary-900">
            {lead ? "Editar Lead" : "Novo Lead"}
          </h2>
          <button onClick={handleClose} className="p-1 text-primary-400 hover:text-primary-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Nome completo *
                </label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="Digite o nome"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Email *</label>
                <input
                  type="email"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Telefone</label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    setFormData({ ...formData, phone: masked });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">Empresa</label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Fonte do lead
                </label>
                <select
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      source: e.target.value as LeadSource,
                    })
                  }
                >
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-primary-700">
                  Área de interesse
                </label>
                <input
                  type="text"
                  className="h-12 w-full rounded-md border border-primary-200 px-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  value={formData.interestArea}
                  onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
                  placeholder="Ex: Livros, E-books, CDs, DVDs..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-primary-700">Observações</label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-primary-200 px-3 py-2 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações sobre o lead..."
              />
            </div>
          </form>
        </div>

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
            {lead ? "Salvar Alterações" : "Criar Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
