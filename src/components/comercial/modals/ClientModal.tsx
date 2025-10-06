"use client";

import { useFirestore } from "@/hooks/useFirestore";
import { Client, ClientFormData } from "@/lib/types";
import {
  fetchAddressByCEP,
  isValidCNPJ,
  isValidCPF,
  isValidEmail,
  maskCEP,
  maskDocument,
  maskPhone,
} from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  client?: Client | null;
}

export function ClientModal({
  isOpen,
  onClose,
  onSubmit,
  client,
}: ClientModalProps) {
  const { checkDuplicate } = useFirestore<Client>("clients");

  const [clientType, setClientType] = useState<"fisica" | "juridica">("fisica");
  const [formData, setFormData] = useState<ClientFormData>({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    document: client?.document || "",
    company_name: client?.company_name || "",
    contact_person: client?.contact_person || "",
    address: {
      street: client?.address?.street || "",
      number: client?.address?.number || "",
      complement: client?.address?.complement || "",
      neighborhood: client?.address?.neighborhood || "",
      city: client?.address?.city || "",
      state: client?.address?.state || "",
      zip_code: client?.address?.zip_code || "",
      country: client?.address?.country || "Brasil",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCEP, setLoadingCEP] = useState(false);

  useEffect(() => {
    if (client?.document) {
      const cleaned = client.document.replace(/\D/g, "");
      setClientType(cleaned.length <= 11 ? "fisica" : "juridica");
    }
  }, [client]);

  if (!isOpen) return null;

  const validateForm = async (): Promise<Record<string, string>> => {
    const newErrors: Record<string, string> = {};

    // Nome obrigatório
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    // Email obrigatório e válido
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    } else {
      // Verificar duplicidade de email
      const isDuplicate = await checkDuplicate(
        "email",
        formData.email,
        client?.id
      );
      if (isDuplicate) {
        newErrors.email = "Este email já está cadastrado";
      }
    }

    // Documento válido se preenchido
    if (formData.document) {
      const cleaned = formData.document.replace(/\D/g, "");
      if (clientType === "fisica" && !isValidCPF(formData.document)) {
        newErrors.document = "CPF inválido";
      } else if (clientType === "juridica" && !isValidCNPJ(formData.document)) {
        newErrors.document = "CNPJ inválido";
      } else {
        // Verificar duplicidade de documento
        const isDuplicate = await checkDuplicate(
          "document",
          formData.document,
          client?.id
        );
        if (isDuplicate) {
          newErrors.document = "Este documento já está cadastrado";
        }
      }
    }

    // Telefone válido se preenchido
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
        document: "",
        company_name: "",
        contact_person: "",
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zip_code: "",
          country: "Brasil",
        },
      });
      setErrors({});
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      setErrors({ general: "Erro ao salvar cliente. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (value: string) => {
    const masked = maskDocument(value);
    const cleaned = value.replace(/\D/g, "");

    setFormData({ ...formData, document: masked });
    setClientType(cleaned.length <= 11 ? "fisica" : "juridica");

    // Limpar erro do campo
    if (errors.document) {
      setErrors({ ...errors, document: "" });
    }
  };

  const handleCEPChange = async (value: string) => {
    const masked = maskCEP(value);
    setFormData({
      ...formData,
      address: { ...formData.address, zip_code: masked },
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

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-primary-900">
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button
            onClick={handleClose}
            className="text-primary-400 hover:text-primary-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            {/* Tipo de Cliente */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Tipo de Cliente
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setClientType("fisica")}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    clientType === "fisica"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-primary-300 text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  Pessoa Física
                </button>
                <button
                  type="button"
                  onClick={() => setClientType("juridica")}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    clientType === "juridica"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-primary-300 text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  Pessoa Jurídica
                </button>
              </div>
            </div>

            {/* Dados Básicos */}
            <div>
              <h3 className="text-lg font-medium text-primary-900 mb-4">
                Dados Básicos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {clientType === "fisica" ? "Nome Completo" : "Razão Social"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder={
                      clientType === "fisica"
                        ? "Nome completo"
                        : "Razão social da empresa"
                    }
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.phone}
                    onChange={(e) => {
                      const masked = maskPhone(e.target.value);
                      setFormData({ ...formData, phone: masked });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {clientType === "fisica" ? "CPF" : "CNPJ"}
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.document}
                    onChange={(e) => handleDocumentChange(e.target.value)}
                    placeholder={
                      clientType === "fisica"
                        ? "000.000.000-00"
                        : "00.000.000/0000-00"
                    }
                    maxLength={clientType === "fisica" ? 14 : 18}
                  />
                  {errors.document && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.document}
                    </p>
                  )}
                </div>
              </div>

              {clientType === "juridica" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_name: e.target.value,
                        })
                      }
                      placeholder="Nome comercial da empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      Pessoa de Contato
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      value={formData.contact_person}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_person: e.target.value,
                        })
                      }
                      placeholder="Nome do responsável"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-lg font-medium text-primary-900 mb-4">
                Endereço (Opcional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full h-12 px-3 pr-10 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      value={formData.address?.zip_code}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {loadingCEP && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.address?.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value,
                        },
                      })
                    }
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.address?.number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          number: e.target.value,
                        },
                      })
                    }
                    placeholder="123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.address?.complement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          complement: e.target.value,
                        },
                      })
                    }
                    placeholder="Apt, Sala..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.address?.neighborhood}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          neighborhood: e.target.value,
                        },
                      })
                    }
                    placeholder="Nome do bairro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.address?.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    placeholder="Nome da cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={formData.address?.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-primary-50 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-primary-700 border border-primary-300 rounded-md hover:bg-primary-100 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {client ? "Salvar Alterações" : "Criar Cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}
