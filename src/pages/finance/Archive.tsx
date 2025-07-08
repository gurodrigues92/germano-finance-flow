import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { useToast } from '@/hooks/use-toast';
import { ArchiveHeader } from '@/components/finance/archive/ArchiveHeader';
import { ArchiveStats } from '@/components/finance/archive/ArchiveStats';
import { MonthlyArchiveCard } from '@/components/finance/archive/MonthlyArchiveCard';
import { useArchiveData } from '@/hooks/useArchiveData';

export const Archive = () => {
  const { transactions, updateTransaction, deleteTransaction, loading } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();

  const { monthlyArchive, exportMonthData } = useArchiveData(transactions);

  const selectedMonthData = useMemo(() => {
    return monthlyArchive.find((month: any) => month.month === selectedMonth);
  }, [monthlyArchive, selectedMonth]);

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditForm(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Transação excluída",
      description: "A transação foi removida do arquivo."
    });
  };

  const handleFormSubmit = (formData: any, isEditing: boolean) => {
    if (isEditing && editingTransaction) {
      updateTransaction(editingTransaction.id, {
        date: formData.date,
        dinheiro: parseFloat(formData.dinheiro) || 0,
        pix: parseFloat(formData.pix) || 0,
        debito: parseFloat(formData.debito) || 0,
        credito: parseFloat(formData.credito) || 0
      });
      setEditingTransaction(null);
      setShowEditForm(false);
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada no arquivo."
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 p-3 sm:p-6 max-w-4xl mx-auto">
      <ArchiveHeader
        monthCount={monthlyArchive.length}
        transactionCount={transactions.length}
        totalBruto={transactions.reduce((sum, t) => sum + t.totalBruto, 0)}
        totalLiquido={transactions.reduce((sum, t) => sum + t.totalLiquido, 0)}
      />

      <ArchiveStats
        monthCount={monthlyArchive.length}
        transactionCount={transactions.length}
        totalBruto={transactions.reduce((sum, t) => sum + t.totalBruto, 0)}
        totalLiquido={transactions.reduce((sum, t) => sum + t.totalLiquido, 0)}
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Arquivo por Mês</h2>
        
        {monthlyArchive.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum dado arquivado encontrado.</p>
            <p className="text-sm mt-1">Adicione transações para ver o histórico.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {monthlyArchive.map((monthData: any) => (
              <MonthlyArchiveCard
                key={monthData.month}
                monthData={monthData}
                onSelectMonth={setSelectedMonth}
                onExportMonth={exportMonthData}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                selectedMonthData={selectedMonthData}
              />
            ))}
          </div>
        )}
      </div>

      <TransactionForm 
        isOpen={showEditForm}
        onOpenChange={setShowEditForm}
        editingTransaction={editingTransaction}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  );
};