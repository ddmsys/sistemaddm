// src/lib/utils/masks.ts

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const removeMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

// ✅ Adicionar função onlyNumbers
export const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateCPF = (cpf: string): boolean => {
  const cleaned = removeMask(cpf);
  return cleaned.length === 11;
};

export const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = removeMask(cnpj);
  return cleaned.length === 14;
};

// Objeto masks para compatibilidade com MaskedInput
export const masks = {
  phone: formatPhone,
  cpf: formatCPF,
  cnpj: formatCNPJ,
  onlyNumbers, // ✅ Adicionar aqui também
  cep: (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(\d{5})(\d)/, "$1-$2");
  },
  document: (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return formatCPF(value);
    } else {
      return formatCNPJ(value);
    }
  },
};
