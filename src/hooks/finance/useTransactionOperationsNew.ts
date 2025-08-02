import { useSupabaseTransactions } from './useSupabaseTransactions';

export const useTransactionOperations = () => {
  const { 
    transactions,
    loading,
    initialLoadDone,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    migrateFromLocalStorage
  } = useSupabaseTransactions();

  return {
    transactions,
    loading,
    initialLoadDone,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    migrateFromLocalStorage
  };
};