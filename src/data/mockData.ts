export interface RealTransaction {
  id: string;
  date: string;
  dinheiro: number;
  pix: number;
  debito: number;
  credito: number;
  totalBruto: number;
  taxaDebito: number;
  taxaCredito: number;
  totalLiquido: number;
  studioShare: number;
  eduShare: number;
  kamShare: number;
  month: string;
  year: number;
  createdAt: string;
  observacoes?: string;
}

export interface StockProduct {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  valorUnitario: number;
  status: 'baixo' | 'normal' | 'alto';
}

export interface Investment {
  id: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  valor: number;
  dataCompra: string;
  fornecedor: string;
  garantiaMeses: number;
  observacoes: string;
}

export interface FixedCost {
  id: string;
  categoria: string;
  subcategoria: string;
  valor: number;
  observacoes: string;
  mesReferencia: string;
}

export interface FinancialGoal {
  id: string;
  titulo: string;
  valor: number;
  valorAtual: number;
  dataInicio: string;
  dataFim: string;
  status: 'ativa' | 'concluida' | 'pausada';
  progresso: number;
}

// Taxas do sistema
export const DEBIT_TAX_RATE = 0.0161; // 1.61%
export const CREDIT_TAX_RATE = 0.0351; // 3.51%
export const STUDIO_SHARE = 0.6; // 60%
export const EDU_SHARE = 0.4; // 40%
export const KAM_SHARE = 0.1; // 10%

// Função para calcular transação completa
const createTransaction = (
  id: string,
  date: string,
  dinheiro: number,
  pix: number,
  debito: number,
  credito: number,
  observacoes?: string
): RealTransaction => {
  const totalBruto = dinheiro + pix + debito + credito;
  const taxaDebito = debito * DEBIT_TAX_RATE;
  const taxaCredito = credito * CREDIT_TAX_RATE;
  const totalLiquido = totalBruto - taxaDebito - taxaCredito;
  const studioShare = totalLiquido * STUDIO_SHARE;
  const eduShare = totalLiquido * EDU_SHARE;
  const kamShare = totalLiquido * KAM_SHARE;
  
  return {
    id,
    date,
    dinheiro,
    pix,
    debito,
    credito,
    totalBruto,
    taxaDebito,
    taxaCredito,
    totalLiquido,
    studioShare,
    eduShare,
    kamShare,
    month: date.slice(0, 7),
    year: parseInt(date.slice(0, 4)),
    createdAt: new Date(date + 'T10:00:00Z').toISOString(),
    observacoes
  };
};

// DADOS REAIS DO STUDIO GERMANO - JULHO 2025
export const realTransactions: RealTransaction[] = [
  createTransaction("1", "2025-07-01", 100, 315, 200, 485, "Dia movimentado - retorno pós feriado"),
  createTransaction("2", "2025-07-02", 0, 330, 385, 190, "Terça normal, muitos débitos"),
  createTransaction("3", "2025-07-03", 0, 90, 315, 810, "Quarta com muitos cartões"),
  createTransaction("4", "2025-07-04", 0, 175, 120, 390, "Quinta mais calma"),
  createTransaction("5", "2025-07-05", 90, 225, 180, 340, "Sexta equilibrada"),
  createTransaction("6", "2025-07-06", 0, 0, 0, 200, "Sábado só crédito"),
  createTransaction("7", "2025-07-07", 0, 1400, 0, 0, "Domingo especial - PIX grande"),
];

