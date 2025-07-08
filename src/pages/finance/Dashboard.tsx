import { useMemo, useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useDataInitializer } from '@/hooks/useDataInitializer';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardCharts } from '@/hooks/useDashboardCharts';
import { useToast } from '@/hooks/use-toast';
import { StockAlert } from '@/components/alerts/StockAlert';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { HeroMetrics } from '@/components/dashboard/HeroMetrics';
import { PaymentMethodsGrid } from '@/components/dashboard/PaymentMethodsGrid';
import { DistributionGrid } from '@/components/dashboard/DistributionGrid';
import { TransactionCharts } from '@/components/dashboard/TransactionCharts';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { MigrationPrompt } from '@/components/migration/MigrationPrompt';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { PageLayout } from '@/components/layout/PageLayout';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { Dialog } from '@/components/ui/dialog';
import { Transaction } from '@/types/finance';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
}

export const Dashboard = () => {
  const financeState = useFinance();
  const { currentMonth, setCurrentMonth, getMonthlyData, transactions, addTransaction, loading } = financeState;
  const { toast } = useToast();
  
  // Transaction form state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
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

  // Get dashboard data and chart calculations
  const { availableMonths, monthOptions } = useDashboardData({
    transactions,
    currentMonth,
    currentYear: financeState.currentYear,
    archivedData: financeState.archivedData || []
  });

  const { transactionCountData, paymentMethodsData, biWeeklyData } = useDashboardCharts({
    currentData
  });

  // Transaction form handlers
  const handleFormSubmit = (formData: TransactionFormData, isEditing: boolean) => {
    const data = {
      date: formData.date,
      dinheiro: parseFloat(formData.dinheiro) || 0,
      pix: parseFloat(formData.pix) || 0,
      debito: parseFloat(formData.debito) || 0,
      credito: parseFloat(formData.credito) || 0
    };

    if (data.dinheiro + data.pix + data.debito + data.credito <= 0) {
      toast({
        title: "Erro",
        description: "Informe pelo menos um valor para a transação",
        variant: "destructive"
      });
      return;
    }

    addTransaction(data);
  };

  const handleOpenTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  return (
    <PageLayout 
      title="Dashboard" 
      subtitle="Visão geral completa das finanças do Studio Germano"
      onFabClick={handleOpenTransactionModal}
    >
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
          <DashboardInsights 
            transactions={currentData.transactions} 
            currentMonth={currentMonth} 
          />

          {/* Footer */}
          <DashboardFooter transactions={currentData.transactions} />
        </>
      )}

      {/* Transaction Form Modal */}
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <TransactionForm
          isOpen={isTransactionModalOpen}
          onOpenChange={setIsTransactionModalOpen}
          editingTransaction={editingTransaction}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </Dialog>
    </PageLayout>
  );
};