import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useCustosFixos } from '@/hooks/useCustosFixos';

import { useProdutos } from '@/hooks/useProdutos';

export const useAnalysisData = (currentMonth: string) => {
  const { getMonthlyData } = useFinance();
  const { totalPorCategoria: totalCustosPorCategoria, totalGeral: totalCustos } = useCustosFixos(currentMonth);
  
  const { produtos, valorTotalEstoque } = useProdutos();
  
  const currentData = getMonthlyData(currentMonth);

  // Generate month options - from March 2025 onwards
  const monthOptions = useMemo(() => {
    const options = [];
    const startDate = new Date('2025-03-01');
    const currentDate = new Date();
    
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth();
    
    const totalMonths = (currentYear - startYear) * 12 + (currentMonthNum - startMonth) + 1;
    
    for (let i = 0; i < totalMonths; i++) {
      const date = new Date(startYear, startMonth + i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      options.unshift({
        value: monthStr,
        label: date.toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        })
      });
    }
    
    return options;
  }, []);

  // Payment methods data
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
        color: 'hsl(var(--finance-income))',
        percentage: currentData.totalBruto > 0 ? (totals.dinheiro / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'PIX', 
        value: totals.pix, 
        color: 'hsl(var(--finance-net))',
        percentage: currentData.totalBruto > 0 ? (totals.pix / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'Débito', 
        value: totals.debito, 
        color: 'hsl(var(--finance-studio))',
        percentage: currentData.totalBruto > 0 ? (totals.debito / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'Crédito', 
        value: totals.credito, 
        color: 'hsl(var(--finance-fees))',
        percentage: currentData.totalBruto > 0 ? (totals.credito / currentData.totalBruto * 100) : 0
      }
    ].filter(item => item.value > 0);
  }, [currentData]);

  // Last 12 months evolution
  const evolutionData = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const data = getMonthlyData(monthStr);
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        fullMonth: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        bruto: data.totalBruto,
        liquido: data.totalLiquido,
        taxas: data.totalTaxas,
        studio: data.totalStudio,
        edu: data.totalEdu,
        kam: data.totalKam,
        transacoes: data.transactions.length
      });
    }
    return months;
  }, [getMonthlyData]);

  // Shares distribution
  const sharesData = [
    { 
      name: 'Studio (60%)', 
      value: currentData.totalStudio, 
      color: 'hsl(var(--finance-studio))',
      percentage: 60
    },
    { 
      name: 'Profissional (40%)', 
      value: currentData.totalEdu, 
      color: 'hsl(var(--finance-profissional))',
      percentage: 40
    },
    { 
      name: 'Assistente (4%)', 
      value: currentData.totalKam, 
      color: 'hsl(var(--finance-assistente))',
      percentage: 4
    }
  ];

  // Calculate month-over-month growth
  const previousMonth = useMemo(() => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  }, [currentMonth]);
  
  const previousData = getMonthlyData(previousMonth);
  const growth = useMemo(() => {
    if (previousData.totalBruto === 0) return 0;
    return ((currentData.totalBruto - previousData.totalBruto) / previousData.totalBruto) * 100;
  }, [currentData.totalBruto, previousData.totalBruto]);

  // Fixed Costs by Category
  const custosData = useMemo(() => {
    return Object.entries(totalCustosPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: categoria === 'Infraestrutura' ? 'hsl(var(--destructive))' :
             categoria === 'Serviços Profissionais' ? 'hsl(var(--warning))' :
             'hsl(var(--primary))',
      percentage: totalCustos > 0 ? (valor / totalCustos * 100) : 0
    }));
  }, [totalCustosPorCategoria, totalCustos]);

  // Investments by Category (removed)
  const investimentosData = [];

  // Stock Status
  const estoqueData = useMemo(() => {
    const produtosOk = produtos.filter(p => p.estoque_atual > p.estoque_minimo);
    const produtosBaixo = produtos.filter(p => p.estoque_atual <= p.estoque_minimo && p.estoque_atual > 0);
    const produtosSemEstoque = produtos.filter(p => p.estoque_atual === 0);

    const valorOk = produtosOk.reduce((sum, p) => sum + (p.estoque_atual * (p.valor_unitario || 0)), 0);
    const valorBaixo = produtosBaixo.reduce((sum, p) => sum + (p.estoque_atual * (p.valor_unitario || 0)), 0);
    const valorSemEstoque = produtosSemEstoque.reduce((sum, p) => sum + (p.estoque_atual * (p.valor_unitario || 0)), 0);

    return [
      {
        name: 'Estoque OK',
        value: valorOk,
        count: produtosOk.length,
        color: 'hsl(var(--success))',
        percentage: valorTotalEstoque > 0 ? (valorOk / valorTotalEstoque * 100) : 0
      },
      {
        name: 'Estoque Baixo',
        value: valorBaixo,
        count: produtosBaixo.length,
        color: 'hsl(var(--warning))',
        percentage: valorTotalEstoque > 0 ? (valorBaixo / valorTotalEstoque * 100) : 0
      },
      {
        name: 'Sem Estoque',
        value: valorSemEstoque,
        count: produtosSemEstoque.length,
        color: 'hsl(var(--destructive))',
        percentage: valorTotalEstoque > 0 ? (valorSemEstoque / valorTotalEstoque * 100) : 0
      }
    ].filter(item => item.count > 0);
  }, [produtos, valorTotalEstoque]);

  return {
    currentData,
    monthOptions,
    paymentMethodsData,
    evolutionData,
    sharesData,
    growth,
    custosData,
    investimentosData,
    estoqueData
  };
};