// src/lib/constants.ts
export const APP = { name: "DDM Sistema", version: "2.0.0" } as const;

export const COLLECTIONS = {
  USERS: "users",
  LEADS: "leads",
  QUOTES: "quotes",
  PROJECTS: "projects",
  CLIENTS: "clients",
} as const;

export const LEAD_STAGES = {
  PRIMEIRO_CONTATO: "primeiro-contato",
  QUALIFICADO: "qualificado",
  PROPOSTA_ENVIADA: "proposta-enviada",
  NEGOCIACAO: "negociacao",
  FECHADO_GANHO: "fechado-ganho",
  FECHADO_PERDIDO: "fechado-perdido",
} as const;

// … (demais constantes de status, prioridades e cores)
