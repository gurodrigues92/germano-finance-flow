import React, { useState } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ChevronDown, Filter, Zap } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-auto p-4 border-2 hover:border-primary/50 transition-all duration-200",
              isOpen && "border-primary/50 shadow-md"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-base">
                  {getCurrentPeriodText()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Clique para alterar período de análise
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {activeFilter === 'range' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Filter className="h-3 w-3 mr-1" />
                  Personalizado
                </Badge>
              )}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Selecionar Período</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Periods */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Períodos Rápidos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickPeriods.map((period) => {
                    const Icon = period.icon;
                    return (
                      <Button
                        key={period.value}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto p-2"
                        onClick={() => handleQuickPeriod(period)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        <span className="text-xs">{period.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Monthly Options */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Por Mês</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {monthOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={currentMonth === option.value && activeFilter === 'month' ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-between h-auto p-2"
                      onClick={() => handleMonthSelect(option.value)}
                    >
                      <span className="text-sm">{option.label}</span>
                      {option.hasData && option.count && (
                        <Badge variant="secondary" className="text-xs">
                          {option.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Range */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Período Personalizado</h4>
                <CalendarComponent
                  mode="range"
                  selected={selectedRange}
                  onSelect={setSelectedRange}
                  numberOfMonths={1}
                  className="pointer-events-auto"
                />
                {selectedRange?.from && selectedRange?.to && (
                  <Button
                    onClick={handleCustomRange}
                    className="w-full mt-2"
                    size="sm"
                  >
                    Aplicar Período Personalizado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};