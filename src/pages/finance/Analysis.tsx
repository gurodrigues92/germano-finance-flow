import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { PageLayout } from '@/components/layout/PageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { useAnalyticsKPIs } from '@/hooks/useAnalyticsKPIs';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { KPIDashboard } from '@/components/finance/analysis/KPIDashboard';
import { SalesReportTabs } from '@/components/finance/analysis/SalesReportTabs';
import { AdvancedEvolutionChart } from '@/components/finance/analysis/AdvancedEvolutionChart';
import { PaymentMethodsAnalytics } from '@/components/finance/analysis/PaymentMethodsAnalytics';
import { SharesDistributionChart } from '@/components/finance/analysis/SharesDistributionChart';
import { OperationalChartsGrid } from '@/components/finance/analysis/OperationalChartsGrid';
import { MonthlyReportCard } from '@/components/finance/analysis/MonthlyReportCard';
import { AdvancedPeriodSelector } from '@/components/finance/AdvancedPeriodSelector';
import { usePageSEO } from '@/hooks/usePageSEO';

export const Analysis = () => {
  const { currentMonth, setCurrentMonth } = useFinance();
  const isMobile = useIsMobile();
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  
  // Use all hooks unconditionally
  const analysisData = useAnalysisData(currentMonth);
  const advancedAnalytics = useAdvancedAnalytics(currentMonth);
  const analyticsKPIs = useAnalyticsKPIs({
    transactions: advancedAnalytics.currentData,
    previousMonthTransactions: advancedAnalytics.previousData
  });

  // Destructure after all hooks are called
  const {
    currentData,
    monthOptions,
    paymentMethodsData,
    evolutionData,
    sharesData,
    growth,
    custosData,
    investimentosData,
    estoqueData
  } = analysisData;

  const { 
    currentData: advancedCurrentData, 
    previousData, 
    evolutionData: advancedEvolutionData,
    paymentMethodsAnalytics
  } = advancedAnalytics;

  const { kpis } = analyticsKPIs;

  // Handle custom date range changes
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setCustomDateRange({ from: startDate, to: endDate });
    // You could add logic here to filter data by custom date range
    // For now, we'll just store the range
    console.log('Custom date range selected:', { startDate, endDate });
  };

  return (
    <PageLayout 
      title="Análise Financeira Inteligente"
      subtitle="Dashboard analítico com insights automatizados e previsões"
    >
      {/* Advanced Period Selector */}
      <div className="mb-6">
        <AdvancedPeriodSelector
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDateRangeChange={handleDateRangeChange}
          monthOptions={monthOptions}
        />
      </div>

      {/* KPI Dashboard */}
      <div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
        <KPIDashboard kpis={kpis} />
      </div>

      {/* Relatórios de Vendas Detalhados */}
      <div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
        <SalesReportTabs transactions={advancedCurrentData} period={currentMonth} />
      </div>

      {/* Comparativo dos Últimos 3 Meses */}
      <div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
        <MonthlyReportCard
          currentMonth={currentMonth}
          currentData={currentData}
          monthOptions={monthOptions}
        />
      </div>

      {/* Advanced Evolution Chart */}
      <div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
        <AdvancedEvolutionChart data={advancedEvolutionData} />
      </div>

      {/* Payment Methods Analytics */}
      <div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
        <PaymentMethodsAnalytics data={paymentMethodsAnalytics} />
      </div>

      {/* Distribuição de Participações */}
      <div className={`mb-6 ${isMobile ? 'px-2' : ''}`}>
        <div className={`${isMobile ? 'grid grid-cols-1' : 'card-grid card-grid-2'}`}>
          <SharesDistributionChart sharesData={sharesData} />
        </div>
      </div>

      {/* Gráficos Operacionais (por último) */}
      <div className={`mt-8 ${isMobile ? 'px-2' : ''}`}>
        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-6 text-foreground`}>
          Análise Operacional
        </h3>
        <OperationalChartsGrid
          custosData={custosData}
          investimentosData={investimentosData}
          estoqueData={estoqueData}
        />
      </div>
    </PageLayout>
  );
};