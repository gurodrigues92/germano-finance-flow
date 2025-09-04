import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Calendar, Clock, TrendingUp, Timer, FileText } from 'lucide-react';
import { ReportFilter } from '@/hooks/useAdvancedReports';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdvancedQuickDateSelectorProps {
  filters: ReportFilter;
  onChange: (filters: ReportFilter) => void;
}

export const AdvancedQuickDateSelector = ({ filters, onChange }: AdvancedQuickDateSelectorProps) => {
  const isMobile = useIsMobile();

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isActive = (startDate: string, endDate: string) => {
    return filters.startDate === startDate && filters.endDate === endDate;
  };

  const quickDateOptions = [
    // Períodos Diários
    {
      category: 'Períodos Diários',
      options: [
        {
          label: 'Hoje',
          value: 'today',
          icon: Clock,
          description: 'Vendas de hoje',
          onClick: () => {
            const today = getDateString(new Date());
            onChange({ ...filters, startDate: today, endDate: today });
          }
        },
        {
          label: 'Ontem',
          value: 'yesterday',
          icon: CalendarDays,
          description: 'Vendas de ontem',
          onClick: () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = getDateString(yesterday);
            onChange({ ...filters, startDate: dateStr, endDate: dateStr });
          }
        }
      ]
    },
    // Períodos Semanais
    {
      category: 'Períodos Semanais',
      options: [
        {
          label: 'Esta Semana',
          value: 'this_week',
          icon: Calendar,
          description: 'Segunda até hoje',
          onClick: () => {
            const today = new Date();
            const monday = new Date(today);
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            monday.setDate(today.getDate() + daysToMonday);
            
            onChange({ 
              ...filters, 
              startDate: getDateString(monday), 
              endDate: getDateString(today) 
            });
          }
        },
        {
          label: 'Semana Passada',
          value: 'last_week',
          icon: Calendar,
          description: 'Segunda a domingo passados',
          onClick: () => {
            const today = new Date();
            const lastSunday = new Date(today);
            const daysToLastSunday = today.getDay() === 0 ? -7 : -today.getDay();
            lastSunday.setDate(today.getDate() + daysToLastSunday);
            
            const lastMonday = new Date(lastSunday);
            lastMonday.setDate(lastSunday.getDate() - 6);
            
            onChange({ 
              ...filters, 
              startDate: getDateString(lastMonday), 
              endDate: getDateString(lastSunday) 
            });
          }
        },
        {
          label: 'Últimos 7 dias',
          value: 'week',
          icon: TrendingUp,
          description: '7 dias corridos',
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
        }
      ]
    },
    // Períodos Mensais
    {
      category: 'Períodos Mensais',
      options: [
        {
          label: 'Este Mês',
          value: 'this_month',
          icon: Calendar,
          description: 'Do dia 1 até hoje',
          onClick: () => {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            onChange({ 
              ...filters, 
              startDate: getDateString(firstDay), 
              endDate: getDateString(today) 
            });
          }
        },
        {
          label: 'Mês Passado',
          value: 'last_month',
          icon: Calendar,
          description: 'Mês anterior completo',
          onClick: () => {
            const today = new Date();
            const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            onChange({ 
              ...filters, 
              startDate: getDateString(firstDayLastMonth), 
              endDate: getDateString(lastDayLastMonth) 
            });
          }
        },
        {
          label: 'Últimos 30 dias',
          value: 'month',
          icon: TrendingUp,
          description: '30 dias corridos',
          onClick: () => {
            const today = new Date();
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            onChange({ 
              ...filters, 
              startDate: getDateString(monthAgo), 
              endDate: getDateString(today) 
            });
          }
        },
        {
          label: 'Últimos 3 meses',
          value: 'quarter',
          icon: TrendingUp,
          description: '90 dias corridos',
          onClick: () => {
            const today = new Date();
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            onChange({ 
              ...filters, 
              startDate: getDateString(threeMonthsAgo), 
              endDate: getDateString(today) 
            });
          }
        }
      ]
    },
    // Períodos Anuais
    {
      category: 'Períodos Anuais',
      options: [
        {
          label: 'Este Ano',
          value: 'this_year',
          icon: FileText,
          description: 'Janeiro até hoje',
          onClick: () => {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), 0, 1);
            onChange({ 
              ...filters, 
              startDate: getDateString(firstDay), 
              endDate: getDateString(today) 
            });
          }
        },
        {
          label: 'Ano Passado',
          value: 'last_year',
          icon: FileText,
          description: 'Ano anterior completo',
          onClick: () => {
            const today = new Date();
            const firstDayLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const lastDayLastYear = new Date(today.getFullYear() - 1, 11, 31);
            onChange({ 
              ...filters, 
              startDate: getDateString(firstDayLastYear), 
              endDate: getDateString(lastDayLastYear) 
            });
          }
        }
      ]
    }
  ];

  // Check which period is currently active
  const getActivePeriod = () => {
    for (const category of quickDateOptions) {
      for (const option of category.options) {
        // Simulate the onClick to get the dates and compare
        const tempFilters = { ...filters };
        option.onClick = () => {}; // Prevent actual execution
        // We need to check manually for each period
        // This is a simplified check - in a real app you'd want more sophisticated logic
      }
    }
    return null;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Períodos Rápidos</CardTitle>
          <Badge variant="outline" className="text-xs">
            {quickDateOptions.reduce((total, cat) => total + cat.options.length, 0)} opções
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {quickDateOptions.map((category) => (
          <div key={category.category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {category.category}
            </h4>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
              {category.options.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={option.onClick}
                    className="h-auto p-3 flex flex-col items-start gap-1"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-3 w-3" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};