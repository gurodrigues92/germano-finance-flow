import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'default' | 'large';
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

const variantStyles = {
  default: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
  danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
};

const iconStyles = {
  default: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600'
};

export const InsightCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  progress, 
  variant = 'default',
  size = 'default',
  badge
}: InsightCardProps) => {
  return (
    <Card className={cn(
      'hover:shadow-md transition-all duration-200 hover:scale-[1.02]',
      variantStyles[variant],
      size === 'large' && 'md:col-span-2'
    )}>
      <CardContent className={cn(
        'p-4',
        size === 'large' && 'p-6'
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-5 w-5', iconStyles[variant])} />
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>
          {badge && (
            <Badge variant={badge.variant || 'default'} className="text-xs">
              {badge.text}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className={cn(
            'font-bold text-gray-900',
            size === 'large' ? 'text-2xl' : 'text-xl'
          )}>
            {value}
          </div>

          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span className={cn(
                'font-medium',
                trend.isPositive === true ? 'text-green-600' : 
                trend.isPositive === false ? 'text-red-600' : 'text-gray-600'
              )}>
                {trend.isPositive === true ? '↗' : trend.isPositive === false ? '↘' : '→'} {trend.value > 0 ? '+' : ''}{trend.value}
              </span>
              <span className="text-gray-500">{trend.label}</span>
            </div>
          )}

          {progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>{progress.label}</span>
                <span>{((progress.value / progress.max) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(progress.value / progress.max) * 100} 
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};