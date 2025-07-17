import { LucideIcon } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const HeroCard = ({ title, value, icon: Icon, gradient, trend, subtitle }: HeroCardProps) => {
  const isMobile = useIsMobile();
  
  const formatTrend = (value: number) => {
    const abs = Math.abs(value);
    const formatted = formatCompactCurrency(abs, isMobile);
    return trend?.isPositive ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={`${gradient} rounded-2xl ${isMobile ? 'p-4' : 'p-6'} text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-primary-foreground/80 text-sm font-medium">{title}</span>
        <Icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-primary-foreground/90`} />
      </div>
      
      <div className="space-y-2">
        <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`} title={formatCompactCurrency(value, false)}>
          {formatCompactCurrency(value, isMobile)}
        </p>
        
        {trend && (
          <p className="text-primary-foreground/90 text-sm font-medium">
            {formatTrend(trend.value)} vs mês anterior
          </p>
        )}
        
        {subtitle && (
          <p className="text-primary-foreground/70 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
};