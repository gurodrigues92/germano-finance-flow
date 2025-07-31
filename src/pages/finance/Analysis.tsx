import { useFinance } from '@/hooks/useFinance';
import { PageLayout } from '@/components/layout/PageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { useAnalyticsKPIs } from '@/hooks/useAnalyticsKPIs';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { KPIDashboard } from '@/components/finance/analysis/KPIDashboard';
import { AdvancedEvolutionChart } from '@/components/finance/analysis/AdvancedEvolutionChart';
import { PaymentMethodsAnalytics } from '@/components/finance/analysis/PaymentMethodsAnalytics';
import { SharesDistributionChart } from '@/components/finance/analysis/SharesDistributionChart';
import { OperationalChartsGrid } from '@/components/finance/analysis/OperationalChartsGrid';
import { MonthlyReportCard } from '@/components/finance/analysis/MonthlyReportCard';

export const Analysis = () => {
  const { currentMonth, setCurrentMonth } = useFinance();
  const isMobile = useIsMobile();
  
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

  return (
    <PageLayout 
      title="Análise Financeira Inteligente"
      subtitle="Dashboard analítico com insights automatizados e previsões"
    >
      {/* Month Selector */}
      <div className="mb-6">
        <select 
          value={currentMonth} 
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-background"
        >
          {monthOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} {option.hasData && `(${option.count} transações)`}
            </option>
          ))}
        </select>
      </div>

      {/* KPI Dashboard */}
      <KPIDashboard kpis={kpis} />

      {/* Advanced Evolution Chart */}
      <AdvancedEvolutionChart data={advancedEvolutionData} />

      {/* Payment Methods Analytics */}
      <PaymentMethodsAnalytics data={paymentMethodsAnalytics} />

      {/* Charts Grid */}
      <div className={`card-grid ${isMobile ? 'grid-cols-1' : 'card-grid-2'}`}>
        <SharesDistributionChart sharesData={sharesData} />
      </div>

      {/* Operational Charts Grid */}
      <OperationalChartsGrid
        custosData={custosData}
        investimentosData={investimentosData}
        estoqueData={estoqueData}
      />

      {/* Detailed Monthly Report */}
      <MonthlyReportCard
        currentMonth={currentMonth}
        currentData={currentData}
        monthOptions={monthOptions}
      />
    </PageLayout>
  );
};