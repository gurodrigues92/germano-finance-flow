import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useComandas } from '@/hooks/salon/useComandas';
import { useRelatorios } from '@/hooks/useRelatorios';
import { Transaction } from '@/types/finance';

export interface ReportFilter {
  startDate: string;
  endDate: string;
  clienteId?: string;
  profissionalId?: string;
  paymentMethod?: 'all' | 'dinheiro' | 'pix' | 'debito' | 'credito';
  minValue?: number;
  maxValue?: number;
}

export interface TrendAnalysis {
  period: string;
  revenue: number;
  growth: number;
  transactions: number;
  avgTicket: number;
}

export interface PredictiveAnalysis {
  nextMonthRevenue: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}

export const useAdvancedReports = () => {
  const { transactions } = useFinance();
  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();
  const { comandas } = useComandas();
  const { relatorios, saveRelatorio, deleteRelatorio } = useRelatorios();

  const [filters, setFilters] = useState<ReportFilter>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'all'
  });

  // Filtered transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);

      if (transactionDate < start || transactionDate > end) return false;
      if (filters.clienteId && transaction.clienteId !== filters.clienteId) return false;
      if (filters.profissionalId && transaction.profissionalId !== filters.profissionalId) return false;
      if (filters.minValue && transaction.totalBruto < filters.minValue) return false;
      if (filters.maxValue && transaction.totalBruto > filters.maxValue) return false;

      if (filters.paymentMethod !== 'all') {
        const paymentValue = transaction[filters.paymentMethod as keyof Transaction];
        const hasPaymentMethod = typeof paymentValue === 'number' && paymentValue > 0;
        if (!hasPaymentMethod) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // Revenue trend analysis - last 12 months
  const trendAnalysis = useMemo(() => {
    const trends: TrendAnalysis[] = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthTransactions = transactions.filter(t => t.month === monthStr);
      
      const revenue = monthTransactions.reduce((sum, t) => sum + t.totalBruto, 0);
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const prevMonthStr = prevMonth.toISOString().slice(0, 7);
      const prevMonthTransactions = transactions.filter(t => t.month === prevMonthStr);
      const prevRevenue = prevMonthTransactions.reduce((sum, t) => sum + t.totalBruto, 0);
      
      const growth = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
      const avgTicket = monthTransactions.length > 0 ? revenue / monthTransactions.length : 0;

      trends.push({
        period: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        revenue,
        growth,
        transactions: monthTransactions.length,
        avgTicket
      });
    }
    
    return trends;
  }, [transactions]);

  // Predictive analysis based on historical data
  const predictiveAnalysis = useMemo((): PredictiveAnalysis => {
    if (trendAnalysis.length < 3) {
      return {
        nextMonthRevenue: 0,
        confidence: 0,
        factors: ['Dados insuficientes para análise'],
        recommendation: 'Aguarde mais dados históricos'
      };
    }

    // Simple moving average prediction
    const lastThreeMonths = trendAnalysis.slice(-3);
    const avgRevenue = lastThreeMonths.reduce((sum, t) => sum + t.revenue, 0) / 3;
    const avgGrowth = lastThreeMonths.reduce((sum, t) => sum + t.growth, 0) / 3;
    
    const nextMonthRevenue = avgRevenue * (1 + (avgGrowth / 100));
    const lastMonthRevenue = trendAnalysis[trendAnalysis.length - 1].revenue;
    
    // Confidence based on growth consistency
    const growthVariance = lastThreeMonths.reduce((sum, t) => {
      return sum + Math.pow(t.growth - avgGrowth, 2);
    }, 0) / 3;
    const confidence = Math.max(0, Math.min(100, 100 - (growthVariance / 10)));

    // Factors affecting prediction
    const factors = [];
    if (avgGrowth > 10) factors.push('Crescimento consistente');
    if (avgGrowth < -5) factors.push('Tendência de queda');
    if (lastMonthRevenue > avgRevenue * 1.2) factors.push('Pico de receita recente');
    if (growthVariance < 25) factors.push('Resultados estáveis');

    // Recommendation
    let recommendation = '';
    if (avgGrowth > 5) {
      recommendation = 'Continue estratégias atuais, considere expandir';
    } else if (avgGrowth < -5) {
      recommendation = 'Revisar estratégias, focar retenção de clientes';
    } else {
      recommendation = 'Buscar novas oportunidades de crescimento';
    }

    return {
      nextMonthRevenue,
      confidence,
      factors,
      recommendation
    };
  }, [trendAnalysis]);

  // Performance by day of week
  const performanceByDay = useMemo(() => {
    const dayStats = Array(7).fill(0).map((_, index) => ({
      day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index],
      revenue: 0,
      transactions: 0,
      avgTicket: 0
    }));

    filteredTransactions.forEach(transaction => {
      const dayOfWeek = new Date(transaction.date).getDay();
      dayStats[dayOfWeek].revenue += transaction.totalBruto;
      dayStats[dayOfWeek].transactions += 1;
    });

    dayStats.forEach(day => {
      day.avgTicket = day.transactions > 0 ? day.revenue / day.transactions : 0;
    });

    return dayStats;
  }, [filteredTransactions]);

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportTransactions = () => {
    const exportData = filteredTransactions.map(t => ({
      Data: t.date,
      'Total Bruto': t.totalBruto,
      'Total Líquido': t.totalLiquido,
      Dinheiro: t.dinheiro,
      PIX: t.pix,
      Débito: t.debito,
      Crédito: t.credito,
      Status: t.status,
      Cliente: clientes.find(c => c.id === t.clienteId)?.nome || 'N/A',
      Profissional: profissionais.find(p => p.id === t.profissionalId)?.nome || 'N/A'
    }));

    exportToCSV(exportData, `transacoes_${filters.startDate}_${filters.endDate}`);
  };

  const exportTrendAnalysis = () => {
    exportToCSV(trendAnalysis, 'analise_tendencia');
  };

  // Save custom report
  const saveCustomReport = async (name: string) => {
    const reportConfig = {
      filters,
      trendAnalysis,
      predictiveAnalysis,
      performanceByDay,
      generatedAt: new Date().toISOString()
    };

    return await saveRelatorio({
      nome: name,
      tipo: 'personalizado',
      configuracao: reportConfig,
      data_inicio: filters.startDate,
      data_fim: filters.endDate
    });
  };

  return {
    filters,
    setFilters,
    filteredTransactions,
    trendAnalysis,
    predictiveAnalysis,
    performanceByDay,
    relatorios,
    exportTransactions,
    exportTrendAnalysis,
    saveCustomReport,
    deleteRelatorio
  };
};