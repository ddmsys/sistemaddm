interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  error?: string;
}

export async function fetchAddressByCep(cep: string): Promise<AddressData> {
  // ✅ LIMPAR CEP (só números)
  const cleanCep = cep.replace(/\D/g, '');

  // ✅ VALIDAR FORMATO
  if (cleanCep.length !== 8) {
    return {
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: cep,
      error: 'CEP deve ter 8 dígitos',
    };
  }

  try {
    // ✅ CONSULTAR VIACEP
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    // ✅ VERIFICAR SE CEP EXISTE
    if (data.erro) {
      return {
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: cep,
        error: 'CEP não encontrado',
      };
    }

    // ✅ RETORNAR DADOS FORMATADOS
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      zipCode: cep,
      error: undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return {
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: cep,
      error: 'Erro ao consultar CEP. Tente novamente.',
    };
  }
}
