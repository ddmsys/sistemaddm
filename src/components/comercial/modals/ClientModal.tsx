"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { AddressForm } from "@/components/ui/AddressForm";
import { Label } from "@/components/ui/label";
import { Client } from "@/lib/types/comercial";
import {
  validateEmail,
  validatePhone,
  validateCPF,
  validateCNPJ,
  checkPhoneUniqueness,
  checkEmailUniqueness,
  checkDocumentUniqueness,
} from "@/lib/validation/commonValidation";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onSave: (data: any) => Promise<void>;
  loading?: boolean;
}

export function ClientModal({
  isOpen,
  onClose,
  client,
  onSave,
  loading = false,
}: ClientModalProps) {
  const [clientType, setClientType] = useState<"individual" | "company">(
    "individual"
  );

  const [formData, setFormData] = useState({
    // ✅ PESSOA FÍSICA
    name: "",
    cpf: "",
    rg: "",
    birthDate: "",

    // ✅ PESSOA JURÍDICA
    companyName: "",
    cnpj: "",
    stateRegistration: "",
    contactPerson: "",

    // ✅ COMUM
    email: "",
    phone: "",
    status: "active" as "active" | "inactive" | "blocked",

    // ✅ REDES SOCIAIS
    instagram: "",
    facebook: "",
    linkedin: "",
    website: "",
  });

  const [address, setAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ POPULATE FORM WHEN EDITING
  useEffect(() => {
    if (client) {
      setClientType(client.type || "individual");

      setFormData({
        // PESSOA FÍSICA
        name: client.name || "",
        cpf: client.cpf || "",
        rg: client.rg || "",
        birthDate: client.birthDate || "",

        // PESSOA JURÍDICA
        companyName: client.companyName || "",
        cnpj: client.cnpj || "",
        stateRegistration: client.stateRegistration || "",
        contactPerson: client.contactPerson || "",

        // COMUM
        email: client.email || "",
        phone: client.phone || "",
        status:
          (client.status as "active" | "inactive" | "blocked") || "active",

        // REDES SOCIAIS
        instagram: client.socialMedia?.instagram || "",
        facebook: client.socialMedia?.facebook || "",
        linkedin: client.socialMedia?.linkedin || "",
        website: client.socialMedia?.website || "",
      });

      setAddress({
        street: client.address?.street || "",
        number: client.address?.number || "",
        complement: client.address?.complement || "",
        neighborhood: client.address?.neighborhood || "",
        city: client.address?.city || "",
        state: client.address?.state || "",
        zipCode: client.address?.zipCode || "",
      });
    } else {
      setClientType("individual");
      setFormData({
        name: "",
        cpf: "",
        rg: "",
        birthDate: "",
        companyName: "",
        cnpj: "",
        stateRegistration: "",
        contactPerson: "",
        email: "",
        phone: "",
        status: "active",
        instagram: "",
        facebook: "",
        linkedin: "",
        website: "",
      });
      setAddress({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
    setErrors({});
  }, [client]);

  // ✅ SMART VALIDATION WITH GLOBAL FUNCTIONS
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // ✅ TELEFONE SEMPRE OBRIGATÓRIO + DUPLICIDADE
    const phoneError = validatePhone(formData.phone, true);
    if (phoneError) {
      newErrors.phone = phoneError;
    } else {
      const phoneDuplicateError = await checkPhoneUniqueness(
        formData.phone,
        client?.id
      );
      if (phoneDuplicateError) newErrors.phone = phoneDuplicateError;
    }

    // ✅ EMAIL SE PREENCHIDO + DUPLICIDADE
    const emailError = validateEmail(formData.email, false);
    if (emailError) {
      newErrors.email = emailError;
    } else if (formData.email.trim()) {
      const emailDuplicateError = await checkEmailUniqueness(
        formData.email,
        client?.id
      );
      if (emailDuplicateError) newErrors.email = emailDuplicateError;
    }

    // ✅ VALIDAÇÃO POR TIPO
    if (clientType === "individual") {
      // CPF se preenchido + duplicidade
      if (formData.cpf.trim()) {
        const cpfError = validateCPF(formData.cpf, false);
        if (cpfError) {
          newErrors.cpf = cpfError;
        } else {
          const cpfDuplicateError = await checkDocumentUniqueness(
            formData.cpf,
            "cpf",
            client?.id
          );
          if (cpfDuplicateError) newErrors.cpf = cpfDuplicateError;
        }
      }

      // RG se preenchido + duplicidade
      if (formData.rg.trim()) {
        const rgDuplicateError = await checkDocumentUniqueness(
          formData.rg,
          "rg",
          client?.id
        );
        if (rgDuplicateError) newErrors.rg = rgDuplicateError;
      }
    } else {
      // CNPJ se preenchido + duplicidade
      if (formData.cnpj.trim()) {
        const cnpjError = validateCNPJ(formData.cnpj, false);
        if (cnpjError) {
          newErrors.cnpj = cnpjError;
        } else {
          const cnpjDuplicateError = await checkDocumentUniqueness(
            formData.cnpj,
            "cnpj",
            client?.id
          );
          if (cnpjDuplicateError) newErrors.cnpj = cnpjDuplicateError;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      // ✅ PREPARAR DADOS PARA SALVAR
      const clientData: any = {
        type: clientType,
        phone: formData.phone, // Sempre obrigatório
        status: formData.status,
      };

      // ✅ ADICIONAR CAMPOS SE PREENCHIDOS
      if (formData.email?.trim()) clientData.email = formData.email;

      if (clientType === "individual") {
        if (formData.name?.trim()) clientData.name = formData.name;
        if (formData.cpf?.trim()) clientData.cpf = formData.cpf;
        if (formData.rg?.trim()) clientData.rg = formData.rg;
        if (formData.birthDate?.trim())
          clientData.birthDate = formData.birthDate;
      } else {
        if (formData.companyName?.trim())
          clientData.companyName = formData.companyName;
        if (formData.cnpj?.trim()) clientData.cnpj = formData.cnpj;
        if (formData.stateRegistration?.trim())
          clientData.stateRegistration = formData.stateRegistration;
        if (formData.contactPerson?.trim())
          clientData.contactPerson = formData.contactPerson;
      }

      // ✅ REDES SOCIAIS SE PREENCHIDAS
      const socialMedia: any = {};
      if (formData.instagram?.trim())
        socialMedia.instagram = formData.instagram;
      if (formData.facebook?.trim()) socialMedia.facebook = formData.facebook;
      if (formData.linkedin?.trim()) socialMedia.linkedin = formData.linkedin;
      if (formData.website?.trim()) socialMedia.website = formData.website;

      if (Object.keys(socialMedia).length > 0) {
        clientData.socialMedia = socialMedia;
      }

      // ✅ ENDEREÇO SE PREENCHIDO
      const addressData = { ...address };
      const hasAddress = Object.values(addressData).some((value) =>
        value?.trim()
      );
      if (hasAddress) {
        clientData.address = addressData;
      }

      await onSave(clientData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const handleClose = () => {
    setClientType("individual");
    setFormData({
      name: "",
      cpf: "",
      rg: "",
      birthDate: "",
      companyName: "",
      cnpj: "",
      stateRegistration: "",
      contactPerson: "",
      email: "",
      phone: "",
      status: "active",
      instagram: "",
      facebook: "",
      linkedin: "",
      website: "",
    });
    setAddress({
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
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
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ TIPO DE CLIENTE */}
          <div>
            <Label>Tipo de Cliente</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="clientType"
                  value="individual"
                  checked={clientType === "individual"}
                  onChange={(e) =>
                    setClientType(e.target.value as "individual" | "company")
                  }
                  className="text-blue-500"
                />
                <span>Pessoa Física</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="clientType"
                  value="company"
                  checked={clientType === "company"}
                  onChange={(e) =>
                    setClientType(e.target.value as "individual" | "company")
                  }
                  className="text-blue-500"
                />
                <span>Pessoa Jurídica</span>
              </label>
            </div>
          </div>

          {/* ✅ CAMPOS DINÂMICOS */}
          {clientType === "individual" ? (
            // ✅ PESSOA FÍSICA
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="João Silva dos Santos"
                  error={errors.name}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <MaskedInput
                    id="cpf"
                    mask="cpf"
                    value={formData.cpf}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, cpf: value }))
                    }
                    error={errors.cpf}
                  />
                </div>

                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, rg: e.target.value }))
                    }
                    placeholder="12.345.678-9"
                    error={errors.rg}
                  />
                </div>

                <div>
                  <Label htmlFor="birthDate">Data Aniversário</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    error={errors.birthDate}
                  />
                </div>
              </div>
            </div>
          ) : (
            // ✅ PESSOA JURÍDICA
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Razão Social</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  placeholder="Empresa LTDA"
                  error={errors.companyName}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <MaskedInput
                    id="cnpj"
                    mask="cnpj"
                    value={formData.cnpj}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, cnpj: value }))
                    }
                    error={errors.cnpj}
                  />
                </div>

                <div>
                  <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                  <Input
                    id="stateRegistration"
                    value={formData.stateRegistration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stateRegistration: e.target.value,
                      }))
                    }
                    placeholder="123.456.789.123"
                    error={errors.stateRegistration}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactPerson">Nome do Contato</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                  placeholder="João Silva (responsável)"
                  error={errors.contactPerson}
                />
              </div>
            </div>
          )}

          {/* ✅ CONTATO (SÓ TELEFONE OBRIGATÓRIO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="contato@exemplo.com"
                error={errors.email}
              />
            </div>
          </div>

          {/* ✅ REDES SOCIAIS */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Redes Sociais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                  placeholder="@usuario"
                />
              </div>

              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facebook: e.target.value,
                    }))
                  }
                  placeholder="facebook.com/usuario"
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  placeholder="linkedin.com/in/usuario"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  placeholder="https://exemplo.com"
                />
              </div>
            </div>
          </div>

          {/* ✅ ENDEREÇO (OPCIONAL) */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Endereço
            </h3>
            <AddressForm
              value={address}
              onChange={setAddress}
              errors={errors}
            />
          </div>

          {/* ✅ STATUS */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as "active" | "inactive" | "blocked",
                }))
              }
              className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="blocked">Bloqueado</option>
            </select>
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
              ) : client ? (
                "Atualizar"
              ) : (
                "Criar Cliente"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
