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

export function useDeleteValorDiario(receitaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (valorId: number): Promise<void> => {
      await api.delete(`/ValorDiario/${valorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita', receitaId] });
    },
  });
}



// DELETE /Despesa/{id}
export function useDeleteDespesa(receitaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (despesaId: number): Promise<void> => {
      await api.delete(`/Despesa/${despesaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita', receitaId] });
    },
  });
}



// PUT /ValorDiario/{id}
export function useUpdateValorDiario(receitaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: number;
      payload: { data: string; observacao: string | null; valor: number };
    }): Promise<void> => {
      const { id, payload } = args;

      const body = {
        receitaId,                
        data: payload.data,
        observacao: payload.observacao,
        valor: payload.valor,
      };

      // Opção A (normal): JSON direto
      await api.put(`/ValorDiario/${id}`, body);

      // Se ainda aparecer "The dto field is required.", troque pela Opção B:
      // await api.put(`/ValorDiario/${id}`, { dto: body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita', receitaId] });
    },
  });
}

// PUT /Despesa/{id}
export function useUpdateDespesa(receitaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: number;
      payload: { data: string; descricao: string; valor: number };
    }): Promise<void> => {
      const { id, payload } = args;

      const body = {
        receitaId,                // 👈 idem aqui
        data: payload.data,
        descricao: payload.descricao,
        valor: payload.valor,
      };

      // Opção A:
      await api.put(`/Despesa/${id}`, body);

      // Se necessário:
      // await api.put(`/Despesa/${id}`, { dto: body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receita', receitaId] });
    },
  });
}
