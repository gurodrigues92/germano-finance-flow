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
      <div className={`mb-6 ${isMobile ? 'px-1' : ''}`}>
        <select 
          value={currentMonth} 
          onChange={(e) => setCurrentMonth(e.target.value)}
          className={`border rounded-lg ${isMobile ? 'px-2 py-1 text-sm w-full' : 'px-3 py-2'} bg-background`}
        >
          {monthOptions.map(option => (
            <option key={option.value} value={option.value}>
              {isMobile ? 
                `${option.label} ${option.hasData ? `(${option.count})` : ''}` :
                `${option.label} ${option.hasData ? `(${option.count} transações)` : ''}`
              }
            </option>
          ))}
        </select>
      </div>

      {/* KPI Dashboard */}
      <KPIDashboard kpis={kpis} />

      {/* Comparativo dos Últimos 3 Meses */}
      <div className="mb-6">
        <MonthlyReportCard
          currentMonth={currentMonth}
          currentData={currentData}
          monthOptions={monthOptions}
        />
      </div>

      {/* Advanced Evolution Chart */}
      <AdvancedEvolutionChart data={advancedEvolutionData} />

      {/* Payment Methods Analytics */}
      <PaymentMethodsAnalytics data={paymentMethodsAnalytics} />

      {/* Distribuição de Participações */}
      <div className={`card-grid ${isMobile ? 'grid-cols-1' : 'card-grid-2'} mb-6`}>
        <SharesDistributionChart sharesData={sharesData} />
      </div>

      {/* Gráficos Operacionais (por último) */}
      <div className={`mt-8 ${isMobile ? 'px-1' : ''}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-4 text-muted-foreground`}>
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