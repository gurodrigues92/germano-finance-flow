// Validações robustas para dados financeiros empresariais
export const validateTransaction = (data: {
  date: string;
  dinheiro: number;
  pix: number;
  debito: number;
  credito: number;
}) => {
  const errors: string[] = [];

  // Validação de data
  const transactionDate = new Date(data.date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (isNaN(transactionDate.getTime())) {
    errors.push('Data inválida');
  } else if (transactionDate > today) {
    errors.push('Data não pode ser futura');
  }

  // Validação de valores - aceitar apenas números positivos
  const values = [data.dinheiro, data.pix, data.debito, data.credito];
  const hasInvalidValue = values.some(v => v < 0 || !Number.isFinite(v));
  
  if (hasInvalidValue) {
    errors.push('Valores devem ser números positivos válidos');
  }

  // Deve ter pelo menos um valor maior que zero
  const totalValue = values.reduce((sum, v) => sum + v, 0);
  if (totalValue <= 0) {
    errors.push('Pelo menos um valor deve ser maior que zero');
  }

  // Validar limites máximos (proteção contra erros de digitação)
  const MAX_SINGLE_VALUE = 1000000; // 1 milhão
  const hasValueTooLarge = values.some(v => v > MAX_SINGLE_VALUE);
  
  if (hasValueTooLarge) {
    errors.push(`Valor individual não pode exceder ${MAX_SINGLE_VALUE.toLocaleString('pt-BR')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validação de integridade de dados
export const validateCalculationIntegrity = (
  input: { dinheiro: number; pix: number; debito: number; credito: number },
  calculated: { totalBruto: number; taxaDebito: number; taxaCredito: number; totalLiquido: number }
) => {
  const expectedBruto = input.dinheiro + input.pix + input.debito + input.credito;
  const brutoDifference = Math.abs(expectedBruto - calculated.totalBruto);
  
  // Tolerância para arredondamentos (1 centavo)
  const TOLERANCE = 0.01;
  
  if (brutoDifference > TOLERANCE) {
    throw new Error(`Erro de cálculo: Total bruto esperado ${expectedBruto}, calculado ${calculated.totalBruto}`);
  }

  // Validar que líquido <= bruto
  if (calculated.totalLiquido > calculated.totalBruto + TOLERANCE) {
    throw new Error('Erro de cálculo: Total líquido não pode ser maior que bruto');
  }

  // Validar taxas não negativas
  if (calculated.taxaDebito < 0 || calculated.taxaCredito < 0) {
    throw new Error('Erro de cálculo: Taxas não podem ser negativas');
  }
};

// Sanitização de dados de entrada
export const sanitizeTransactionData = (data: any) => {
  return {
    date: String(data.date || '').trim(),
    dinheiro: Number(data.dinheiro) || 0,
    pix: Number(data.pix) || 0,
    debito: Number(data.debito) || 0,
    credito: Number(data.credito) || 0,
    customRates: data.customRates ? {
      studioRate: Number(data.customRates.studioRate) || 60,
      eduRate: Number(data.customRates.eduRate) || 40,
      kamRate: Number(data.customRates.kamRate) || 10
    } : undefined
  };
};