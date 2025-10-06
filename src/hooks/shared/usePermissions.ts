import { useAuth } from '@/context/AuthContext';
import { hasPermission, Permission } from '@/lib/permissions';

export function usePermissions() {
  const { user } = useAuth();

  const can = (perm: Permission) => {
    if (!user) return false;
    // TODO: Implementar lógica de permissões baseada no perfil do usuário
    // Por enquanto, retorna true para admin
    return true; // Temporário
  };

  return { can };
}
