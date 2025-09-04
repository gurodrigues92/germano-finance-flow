import React, { useState } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown, Filter, Zap } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsivePopover } from '@/components/ui/responsive-popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AdvancedPeriodSelectorProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  monthOptions: Array<{ value: string; label: string; count?: number; hasData?: boolean }>;
}

export const AdvancedPeriodSelector = ({ 
  currentMonth, 
  onMonthChange, 
  onDateRangeChange,
  monthOptions 
}: AdvancedPeriodSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [activeFilter, setActiveFilter] = useState<string>('month');

  const quickPeriods = [
    {
      label: 'Últimos 7 dias',
      value: 'last-7',
      icon: Zap,
      getRange: () => ({
        from: subDays(new Date(), 6),
        to: new Date()
      })
    },
    {
      label: 'Últimos 30 dias',
      value: 'last-30',
      icon: Zap,
      getRange: () => ({
        from: subDays(new Date(), 29),
        to: new Date()
      })
    },
    {
      label: 'Último trimestre',
      value: 'last-quarter',
      icon: Zap,
      getRange: () => ({
        from: subMonths(new Date(), 3),
        to: new Date()
      })
    },
    {
      label: 'Este ano',
      value: 'this-year',
      icon: Zap,
      getRange: () => ({
        from: startOfYear(new Date()),
        to: endOfYear(new Date())
      })
    }
  ];

  const handleQuickPeriod = (period: any) => {
    const range = period.getRange();
    setSelectedRange(range);
    setActiveFilter('range');
    if (onDateRangeChange && range.from && range.to) {
      onDateRangeChange(range.from, range.to);
    }
    setIsOpen(false);
  };

  const handleMonthSelect = (month: string) => {
    onMonthChange(month);
    setActiveFilter('month');
    setSelectedRange(undefined);
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (selectedRange?.from && selectedRange?.to && onDateRangeChange) {
      onDateRangeChange(selectedRange.from, selectedRange.to);
      setActiveFilter('range');
      setIsOpen(false);
    }
  };

  const getCurrentPeriodText = () => {
    if (activeFilter === 'range' && selectedRange?.from && selectedRange?.to) {
      return `${format(selectedRange.from, 'dd MMM', { locale: ptBR })} - ${format(selectedRange.to, 'dd MMM yyyy', { locale: ptBR })}`;
    }
    
    const currentOption = monthOptions.find(opt => opt.value === currentMonth);
    return currentOption?.label || 'Selecionar período';
  };

  return (
    <div className="mb-6">
      <ResponsivePopover
        open={isOpen}
        onOpenChange={setIsOpen}
        align="start"
        className="w-full max-w-sm"
        trigger={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-auto p-3 md:p-4 border-2 hover:border-primary/50 transition-all duration-200",
              isOpen && "border-primary/50 shadow-md"
            )}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="font-semibold text-sm md:text-base truncate">
                  {getCurrentPeriodText()}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Clique para alterar período de análise
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 ml-2">
              {activeFilter === 'range' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  <Filter className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                  <span className="hidden sm:inline">Personalizado</span>
                </Badge>
              )}
              <ChevronDown className={cn("h-3 w-3 md:h-4 md:w-4 transition-transform flex-shrink-0", isOpen && "rotate-180")} />
            </div>
          </Button>
        }
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 px-4 md:px-6">
            <CardTitle className="text-base md:text-lg flex items-center space-x-2">
              <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              <span>Selecionar Período</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 md:px-6 pb-4 md:pb-6">
            {/* Custom Range - First on Mobile */}
            <div>
              <h4 className="font-medium text-xs md:text-sm text-muted-foreground mb-2">Período Personalizado</h4>
              <CalendarComponent
                mode="range"
                selected={selectedRange}
                onSelect={setSelectedRange}
                numberOfMonths={1}
                className="pointer-events-auto w-full border-0 p-0"
              />
              {selectedRange?.from && selectedRange?.to && (
                <Button
                  onClick={handleCustomRange}
                  className="w-full mt-3"
                  size="sm"
                >
                  Aplicar Período Personalizado
                </Button>
              )}
            </div>

            <Separator />

            {/* Quick Periods */}
            <div>
              <h4 className="font-medium text-xs md:text-sm text-muted-foreground mb-2">Períodos Rápidos</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickPeriods.map((period) => {
                  const Icon = period.icon;
                  return (
                    <Button
                      key={period.value}
                      variant="outline"
                      size="sm"
                      className="justify-start h-8 p-2 text-left text-xs"
                      onClick={() => handleQuickPeriod(period)}
                    >
                      <Icon className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{period.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Monthly Options */}
            <div>
              <h4 className="font-medium text-xs md:text-sm text-muted-foreground mb-2">Por Mês</h4>
              <div className="max-h-24 md:max-h-32 overflow-y-auto space-y-1">
                {monthOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={currentMonth === option.value && activeFilter === 'month' ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-between h-8 p-2"
                    onClick={() => handleMonthSelect(option.value)}
                  >
                    <span className="text-xs text-left flex-1 min-w-0 truncate">{option.label}</span>
                    {option.hasData && option.count && (
                      <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                        {option.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </ResponsivePopover>
    </div>
  );
};