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

export const calculateTransaction = (
  dinheiro: number,
  pix: number,
  debito: number,
  credito: number
): TransactionCalculation => {
  const totalBruto = dinheiro + pix + debito + credito;
  const taxaDebito = debito * DEBIT_TAX_RATE;
  const taxaCredito = credito * CREDIT_TAX_RATE;
  const totalLiquido = totalBruto - taxaDebito - taxaCredito;
  
  return {
    totalBruto,
    taxaDebito,
    taxaCredito,
    totalLiquido,
    studioShare: totalLiquido * STUDIO_SHARE,
    eduShare: totalLiquido * EDU_SHARE,
    kamShare: totalLiquido * KAM_SHARE
  };
};