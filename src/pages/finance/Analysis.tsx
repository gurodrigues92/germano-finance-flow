import { useFinance } from '@/hooks/useFinance';
import { PageLayout } from '@/components/layout/PageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { AnalysisHeader } from '@/components/finance/analysis/AnalysisHeader';
import { PaymentMethodsChart } from '@/components/finance/analysis/PaymentMethodsChart';
import { SharesDistributionChart } from '@/components/finance/analysis/SharesDistributionChart';
import { OperationalChartsGrid } from '@/components/finance/analysis/OperationalChartsGrid';
import { EvolutionChart } from '@/components/finance/analysis/EvolutionChart';
import { MonthlyReportCard } from '@/components/finance/analysis/MonthlyReportCard';

export const Analysis = () => {
  const { currentMonth, setCurrentMonth } = useFinance();
  const isMobile = useIsMobile();
  
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
  } = useAnalysisData(currentMonth);

  return (
    <PageLayout 
      title="Análise Financeira"
      subtitle="Relatórios detalhados e insights"
    >
      <AnalysisHeader
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthOptions={monthOptions}
        currentData={currentData}
        growth={growth}
      />

      {/* Charts Grid */}
      <div className={`grid gap-6 lg:gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <PaymentMethodsChart paymentMethodsData={paymentMethodsData} />
        <SharesDistributionChart sharesData={sharesData} />
      </div>

      {/* Operational Charts Grid */}
      <OperationalChartsGrid
        custosData={custosData}
        investimentosData={investimentosData}
        estoqueData={estoqueData}
      />

      {/* Evolution Chart */}
      <EvolutionChart evolutionData={evolutionData} />

      {/* Detailed Monthly Report */}
      <MonthlyReportCard
        currentMonth={currentMonth}
        currentData={currentData}
        monthOptions={monthOptions}
      />
    </PageLayout>
  );
};