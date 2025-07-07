import { LucideIcon } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const formatTrend = (value: number) => {
    const abs = Math.abs(value);
    const formatted = formatCompactCurrency(abs, isMobile);
    return trend?.isPositive ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={`glass rounded-xl ${isMobile ? 'p-3' : 'p-4'} shadow-sm border border-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 active:scale-95`}>
      <div className={`flex items-center ${isMobile ? 'space-x-2 mb-2' : 'space-x-3 mb-3'}`}>
        <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
        </div>
        <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>{title}</span>
      </div>

      <div className="space-y-1">
        <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`} title={formatCompactCurrency(value, false)}>
          {formatCompactCurrency(value, isMobile)}
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