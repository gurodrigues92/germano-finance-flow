export interface Investimento {
  id: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  valor: number;
  data_compra: string;
  fornecedor?: string;
  garantia_meses?: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvestimentoInput {
  categoria: string;
  subcategoria: string;
  descricao: string;
  valor: number;
  data_compra: string;
  fornecedor?: string;
  garantia_meses?: number;
  observacoes?: string;
}

export interface ReservaEmergencia {
  id: string;
  valor_atual: number;
  meta_valor: number;
  mes_referencia: string;
  created_at: string;
  updated_at: string;
}

export interface ReservaEmergenciaInput {
  valor_atual: number;
  meta_valor: number;
  mes_referencia: string;
}

export const CATEGORIAS_INVESTIMENTOS = {
  'Equipamentos': [
    'Secadores',
    'Cadeiras',
    'Lavatórios',
    'Outros equipamentos'
  ],
  'Mobiliário': [
    'Móveis',
    'Decoração',
    'Reformas'
  ],
  'Desenvolvimento': [
    'Cursos',
    'Treinamentos',
    'Certificações'
  ],
  'Emergência': [
    'Fundo de emergência',
    'Imprevistos'
  ]
} as const;

export type CategoriaInvestimento = keyof typeof CATEGORIAS_INVESTIMENTOS;