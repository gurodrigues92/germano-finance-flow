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

// DADOS REAIS DO STUDIO GERMANO - MARÇO A JUNHO 2025
export const realTransactions: RealTransaction[] = [
  // MARÇO 2025
  createTransaction("1", "2025-03-18", 100, 315, 200, 485, "Retorno do meio da semana"),
  createTransaction("2", "2025-03-19", 0, 330, 385, 190, "Quinta com débitos"),
  createTransaction("3", "2025-03-20", 0, 90, 315, 810, "Sexta movimentada"),
  createTransaction("4", "2025-03-21", 0, 175, 120, 390, "Sábado equilibrado"),
  createTransaction("5", "2025-03-22", 90, 225, 180, 340, "Domingo bom"),
  createTransaction("6", "2025-03-23", 0, 0, 0, 200, "Segunda só crédito"),
  createTransaction("7", "2025-03-24", 0, 1400, 0, 0, "Terça especial PIX"),
  createTransaction("8", "2025-03-25", 0, 405, 0, 290, "Quarta mista"),
  createTransaction("9", "2025-03-26", 0, 110, 180, 180, "Quinta variada"),
  createTransaction("10", "2025-03-27", 315, 540, 100, 450, "Sexta excelente"),
  createTransaction("11", "2025-03-28", 0, 265, 305, 470, "Sábado forte"),
  createTransaction("12", "2025-03-29", 0, 140, 110, 950, "Domingo muito bom"),

  // ABRIL 2025
  createTransaction("13", "2025-04-01", 0, 270, 90, 320, "Início abril"),
  createTransaction("14", "2025-04-02", 140, 110, 290, 720, "Quarta forte"),
  createTransaction("15", "2025-04-03", 0, 270, 0, 360, "Quinta PIX"),
  createTransaction("16", "2025-04-04", 0, 375, 210, 735, "Sexta excelente"),
  createTransaction("17", "2025-04-05", 0, 1220, 180, 90, "Sábado PIX alto"),
  createTransaction("18", "2025-04-08", 0, 0, 225, 100, "Terça débito"),
  createTransaction("19", "2025-04-09", 90, 250, 0, 690, "Quarta boa"),
  createTransaction("20", "2025-04-10", 0, 2520, 100, 675, "Quinta excepcional"),
  createTransaction("21", "2025-04-11", 0, 740, 120, 1235, "Sexta muito forte"),
  createTransaction("22", "2025-04-12", 0, 870, 90, 200, "Sábado PIX"),
  createTransaction("23", "2025-04-15", 210, 200, 90, 670, "Terça equilibrada"),
  createTransaction("24", "2025-04-16", 0, 90, 0, 1115, "Quarta crédito"),
  createTransaction("25", "2025-04-17", 100, 610, 240, 440, "Quinta variada"),
  createTransaction("26", "2025-04-19", 0, 90, 150, 0, "Sábado fraco"),
  createTransaction("27", "2025-04-22", 0, 65, 295, 855, "Terça crédito"),
  createTransaction("28", "2025-04-23", 0, 1300, 890, 0, "Quarta débito"),
  createTransaction("29", "2025-04-24", 0, 1065, 0, 200, "Quinta PIX"),
  createTransaction("30", "2025-04-25", 90, 280, 305, 190, "Sexta mista"),
  createTransaction("31", "2025-04-26", 0, 700, 120, 150, "Sábado PIX"),
  createTransaction("32", "2025-04-29", 0, 90, 180, 180, "Terça equilibrada"),
  createTransaction("33", "2025-04-30", 0, 355, 0, 495, "Fim abril"),

  // MAIO 2025
  createTransaction("34", "2025-05-02", 0, 90, 2245, 1260, "Sexta débito alto"),
  createTransaction("35", "2025-05-03", 0, 790, 0, 420, "Sábado PIX"),
  createTransaction("36", "2025-05-05", 0, 0, 0, 350, "Segunda crédito"),
  createTransaction("37", "2025-05-06", 0, 420, 0, 190, "Terça PIX"),
  createTransaction("38", "2025-05-07", 90, 250, 180, 285, "Quarta variada"),
  createTransaction("39", "2025-05-08", 90, 225, 0, 690, "Quinta boa"),
  createTransaction("40", "2025-05-09", 0, 180, 120, 695, "Sexta equilibrada"),
  createTransaction("41", "2025-05-10", 0, 0, 0, 2070, "Sábado excepcional"),
  createTransaction("42", "2025-05-13", 310, 190, 180, 780, "Terça excelente"),
  createTransaction("43", "2025-05-14", 0, 200, 210, 575, "Quarta boa"),
  createTransaction("44", "2025-05-16", 0, 90, 405, 1465, "Sexta forte"),
  createTransaction("45", "2025-05-17", 0, 290, 0, 705, "Sábado crédito"),
  createTransaction("46", "2025-05-20", 0, 240, 0, 650, "Terça boa"),
  createTransaction("47", "2025-05-21", 0, 330, 0, 610, "Quarta PIX"),
  createTransaction("48", "2025-05-22", 310, 530, 0, 270, "Quinta variada"),
  createTransaction("49", "2025-05-23", 0, 265, 305, 380, "Sexta equilibrada"),
  createTransaction("50", "2025-05-24", 350, 140, 0, 280, "Sábado dinheiro"),
  createTransaction("51", "2025-05-27", 230, 100, 0, 835, "Terça mista"),
  createTransaction("52", "2025-05-28", 300, 430, 90, 350, "Quarta boa"),
  createTransaction("53", "2025-05-29", 0, 250, 420, 330, "Quinta débito"),
  createTransaction("54", "2025-05-30", 0, 415, 555, 310, "Sexta variada"),
  createTransaction("55", "2025-05-31", 0, 335, 125, 110, "Fim maio"),

  // JUNHO 2025
  createTransaction("56", "2025-06-03", 0, 110, 90, 1155, "Terça crédito alto"),
  createTransaction("57", "2025-06-04", 0, 110, 315, 0, "Quarta débito"),
  createTransaction("58", "2025-06-05", 0, 640, 280, 460, "Quinta boa"),
  createTransaction("59", "2025-06-06", 0, 210, 100, 0, "Sexta baixa"),
  createTransaction("60", "2025-06-10", 0, 0, 225, 0, "Terça só débito"),
  createTransaction("61", "2025-06-11", 0, 280, 0, 1495, "Quarta excelente"),
  createTransaction("62", "2025-06-12", 0, 695, 0, 425, "Quinta PIX"),
  createTransaction("63", "2025-06-13", 0, 330, 0, 640, "Sexta boa"),
  createTransaction("64", "2025-06-14", 0, 270, 35, 500, "Sábado equilibrado"),
  createTransaction("65", "2025-06-17", 0, 0, 180, 1710, "Terça crédito alto"),
  createTransaction("66", "2025-06-18", 90, 240, 180, 565, "Quarta variada"),
  createTransaction("67", "2025-06-20", 0, 810, 90, 280, "Sexta PIX"),
  createTransaction("68", "2025-06-21", 0, 180, 110, 750, "Sábado crédito"),
  createTransaction("69", "2025-06-22", 100, 280, 0, 825, "Domingo bom"),
  createTransaction("70", "2025-06-24", 0, 110, 100, 730, "Terça equilibrada"),
  createTransaction("71", "2025-06-25", 750, 110, 200, 90, "Quarta dinheiro alto"),
  createTransaction("72", "2025-06-26", 0, 395, 90, 490, "Quinta PIX"),
  createTransaction("73", "2025-06-27", 0, 0, 100, 555, "Sexta crédito"),
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
    valorAtual: 80605.00,
    dataInicio: "2025-07-01",
    dataFim: "2025-07-31",
    status: "concluida",
    progresso: 161.21
  },
  {
    id: "2",
    titulo: "Reserva de Emergência",
    valor: 15000.00,
    valorAtual: 12500.00,
    dataInicio: "2025-01-01",
    dataFim: "2025-12-31",
    status: "ativa",
    progresso: 83.33
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