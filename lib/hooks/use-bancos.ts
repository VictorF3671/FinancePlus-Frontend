import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { BancoResponsavel, BancoResponsavelCreateDTO } from '@/lib/types';

export function useBancos() {
  return useQuery({
    queryKey: ['bancos'],
    queryFn: async (): Promise<BancoResponsavel[]> => {
      const response = await api.get('/BancoResponsavel');
      return response.data;
    },
  });
}

export function useCreateBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: BancoResponsavelCreateDTO): Promise<BancoResponsavel> => {
      const response = await api.post('/BancoResponsavel', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
    },
  });
}

export function useDeleteBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/BancoResponsavel/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
    },
  });
}