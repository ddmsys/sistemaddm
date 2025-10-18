// src/lib/constants.ts
export const APP = { name: "DDM Sistema", version: "2.0.0" } as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const COLLECTIONS = {
  USERS: "users",
  LEADS: "leads",
  QUOTES: "budgets",
  PROJECTS: "projects",
  CLIENTS: "clients",
} as const;

export const LEAD_STAGES = {
  PRIMEIRO_CONTATO: "primeiro_contato",
  QUALIFICADO: "qualificado",
  PROPOSTA_ENVIADA: "proposta_enviada",
  NEGOCIACAO: "negociacao",
  FECHADO_GANHO: "fechado_ganho",
  FECHADO_PERDIDO: "fechado_perdido",
} as const;

// … (demais constantes de status, prioridades e cores)
