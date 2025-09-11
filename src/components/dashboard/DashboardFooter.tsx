import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { Transaction } from '@/types/finance';
import { TransactionFormData } from '@/hooks/finance/useTransactionForm';
import { useState } from 'react';

interface DashboardFooterProps {
  transactions: Transaction[];
  onAddTransaction: (data: TransactionFormData, isEditing: boolean) => void;
  onUpdateTransaction: (id: string, data: TransactionFormData) => void;
  onDeleteTransaction: (id: string) => void;
  loading: boolean;
}

export const DashboardFooter = ({ 
  transactions, 
  onAddTransaction, 
  onUpdateTransaction, 
  onDeleteTransaction, 
  loading 
}: DashboardFooterProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: TransactionFormData, isEditing: boolean) => {
    if (isEditing && editingTransaction) {
      onUpdateTransaction(editingTransaction.id, data);
    } else {
      onAddTransaction(data, isEditing);
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
  };

  return (
    <>
      <RecentTransactions 
        transactions={transactions} 
        onEdit={handleEdit}
      />
      
      <TransactionForm
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        editingTransaction={editingTransaction}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        loading={loading}
      />
    </>
  );
};