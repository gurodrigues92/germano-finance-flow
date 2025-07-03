import { useState, useEffect } from 'react';
import { Transaction, MonthlyData, FinanceState, DEBIT_TAX_RATE, CREDIT_TAX_RATE, STUDIO_SHARE, EDU_SHARE, KAM_SHARE } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'studio_germano_finance';

export const useFinance = () => {
  const { toast } = useToast();
  const [state, setState] = useState<FinanceState>({
    transactions: [],
    currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    currentYear: new Date().getFullYear(),
    archivedData: []
  });

  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('[Financeiro] Loading data from localStorage');
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(parsedData);
        console.log('[Financeiro] Data loaded successfully', parsedData);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      console.log('[Financeiro] Data saved to localStorage');
    } catch (error) {
      console.error('[Financeiro] Error saving data:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados",
        variant: "destructive"
      });
    }
  };

  const calculateTransaction = (
    dinheiro: number,
    pix: number,
    debito: number,
    credito: number
  ) => {
    const totalBruto = dinheiro + pix + debito + credito;
    const taxaDebito = debito * DEBIT_TAX_RATE;
    const taxaCredito = credito * CREDIT_TAX_RATE;
    const totalLiquido = totalBruto - taxaDebito - taxaCredito;
    
    return {
      totalBruto,
      taxaDebito,
      taxaCredito,
      totalLiquido,
      studioShare: totalLiquido * STUDIO_SHARE,
      eduShare: totalLiquido * EDU_SHARE,
      kamShare: totalLiquido * KAM_SHARE
    };
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

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setLoading(true);
    
    try {
      const newState = {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
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
    const transactions = state.transactions.filter(t => t.month === targetMonth);
    
    const totals = transactions.reduce(
      (acc, t) => ({
        totalBruto: acc.totalBruto + t.totalBruto,
        totalLiquido: acc.totalLiquido + t.totalLiquido,
        totalStudio: acc.totalStudio + t.studioShare,
        totalEdu: acc.totalEdu + t.eduShare,
        totalKam: acc.totalKam + t.kamShare,
        totalTaxas: acc.totalTaxas + t.taxaDebito + t.taxaCredito
      }),
      {
        totalBruto: 0,
        totalLiquido: 0,
        totalStudio: 0,
        totalEdu: 0,
        totalKam: 0,
        totalTaxas: 0
      }
    );

    return {
      month: targetMonth,
      year: parseInt(targetMonth.split('-')[0]),
      transactions,
      ...totals
    };
  };

  const exportToCSV = () => {
    try {
      const headers = [
        'Data',
        'Dinheiro',
        'PIX',
        'Débito',
        'Crédito',
        'Total Bruto',
        'Taxa Débito',
        'Taxa Crédito',
        'Total Líquido',
        'Studio (60%)',
        'Edu (40%)',
        'Kam (10%)'
      ];

      const csvContent = [
        headers.join(','),
        ...state.transactions.map(t => [
          t.date,
          t.dinheiro,
          t.pix,
          t.debito,
          t.credito,
          t.totalBruto,
          t.taxaDebito,
          t.taxaCredito,
          t.totalLiquido,
          t.studioShare,
          t.eduShare,
          t.kamShare
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studio_germano_${state.currentMonth}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

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

  return {
    ...state,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    exportToCSV,
    setCurrentMonth: (month: string) => setState(prev => ({ ...prev, currentMonth: month })),
    setCurrentYear: (year: number) => setState(prev => ({ ...prev, currentYear: year }))
  };
};