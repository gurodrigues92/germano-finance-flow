import { useIsMobile } from './use-mobile';
import { formatCompactCurrency } from '@/lib/formatUtils';

export const useChartConfig = () => {
  const isMobile = useIsMobile();
  
  return {
    pieChart: {
      height: isMobile ? 220 : 300,
      outerRadius: isMobile ? 60 : 120,
      innerRadius: isMobile ? 30 : 60,
      labelPosition: isMobile ? 'bottom' : 'center',
      margin: isMobile ? { top: 10, right: 10, bottom: 40, left: 10 } : { top: 20, right: 20, bottom: 20, left: 20 }
    },
    areaChart: {
      height: isMobile ? 250 : 400,
      margin: isMobile ? { top: 10, right: 10, bottom: 20, left: 10 } : { top: 20, right: 30, bottom: 20, left: 20 }
    },
    barChart: {
      height: isMobile ? 220 : 300,
      margin: isMobile ? { top: 10, right: 10, bottom: 20, left: 10 } : { top: 20, right: 30, bottom: 20, left: 20 }
    },
    legend: {
      verticalAlign: isMobile ? 'bottom' : 'middle',
      align: isMobile ? 'center' : 'right',
      layout: isMobile ? 'horizontal' : 'vertical'
    }
  };
};

export const formatChartCurrency = (value: number): string => {
  return formatCompactCurrency(value, true);
};