// PRODUTOS DE ESTOQUE
export const stockProducts: StockProduct[] = [
  {
    id: "1",
    nome: "Shampoo Profissional L'Oréal",
    categoria: "Shampoo",
    unidade: "Litro",
    estoqueAtual: 3,
    estoqueMinimo: 5,
    valorUnitario: 45.90,
    status: "baixo"
  },
  {
    id: "2",
    nome: "Condicionador Hydra Intense",
    categoria: "Condicionador",
    unidade: "Litro",
    estoqueAtual: 8,
    estoqueMinimo: 4,
    valorUnitario: 38.50,
    status: "normal"
  },
  {
    id: "3",
    nome: "Tinta Coloração 6.0 Louro Escuro",
    categoria: "Tinta",
    unidade: "Tubo",
    estoqueAtual: 2,
    estoqueMinimo: 3,
    valorUnitario: 22.90,
    status: "baixo"
  },
  {
    id: "4",
    nome: "Escova Térmica Profissional",
    categoria: "Equipamentos",
    unidade: "Unidade",
    estoqueAtual: 6,
    estoqueMinimo: 2,
    valorUnitario: 85.00,
    status: "normal"
  },
  {
    id: "5",
    nome: "Ampola de Tratamento Intense",
    categoria: "Tratamento",
    unidade: "Unidade",
    estoqueAtual: 1,
    estoqueMinimo: 10,
    valorUnitario: 15.90,
    status: "baixo"
  },
  {
    id: "6",
    nome: "Máscara Hidratante Profissional",
    categoria: "Tratamento",
    unidade: "Kg",
    estoqueAtual: 12,
    estoqueMinimo: 3,
    valorUnitario: 65.00,
    status: "normal"
  },
  {
    id: "7",
    nome: "Tinta Coloração 4.0 Castanho",
    categoria: "Tinta",
    unidade: "Tubo",
    estoqueAtual: 0,
    estoqueMinimo: 3,
    valorUnitario: 22.90,
    status: "baixo"
  },
  {
    id: "8",
    nome: "Spray Finalizador",
    categoria: "Finalizador",
    unidade: "Frasco",
    estoqueAtual: 15,
    estoqueMinimo: 5,
    valorUnitario: 28.50,
    status: "normal"
  }
];

// INVESTIMENTOS
export const investments: Investment[] = [
  {
    id: "1",
    categoria: "Equipamentos",
    subcategoria: "Secadores",
    descricao: "Secador Profissional Taiff 2000W",
    valor: 450.00,
    dataCompra: "2025-06-15",
    fornecedor: "Distribuidora Beauty Pro",
    garantiaMeses: 12,
    observacoes: "Secador principal do salão"
  },
  {
    id: "2",
    categoria: "Mobiliário",
    subcategoria: "Cadeiras",
    descricao: "Cadeira Hidráulica para Corte",
    valor: 890.00,
    dataCompra: "2025-05-20",
    fornecedor: "Móveis para Salão Ltda",
    garantiaMeses: 24,
    observacoes: "Cadeira nova para segunda posição"
  },
  {
    id: "3",
    categoria: "Desenvolvimento",
    subcategoria: "Cursos",
    descricao: "Curso de Coloração Avançada",
    valor: 650.00,
    dataCompra: "2025-06-01",
    fornecedor: "Instituto de Beleza SP",
    garantiaMeses: 0,
    observacoes: "Capacitação para nova técnica"
  },
  {
    id: "4",
    categoria: "Equipamentos",
    subcategoria: "Lavatórios",
    descricao: "Lavatório com Massageador",
    valor: 1200.00,
    dataCompra: "2025-04-10",
    fornecedor: "Equipamentos Pro",
    garantiaMeses: 18,
    observacoes: "Melhoria no conforto dos clientes"
  },
  {
    id: "5",
    categoria: "Tecnologia",
    subcategoria: "Sistema",
    descricao: "Sistema de Gestão Financeira",
    valor: 580.00,
    dataCompra: "2025-06-30",
    fornecedor: "Lovable Development",
    garantiaMeses: 12,
    observacoes: "Automação dos processos financeiros"
  }
];

