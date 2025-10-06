import { Timestamp } from 'firebase/firestore';

/**
 * Formata Timestamp do Firestore para string de data
 */
export const formatDate = (timestamp: Timestamp | Date | string | undefined | null): string => {
  if (!timestamp) return 'Data não informada';

  try {
    let date: Date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Data inválida';
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

/**
 * Formata Timestamp para data e hora
 */
export const formatDateTime = (timestamp: Timestamp | Date | string | undefined | null): string => {
  if (!timestamp) return 'Data não informada';

  try {
    let date: Date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return 'Data inválida';
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Erro ao formatar data/hora:', error);
    return 'Data inválida';
  }
};

/**
 * Formata valor monetário em BRL
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return 'R$ 0,00';

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number | undefined | null, decimals = 0): string => {
  if (value === undefined || value === null) return '0%';

  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata número com separador de milhares
 */
export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';

  return value.toLocaleString('pt-BR');
};
