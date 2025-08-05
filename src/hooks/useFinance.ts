import { useFinanceState } from './finance/useFinanceState';
import { useTransactionOperations } from './finance/useTransactionOperationsNew';
import { useFinanceData } from './finance/useFinanceData';
import { useFinanceIO } from './finance/useFinanceIO';
import { useTransactionOperations as useLocalTransactionOperations } from './finance/useTransactionOperations';

export const useFinance = () => {
  const {
    state,
    setState,
    loading,
    setLoading,
    saveToStorage,
    setCurrentMonth,
    setCurrentYear
  } = useFinanceState();

  const {
    addTransaction: addToLocalStorage,
    updateTransaction: updateInLocalStorage,
    deleteTransaction: deleteFromLocalStorage
  } = useLocalTransactionOperations(state, setState, saveToStorage, setLoading);

  const {
    transactions: supabaseTransactions,
    loading: supabaseLoading,
    initialLoadDone,
    addTransaction: addToSupabase,
    updateTransaction: updateInSupabase,
    deleteTransaction: deleteFromSupabase,
    migrateFromLocalStorage
  } = useTransactionOperations();

  // Híbrido: usar Supabase se houver dados, senão localStorage
  const transactions = supabaseTransactions.length > 0 ? supabaseTransactions : state.transactions;
  const isUsingSupabase = supabaseTransactions.length > 0;

  const { getMonthlyData } = useFinanceData({ ...state, transactions });

  const {
    importFromCSV,
    exportToCSV
  } = useFinanceIO(state, setState, saveToStorage, setLoading);

  // Função híbrida para adicionar transação
  const addTransaction = async (transactionData: {
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
    // Novos campos opcionais para unificação
    tipo?: 'manual' | 'comanda';
    clienteId?: string;
    profissionalId?: string;
    status?: 'aberta' | 'fechada';
    observacoes?: string;
    comandaId?: string;
    totalBruto?: number;
  }) => {
    if (isUsingSupabase) {
      return await addToSupabase(transactionData);
    } else {
      return addToLocalStorage(transactionData);
    }
  };

  // Função híbrida para atualizar transação
  const updateTransaction = async (id: string, transactionData: {
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
    // Novos campos opcionais para unificação
    tipo?: 'manual' | 'comanda';
    clienteId?: string;
    profissionalId?: string;
    status?: 'aberta' | 'fechada';
    observacoes?: string;
    comandaId?: string;
  }) => {
    if (isUsingSupabase) {
      return await updateInSupabase(id, transactionData);
    } else {
      return updateInLocalStorage(id, transactionData);
    }
  };

  // Função híbrida para deletar transação
  const deleteTransaction = async (id: string) => {
    if (isUsingSupabase) {
      return await deleteFromSupabase(id);
    } else {
      return deleteFromLocalStorage(id);
    }
  };

  return {
    ...state,
    transactions,
    loading: loading || supabaseLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    exportToCSV,
    importFromCSV,
    setCurrentMonth,
    setCurrentYear,
    migrateFromLocalStorage,
    isUsingSupabase,
    initialLoadDone
  };
};