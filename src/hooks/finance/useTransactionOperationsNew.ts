import { useSupabaseTransactions } from './useSupabaseTransactions';

export const useTransactionOperations = () => {
  const { 
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    migrateFromLocalStorage
  } = useSupabaseTransactions();

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    migrateFromLocalStorage
  };
};