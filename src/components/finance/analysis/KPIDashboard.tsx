import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPI {
  title: string;
  value: number;
  growth: number;
  badge: {
    label: string;
    color: string;
    textColor: string;
  };
  format: 'currency' | 'number' | 'percentage' | 'decimal';
}

interface KPIDashboardProps {
  kpis: KPI[];
}

export const KPIDashboard = ({ kpis }: KPIDashboardProps) => {
  const isMobile = useIsMobile();

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return formatCompactCurrency(value, isMobile);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(1);
      case 'number':
      default:
        return value.toString();
    }
  };

  const getTrendIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (growth < 0) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-gray-500" />;
  };

  const formatGrowth = (growth: number) => {
    const abs = Math.abs(growth);
    const sign = growth >= 0 ? '+' : '-';
    return `${sign}${abs.toFixed(1)}%`;
  };

  return (
    <div className={`grid gap-3 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
      {kpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            {/* Badge */}
            <div className={`absolute ${isMobile ? 'top-1 right-1' : 'top-2 right-2'}`}>
              <span className={`${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'} rounded-full font-medium ${kpi.badge.color} ${kpi.badge.textColor}`}>
                {kpi.badge.label}
              </span>
            </div>

            {/* Content */}
            <div className={`space-y-${isMobile ? '1' : '2'}`}>
              <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground`}>{kpi.title}</h3>
              
              <div className="space-y-1">
                <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`} title={formatValue(kpi.value, kpi.format)}>
                  {formatValue(kpi.value, kpi.format)}
                </p>
                
                {kpi.growth !== 0 && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(kpi.growth)}
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-medium ${
                      kpi.growth > 0 ? 'text-green-600' : 
                      kpi.growth < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {formatGrowth(kpi.growth)} {isMobile ? '' : 'vs mês anterior'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};