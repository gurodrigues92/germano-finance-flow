import { FinanceState } from '@/types/finance';

const STORAGE_KEY = 'studio_germano_finance';

export const loadFinanceData = (): FinanceState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  } catch (error) {
    console.error('[Financeiro] Error loading data:', error);
    throw new Error('Erro ao carregar dados salvos');
  }
};

export const saveFinanceData = (state: FinanceState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('[Financeiro] Data saved to localStorage');
  } catch (error) {
    console.error('[Financeiro] Error saving data:', error);
    throw new Error('Erro ao salvar dados');
  }
};