// Tipos para gestão completa de salão
export interface Cliente {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  foto_url?: string;
  data_nascimento?: string;
  endereco?: string;
  saldo: number;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  foto_url?: string;
  tipo: 'cabeleireiro' | 'assistente' | 'recepcionista';
  percentual_comissao: number;
  horario_trabalho?: HorarioTrabalho;
  cor_agenda: string;
  especialidades?: string[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface HorarioTrabalho {
  segunda?: { inicio: string; fim: string; ativo: boolean };
  terca?: { inicio: string; fim: string; ativo: boolean };
  quarta?: { inicio: string; fim: string; ativo: boolean };
  quinta?: { inicio: string; fim: string; ativo: boolean };
  sexta?: { inicio: string; fim: string; ativo: boolean };
  sabado?: { inicio: string; fim: string; ativo: boolean };
  domingo?: { inicio: string; fim: string; ativo: boolean };
}

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  duracao_minutos: number;
  descricao?: string;
  cor_categoria: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Agendamento {
  id: string;
  cliente_id: string;
  profissional_id: string;
  servico_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado';
  observacoes?: string;
  valor: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  // Dados relacionados para exibição
  cliente?: Cliente;
  profissional?: Profissional;
  servico?: Servico;
}

export interface Comanda {
  id: string;
  numero_comanda: number;
  cliente_id?: string;
  profissional_principal_id?: string;
  data_abertura: string;
  data_fechamento?: string;
  status: 'aberta' | 'fechada' | 'cancelada';
  total_bruto: number;
  desconto: number;
  total_liquido: number;
  observacoes?: string;
  // Métodos de pagamento (para integração com transações)
  dinheiro: number;
  pix: number;
  debito: number;
  credito: number;
  transacao_id?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  // Dados relacionados
  cliente?: Cliente;
  profissional_principal?: Profissional;
  itens?: ComandaItem[];
}

export interface ComandaItem {
  id: string;
  comanda_id: string;
  tipo: 'servico' | 'produto';
  item_id: string;
  nome_item: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  profissional_id?: string;
  created_at: string;
  // Dados relacionados
  profissional?: Profissional;
  servico?: Servico;
  produto?: any; // Referência aos produtos do estoque
}

export interface ProfissionalServico {
  id: string;
  profissional_id: string;
  servico_id: string;
  created_at: string;
}

export interface BloqueioAgenda {
  id: string;
  profissional_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  tipo: 'almoco' | 'falta' | 'indisponivel' | 'folga';
  motivo?: string;
  cor: string;
  created_at: string;
  user_id?: string;
  // Dados relacionados
  profissional?: Profissional;
}

// Tipos para formulários
export interface ClienteFormData {
  nome: string;
  telefone?: string;
  email?: string;
  data_nascimento?: string;
  endereco?: string;
  observacoes?: string;
  saldo?: number;
}

export interface ProfissionalFormData {
  nome: string;
  telefone?: string;
  email?: string;
  tipo: 'cabeleireiro' | 'assistente' | 'recepcionista';
  percentual_comissao: number;
  cor_agenda: string;
  horario_trabalho?: HorarioTrabalho;
}

export interface ServicoFormData {
  nome: string;
  categoria: string;
  preco: number;
  duracao_minutos: number;
  descricao?: string;
  cor_categoria: string;
}

export interface AgendamentoFormData {
  cliente_id: string;
  profissional_id: string;
  servico_id: string;
  data: string;
  hora_inicio: string;
  observacoes?: string;
}

export interface ComandaFormData {
  cliente_id?: string;
  profissional_principal_id?: string;
  observacoes?: string;
}

// Tipos para filtros e busca
export interface ClienteFilters {
  search?: string;
  status?: 'todos' | 'agendados' | 'com_credito' | 'em_debito' | 'com_pacote' | 'aniversariantes' | 'inativos_30_dias' | 'primeira_visita';
  ativo?: boolean;
  data_nascimento?: {
    mes?: number;
    periodo?: 'este_mes' | 'proximo_mes';
  };
  ultima_visita?: {
    periodo?: 'ultimos_7_dias' | 'ultimos_30_dias' | 'mais_de_30_dias' | 'mais_de_90_dias';
  };
  valor_gasto?: {
    min?: number;
    max?: number;
    periodo?: 'total' | 'ultimo_mes' | 'ultimo_ano';
  };
  ordenacao?: 'nome' | 'ultima_visita' | 'valor_gasto' | 'saldo' | 'data_cadastro';
  direcao?: 'asc' | 'desc';
}

export interface AgendaFilters {
  data_inicio: string;
  data_fim: string;
  profissional_id?: string;
  status?: string[];
}

// Constantes úteis
export const CATEGORIAS_SERVICO = [
  'Corte',
  'Coloração',
  'Tratamentos',
  'Manicure',
  'Pedicure',
  'Sobrancelha',
  'Massagem',
  'Outros'
];

export const CORES_CATEGORIA = [
  '#8B5CF6', // Roxo principal
  '#EF4444', // Vermelho
  '#10B981', // Verde
  '#3B82F6', // Azul
  '#F59E0B', // Amarelo
  '#EC4899', // Rosa
  '#6366F1', // Índigo
  '#14B8A6', // Teal
];

export const CORES_PROFISSIONAL = [
  '#8B5CF6', // Roxo principal
  '#EF4444', // Vermelho
  '#10B981', // Verde
  '#3B82F6', // Azul
  '#F59E0B', // Amarelo
  '#EC4899', // Rosa
  '#6366F1', // Índigo
  '#14B8A6', // Teal
  '#8B5CF6', // Roxo
  '#F97316', // Laranja
];

export const STATUS_AGENDAMENTO = [
  { value: 'agendado', label: 'Agendado', color: '#6B7280' },
  { value: 'confirmado', label: 'Confirmado', color: '#3B82F6' },
  { value: 'em_atendimento', label: 'Em Atendimento', color: '#F59E0B' },
  { value: 'concluido', label: 'Concluído', color: '#10B981' },
  { value: 'cancelado', label: 'Cancelado', color: '#EF4444' },
];

export const TIPOS_BLOQUEIO = [
  { value: 'lunch-time', label: 'Lunch Time', color: '#6f42c1', description: 'Horário de almoço' },
  { value: 'lack', label: 'Lack', color: '#dc3545', description: 'Falta do profissional' },
  { value: 'unavailable', label: 'Unavailable', color: '#ffc107', description: 'Indisponível temporariamente' },
];