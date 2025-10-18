'use client';

import { useEffect } from 'react';

import { MaskedInput } from '@/components/ui/MaskedInput';
import { useAddress } from '@/hooks/useAddress';

import { Input } from './input';
import { Label } from './label';

interface AddressFormProps {
  value?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onChange: (address: any) => void;
  errors?: Record<string, string>;
}

export function AddressForm({ value, onChange, errors = {} }: AddressFormProps) {
  const { address, loading, error, updateAddress, searchCep } = useAddress(value);

  // ✅ NOTIFICAR MUDANÇAS PARA O FORMULÁRIO PAI
  useEffect(() => {
    onChange(address);
  }, [address, onChange]);

  // ✅ HANDLER PARA CEP
  const handleCepChange = async (cep: string) => {
    updateAddress('zipCode', cep);

    // ✅ AUTO-BUSCAR QUANDO CEP ESTIVER COMPLETO
    if (cep.replace(/\D/g, '').length === 8) {
      await searchCep(cep);
    }
  };

  return (
    <div className="space-y-4">
      {/* ✅ CEP COM AUTO-PREENCHIMENTO */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="zipCode">CEP *</Label>
          <div className="relative">
            <MaskedInput
              id="zipCode"
              mask="cep"
              placeholder="12345-678"
              value={address.zipCode}
              onChange={handleCepChange}
              error={errors.zipCode || error || undefined}
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ ESTADO */}
        <div>
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            placeholder="SP"
            value={address.state}
            onChange={(e) => updateAddress('state', e.target.value.toUpperCase())}
            maxLength={2}
            className={address.state && !errors.state ? 'bg-green-50' : ''}
            error={errors.state}
          />
        </div>
      </div>

      {/* ✅ CIDADE E BAIRRO */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            placeholder="São Paulo"
            value={address.city}
            onChange={(e) => updateAddress('city', e.target.value)}
            className={address.city && !errors.city ? 'bg-green-50' : ''}
            error={errors.city}
          />
        </div>

        <div>
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            placeholder="Centro"
            value={address.neighborhood}
            onChange={(e) => updateAddress('neighborhood', e.target.value)}
            className={address.neighborhood && !errors.neighborhood ? 'bg-green-50' : ''}
            error={errors.neighborhood}
          />
        </div>
      </div>

      {/* ✅ RUA E NÚMERO */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Label htmlFor="street">Endereço *</Label>
          <Input
            id="street"
            placeholder="Rua das Flores"
            value={address.street}
            onChange={(e) => updateAddress('street', e.target.value)}
            className={address.street && !errors.street ? 'bg-green-50' : ''}
            error={errors.street}
          />
        </div>

        <div>
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            placeholder="123"
            value={address.number}
            onChange={(e) => updateAddress('number', e.target.value)}
            error={errors.number}
          />
        </div>
      </div>

      {/* ✅ COMPLEMENTO */}
      <div>
        <Label htmlFor="complement">Complemento</Label>
        <Input
          id="complement"
          placeholder="Apto 45, Bloco B"
          value={address.complement}
          onChange={(e) => updateAddress('complement', e.target.value)}
        />
      </div>

      {/* ✅ INDICADOR VISUAL DE AUTO-PREENCHIMENTO */}
      {address.street && address.city && address.state && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Endereço preenchido automaticamente via CEP</span>
        </div>
      )}
    </div>
  );
}
