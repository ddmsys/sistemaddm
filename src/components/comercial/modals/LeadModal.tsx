"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Lead, LeadFormData } from "@/lib/types/leads";
import { maskPhone } from "@/lib/utils";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<string | null>;
  lead?: Lead | null;
}

export function LeadModal({ isOpen, onClose, onSubmit, lead }: LeadModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "website" as LeadFormData["source"],
    referredBy: "",
    status: "primeiro_contato" as LeadFormData["status"],
    value: 0,
    probability: 0,
    notes: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");

  // Carregar dados do lead ao editar
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source || "website",
        referredBy: lead.referredBy || "",
        status: lead.status || "primeiro_contato",
        value: lead.value || 0,
        probability: lead.probability || 0,
        notes: lead.notes || "",
        tags: lead.tags || [],
      });
    } else {
      // Resetar ao criar novo
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "website",
        referredBy: "",
        status: "primeiro_contato",
        value: 0,
        probability: 0,
        notes: "",
        tags: [],
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name.trim()) {
      alert("Nome é obrigatório!");
      return;
    }

    const result = await onSubmit(formData);
    if (result) {
      onClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = maskPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{lead ? "Editar Lead" : "Novo Lead"}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "basic"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Dados Básicos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Detalhes
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ABA: Dados Básicos */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Empresa */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Empresa</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/*Indicação */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Indicação</label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Origem */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Origem <span className="text-red-500">*</span>
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="website">Website</option>
                  <option value="social_media">Redes Sociais</option>
                  <option value="referral">Indicação</option>
                  <option value="advertising">Publicidade</option>
                  <option value="email">Email Marketing</option>
                  <option value="event">Eventos</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="phone">Telefone</option>
                  <option value="other">Outros</option>
                </select>
              </div>
            </div>
          )}

          {/* ABA: Detalhes */}
          {activeTab === "details" && (
            <div className="space-y-4">
              {/* Valor Estimado */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Valor Estimado (R$)
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Probabilidade */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Probabilidade (%)
                </label>
                <input
                  type="number"
                  name="probability"
                  value={formData.probability}
                  onChange={handleNumberChange}
                  min="0"
                  max="100"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Digite e pressione Enter"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                </div>

                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {lead ? "Salvar" : "Criar Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
