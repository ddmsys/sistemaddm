// ✅ VALIDAÇÃO GLOBAL DE EMAIL
export function validateEmail(email: string, required: boolean = false): string | null {
  if (!email.trim()) {
    return required ? 'Email é obrigatório' : null;
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) return 'Email inválido';

  return null;
}

// ✅ VALIDAÇÃO GLOBAL DE TELEFONE
export function validatePhone(phone: string, required: boolean = false): string | null {
  if (!phone.trim()) {
    return required ? 'Telefone é obrigatório' : null;
  }

  const numbers = phone.replace(/\D/g, '');

  // ✅ VERIFICAR TAMANHO MÍNIMO
  if (numbers.length < 10) return 'Telefone deve ter pelo menos 10 dígitos';

  // ✅ VERIFICAR FORMATO BRASILEIRO
  if (numbers.length === 10) {
    // Telefone fixo: (11) 1234-5678
    const areaCode = numbers.substring(0, 2);
    if (parseInt(areaCode) < 11 || parseInt(areaCode) > 99) {
      return 'DDD inválido';
    }
  } else if (numbers.length === 11) {
    // Celular: (11) 91234-5678
    const areaCode = numbers.substring(0, 2);
    const firstDigit = numbers.charAt(2);
    if (parseInt(areaCode) < 11 || parseInt(areaCode) > 99) {
      return 'DDD inválido';
    }
    if (firstDigit !== '9') {
      return 'Celular deve começar com 9';
    }
  } else {
    return 'Telefone deve ter 10 ou 11 dígitos';
  }

  // ✅ VERIFICAR SE NÃO SÃO TODOS IGUAIS
  if (/^(\d)\1+$/.test(numbers)) {
    return 'Telefone inválido';
  }

  return null;
}

// ✅ VALIDAR CPF
export function validateCPF(cpf: string, required: boolean = false): string | null {
  if (!cpf.trim()) {
    return required ? 'CPF é obrigatório' : null;
  }

  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return 'CPF deve ter 11 dígitos';

  // Verificar se não são todos iguais
  if (/^(\d)\1+$/.test(numbers)) return 'CPF inválido';

  // Calcular dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(9))) return 'CPF inválido';

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(numbers.charAt(10))) return 'CPF inválido';

  return null;
}

// ✅ VALIDAR CNPJ
export function validateCNPJ(cnpj: string, required: boolean = false): string | null {
  if (!cnpj.trim()) {
    return required ? 'CNPJ é obrigatório' : null;
  }

  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length !== 14) return 'CNPJ deve ter 14 dígitos';
  if (/^(\d)\1+$/.test(numbers)) return 'CNPJ inválido';

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * weights1[i];
  }
  let digit = sum % 11;
  digit = digit < 2 ? 0 : 11 - digit;
  if (digit !== parseInt(numbers.charAt(12))) return 'CNPJ inválido';

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers.charAt(i)) * weights2[i];
  }
  digit = sum % 11;
  digit = digit < 2 ? 0 : 11 - digit;
  if (digit !== parseInt(numbers.charAt(13))) return 'CNPJ inválido';

  return null;
}

// ✅ VALIDAR DUPLICIDADE DE TELEFONE (GLOBAL)
export async function checkPhoneUniqueness(
  phone: string,
  currentId?: string,
): Promise<string | null> {
  if (!phone.trim()) return null;

  const numbers = phone.replace(/\D/g, '');

  // ✅ TODO: Implementar consulta no Firebase
  // Buscar em LEADS e CLIENTS
  /*
  const leadExists = await db.collection('leads')
    .where('phone', '==', numbers)
    .where('id', '!=', currentId || 'none')
    .get();
    
  const clientExists = await db.collection('clients')
    .where('phone', '==', numbers)
    .where('id', '!=', currentId || 'none')
    .get();
    
  if (!leadExists.empty) {
    return 'Telefone já cadastrado como Lead';
  }
  
  if (!clientExists.empty) {
    return 'Telefone já cadastrado como Cliente';
  }
  */

  return null; // Por enquanto não valida duplicidade
}

// ✅ VALIDAR DUPLICIDADE DE EMAIL (GLOBAL)
export async function checkEmailUniqueness(
  email: string,
  currentId?: string,
): Promise<string | null> {
  if (!email.trim()) return null;

  // ✅ TODO: Implementar consulta no Firebase
  // Buscar em LEADS e CLIENTS
  /*
  const leadExists = await db.collection('leads')
    .where('email', '==', email.toLowerCase())
    .where('id', '!=', currentId || 'none')
    .get();
    
  const clientExists = await db.collection('clients')
    .where('email', '==', email.toLowerCase())
    .where('id', '!=', currentId || 'none')
    .get();
    
  if (!leadExists.empty) {
    return 'Email já cadastrado como Lead';
  }
  
  if (!clientExists.empty) {
    return 'Email já cadastrado como Cliente';
  }
  */

  return null; // Por enquanto não valida duplicidade
}

// ✅ VALIDAR DUPLICIDADE DE DOCUMENTO (CPF/CNPJ/RG)
export async function checkDocumentUniqueness(
  document: string,
  type: 'cpf' | 'cnpj' | 'rg',
  currentId?: string,
): Promise<string | null> {
  if (!document.trim()) return null;

  const cleanDocument = document.replace(/\D/g, '');

  // ✅ TODO: Implementar consulta no Firebase
  /*
  const clientExists = await db.collection('clients')
    .where(type, '==', cleanDocument)
    .where('id', '!=', currentId || 'none')
    .get();
    
  if (!clientExists.empty) {
    return `${type.toUpperCase()} já está em uso`;
  }
  */

  return null; // Por enquanto não valida duplicidade
}
