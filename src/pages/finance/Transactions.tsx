import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Transaction } from '@/types/finance';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { TransactionTable } from '@/components/finance/TransactionTable';
import { TransactionSummary } from '@/components/finance/TransactionSummary';
import { TransactionActions } from '@/components/finance/TransactionActions';
import { PageLayout } from '@/components/layout/PageLayout';
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
    currentMonth
  } = useFinance();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  // Filter transactions to current month being viewed
  const currentMonthTransactions = transactions.filter(t => t.month === currentMonth);

  return (
    <PageLayout 
      title="Gestão de Transações"
      subtitle="Adicione e gerencie as transações do Studio Germano"
      onFabClick={() => setIsOpen(true)}
    >
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

      {/* Monthly Summary */}
      <TransactionSummary transactions={currentMonthTransactions} />

      {/* Transactions Table */}
      <TransactionTable
        transactions={currentMonthTransactions}
        onEdit={handleEdit}
        onDelete={deleteTransaction}
      />
    </PageLayout>
  );
};