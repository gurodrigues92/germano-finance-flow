import { useIsMobile } from './use-mobile';

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

export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};