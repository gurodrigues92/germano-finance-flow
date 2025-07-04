export interface Transaction {
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
}

export interface MonthlyData {
  month: string;
  year: number;
  transactions: Transaction[];
  totalBruto: number;
  totalLiquido: number;
  totalStudio: number;
  totalEdu: number;
  totalKam: number;
  totalTaxas: number;
  totalDinheiro: number;
  totalPix: number;
  totalDebito: number;
  totalCredito: number;
}

export interface FinanceState {
  transactions: Transaction[];
  currentMonth: string;
  currentYear: number;
  archivedData: MonthlyData[];
}

export const DEBIT_TAX_RATE = 0.0161; // 1.61%
export const CREDIT_TAX_RATE = 0.0351; // 3.51%
export const STUDIO_SHARE = 0.6; // 60%
export const EDU_SHARE = 0.4; // 40%
export const KAM_SHARE = 0.1; // 10%