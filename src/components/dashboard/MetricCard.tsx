import { LucideIcon } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const MetricCard = ({ title, value, icon: Icon, colorClass, trend, subtitle }: MetricCardProps) => {
  const isMobile = useIsMobile();
  
  const formatTrend = (value: number) => {
    const abs = Math.abs(value);
    const formatted = formatCompactCurrency(abs, isMobile);
    return trend?.isPositive ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={`glass rounded-2xl ${isMobile ? 'p-3' : 'p-4'} border border-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer active:scale-95`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground font-medium`}>{title}</span>
        <div className={`p-2 rounded-lg ${colorClass} shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground`} title={formatCompactCurrency(value, false)}>
          {formatCompactCurrency(value, isMobile)}
        </p>
        
        {trend && (
          <p className={`text-xs font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatTrend(trend.value)} vs mês anterior
          </p>
        )}
        
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};