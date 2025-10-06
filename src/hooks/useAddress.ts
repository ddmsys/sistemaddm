"use client";

import { fetchAddressByCep } from "@/lib/services/cep";
import { useCallback, useState } from "react";

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UseAddressReturn {
  address: Address;
  loading: boolean;
  error: string | null;
  updateAddress: (field: keyof Address, value: string) => void;
  searchCep: (cep: string) => Promise<void>;
  resetAddress: () => void;
}

const initialAddress: Address = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

export function useAddress(initialData?: Partial<Address>): UseAddressReturn {
  const [address, setAddress] = useState<Address>({
    ...initialAddress,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ ATUALIZAR CAMPO ESPECÍFICO
  const updateAddress = useCallback((field: keyof Address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  }, []);

  // ✅ BUSCAR CEP E PREENCHER AUTOMATICAMENTE
  const searchCep = useCallback(async (cep: string) => {
    if (cep.replace(/\D/g, "").length !== 8) return;

    setLoading(true);
    setError(null);

    try {
      const addressData = await fetchAddressByCep(cep);

      if (addressData.error) {
        setError(addressData.error);
      } else {
        // ✅ PREENCHER CAMPOS AUTOMATICAMENTE
        setAddress((prev) => ({
          ...prev,
          street: addressData.street,
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          // number e complement mantêm valores existentes
        }));
      }
    } catch (err) {
      setError("Erro ao buscar CEP");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ RESETAR ENDEREÇO
  const resetAddress = useCallback(() => {
    setAddress(initialAddress);
    setError(null);
  }, []);

  return {
    address,
    loading,
    error,
    updateAddress,
    searchCep,
    resetAddress,
  };
}
