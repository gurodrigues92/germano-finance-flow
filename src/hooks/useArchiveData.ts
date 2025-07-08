import { useMemo } from 'react';

export const useArchiveData = (transactions: any[]) => {
  const monthlyArchive = useMemo(() => {
    // Filter transactions from 2025 onwards only
    const filteredTransactions = transactions.filter(t => 
      new Date(t.date).getFullYear() >= 2025
    );
    
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const month = transaction.month;
      if (!acc[month]) {
        acc[month] = {
          month,
          year: transaction.year,
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

  const exportMonthData = (monthData: any) => {
    try {
      const headers = [
        'Data',
        'Dinheiro',
        'PIX',
        'Débito',
        'Crédito',
        'Total Bruto',
        'Taxa Débito',
        'Taxa Crédito',
        'Total Líquido',
        'Studio (60%)',
        'Edu (40%)',
        'Kam (10%)'
      ];

      const csvContent = [
        headers.join(','),
        ...monthData.transactions.map((t: any) => [
          t.date,
          t.dinheiro,
          t.pix,
          t.debito,
          t.credito,
          t.totalBruto,
          t.taxaDebito,
          t.taxaCredito,
          t.totalLiquido,
          t.studioShare,
          t.eduShare,
          t.kamShare
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studio_germano_${monthData.month}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[Financeiro] Error exporting month data:', error);
    }
  };

  return {
    monthlyArchive,
    exportMonthData
  };
};