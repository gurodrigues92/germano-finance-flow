import { useMemo } from 'react';
import { Transaction } from '@/types/finance';
import { useFinance } from '@/hooks/useFinance';
import { useCustosFixos } from '@/hooks/useCustosFixos';
import { useInvestimentos } from '@/hooks/useInvestimentos';
import { useProdutos } from '@/hooks/useProdutos';

export const useAdvancedAnalytics = (currentMonth: string) => {
  const { transactions, archivedData } = useFinance();
  const { custos } = useCustosFixos();
  const { investimentos } = useInvestimentos();
  const { produtos } = useProdutos();

  return useMemo(() => {
    // Get current month transactions
    const currentData = transactions.filter(t => t.month === currentMonth);
    
    // Get previous month for comparison
    const currentDate = new Date(currentMonth + '-01');
    const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonth = previousDate.toISOString().slice(0, 7);
    
    const previousData = transactions.filter(t => t.month === previousMonth);

    // Enhanced evolution data with new metrics
    const evolutionData = useMemo(() => {
      const last12Months = [];
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
      
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const monthStr = monthDate.toISOString().slice(0, 7);
        const monthTransactions = transactions.filter(t => t.month === monthStr);
        
        const bruto = monthTransactions.reduce((sum, t) => sum + t.totalBruto, 0);
        const liquido = monthTransactions.reduce((sum, t) => sum + t.totalLiquido, 0);
        const transacoes = monthTransactions.length;
        const ticketMedio = transacoes > 0 ? bruto / transacoes : 0;
        const margem = bruto > 0 ? (liquido / bruto) * 100 : 0;
        
        last12Months.push({
          month: monthStr,
          fullMonth: monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          bruto,
          liquido,
          transacoes,
          ticketMedio,
          margem
        });
      }
      
      return last12Months;
    }, [transactions, currentDate]);

    // Enhanced payment methods analytics
    const paymentMethodsAnalytics = useMemo(() => {
      const calculateMethodData = (transactions: Transaction[]) => {
        return transactions.reduce((acc, t) => ({
          dinheiro: { value: acc.dinheiro.value + t.dinheiro, count: acc.dinheiro.count + (t.dinheiro > 0 ? 1 : 0) },
          pix: { value: acc.pix.value + t.pix, count: acc.pix.count + (t.pix > 0 ? 1 : 0) },
          debito: { value: acc.debito.value + t.debito, count: acc.debito.count + (t.debito > 0 ? 1 : 0) },
          credito: { value: acc.credito.value + t.credito, count: acc.credito.count + (t.credito > 0 ? 1 : 0) }
        }), {
          dinheiro: { value: 0, count: 0 },
          pix: { value: 0, count: 0 },
          debito: { value: 0, count: 0 },
          credito: { value: 0, count: 0 }
        });
      };

      const currentMethods = calculateMethodData(currentData);
      const previousMethods = calculateMethodData(previousData);
      const totalCurrent = Object.values(currentMethods).reduce((sum, m) => sum + m.value, 0);

      return [
        {
          name: 'Dinheiro',
          value: currentMethods.dinheiro.value,
          count: currentMethods.dinheiro.count,
          ticketMedio: currentMethods.dinheiro.count > 0 ? currentMethods.dinheiro.value / currentMethods.dinheiro.count : 0,
          percentage: totalCurrent > 0 ? (currentMethods.dinheiro.value / totalCurrent) * 100 : 0,
          previousValue: previousMethods.dinheiro.value,
          previousCount: previousMethods.dinheiro.count,
          color: '#10b981'
        },
        {
          name: 'PIX',
          value: currentMethods.pix.value,
          count: currentMethods.pix.count,
          ticketMedio: currentMethods.pix.count > 0 ? currentMethods.pix.value / currentMethods.pix.count : 0,
          percentage: totalCurrent > 0 ? (currentMethods.pix.value / totalCurrent) * 100 : 0,
          previousValue: previousMethods.pix.value,
          previousCount: previousMethods.pix.count,
          color: '#3b82f6'
        },
        {
          name: 'Débito',
          value: currentMethods.debito.value,
          count: currentMethods.debito.count,
          ticketMedio: currentMethods.debito.count > 0 ? currentMethods.debito.value / currentMethods.debito.count : 0,
          percentage: totalCurrent > 0 ? (currentMethods.debito.value / totalCurrent) * 100 : 0,
          previousValue: previousMethods.debito.value,
          previousCount: previousMethods.debito.count,
          color: '#8b5cf6'
        },
        {
          name: 'Crédito',
          value: currentMethods.credito.value,
          count: currentMethods.credito.count,
          ticketMedio: currentMethods.credito.count > 0 ? currentMethods.credito.value / currentMethods.credito.count : 0,
          percentage: totalCurrent > 0 ? (currentMethods.credito.value / totalCurrent) * 100 : 0,
          previousValue: previousMethods.credito.value,
          previousCount: previousMethods.credito.count,
          color: '#ef4444'
        }
      ].filter(method => method.value > 0);
    }, [currentData, previousData]);

    // Performance heatmap data
    const performanceHeatmap = useMemo(() => {
      const heatmapData = [];
      const monthDate = new Date(currentMonth + '-01');
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentMonth}-${day.toString().padStart(2, '0')}`;
        const dayTransactions = currentData.filter(t => t.date === dateStr);
        const dayTotal = dayTransactions.reduce((sum, t) => sum + t.totalBruto, 0);
        
        heatmapData.push({
          day,
          date: dateStr,
          value: dayTotal,
          count: dayTransactions.length,
          weekday: new Date(dateStr).getDay()
        });
      }
      
      return heatmapData;
    }, [currentData, currentMonth]);

    return {
      currentData,
      previousData,
      evolutionData,
      paymentMethodsAnalytics,
      performanceHeatmap
    };
  }, [currentMonth, transactions]);
};