import { LucideIcon } from 'lucide-react';

interface CompactCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  percentage?: string;
}

export const CompactCard = ({ title, value, icon: Icon, iconColor, iconBg, trend, percentage }: CompactCardProps) => {
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
    <div className="glass rounded-xl p-4 shadow-sm border border-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 active:scale-95">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>

      <div className="space-y-1">
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(value)}
        </p>
        
        <div className="flex items-center justify-between">
          {percentage && (
            <span className="text-xs text-gray-500 font-medium">{percentage}</span>
          )}
          
          {trend && (
            <span className={`text-xs font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatTrend(trend.value)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};