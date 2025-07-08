import { Transaction, FinanceState } from '@/types/finance';
import { calculateTransaction } from '@/lib/finance/calculations';
import { useToast } from '@/hooks/use-toast';

export const useTransactionOperations = (
  state: FinanceState,
  setState: (newState: FinanceState) => void,
  saveToStorage: (newState: FinanceState) => void,
  setLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

  const addTransaction = (transactionData: {
    date: string;
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
    customRates?: {
      studioRate: number;
      eduRate: number;
      kamRate: number;
    };
  }) => {
    setLoading(true);
    
    try {
      const calculations = calculateTransaction(
        transactionData.dinheiro,
        transactionData.pix,
        transactionData.debito,
        transactionData.credito,
        transactionData.customRates
      );

      const transaction: Transaction = {
        id: Date.now().toString(),
        date: transactionData.date,
        dinheiro: transactionData.dinheiro,
        pix: transactionData.pix,
        debito: transactionData.debito,
        credito: transactionData.credito,
        ...calculations,
        month: transactionData.date.slice(0, 7),
        year: new Date(transactionData.date).getFullYear(),
        createdAt: new Date().toISOString(),
        customRates: transactionData.customRates
      };

      const newState = {
        ...state,
        transactions: [transaction, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction added:', transaction);
      toast({
        title: "Transação foi arquivada com sucesso!",
        description: "A transação foi salva no arquivo."
      });

      return transaction;
    } catch (error) {
      console.error('[Financeiro] Error adding transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = (id: string, transactionData: {
    date: string;
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  }) => {
    setLoading(true);
    
    try {
      const calculations = calculateTransaction(
        transactionData.dinheiro,
        transactionData.pix,
        transactionData.debito,
        transactionData.credito
      );

      const updatedTransaction: Transaction = {
        ...state.transactions.find(t => t.id === id)!,
        ...transactionData,
        ...calculations,
        month: transactionData.date.slice(0, 7),
        year: new Date(transactionData.date).getFullYear(),
      };

      const newState = {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === id ? updatedTransaction : t
        )
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction updated:', id);
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error updating transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = (id: string) => {
    setLoading(true);
    
    try {
      const newState = {
        ...state,
        transactions: state.transactions.filter(t => t.id !== id)
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction deleted:', id);
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error deleting transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir transação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};