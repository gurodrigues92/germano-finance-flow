import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ActionableInsightProps {
  type: 'success' | 'warning' | 'info' | 'trend';
  title: string;
  description: string;
  action?: string;
  priority?: 'high' | 'medium' | 'low';
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50',
    iconColor: 'text-green-600',
    badgeVariant: 'default' as const
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50',
    iconColor: 'text-yellow-600',
    badgeVariant: 'secondary' as const
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50',
    iconColor: 'text-blue-600',
    badgeVariant: 'secondary' as const
  },
  trend: {
    icon: TrendingUp,
    className: 'border-purple-200 bg-purple-50',
    iconColor: 'text-purple-600',
    badgeVariant: 'secondary' as const
  }
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Média', 
  low: 'Baixa'
};

export const ActionableInsight = ({ 
  type, 
  title, 
  description, 
  action, 
  priority 
}: ActionableInsightProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={config.className}>
      <Icon className={`h-4 w-4 ${config.iconColor}`} />
      <AlertDescription>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{title}</span>
              {priority && (
                <Badge variant={config.badgeVariant} className="text-xs">
                  {priorityLabels[priority]}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{description}</p>
            {action && (
              <p className="text-xs text-gray-600 italic">💡 {action}</p>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};