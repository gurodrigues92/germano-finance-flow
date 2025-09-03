import { useMemo } from 'react';

export const useArchiveData = (transactions: any[]) => {
  const monthlyArchive = useMemo(() => {
    // Filter transactions from 2025 onwards only
    const filteredTransactions = transactions.filter(t => 
      new Date(t.date).getFullYear() >= 2025
    );
    
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const month = transaction.mes_referencia || transaction.month;
      if (!acc[month]) {
        acc[month] = {
          month,
          year: transaction.ano || transaction.year,
          transactions: [],
          totalBruto: 0,
          totalLiquido: 0,
          totalTaxas: 0,
          totalStudio: 0,
          totalEdu: 0,
          totalKam: 0
        };
      }
      
      acc[month].transactions.push(transaction);
      acc[month].totalBruto += transaction.totalBruto;
      acc[month].totalLiquido += transaction.totalLiquido;
      acc[month].totalTaxas += transaction.taxaDebito + transaction.taxaCredito;
      acc[month].totalStudio += transaction.studioShare;
      acc[month].totalEdu += transaction.eduShare;
      acc[month].totalKam += transaction.kamShare;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).sort((a: any, b: any) => b.month.localeCompare(a.month));
  }, [transactions]);


  return {
    monthlyArchive
  };
};