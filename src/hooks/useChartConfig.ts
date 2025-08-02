import { useIsMobile } from './use-mobile';
import { formatCompactCurrency } from '@/lib/formatUtils';

export const useChartConfig = () => {
  const isMobile = useIsMobile();
  
  return {
    pieChart: {
      height: isMobile ? 250 : 300,
      outerRadius: isMobile ? 70 : 120,
      innerRadius: isMobile ? 35 : 60,
      labelPosition: isMobile ? 'bottom' : 'center'
    },
    areaChart: {
      height: isMobile ? 300 : 400
    },
    barChart: {
      height: isMobile ? 250 : 300
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