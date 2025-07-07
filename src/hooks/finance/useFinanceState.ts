import { useState, useEffect } from 'react';
import { FinanceState } from '@/types/finance';
import { loadFinanceData, saveFinanceData } from '@/lib/finance/storage';
import { useToast } from '@/hooks/use-toast';

const getInitialCurrentMonth = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Use June 2025 as default (last month with real data)
  // If we're past 2025, use current month
  if (currentYear > 2025) {
    return now.toISOString().slice(0, 7);
  }
  return '2025-06';
};

export const useFinanceState = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<FinanceState>({
    transactions: [],
    currentMonth: getInitialCurrentMonth(),
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

  const setCurrentMonth = (month: string) => setState(prev => ({ ...prev, currentMonth: month }));
  const setCurrentYear = (year: number) => setState(prev => ({ ...prev, currentYear: year }));

  return {
    state,
    setState,
    loading,
    setLoading,
    saveToStorage,
    setCurrentMonth,
    setCurrentYear
  };
};