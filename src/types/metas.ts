export interface MetaFinanceira {
  id: string;
  tipo: 'receita' | 'economia' | 'investimento' | 'personalizada';
  titulo: string;
  descricao?: string;
  valor_meta: number;
  valor_atual: number;
  data_inicio: string;
  data_fim: string;
  categoria?: string;
  status: 'ativa' | 'concluida' | 'cancelada';
  created_at: string;
  updated_at: string;
}

export interface MetaFinanceiraInput {
  tipo: 'receita' | 'economia' | 'investimento' | 'personalizada';
  titulo: string;
  descricao?: string;
  valor_meta: number;
  valor_atual?: number;
  data_inicio: string;
  data_fim: string;
  categoria?: string;
  status?: 'ativa' | 'concluida' | 'cancelada';
}

export interface RelatorioSalvo {
  id: string;
  nome: string;
  tipo: 'mensal' | 'trimestral' | 'anual' | 'personalizado';
  configuracao: Record<string, any>;
  data_inicio?: string;
  data_fim?: string;
  created_at: string;
  updated_at: string;
}

export interface RelatorioSalvoInput {
  nome: string;
  tipo: 'mensal' | 'trimestral' | 'anual' | 'personalizado';
  configuracao: Record<string, any>;
  data_inicio?: string;
  data_fim?: string;
}

export const TIPOS_META = {
  receita: 'Receita',
  economia: 'Economia',
  investimento: 'Investimento', 
  personalizada: 'Personalizada'
} as const;

export const STATUS_META = {
  ativa: 'Ativa',
  concluida: 'Concluída',
  cancelada: 'Cancelada'
} as const;