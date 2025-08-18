import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  ReceitaReadDTO,
  ReceitaCreateDTO,
  ValorDiarioCreateDTO,
  DespesaCreateDTO,
} from '@/lib/types';

export function useReceitas() {
  return useQuery({
    queryKey: ['receitas'],
    queryFn: async (): Promise<ReceitaReadDTO[]> => {
      const response = await api.get('/Receita');
      return response.data;
    },
  });
}

export function useReceita(id: number) {
  return useQuery({
    queryKey: ['receita', id],
    queryFn: async (): Promise<ReceitaReadDTO> => {
      const response = await api.get(`/Receita/${id}`);
      return response.data;
    },
  });
}

export function useCreateReceita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ReceitaCreateDTO): Promise<ReceitaReadDTO> => {
      const response = await api.post('/Receita', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
    },
  });
}

export function useDeleteReceita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/Receita/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
    },
  });
}

export function useAddValorDiario(receitaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<ValorDiarioCreateDTO, 'receitaId'>) => {
      const response = await api.post('/ValorDiario', { ...payload, receitaId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita', receitaId] });
    },
  });
}

export function useAddDespesa(receitaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<DespesaCreateDTO, 'receitaId'>) => {
      const response = await api.post('/Despesa', { ...payload, receitaId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita', receitaId] });
    },
  });
}