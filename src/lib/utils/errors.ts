/**
 * Extrai mensagem de erro de forma segura
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Erro desconhecido";
};

/**
 * Tipo para erros tipados
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Cria erro customizado
 */
export const createError = (
  code: string,
  message: string,
  details?: unknown
): AppError => ({
  code,
  message,
  details,
});
