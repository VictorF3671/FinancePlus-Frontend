export type BancoResponsavel = {
  id: number;
  nome: string;
  tipo: string;
};

export type ValorDiario = {
  id: number;
  observacao?: string | null;
  data: string; // ISO UTC (ex.: "2025-08-12T00:00:00.000Z")
  valor: number;
  receitaId?: number;
};

export type Despesa = {
  id: number;
  descricao: string;
  data: string; // ISO UTC
  valor: number;
  receitaId?: number;
};

export type ReceitaReadDTO = {
  id: number;
  nome: string;
  descricao?: string | null;
  criado_em: string; // ISO UTC
  bancoResponsavelId: number;
  bancoResponsavelNome: string;
  valoresDiarios: ValorDiario[];
  despesas: Despesa[];
};

export type ReceitaCreateDTO = {
  nome: string;
  descricao?: string | null;
  bancoResponsavelId: number;
};

export type ValorDiarioCreateDTO = {
  receitaId: number;
  observacao?: string | null;
  data: string; // ISO UTC
  valor: number;
};

export type DespesaCreateDTO = {
  receitaId: number;
  descricao: string;
  data: string; // ISO UTC
  valor: number;
};

export type BancoResponsavelCreateDTO = {
  nome: string;
  tipo: string;
};