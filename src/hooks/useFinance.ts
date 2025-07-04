import { useFinanceState } from './finance/useFinanceState';
import { useTransactionOperations } from './finance/useTransactionOperations';
import { useFinanceData } from './finance/useFinanceData';
import { useFinanceIO } from './finance/useFinanceIO';

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
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactionOperations(state, setState, saveToStorage, setLoading);

  const { getMonthlyData } = useFinanceData(state);

  const {
    importFromCSV,
    exportToCSV,
    loadSampleData
  } = useFinanceIO(state, setState, saveToStorage, setLoading);

  return {
    ...state,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    exportToCSV,
    importFromCSV,
    loadSampleData,
    setCurrentMonth,
    setCurrentYear
  };
};