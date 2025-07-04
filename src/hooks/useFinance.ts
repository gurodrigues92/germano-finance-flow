import { useState, useEffect } from 'react';
import { Transaction, MonthlyData, FinanceState } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';
import { calculateTransaction } from '@/lib/finance/calculations';
import { loadFinanceData, saveFinanceData } from '@/lib/finance/storage';
import { importTransactionsFromCSV, exportTransactionsToCSV } from '@/lib/finance/csv';
import { generateSampleTransactions } from '@/lib/finance/sampleData';

export const useFinance = () => {
  const { toast } = useToast();
  const [state, setState] = useState<FinanceState>({
    transactions: [],
    currentMonth: (() => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // If we're in 2025 or later, use current month, otherwise default to 2025-01
      if (currentYear >= 2025) {
        return now.toISOString().slice(0, 7);
      }
      return '2025-01';
    })(),
    currentYear: Math.max(new Date().getFullYear(), 2025),
    archivedData: []
  });

  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('[Financeiro] Loading data from localStorage');
    try {
      const saved = loadFinanceData();
      if (saved) {
        setState(saved);
        console.log('[Financeiro] Data loaded successfully', saved);
      }
    } catch (error) {
      console.error('[Financeiro] Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados salvos",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Save to localStorage whenever state changes
  const saveToStorage = (newState: FinanceState) => {
    try {
      saveFinanceData(newState);
    } catch (error) {
      console.error('[Financeiro] Error saving data:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados",
        variant: "destructive"
      });
    }
  };


  const addTransaction = (transactionData: {
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

      const transaction: Transaction = {
        id: Date.now().toString(),
        ...transactionData,
        ...calculations,
        month: transactionData.date.slice(0, 7),
        year: new Date(transactionData.date).getFullYear(),
        createdAt: new Date().toISOString()
      };

      const newState = {
        ...state,
        transactions: [transaction, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction added:', transaction);
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso"
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

  const getMonthlyData = (month?: string): MonthlyData => {
    const targetMonth = month || state.currentMonth;
    // Filter transactions from 2025 onwards only
    const transactions = state.transactions.filter(t => 
      t.month === targetMonth && new Date(t.date).getFullYear() >= 2025
    );
    
    const totals = transactions.reduce(
      (acc, t) => ({
        totalBruto: acc.totalBruto + t.totalBruto,
        totalLiquido: acc.totalLiquido + t.totalLiquido,
        totalStudio: acc.totalStudio + t.studioShare,
        totalEdu: acc.totalEdu + t.eduShare,
        totalKam: acc.totalKam + t.kamShare,
        totalTaxas: acc.totalTaxas + t.taxaDebito + t.taxaCredito,
        totalDinheiro: acc.totalDinheiro + t.dinheiro,
        totalPix: acc.totalPix + t.pix,
        totalDebito: acc.totalDebito + t.debito,
        totalCredito: acc.totalCredito + t.credito
      }),
      {
        totalBruto: 0,
        totalLiquido: 0,
        totalStudio: 0,
        totalEdu: 0,
        totalKam: 0,
        totalTaxas: 0,
        totalDinheiro: 0,
        totalPix: 0,
        totalDebito: 0,
        totalCredito: 0
      }
    );

    return {
      month: targetMonth,
      year: parseInt(targetMonth.split('-')[0]),
      transactions,
      ...totals
    };
  };

  const importFromCSV = async (file: File) => {
    setLoading(true);
    
    try {
      const importedTransactions = await importTransactionsFromCSV(file);
      
      const newState = {
        ...state,
        transactions: [...importedTransactions, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Imported transactions:', importedTransactions.length);
      toast({
        title: "Sucesso",
        description: `${importedTransactions.length} transações importadas com sucesso`
      });
    } catch (error) {
      console.error('[Financeiro] Error importing CSV:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao importar arquivo CSV",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      exportTransactionsToCSV(state.transactions, state.currentMonth);
      toast({
        title: "Sucesso",
        description: "Dados exportados com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error exporting data:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar dados",
        variant: "destructive"
      });
    }
  };

  const loadSampleData = () => {
    setLoading(true);
    
    try {
      const sampleTransactions = generateSampleTransactions();

      const newState = {
        ...state,
        transactions: [...sampleTransactions, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Sample data loaded');
      toast({
        title: "Sucesso",
        description: "Dados de exemplo carregados com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error loading sample data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de exemplo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
    setCurrentMonth: (month: string) => setState(prev => ({ ...prev, currentMonth: month })),
    setCurrentYear: (year: number) => setState(prev => ({ ...prev, currentYear: year }))
  };
};