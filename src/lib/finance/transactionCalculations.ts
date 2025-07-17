import { CustomRates } from './calculations';

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
  useCustomRates: boolean,
  customRates?: CustomRates
): TransactionCalculationResult => {
  const dinheiroValue = parseFloat(dinheiro) || 0;
  const pixValue = parseFloat(pix) || 0;
  const debitoValue = parseFloat(debito) || 0;
  const creditoValue = parseFloat(credito) || 0;
  
  const totalBruto = dinheiroValue + pixValue + debitoValue + creditoValue;
  const taxaDebito = debitoValue * 0.0161;
  const taxaCredito = creditoValue * 0.0351;
  const totalLiquido = totalBruto - taxaDebito - taxaCredito;
  
  // Usar taxas customizadas se definidas, senão usar padrão
  const studioRate = useCustomRates && customRates 
    ? customRates.studioRate / 100 
    : 0.6;
  const eduRate = useCustomRates && customRates 
    ? customRates.eduRate / 100 
    : 0.4; 
  const kamRate = useCustomRates && customRates 
    ? customRates.kamRate / 100 
    : 0.1;
  
  const studioShare = totalLiquido * studioRate;
  const eduShare = totalLiquido * eduRate;
  
  // Assistente sempre calcula como % do valor do profissional
  const kamShare = eduShare * kamRate;
  
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