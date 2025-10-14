// src/lib/utils/user-helper.ts

// Helper para extrair dados do usuário de forma segura

/**
 * Extrai o ID do usuário independente do tipo de User
 * Funciona com Firebase User ou User customizado
 */
export function getUserId(user: any): string {
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Tenta acessar uid (Firebase) ou id (customizado)
  const userId = user.uid || user.id;

  if (!userId) {
    throw new Error('User ID not found');
  }

  return userId;
}

/**
 * Extrai o nome/email do usuário para exibição
 */
export function getUserDisplayName(user: any): string {
  if (!user) {
    return 'Unknown';
  }

  return user.displayName || user.name || user.email || 'Unknown';
}

/**
 * Extrai o email do usuário
 */
export function getUserEmail(user: any): string | undefined {
  if (!user) {
    return undefined;
  }

  return user.email;
}
