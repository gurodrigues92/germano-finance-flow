import { DEBIT_TAX_RATE, CREDIT_TAX_RATE, STUDIO_SHARE, EDU_SHARE, KAM_SHARE } from '@/types/finance';

export interface TransactionCalculation {
  totalBruto: number;
  taxaDebito: number;
  taxaCredito: number;
  totalLiquido: number;
  studioShare: number;
  eduShare: number;
  kamShare: number;
}

export interface CustomRates {
  studioRate: number;
  eduRate: number;
  kamRate: number;
  assistenteCalculationMode?: 'percentage_of_profissional' | 'percentage_of_total';
}

export const calculateTransaction = (
  dinheiro: number,
  pix: number,
  debito: number,
  credito: number,
  customRates?: CustomRates
): TransactionCalculation => {
  const totalBruto = dinheiro + pix + debito + credito;
  const taxaDebito = debito * DEBIT_TAX_RATE;
  const taxaCredito = credito * CREDIT_TAX_RATE;
  const totalLiquido = totalBruto - taxaDebito - taxaCredito;
  
  // Usar taxas customizadas ou padrão
  const studioRate = customRates ? customRates.studioRate / 100 : STUDIO_SHARE;
  const eduRate = customRates ? customRates.eduRate / 100 : EDU_SHARE;
  const kamRate = customRates ? customRates.kamRate / 100 : KAM_SHARE;
  
  const studioShare = totalLiquido * studioRate;
  const eduShare = totalLiquido * eduRate;
  
  // Calcular assistente baseado no modo selecionado
  let kamShare: number;
  if (customRates?.assistenteCalculationMode === 'percentage_of_total') {
    kamShare = totalLiquido * kamRate; // % do total líquido
  } else {
    kamShare = eduShare * kamRate; // % do valor do profissional (padrão)
  }
  
  return {
    totalBruto,
    taxaDebito,
    taxaCredito,
    totalLiquido,
    studioShare,
    eduShare,
    kamShare
  };
};