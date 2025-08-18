/**
 * Formata um valor numérico para moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Remove a formatação de moeda e retorna apenas o número
 */
export function parseCurrency(value: string): number {
  // Remove tudo exceto números, vírgula e ponto
  const cleaned = value.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto para parsing
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}