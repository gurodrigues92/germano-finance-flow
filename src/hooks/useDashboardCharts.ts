import { useMemo } from 'react';

interface DashboardChartsHook {
  currentData: {
    transactions: any[];
    totalBruto: number;
  };
}

export const useDashboardCharts = ({ currentData }: DashboardChartsHook) => {
  // Transaction count data for pie chart
  const transactionCountData = useMemo(() => {
    const counts = currentData.transactions.reduce(
      (acc, t) => {
        if (t.dinheiro > 0) acc.dinheiro++;
        if (t.pix > 0) acc.pix++;
        if (t.debito > 0) acc.debito++;
        if (t.credito > 0) acc.credito++;
        return acc;
      },
      { dinheiro: 0, pix: 0, debito: 0, credito: 0 }
    );

    return [
      { name: 'Dinheiro', value: counts.dinheiro, color: '#10b981' },
      { name: 'PIX', value: counts.pix, color: '#3b82f6' },
      { name: 'Débito', value: counts.debito, color: '#8b5cf6' },
      { name: 'Crédito', value: counts.credito, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [currentData]);

  // Payment methods data with monetary values for enhanced pie chart
  const paymentMethodsData = useMemo(() => {
    const totals = currentData.transactions.reduce(
      (acc, t) => ({
        dinheiro: acc.dinheiro + t.dinheiro,
        pix: acc.pix + t.pix,
        debito: acc.debito + t.debito,
        credito: acc.credito + t.credito
      }),
      { dinheiro: 0, pix: 0, debito: 0, credito: 0 }
    );

    return [
      { 
        name: 'Dinheiro', 
        value: totals.dinheiro, 
        color: '#10b981',
        percentage: currentData.totalBruto > 0 ? (totals.dinheiro / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'PIX', 
        value: totals.pix, 
        color: '#3b82f6',
        percentage: currentData.totalBruto > 0 ? (totals.pix / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'Débito', 
        value: totals.debito, 
        color: '#8b5cf6',
        percentage: currentData.totalBruto > 0 ? (totals.debito / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'Crédito', 
        value: totals.credito, 
        color: '#ef4444',
        percentage: currentData.totalBruto > 0 ? (totals.credito / currentData.totalBruto * 100) : 0
      }
    ].filter(item => item.value > 0);
  }, [currentData]);

  // Bi-weekly comparison data
  const biWeeklyData = useMemo(() => {
    const firstHalf = currentData.transactions.filter(t => {
      const day = new Date(t.date).getDate();
      return day <= 15;
    });
    
    const secondHalf = currentData.transactions.filter(t => {
      const day = new Date(t.date).getDate();
      return day > 15;
    });

    const calculateTotals = (transactions: any[]) => 
      transactions.reduce(
        (acc, t) => ({
          bruto: acc.bruto + t.totalBruto,
          liquido: acc.liquido + t.totalLiquido,
          count: acc.count + 1
        }),
        { bruto: 0, liquido: 0, count: 0 }
      );

    return {
      firstHalf: calculateTotals(firstHalf),
      secondHalf: calculateTotals(secondHalf)
    };
  }, [currentData]);

  return {
    transactionCountData,
    paymentMethodsData,
    biWeeklyData
  };
};