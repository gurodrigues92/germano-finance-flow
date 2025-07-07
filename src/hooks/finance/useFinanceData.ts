import { MonthlyData, FinanceState } from '@/types/finance';

export const useFinanceData = (state: FinanceState) => {
  const getMonthlyData = (month?: string): MonthlyData => {
    const targetMonth = month || state.currentMonth;
    // Filter transactions from 2025 onwards only
    const transactions = state.transactions.filter(t => 
      t.month === targetMonth && new Date(t.date).getFullYear() >= 2025
    );
    
    // Debug: Log filtering results
    console.log(`[FinanceData] Filtering for month: ${targetMonth}`);
    console.log(`[FinanceData] Total transactions: ${state.transactions.length}`);
    console.log(`[FinanceData] Filtered transactions: ${transactions.length}`);
    console.log(`[FinanceData] Available months:`, [...new Set(state.transactions.map(t => t.month))].sort());
    
    const totals = transactions.reduce(
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

    return {
      month: targetMonth,
      year: parseInt(targetMonth.split('-')[0]),
      transactions,
      ...totals
    };
  };

  return {
    getMonthlyData
  };
};