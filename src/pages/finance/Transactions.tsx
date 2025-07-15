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
import { Plus } from 'lucide-react';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
  useCustomRates: boolean;
  customRates?: {
    studioRate: number;
    eduRate: number;
    kamRate: number;
  };
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

  // Filter transactions to current month being viewed
  const currentMonthTransactions = transactions.filter(t => t.month === currentMonth);
  
  // Search and filter functionality
  const {
    filters,
    setFilters,
    filteredTransactions,
    totalFiltered
  } = useTransactionFilters(currentMonthTransactions);

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

  const resetForm = () => {
    setEditingTransaction(null);
  };

  const handleFormSubmit = (formData: TransactionFormData, isEditing: boolean) => {
    const data = {
      date: formData.date,
      dinheiro: parseFloat(formData.dinheiro) || 0,
      pix: parseFloat(formData.pix) || 0,
      debito: parseFloat(formData.debito) || 0,
      credito: parseFloat(formData.credito) || 0,
      customRates: formData.useCustomRates ? formData.customRates : undefined
    };

    if (data.dinheiro + data.pix + data.debito + data.credito <= 0) {
      toast({
        title: "Erro",
        description: "Informe pelo menos um valor para a transação",
        variant: "destructive"
      });
      return;
    }

    console.log('[Financeiro] Submitting transaction:', data);
    
    if (isEditing && editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
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
      title="Gestão de Transações"
      subtitle={`Transações de ${monthOptions.find(m => m.value === currentMonth)?.label || currentMonth} - ${currentMonthTransactions.length} registros`}
      onFabClick={() => setIsOpen(true)}
    >
      {/* Month Selection Header */}
      <DashboardHeader
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        monthOptions={monthOptions}
      />

      <div className="header-actions">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <TransactionActions
            onNewTransaction={handleNewTransaction}
          />
          
          <TransactionForm
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            editingTransaction={editingTransaction}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </Dialog>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={totalFiltered}
      />

      {/* Pull to Refresh Content */}
      <PullToRefresh onRefresh={handleRefresh} className="min-h-[400px]">
        {/* Monthly Summary */}
        <TransactionSummary transactions={filteredTransactions} />

        {/* Transactions Table */}
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

      {/* Bulk Action Bar */}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        count={pendingDeleteIds.length}
        loading={loading}
      />
    </PageLayout>
  );
};