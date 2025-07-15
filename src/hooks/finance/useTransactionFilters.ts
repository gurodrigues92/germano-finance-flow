import { useState, useMemo } from 'react';
import { Transaction } from '@/types/finance';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, parseISO, isWithinInterval } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export interface FilterState {
  searchText: string;
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'all';
  paymentMethods: string[];
  valueRange: {
    min: string;
    max: string;
  };
}

const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    dateRange: 'all',
    paymentMethods: [],
    valueRange: { min: '', max: '' }
  });

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Text search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(transaction => {
        const date = transaction.date.toLowerCase();
        const totalBruto = transaction.totalBruto.toString();
        const totalLiquido = transaction.totalLiquido.toString();
        
        return date.includes(searchLower) ||
               totalBruto.includes(searchLower) ||
               totalLiquido.includes(searchLower) ||
               (transaction.dinheiro > 0 && 'dinheiro'.includes(searchLower)) ||
               (transaction.pix > 0 && 'pix'.includes(searchLower)) ||
               (transaction.debito > 0 && 'debito'.includes(searchLower)) ||
               (transaction.credito > 0 && 'credito'.includes(searchLower));
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = toZonedTime(new Date(), BRAZIL_TIMEZONE);
      let startDate: Date;
      let endDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case 'week':
          startDate = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
          endDate = endOfWeek(now, { weekStartsOn: 0 });
          break;
        case 'month':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'quarter':
          startDate = startOfQuarter(now);
          endDate = endOfQuarter(now);
          break;
        default:
          startDate = new Date(0);
          endDate = new Date();
      }

      filtered = filtered.filter(transaction => {
        try {
          const transactionDate = parseISO(transaction.date);
          return isWithinInterval(transactionDate, { start: startDate, end: endDate });
        } catch {
          return false;
        }
      });
    }

    // Payment methods filter
    if (filters.paymentMethods.length > 0) {
      filtered = filtered.filter(transaction => {
        return filters.paymentMethods.some(method => {
          switch (method) {
            case 'dinheiro':
              return transaction.dinheiro > 0;
            case 'pix':
              return transaction.pix > 0;
            case 'debito':
              return transaction.debito > 0;
            case 'credito':
              return transaction.credito > 0;
            default:
              return false;
          }
        });
      });
    }

    // Value range filter
    if (filters.valueRange.min || filters.valueRange.max) {
      const minValue = filters.valueRange.min ? parseFloat(filters.valueRange.min) : 0;
      const maxValue = filters.valueRange.max ? parseFloat(filters.valueRange.max) : Infinity;

      filtered = filtered.filter(transaction => {
        const value = transaction.totalBruto;
        return value >= minValue && value <= maxValue;
      });
    }

    console.log('[Financeiro] Filtered transactions:', filtered.length, 'of', transactions.length);
    return filtered;
  }, [transactions, filters]);

  return {
    filters,
    setFilters,
    filteredTransactions,
    totalFiltered: filteredTransactions.length
  };
};