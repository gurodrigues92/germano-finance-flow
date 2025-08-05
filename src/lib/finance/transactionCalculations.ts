

export interface TransactionCalculationResult {
  totalBruto: number;
  taxaDebito: number;
  taxaCredito: number;
  totalLiquido: number;
  studioShare: number;
  eduShare: number;
  kamShare: number;
  studioRate: number;
  eduRate: number;
  kamRate: number;
  
}

export const calculateTransactionPreview = (
  dinheiro: string,
  pix: string,
  debito: string,
  credito: string,
  temAssistente: boolean = false
): TransactionCalculationResult => {
  const dinheiroValue = parseFloat(dinheiro) || 0;
  const pixValue = parseFloat(pix) || 0;
  const debitoValue = parseFloat(debito) || 0;
  const creditoValue = parseFloat(credito) || 0;
  
  const totalBruto = dinheiroValue + pixValue + debitoValue + creditoValue;
  const taxaDebito = debitoValue * 0.0161;
  const taxaCredito = creditoValue * 0.0351;
  const totalLiquido = totalBruto - taxaDebito - taxaCredito;
  
  // Usar taxas fixas padrão
  const studioRate = 0.6; // 60%
  const eduRate = 0.4; // 40%
  const kamRate = 0.1; // 10% do valor do profissional
  
  const studioShare = totalLiquido * studioRate;
  const eduShare = totalLiquido * eduRate;
  
  // Assistente: 10% do valor do profissional (apenas se tem assistente)
  const kamShare = temAssistente ? eduShare * kamRate : 0;
  
  return {
    totalBruto,
    taxaDebito,
    taxaCredito,
    totalLiquido,
    studioShare,
    eduShare,
    kamShare,
    studioRate: studioRate * 100,
    eduRate: eduRate * 100,
    kamRate: kamRate * 100
  };
};