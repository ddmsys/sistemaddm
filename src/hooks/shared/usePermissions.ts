import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const can = () => {
    if (!user) return false;
    // TODO: Implementar lógica de permissões baseada no perfil do usuário
    // Por enquanto, retorna true para admin
    return true; // Temporário
  };

  return { can };
}
