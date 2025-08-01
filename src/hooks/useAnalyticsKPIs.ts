import { useMemo } from 'react';
import { Transaction } from '@/types/finance';

interface AnalyticsKPIsProps {
  transactions: Transaction[];
  previousMonthTransactions: Transaction[];
}

export const useAnalyticsKPIs = ({ transactions, previousMonthTransactions }: AnalyticsKPIsProps) => {
  return useMemo(() => {
    // Current month calculations
    const totalBruto = transactions.reduce((sum, t) => sum + t.totalBruto, 0);
    const totalLiquido = transactions.reduce((sum, t) => sum + t.totalLiquido, 0);
    const totalTransactions = transactions.length;
    const ticketMedio = totalTransactions > 0 ? totalBruto / totalTransactions : 0;
    const margemLiquida = totalBruto > 0 ? (totalLiquido / totalBruto) * 100 : 0;
    
    // Previous month calculations
    const prevTotalBruto = previousMonthTransactions.reduce((sum, t) => sum + t.totalBruto, 0);
    const prevTotalLiquido = previousMonthTransactions.reduce((sum, t) => sum + t.totalLiquido, 0);
    const prevTotalTransactions = previousMonthTransactions.length;
    const prevTicketMedio = prevTotalTransactions > 0 ? prevTotalBruto / prevTotalTransactions : 0;
    const prevMargemLiquida = prevTotalBruto > 0 ? (prevTotalLiquido / prevTotalBruto) * 100 : 0;
    
    // Growth calculations
    const growthBruto = prevTotalBruto > 0 ? ((totalBruto - prevTotalBruto) / prevTotalBruto) * 100 : 0;
    const growthLiquido = prevTotalLiquido > 0 ? ((totalLiquido - prevTotalLiquido) / prevTotalLiquido) * 100 : 0;
    const growthTransactions = prevTotalTransactions > 0 ? ((totalTransactions - prevTotalTransactions) / prevTotalTransactions) * 100 : 0;
    const growthTicketMedio = prevTicketMedio > 0 ? ((ticketMedio - prevTicketMedio) / prevTicketMedio) * 100 : 0;
    const growthMargemLiquida = margemLiquida - prevMargemLiquida;
    
    // Efficiency metrics
    const diasComTransacao = new Set(transactions.map(t => t.date)).size;
    const frequenciaTransacoes = diasComTransacao > 0 ? totalTransactions / diasComTransacao : 0;
    const eficienciaOperacional = totalLiquido > 0 ? (totalTransactions / totalLiquido) * 1000 : 0; // Transactions per R$1000
    
    // Performance badges
    const getPerformanceBadge = (growth: number) => {
      if (growth >= 20) return { label: 'Excelente', color: 'bg-emerald-500', textColor: 'text-white' };
      if (growth >= 10) return { label: 'Muito Bom', color: 'bg-green-500', textColor: 'text-white' };
      if (growth >= 5) return { label: 'Bom', color: 'bg-blue-500', textColor: 'text-white' };
      if (growth >= 0) return { label: 'Estável', color: 'bg-yellow-500', textColor: 'text-white' };
      if (growth >= -5) return { label: 'Atenção', color: 'bg-orange-500', textColor: 'text-white' };
      return { label: 'Crítico', color: 'bg-red-500', textColor: 'text-white' };
    };

    return {
      kpis: [
        {
          title: 'Faturamento Bruto',
          value: totalBruto,
          growth: growthBruto,
          badge: getPerformanceBadge(growthBruto),
          format: 'currency' as const
        },
        {
          title: 'Faturamento Líquido',
          value: totalLiquido,
          growth: growthLiquido,
          badge: getPerformanceBadge(growthLiquido),
          format: 'currency' as const
        },
        {
          title: 'Ticket Médio (por transação)',
          value: ticketMedio,
          growth: growthTicketMedio,
          badge: getPerformanceBadge(growthTicketMedio),
          format: 'currency' as const
        },
        {
          title: 'Total de Transações',
          value: totalTransactions,
          growth: growthTransactions,
          badge: getPerformanceBadge(growthTransactions),
          format: 'number' as const
        },
        {
          title: 'Margem Líquida',
          value: margemLiquida,
          growth: growthMargemLiquida,
          badge: getPerformanceBadge(growthMargemLiquida),
          format: 'percentage' as const
        },
        {
          title: 'Frequência Diária',
          value: frequenciaTransacoes,
          growth: 0, // Could calculate if we had previous data
          badge: { label: 'Métricas', color: 'bg-purple-500', textColor: 'text-white' },
          format: 'decimal' as const
        }
      ],
      insights: {
        totalBruto,
        totalLiquido,
        totalTransactions,
        ticketMedio,
        margemLiquida,
        frequenciaTransacoes,
        eficienciaOperacional,
        diasComTransacao
      }
    };
  }, [transactions, previousMonthTransactions]);
};