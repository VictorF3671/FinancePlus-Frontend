import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useTotalValorDiario() {
  return useQuery({
    queryKey: ['valorDiario', 'total'],
    queryFn: async (): Promise<number> => {
      const res = await api.get('/ValorDiario/GetTotalValue', { responseType: 'json' });
      const data = res.data;
      if (typeof data === 'number') return data;
      if (data && typeof data.total === 'number') return data.total;
      if (typeof data === 'string') {
        const n = Number(data.replace(',', '.'));
        if (!Number.isNaN(n)) return n;
      }
      throw new Error('Formato inesperado na resposta do total');
    },
    refetchInterval: 30000,
  });
}