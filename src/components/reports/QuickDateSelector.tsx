import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Calendar, Clock } from 'lucide-react';
import { ReportFilter } from '@/hooks/useAdvancedReports';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickDateSelectorProps {
  filters: ReportFilter;
  onChange: (filters: ReportFilter) => void;
}

export const QuickDateSelector = ({ filters, onChange }: QuickDateSelectorProps) => {
  const isMobile = useIsMobile();

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isSpecificDay = () => {
    return filters.startDate === filters.endDate;
  };

  const quickDateOptions = [
    {
      label: 'Hoje',
      value: 'today',
      icon: Clock,
      onClick: () => {
        const today = getDateString(new Date());
        onChange({ ...filters, startDate: today, endDate: today });
      }
    },
    {
      label: 'Ontem',
      value: 'yesterday',
      icon: CalendarDays,
      onClick: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = getDateString(yesterday);
        onChange({ ...filters, startDate: dateStr, endDate: dateStr });
      }
    },
    {
      label: 'Últimos 7 dias',
      value: 'week',
      icon: Calendar,
      onClick: () => {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        onChange({ 
          ...filters, 
          startDate: getDateString(weekAgo), 
          endDate: getDateString(today) 
        });
      }
    },
    {
      label: 'Este mês',
      value: 'month',
      icon: Calendar,
      onClick: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        onChange({ 
          ...filters, 
          startDate: getDateString(firstDay), 
          endDate: getDateString(today) 
        });
      }
    }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Períodos Rápidos</h3>
            {isSpecificDay() && (
              <Badge variant="secondary" className="text-xs">
                Dia Específico
              </Badge>
            )}
          </div>
        </div>
        
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {quickDateOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.value === 'today' && filters.startDate === getDateString(new Date()) && isSpecificDay() ||
                            option.value === 'yesterday' && (() => {
                              const yesterday = new Date();
                              yesterday.setDate(yesterday.getDate() - 1);
                              return filters.startDate === getDateString(yesterday) && isSpecificDay();
                            })();
            
            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={option.onClick}
                className={`${isMobile ? 'text-xs' : 'text-sm'} justify-start`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {isMobile ? option.label.split(' ')[0] : option.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};