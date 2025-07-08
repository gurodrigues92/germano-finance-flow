import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useFinanceData } from '@/hooks/finance/useFinanceData';
import { useDataInitializer } from '@/hooks/useDataInitializer';
import { StockAlert } from '@/components/alerts/StockAlert';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { HeroMetrics } from '@/components/dashboard/HeroMetrics';
import { PaymentMethodsGrid } from '@/components/dashboard/PaymentMethodsGrid';
import { DistributionGrid } from '@/components/dashboard/DistributionGrid';
import { TransactionCharts } from '@/components/dashboard/TransactionCharts';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { MigrationPrompt } from '@/components/migration/MigrationPrompt';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

export const Dashboard = () => {
  const financeState = useFinance();
  const { currentMonth, setCurrentMonth, getMonthlyData, transactions } = financeState;
  const { getAvailableMonths } = useFinanceData({ 
    transactions, 
    currentMonth, 
    currentYear: financeState.currentYear,
    archivedData: financeState.archivedData || []
  });
  
  // Inicializar dados reais
  useDataInitializer();
  
  const currentData = getMonthlyData(currentMonth);
  
  // Previous month data for comparison
  const previousMonth = useMemo(() => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  }, [currentMonth]);
  
  const previousData = getMonthlyData(previousMonth);

  // Calculate trends
  const trends = useMemo(() => ({
    bruto: currentData.totalBruto - previousData.totalBruto,
    liquido: currentData.totalLiquido - previousData.totalLiquido,
    studio: currentData.totalStudio - previousData.totalStudio,
    edu: currentData.totalEdu - previousData.totalEdu,
    kam: currentData.totalKam - previousData.totalKam,
    taxas: currentData.totalTaxas - previousData.totalTaxas,
    dinheiro: currentData.totalDinheiro - previousData.totalDinheiro,
    pix: currentData.totalPix - previousData.totalPix,
    debito: currentData.totalDebito - previousData.totalDebito,
    credito: currentData.totalCredito - previousData.totalCredito
  }), [currentData, previousData]);

  const availableMonths = getAvailableMonths();
  
  // Dynamic month options - from March 2025 to current month
  const monthOptions = useMemo(() => {
    const options = [];
    const startDate = new Date('2025-03-01'); // Start from March 2025 (first month with data)
    const currentDate = new Date();
    
    // Generate months from March 2025 to current month
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Calculate total months from start to current
    const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth) + 1;
    
    for (let i = 0; i < totalMonths; i++) {
      const date = new Date(startYear, startMonth + i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthData = availableMonths.find(m => m.month === monthStr);
      
      options.unshift({ // Add to beginning for reverse chronological order
        value: monthStr,
        label: date.toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        }),
        hasData: !!monthData,
        count: monthData?.count || 0
      });
    }
    
    return options;
  }, [availableMonths]);

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

  return (
    <div className="page-container">
      {/* Migration Prompt */}
      <MigrationPrompt />
      
      {/* Stock Alert */}
      <StockAlert />
      
      {/* Dashboard Header */}
      <DashboardHeader 
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthOptions={monthOptions}
      />

      {/* Empty State or Hero Metrics */}
      {currentData.transactions.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Nenhuma transação encontrada para {monthOptions.find(m => m.value === currentMonth)?.label}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {availableMonths.length > 0 ? (
              <>
                Dados disponíveis em: {availableMonths.map(m => {
                  const option = monthOptions.find(opt => opt.value === m.month);
                  return option?.label;
                }).join(', ')}
              </>
            ) : (
              'Nenhum dado disponível. Adicione algumas transações primeiro.'
            )}
          </p>
          {availableMonths.length > 0 && (
            <button 
              onClick={() => setCurrentMonth(availableMonths[0].month)}
              className="text-primary hover:underline"
            >
              Ir para o mês mais recente com dados
            </button>
          )}
        </div>
      ) : (
        <HeroMetrics
          totalBruto={currentData.totalBruto}
          totalLiquido={currentData.totalLiquido}
          trends={{ bruto: trends.bruto, liquido: trends.liquido }}
        />
      )}

      {/* Only show detailed metrics if there's data */}
      {currentData.transactions.length > 0 && (
        <>
          {/* Payment Methods */}
          <PaymentMethodsGrid
            totalBruto={currentData.totalBruto}
            totalDinheiro={currentData.totalDinheiro}
            totalPix={currentData.totalPix}
            totalDebito={currentData.totalDebito}
            totalCredito={currentData.totalCredito}
            trends={{
              dinheiro: trends.dinheiro,
              pix: trends.pix,
              debito: trends.debito,
              credito: trends.credito
            }}
          />

          {/* Distribution and Fees */}
          <DistributionGrid
            totalStudio={currentData.totalStudio}
            totalEdu={currentData.totalEdu}
            totalKam={currentData.totalKam}
            totalTaxas={currentData.totalTaxas}
            trends={{
              studio: trends.studio,
              edu: trends.edu,
              kam: trends.kam,
              taxas: trends.taxas
            }}
          />

          {/* Transaction Charts */}
          <TransactionCharts
            transactionCountData={transactionCountData}
            biWeeklyData={biWeeklyData}
            paymentMethodsData={paymentMethodsData}
          />

          {/* Insights */}
          <DashboardInsights />

          {/* Footer */}
          <DashboardFooter transactions={currentData.transactions} />
        </>
      )}
    </div>
  );
};