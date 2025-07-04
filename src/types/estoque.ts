export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida: string;
  estoque_minimo: number;
  estoque_atual: number;
  valor_unitario?: number;
  created_at: string;
  updated_at: string;
}

export interface ProdutoInput {
  nome: string;
  categoria: string;
  unidade_medida: string;
  estoque_minimo: number;
  valor_unitario?: number;
}

export interface MovimentacaoEstoque {
  id: string;
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo?: string;
  fornecedor?: string;
  valor_total?: number;
  data_movimentacao: string;
  created_at: string;
}

export interface MovimentacaoInput {
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo?: string;
  fornecedor?: string;
  valor_total?: number;
  data_movimentacao: string;
}

export const CATEGORIAS_PRODUTOS = [
  'Shampoo',
  'Condicionador',
  'Tinta',
  'Equipamentos',
  'Ferramentas',
  'Produtos de Limpeza',
  'Outros'
] as const;

export const UNIDADES_MEDIDA = [
  'Unidade',
  'Litro',
  'Ml',
  'Kg',
  'G',
  'Metro',
  'Cm'
] as const;

export const MOTIVOS_SAIDA = [
  'Uso em atendimento',
  'Venda',
  'Perda/Quebra',
  'Vencimento',
  'Doação',
  'Outros'
] as const;

export type CategoriaProduto = typeof CATEGORIAS_PRODUTOS[number];
export type UnidadeMedida = typeof UNIDADES_MEDIDA[number];
export type MotivoSaida = typeof MOTIVOS_SAIDA[number];