// CUSTOS FIXOS
export const fixedCosts: FixedCost[] = [
  {
    id: "1",
    categoria: "Infraestrutura",
    subcategoria: "Aluguel",
    valor: 2800.00,
    observacoes: "Aluguel mensal do salão",
    mesReferencia: "2025-07"
  },
  {
    id: "2",
    categoria: "Infraestrutura",
    subcategoria: "Conta de Luz",
    valor: 380.00,
    observacoes: "Conta de energia elétrica",
    mesReferencia: "2025-07"
  },
  {
    id: "3",
    categoria: "Infraestrutura",
    subcategoria: "Conta de Água",
    valor: 120.00,
    observacoes: "Conta de água e esgoto",
    mesReferencia: "2025-07"
  },
  {
    id: "4",
    categoria: "Serviços Profissionais",
    subcategoria: "Contabilidade",
    valor: 450.00,
    observacoes: "Serviços contábeis mensais",
    mesReferencia: "2025-07"
  },
  {
    id: "5",
    categoria: "Assinaturas",
    subcategoria: "Internet",
    valor: 89.90,
    observacoes: "Internet fibra óptica 200MB",
    mesReferencia: "2025-07"
  },
  {
    id: "6",
    categoria: "Impostos",
    subcategoria: "Simples Nacional",
    valor: 580.00,
    observacoes: "Imposto mensal simplificado",
    mesReferencia: "2025-07"
  },
  {
    id: "7",
    categoria: "Seguros",
    subcategoria: "Seguro do Estabelecimento",
    valor: 150.00,
    observacoes: "Seguro contra roubo e incêndio",
    mesReferencia: "2025-07"
  },
  {
    id: "8",
    categoria: "Marketing",
    subcategoria: "Redes Sociais",
    valor: 200.00,
    observacoes: "Impulsionamento Instagram e Google",
    mesReferencia: "2025-07"
  }
];

// METAS FINANCEIRAS
export const financialGoals: FinancialGoal[] = [
  {
    id: "1",
    titulo: "Faturamento Mensal Julho",
    valor: 50000.00,
    valorAtual: 6340.00,
    dataInicio: "2025-07-01",
    dataFim: "2025-07-31",
    status: "ativa",
    progresso: 12.68
  },
  {
    id: "2",
    titulo: "Reserva de Emergência",
    valor: 15000.00,
    valorAtual: 8500.00,
    dataInicio: "2025-01-01",
    dataFim: "2025-12-31",
    status: "ativa",
    progresso: 56.67
  },
  {
    id: "3",
    titulo: "Investimento em Equipamentos",
    valor: 5000.00,
    valorAtual: 3770.00,
    dataInicio: "2025-04-01",
    dataFim: "2025-08-31",
    status: "ativa",
    progresso: 75.40
  },
  {
    id: "4",
    titulo: "Capacitação Profissional",
    valor: 2000.00,
    valorAtual: 650.00,
    dataInicio: "2025-06-01",
    dataFim: "2025-12-31",
    status: "ativa",
    progresso: 32.50
  }
];

// FUNÇÕES UTILITÁRIAS
export const calculateTotals = (transactions: RealTransaction[]) => {
  return transactions.reduce(
    (acc, t) => ({
      totalBruto: acc.totalBruto + t.totalBruto,
      totalLiquido: acc.totalLiquido + t.totalLiquido,
      totalStudio: acc.totalStudio + t.studioShare,
      totalEdu: acc.totalEdu + t.eduShare,
      totalKam: acc.totalKam + t.kamShare,
      totalTaxas: acc.totalTaxas + t.taxaDebito + t.taxaCredito,
      totalDinheiro: acc.totalDinheiro + t.dinheiro,
      totalPix: acc.totalPix + t.pix,
      totalDebito: acc.totalDebito + t.debito,
      totalCredito: acc.totalCredito + t.credito
    }),
    {
      totalBruto: 0,
      totalLiquido: 0,
      totalStudio: 0,
      totalEdu: 0,
      totalKam: 0,
      totalTaxas: 0,
      totalDinheiro: 0,
      totalPix: 0,
      totalDebito: 0,
      totalCredito: 0
    }
  );
};

// Produtos com baixo estoque
export const getLowStockProducts = () => stockProducts.filter(p => p.estoqueAtual <= p.estoqueMinimo);

// Total investido
export const getTotalInvested = () => investments.reduce((sum, inv) => sum + inv.valor, 0);

// Total custos fixos
export const getTotalFixedCosts = () => fixedCosts.reduce((sum, cost) => sum + cost.valor, 0);

// Dados calculados do mês atual
export const currentMonthTotals = calculateTotals(realTransactions);

// Flag para controlar inicialização
export const DATA_INITIALIZED_KEY = 'studio_germano_data_initialized';
export const BACKUP_DATA_KEY = 'studio_germano_backup_data';