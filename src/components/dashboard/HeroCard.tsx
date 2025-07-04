import { LucideIcon } from 'lucide-react';

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
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const formatTrend = (value: number) => {
    const abs = Math.abs(value);
    const formatted = formatCurrency(abs);
    return trend?.isPositive ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={`${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm font-medium">{title}</span>
        <Icon className="w-6 h-6 text-white/90" />
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold">
          {formatCurrency(value)}
        </p>
        
        {trend && (
          <p className="text-white/90 text-sm font-medium">
            {formatTrend(trend.value)} vs mês anterior
          </p>
        )}
        
        {subtitle && (
          <p className="text-white/70 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
};