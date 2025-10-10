// src/components/ui/AddressForm.tsx
'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

// CORRIGIDO: Interface Address definida localmente
interface Address {
  street: string;
  number?: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressFormProps {
  value?: Address;
  address?: Address; // CORRIGIDO: Interface definida
  onChange: (address: Address) => void; // CORRIGIDO: Interface definida
  errors?: Record<string, string>;
  required?: boolean;
}

export default function AddressForm({
  value,
  address,
  onChange,
  errors = {},
  required = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    ...(value || address || {}),
  });

  useEffect(() => {
    if (value || address) {
      setFormData({
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        ...(value || address || {}),
      });
    }
  }, [value, address]);

  const handleChange = (field: keyof Address, newValue: string) => {
    const updatedAddress = {
      ...formData,
      [field]: newValue,
    };
    setFormData(updatedAddress);
    onChange(updatedAddress);
  };

  const handleCEPChange = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    handleChange('zipCode', cep);

    if (cleanCEP.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();

        if (!data.erro) {
          const updatedAddress = {
            ...formData,
            zipCode: cep,
            street: data.logradouro || formData.street,
            district: data.bairro || formData.district,
            city: data.localidade || formData.city,
            state: data.uf || formData.state,
          };
          setFormData(updatedAddress);
          onChange(updatedAddress);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Endereço {required && <span className="text-red-500">*</span>}
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-1">
          <Input
            label={`CEP ${required ? '*' : ''}`}
            value={formData.zipCode}
            onChange={(e) => handleCEPChange(e.target.value)}
            placeholder="00000-000"
            error={errors.zipCode}
            maxLength={9}
          />
        </div>

        <div className="md:col-span-1">
          <Input
            label={`Estado ${required ? '*' : ''}`}
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="SP"
            error={errors.state}
            maxLength={2}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label={`Logradouro ${required ? '*' : ''}`}
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Rua das Flores"
            error={errors.street}
          />
        </div>

        <div className="md:col-span-1">
          <Input
            label="Número"
            value={formData.number || ''}
            onChange={(e) => handleChange('number', e.target.value)}
            placeholder="123"
            error={errors.number}
          />
        </div>

        <div className="md:col-span-1">
          <Input
            label="Complemento"
            value={formData.complement || ''}
            onChange={(e) => handleChange('complement', e.target.value)}
            placeholder="Apto 45"
            error={errors.complement}
          />
        </div>

        <div className="md:col-span-1">
          <Input
            label={`Bairro ${required ? '*' : ''}`}
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            placeholder="Centro"
            error={errors.district}
          />
        </div>

        <div className="md:col-span-1">
          <Input
            label={`Cidade ${required ? '*' : ''}`}
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="São Paulo"
            error={errors.city}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label={`País ${required ? '*' : ''}`}
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Brasil"
            error={errors.country}
          />
        </div>
      </div>
    </div>
  );
}
