import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Converte qualquer valor de data para string ISO UTC com Z
 */
export function toUtcIso(dateLike: Date | string): string {
  return new Date(dateLike).toISOString();
}

/**
 * Formata uma data ISO para exibição em pt-BR
 */
export function formatDate(isoDate: string, formatStr = 'dd/MM/yyyy'): string {
  return format(parseISO(isoDate), formatStr, { locale: ptBR });
}

/**
 * Formata uma data ISO para exibição com hora em pt-BR
 */
export function formatDateTime(isoDate: string): string {
  return format(parseISO(isoDate), 'dd/MM/yyyy HH:mm', { locale: ptBR });
}