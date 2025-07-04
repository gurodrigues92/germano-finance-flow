export interface CustoFixo {
  id: string;
  categoria: string;
  subcategoria: string;
  valor: number;
  observacoes?: string;
  mes_referencia: string;
  created_at: string;
  updated_at: string;
}

export interface CustoFixoInput {
  categoria: string;
  subcategoria: string;
  valor: number;
  observacoes?: string;
  mes_referencia: string;
}

export const CATEGORIAS_CUSTOS = {
  'Infraestrutura': [
    'Aluguel',
    'Conta de Água',
    'Conta de Luz',
    'Conta de Gás'
  ],
  'Serviços Profissionais': [
    'Contabilidade',
    'Produtos de limpeza',
    'Manutenção de equipamentos',
    'Serviços de limpeza'
  ],
  'Assinaturas': [
    'Internet',
    'Software/Apps',
    'Outros serviços'
  ]
} as const;

export type CategoriaCusto = keyof typeof CATEGORIAS_CUSTOS;