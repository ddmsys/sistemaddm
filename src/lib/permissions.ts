// src/lib/permissions.ts
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  COMMERCIAL = "commercial",
  PRODUCTION = "production",
  FINANCE = "finance",
  CLIENT = "client",
}

export enum Permission {
  LEADS_VIEW = "leads.view",
  LEADS_CREATE = "leads.create",
  LEADS_EDIT = "leads.edit",
  LEADS_DELETE = "leads.delete",
  QUOTES_VIEW = "quotes.view",
  QUOTES_CREATE = "quotes.create",
  // … demais permissões
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.MANAGER]: [
    Permission.LEADS_VIEW,
    Permission.LEADS_CREATE,
    Permission.LEADS_EDIT,
    Permission.QUOTES_VIEW,
    Permission.QUOTES_CREATE,
    // …demais
  ],
  [UserRole.COMMERCIAL]: [
    Permission.LEADS_VIEW,
    Permission.LEADS_CREATE,
    Permission.LEADS_EDIT,
    Permission.QUOTES_VIEW,
  ],
  // …demais roles
};

export const hasPermission = (role: UserRole, permission: Permission) =>
  ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
