import { useMemo, useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useDataInitializer } from '@/hooks/useDataInitializer';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardCharts } from '@/hooks/useDashboardCharts';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/contexts/UserProfileContext';
import { useTransactionFilters } from '@/hooks/finance/useTransactionFilters';
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
import { TransactionTable } from '@/components/finance/TransactionTable';
import { TransactionSummary } from '@/components/finance/TransactionSummary';
import { PeriodSelector } from '@/components/finance/PeriodSelector';
import { SearchAndFilter } from '@/components/finance/SearchAndFilter';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';
import { Plus, BarChart3, List } from 'lucide-react';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
}

export const FinanceDashboard = () => {
  const financeState = useFinance();
  const { 
    currentMonth, 
    setCurrentMonth, 
    getMonthlyData, 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    loading 
  } = financeState;
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  
  // Transaction filters
  const { 
    filters, 
    setFilters, 
    filteredTransactions,
    totalFiltered 
  } = useTransactionFilters(transactions);
  
  // Tab navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

    if (isEditing && editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
      setIsTransactionModalOpen(false);
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso."
      });
    } else {
      addTransaction(data);
      setIsTransactionModalOpen(false);
      toast({
        title: "Transação adicionada",
        description: "A transação foi adicionada com sucesso."
      });
    }
  };

  const handleOpenTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };
  
  // Transaction management handlers
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso."
    });
  };

  return (
    <PageLayout 
      title="Centro Financeiro" 
      subtitle="Análise completa e gerenciamento de transações"
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

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Transações
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
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
            <>
              <HeroMetrics
                totalBruto={currentData.totalBruto}
                totalLiquido={currentData.totalLiquido}
                trends={{ bruto: trends.bruto, liquido: trends.liquido }}
              />

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
            </>
          )}

          {/* Recent transactions */}
          <DashboardFooter transactions={currentData.transactions} />
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Action Button */}
          <div className="flex justify-start">
            <Button onClick={handleOpenTransactionModal}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>

          {/* Filters Section */}
          <div className="space-y-4 mb-6">
            <SearchAndFilter
              filters={filters}
              onFiltersChange={setFilters}
              totalResults={totalFiltered}
            />
            
            {/* Period Selector with Enhanced Visibility */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-75"></div>
              <div className="relative">
                <PeriodSelector
                  filters={filters}
                  onFiltersChange={setFilters}
                  transactions={filteredTransactions}
                />
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <TransactionSummary transactions={filteredTransactions} />

          {/* Transaction Table */}
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </TabsContent>
      </Tabs>

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