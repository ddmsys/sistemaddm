import { useAuth } from "@/hooks/useAuth";
import { hasPermission, Permission } from "@/lib/permissions";

export function usePermissions() {
  const { user } = useAuth(); // user.role disponível
  const can = (perm: Permission) => hasPermission(user.role, perm);
  return { can };
}
