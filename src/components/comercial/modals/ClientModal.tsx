"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { useFirestore } from "@/hooks/useFirestore";
import { Client, ClientFormData } from "@/lib/types/clients";
import {
  fetchAddressByCEP,
  isValidCNPJ,
  isValidCPF,
  isValidEmail,
  maskCEP,
  maskDocument,
  maskPhone,
} from "@/lib/utils";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<string | null>;
  client?: Client | null;
}

export function ClientModal({ isOpen, onClose, onSubmit, client }: ClientModalProps) {
  const { checkDuplicate } = useFirestore("clients");
  const [clientType, setClientType] = useState<"fisica" | "juridica">("fisica");
  const [activeTab, setActiveTab] = useState<"basic" | "address" | "social">("basic");

  const [formData, setFormData] = useState<ClientFormData>({
    type: "individual",
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    document: client?.document || "",
    rg: client?.rg || "",
    status: client?.status || "active",
    company: client?.company || "",
    companyName: client?.companyName || "",
    stateRegistration: client?.stateRegistration || "",
    contactPerson: client?.contactPerson || "",
    birthDate: client?.birthDate || "",
    businessType: client?.businessType || "",
    source: client?.source || "",
    referralSource: client?.referralSource || "",
    notes: client?.notes || "",
    tags: client?.tags || [],
    socialMedia: client?.socialMedia || {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    address: {
      street: client?.address?.street || "",
      number: client?.address?.number || "",
      complement: client?.address?.complement || "",
      neighborhood: client?.address?.neighborhood || "",
      city: client?.address?.city || "",
      state: client?.address?.state || "",
      zipCode: client?.address?.zipCode || "",
      country: client?.address?.country || "Brasil",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [tagInput, setTagInput] = useState("");

  if (!isOpen) return null;

  const validateForm = async (): Promise<Record<string, string>> => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    } else {
      const isDuplicate = await checkDuplicate("email", formData.email, client?.id);
      if (isDuplicate) {
        newErrors.email = "Este email já está cadastrado";
      }
    }

    if (formData.document) {
      if (clientType === "fisica" && !isValidCPF(formData.document)) {
        newErrors.document = "CPF inválido";
      } else if (clientType === "juridica" && !isValidCNPJ(formData.document)) {
        newErrors.document = "CNPJ inválido";
      } else {
        const isDuplicate = await checkDuplicate("document", formData.document, client?.id);
        if (isDuplicate) {
          newErrors.document = "Este documento já está cadastrado";
        }
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
    setErrors({});

    try {
      const validationErrors = await validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await onSubmit(formData);
      onClose();
      resetForm();
    } catch (error) {
      console.error("❌ Erro ao salvar cliente:", error);
      setErrors({ general: "Erro ao salvar cliente. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "individual",
      name: "",
      email: "",
      phone: "",
      document: "",
      rg: "",

      status: "active",

      company: "",
      companyName: "",
      stateRegistration: "",
      contactPerson: "",

      birthDate: "",
      businessType: "",
      source: "",
      referralSource: "",
      notes: "",
      tags: [],
      socialMedia: {
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        website: "",
      },
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Brasil",
      },
    });
    setClientType("fisica");
    setActiveTab("basic");
    setErrors({});
    setTagInput("");
  };

  const handleDocumentChange = (value: string) => {
    const masked = maskDocument(value);
    setFormData((prev) => ({
      ...prev,
      document: masked,
    }));
  };

  const handleTypeChange = (newType: "fisica" | "juridica") => {
    setClientType(newType);
    setFormData((prev) => ({
      ...prev,
      type: newType === "fisica" ? "individual" : "company",
      document: "",
    }));
  };

  const handleCEPChange = async (value: string) => {
    const masked = maskCEP(value);
    setFormData({
      ...formData,
      address: { ...formData.address, zipCode: masked },
    });

    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 8) {
      setLoadingCEP(true);
      try {
        const addressData = await fetchAddressByCEP(cleaned);
        if (addressData) {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              ...addressData,
            },
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50 px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("basic")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "basic"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Dados Básicos
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "address"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Endereço
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "social"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Redes Sociais
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">{errors.general}</div>
          )}

          {/* TAB: Dados Básicos */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              {/* Tipo de Cliente */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tipo de Cliente *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("fisica")}
                    className={`rounded-lg border px-4 py-2 font-medium transition-colors ${
                      clientType === "fisica"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Pessoa Física
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("juridica")}
                    className={`rounded-lg border px-4 py-2 font-medium transition-colors ${
                      clientType === "juridica"
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Pessoa Jurídica
                  </button>
                </div>
              </div>

              {/* Grid de Campos */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {clientType === "fisica" ? "Nome Completo" : "Razão Social"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* ========== EMAIL ========== */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* ========== TELEFONE ========== */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const masked = maskPhone(e.target.value);
                      setFormData({ ...formData, phone: masked });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    maxLength={15}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* ========== DATA DE ANIVERSÁRIO ========== */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {clientType === "fisica" ? "Data de Aniversário" : "Aniversário do Contato"}
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* ========== PESSOA FÍSICA: CPF + RG ========== */}
                {clientType === "fisica" && (
                  <>
                    {/* CPF */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">CPF</label>
                      <input
                        type="text"
                        value={formData.document}
                        onChange={(e) => handleDocumentChange(e.target.value)}
                        maxLength={14}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      {errors.document && (
                        <p className="mt-1 text-sm text-red-600">{errors.document}</p>
                      )}
                    </div>

                    {/* RG */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">RG</label>
                      <input
                        type="text"
                        value={formData.rg || ""}
                        onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                        placeholder="00.000.000-0"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </>
                )}

                {/* ========== PESSOA JURÍDICA: CNPJ + INSCRIÇÃO ESTADUAL ========== */}
                {clientType === "juridica" && (
                  <>
                    {/* CNPJ */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">CNPJ</label>
                      <input
                        type="text"
                        value={formData.document}
                        onChange={(e) => handleDocumentChange(e.target.value)}
                        maxLength={18}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      {errors.document && (
                        <p className="mt-1 text-sm text-red-600">{errors.document}</p>
                      )}
                    </div>

                    {/* Inscrição Estadual */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Inscrição Estadual
                      </label>
                      <input
                        type="text"
                        value={formData.stateRegistration || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, stateRegistration: e.target.value })
                        }
                        placeholder="000.000.000.000"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    {/* Nome Fantasia */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Nome Fantasia
                      </label>
                      <input
                        type="text"
                        value={formData.companyName || ""}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Ex: Editora XYZ"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    {/* Pessoa de Contato */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Pessoa de Contato
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, contactPerson: e.target.value })
                        }
                        placeholder="Ex: Maria Silva"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>

                    {/* Tipo de Negócio */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Tipo de Negócio
                      </label>
                      <input
                        type="text"
                        value={formData.businessType || ""}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        placeholder="Ex: Editora, Gráfica"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                  </>
                )}

                {/* ========== STATUS ========== */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>

                {/* ========== ORIGEM ========== */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Origem</label>
                  <select
                    value={formData.source || ""}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Selecione...</option>
                    <option value="website">Website</option>
                    <option value="referral">Indicação</option>
                    <option value="advertising">Publicidade</option>
                    <option value="email">Email</option>
                    <option value="phone">Telefone</option>
                    <option value="event">Evento</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                {/* ========== INDICAÇÃO ========== */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Indicação (Nome da pessoa)
                  </label>
                  <input
                    type="text"
                    value={formData.referralSource || ""}
                    onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Se o cliente foi indicado por alguém, informe o nome aqui
                  </p>
                </div>
              </div>

              {/* ========== TAGS (fora do grid) ========== */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Digite uma tag e pressione Enter"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ========== OBSERVAÇÕES (fora do grid) ========== */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* TAB: Endereço */}
          {activeTab === "address" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">CEP</label>
                  <input
                    type="text"
                    value={formData.address?.zipCode || ""}
                    onChange={(e) => handleCEPChange(e.target.value)}
                    maxLength={9}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                  {loadingCEP && <p className="mt-1 text-sm text-blue-600">Buscando CEP...</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">Logradouro</label>
                  <input
                    type="text"
                    value={formData.address?.street || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, street: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Número</label>
                  <input
                    type="text"
                    value={formData.address?.number || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, number: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.address?.complement || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, complement: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Bairro</label>
                  <input
                    type="text"
                    value={formData.address?.neighborhood || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, neighborhood: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Cidade</label>
                  <input
                    type="text"
                    value={formData.address?.city || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, city: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
                  <input
                    type="text"
                    value={formData.address?.state || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, state: e.target.value },
                      })
                    }
                    maxLength={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 uppercase"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">País</label>
                  <input
                    type="text"
                    value={formData.address?.country || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, country: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Redes Sociais */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={formData.socialMedia?.website || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia!, website: e.target.value },
                      })
                    }
                    placeholder="https://www.exemplo.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="text"
                    value={formData.socialMedia?.facebook || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia!, facebook: e.target.value },
                      })
                    }
                    placeholder="@usuario"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="text"
                    value={formData.socialMedia?.instagram || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia!, instagram: e.target.value },
                      })
                    }
                    placeholder="@usuario"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.socialMedia?.linkedin || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia!, linkedin: e.target.value },
                      })
                    }
                    placeholder="linkedin.com/in/usuario"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Twitter/X</label>
                  <input
                    type="text"
                    value={formData.socialMedia?.twitter || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia!, twitter: e.target.value },
                      })
                    }
                    placeholder="@usuario"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {client ? "Salvar Alterações" : "Criar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
