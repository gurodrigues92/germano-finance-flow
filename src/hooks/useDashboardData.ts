import { useMemo } from 'react';
import { useFinanceData } from '@/hooks/finance/useFinanceData';

interface DashboardDataHook {
  transactions: any[];
  currentMonth: string;
  currentYear: number;
  archivedData: any[];
}

export const useDashboardData = ({ transactions, currentMonth, currentYear, archivedData }: DashboardDataHook) => {
  const { getAvailableMonths } = useFinanceData({ 
    transactions, 
    currentMonth, 
    currentYear,
    archivedData: archivedData || []
  });

  const availableMonths = getAvailableMonths();
  
  // Dynamic month options - from March 2025 to current month
  const monthOptions = useMemo(() => {
    const options = [];
    const startDate = new Date('2025-03-01'); // Start from March 2025 (first month with data)
    const currentDate = new Date();
    
    // Generate months from March 2025 to current month
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Calculate total months from start to current
    const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth) + 1;
    
    for (let i = 0; i < totalMonths; i++) {
      const date = new Date(startYear, startMonth + i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthData = availableMonths.find(m => m.month === monthStr);
      
      options.unshift({ // Add to beginning for reverse chronological order
        value: monthStr,
        label: date.toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        }),
        hasData: !!monthData,
        count: monthData?.count || 0
      });
    }
    
    return options;
  }, [availableMonths]);

  return {
    availableMonths,
    monthOptions
  };
};