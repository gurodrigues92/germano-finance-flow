import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  format?: 'currency' | 'percentage';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass,
  format = 'currency',
  trend 
}: MetricCardProps) => {
  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(val);
    }
    return `${val.toFixed(1)}%`;
  };

  const formatTrend = (val: number) => {
    const prefix = val >= 0 ? '+' : '';
    return format === 'currency' 
      ? `${prefix}${formatValue(val)}` 
      : `${prefix}${val.toFixed(1)}%`;
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          colorClass
        )}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {formatValue(value)}
        </div>
        {trend && (
          <p className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-finance-income" : "text-finance-fees"
          )}>
            {formatTrend(trend.value)} em relação ao mês anterior
          </p>
        )}
      </CardContent>
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
        colorClass.replace('bg-', 'from-').replace('bg-', 'to-') + '/20'
      )} />
    </Card>
  );
};