import { LucideIcon } from 'lucide-react';

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
    <div className="bg-card rounded-2xl p-4 border border-border hover:scale-[1.02] transition-transform cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(value)}
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