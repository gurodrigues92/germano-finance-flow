import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Transaction } from '@/types/finance';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { TransactionTable } from '@/components/finance/TransactionTable';
import { TransactionSummary } from '@/components/finance/TransactionSummary';
import { TransactionActions } from '@/components/finance/TransactionActions';
import { SearchAndFilter } from '@/components/finance/SearchAndFilter';
import { BulkActionBar } from '@/components/finance/BulkActionBar';
import { DeleteConfirmModal } from '@/components/finance/DeleteConfirmModal';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { useTransactionFilters } from '@/hooks/finance/useTransactionFilters';
import { useBulkSelection } from '@/hooks/finance/useBulkSelection';
import { PeriodSelector } from '@/components/finance/PeriodSelector';
import { PeriodSummary } from '@/components/finance/PeriodSummary';
import { NovaComandaDialog } from '@/components/finance/NovaComandaDialog';
import { ComandasAbertasSection } from '@/components/finance/ComandasAbertasSection';
import { FecharComandaDialog } from '@/components/finance/FecharComandaDialog';
import { UnifiedTransactionFilters } from '@/components/finance/UnifiedTransactionFilters';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Plus, Receipt } from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
  profissionalId: string;
  temAssistente: boolean;
}

export const Transactions = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    loading, 
    currentMonth,
    currentYear,
    archivedData,
    setCurrentMonth
  } = useFinance();
  const { toast } = useToast();

  // Get month options for the header
  const { monthOptions } = useDashboardData({
    transactions,
    currentMonth,
    currentYear,
    archivedData
  });

  // Filtro unificado - declarar antes de usar
  const [filtroUnificado, setFiltroUnificado] = useState<'todas' | 'comandas_abertas' | 'transacoes_manuais' | 'hoje'>('todas');

  // Filter transactions to current month being viewed
  const currentMonthTransactions = transactions.filter(t => t.month === currentMonth);
  
  // Aplicar filtro unificado
  const getFilteredByType = () => {
    const hoje = new Date().toISOString().split('T')[0];
    
    switch (filtroUnificado) {
      case 'comandas_abertas':
        return currentMonthTransactions.filter(t => t.status === 'aberta');
      case 'transacoes_manuais':
        return currentMonthTransactions.filter(t => t.tipo === 'manual' || !t.tipo);
      case 'hoje':
        return currentMonthTransactions.filter(t => t.date === hoje);
      default:
        return currentMonthTransactions;
    }
  };

  const transactionsFilteredByType = getFilteredByType();
  
  // Search and filter functionality
  const {
    filters,
    setFilters,
    filteredTransactions,
    totalFiltered
  } = useTransactionFilters(transactionsFilteredByType);
  
  // Separar comandas abertas para exibição especial
  const comandasAbertas = currentMonthTransactions.filter(t => t.status === 'aberta');
  
  // Contadores para os filtros
  const hoje = new Date().toISOString().split('T')[0];
  const filterCounts = {
    todas: currentMonthTransactions.length,
    comandas_abertas: comandasAbertas.length,
    transacoes_manuais: currentMonthTransactions.filter(t => t.tipo === 'manual' || !t.tipo).length,
    hoje: currentMonthTransactions.filter(t => t.date === hoje).length
  };

  // Bulk selection functionality
  const transactionIds = filteredTransactions.map(t => t.id);
  const {
    selectedIds,
    isSelectionMode,
    selectedCount,
    hasSelection,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    enterSelectionMode,
    exitSelectionMode
  } = useBulkSelection(transactionIds);
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  
  // Estados para Nova Comanda e Fechar Comanda
  const [novaComandaOpen, setNovaComandaOpen] = useState(false);
  const [fecharComandaOpen, setFecharComandaOpen] = useState(false);
  const [comandaParaFechar, setComandaParaFechar] = useState<Transaction | null>(null);

  const resetForm = () => {
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (formData: TransactionFormData, isEditing: boolean) => {
    console.log('[Transactions] handleFormSubmit chamado com:', formData, 'isEditing:', isEditing);
    
    const data = {
      date: formData.date,
      dinheiro: parseFloat(formData.dinheiro) || 0,
      pix: parseFloat(formData.pix) || 0,
      debito: parseFloat(formData.debito) || 0,
      credito: parseFloat(formData.credito) || 0,
      profissionalId: formData.profissionalId || undefined,
      temAssistente: formData.temAssistente
    };

    console.log('[Transactions] Dados processados:', data);

    if (data.dinheiro + data.pix + data.debito + data.credito <= 0) {
      console.log('[Transactions] Erro: Nenhum valor informado');
      toast({
        title: "Erro",
        description: "Informe pelo menos um valor para a transação",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('[Transactions] Tentando salvar transação...');
      
      let success = false;
      if (isEditing && editingTransaction) {
        console.log('[Transactions] Atualizando transação:', editingTransaction.id);
        const result = await updateTransaction(editingTransaction.id, data);
        success = typeof result === 'boolean' ? result : false;
      } else {
        console.log('[Transactions] Adicionando nova transação');
        const result = await addTransaction(data);
        success = typeof result === 'boolean' ? result : false;
      }

      if (success) {
        console.log('[Transactions] Transação salva com sucesso, fechando modal');
        setIsOpen(false);
        resetForm();
      } else {
        console.log('[Transactions] Falha ao salvar transação');
      }
    } catch (error) {
      console.error('[Transactions] Erro ao salvar transação:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar transação",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsOpen(true);
  };

  const handleNewTransaction = () => {
    resetForm();
  };

  const handleDelete = (id: string) => {
    setPendingDeleteIds([id]);
    setDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setPendingDeleteIds(selectedIds);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      for (const id of pendingDeleteIds) {
        await deleteTransaction(id);
      }
      
      toast({
        title: "Sucesso",
        description: `${pendingDeleteIds.length === 1 ? 'Transação excluída' : `${pendingDeleteIds.length} transações excluídas`} com sucesso`,
      });
      
      exitSelectionMode();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir transação(ões)",
        variant: "destructive"
      });
    } finally {
      setDeleteModalOpen(false);
      setPendingDeleteIds([]);
    }
  };

  const handleLongPress = (transactionId: string) => {
    if (!isSelectionMode) {
      enterSelectionMode(transactionId);
    }
  };

  // Função para criar nova comanda
  const handleNovaComanda = async (comandaData: any) => {
    try {
      const transactionData = {
        date: new Date().toISOString().split('T')[0],
        dinheiro: 0,
        pix: 0,
        debito: 0,
        credito: 0,
        // Novos campos para comanda
        tipo: comandaData.tipo,
        clienteId: comandaData.clienteId,
        profissionalId: comandaData.profissionalId,
        status: comandaData.status,
        observacoes: comandaData.observacoes,
        totalBruto: comandaData.totalEstimado
      };

      await addTransaction(transactionData);
      
      toast({
        title: "Sucesso",
        description: "Comanda criada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar comanda",
        variant: "destructive"
      });
    }
  };

  // Função para fechar comanda
  const handleFecharComanda = (comandaId: string) => {
    const comanda = currentMonthTransactions.find(t => t.id === comandaId);
    if (comanda) {
      setComandaParaFechar(comanda);
      setFecharComandaOpen(true);
    }
  };

  // Função para processar fechamento de comanda
  const handleProcessarFechamentoComanda = async (comandaId: string, metodosPagamento: any) => {
    try {
      const updateData = {
        date: new Date().toISOString().split('T')[0],
        ...metodosPagamento,
        status: 'fechada' as const
      };

      await updateTransaction(comandaId, updateData);
      
      toast({
        title: "Sucesso",
        description: "Comanda fechada com sucesso",
      });
      
      setFecharComandaOpen(false);
      setComandaParaFechar(null);
    } catch (error) {
      console.error('Erro ao fechar comanda:', error);
      toast({
        title: "Erro",
        description: "Erro ao fechar comanda",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    console.log('[Financeiro] Pull to refresh triggered');
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <PageLayout 
      title="Transações & Comandas"
      subtitle={`${monthOptions.find(m => m.value === currentMonth)?.label || currentMonth} • ${filteredTransactions.length} transações`}
      onFabClick={() => setIsOpen(true)}
    >
      {/* Compact Header with Month Selection */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 mb-4">
        <DashboardHeader
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          monthOptions={monthOptions}
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 mb-4">
        <ResponsiveButton 
          onClick={() => setIsOpen(true)}
          className="bg-finance-income hover:bg-finance-income/90 text-finance-income-foreground flex items-center gap-2"
          mobileSize="lg"
        >
          <Plus className="h-4 w-4" />
          Nova Transação
        </ResponsiveButton>
        <ResponsiveButton 
          onClick={() => setNovaComandaOpen(true)}
          className="flex items-center gap-2"
          variant="outline"
          mobileSize="lg"
        >
          <Receipt className="h-4 w-4" />
          Nova Comanda
        </ResponsiveButton>
      </div>

      {/* Action Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <TransactionForm
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          editingTransaction={editingTransaction}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </Dialog>

      {/* Comandas Abertas */}
      <ComandasAbertasSection
        comandasAbertas={comandasAbertas}
        onFecharComanda={handleFecharComanda}
        loading={loading}
      />

      {/* Filtros Unificados */}
      <div className="mb-4">
        <UnifiedTransactionFilters
          activeFilter={filtroUnificado}
          onFilterChange={setFiltroUnificado}
          counts={filterCounts}
        />
      </div>

      {/* Filters Section */}
      <div className="space-y-3 mb-4">
        <SearchAndFilter
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={totalFiltered}
        />
        
        <PeriodSelector
          filters={filters}
          onFiltersChange={setFilters}
          transactions={filteredTransactions}
        />
      </div>

      {/* Smart Summary */}
      <TransactionSummary 
        transactions={filteredTransactions}
        dateStart={filters.customDateStart}
        dateEnd={filters.customDateEnd}
        isCustomPeriod={filters.isCustomDateActive}
        totalTransactions={currentMonthTransactions.length}
      />

      {/* Main Content */}
      <PullToRefresh onRefresh={handleRefresh} className="min-h-[300px]">
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLongPress={handleLongPress}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
        />
      </PullToRefresh>

      {/* Bulk Actions */}
      {isSelectionMode && (
        <BulkActionBar
          selectedCount={selectedCount}
          totalItems={filteredTransactions.length}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onBulkDelete={handleBulkDelete}
          onCancel={exitSelectionMode}
        />
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        count={pendingDeleteIds.length}
        loading={loading}
      />

      {/* Nova Comanda Dialog */}
      <NovaComandaDialog
        isOpen={novaComandaOpen}
        onOpenChange={setNovaComandaOpen}
        onComandaCreated={handleNovaComanda}
        loading={loading}
      />

      {/* Fechar Comanda Dialog */}
      <FecharComandaDialog
        isOpen={fecharComandaOpen}
        onOpenChange={setFecharComandaOpen}
        comanda={comandaParaFechar}
        onFecharComanda={handleProcessarFechamentoComanda}
        loading={loading}
      />
    </PageLayout>
  );
};