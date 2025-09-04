import React, { useState } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Filter, Zap, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PeriodSelectorModalProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  currentPeriod?: { from?: Date; to?: Date };
}

export const PeriodSelectorModal = ({ 
  onDateRangeChange,
  currentPeriod
}: PeriodSelectorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    currentPeriod ? { from: currentPeriod.from, to: currentPeriod.to } : undefined
  );

  const quickPeriods = [
    {
      label: 'Hoje',
      value: 'today',
      icon: Clock,
      getRange: () => ({
        from: new Date(),
        to: new Date()
      })
    },
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
      label: 'Este mês',
      value: 'this-month',
      icon: Calendar,
      getRange: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
      })
    },
    {
      label: 'Mês passado',
      value: 'last-month',
      icon: Calendar,
      getRange: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        };
      }
    },
    {
      label: 'Últimos 90 dias',
      value: 'last-90',
      icon: Zap,
      getRange: () => ({
        from: subDays(new Date(), 89),
        to: new Date()
      })
    }
  ];

  const handleQuickPeriod = (period: any) => {
    const range = period.getRange();
    setSelectedRange(range);
    if (onDateRangeChange && range.from && range.to) {
      onDateRangeChange(range.from, range.to);
    }
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (selectedRange?.from && selectedRange?.to && onDateRangeChange) {
      onDateRangeChange(selectedRange.from, selectedRange.to);
      setIsOpen(false);
    }
  };

  const getCurrentPeriodText = () => {
    if (currentPeriod?.from && currentPeriod?.to) {
      if (format(currentPeriod.from, 'yyyy-MM-dd') === format(currentPeriod.to, 'yyyy-MM-dd')) {
        return format(currentPeriod.from, 'dd MMM yyyy', { locale: ptBR });
      }
      return `${format(currentPeriod.from, 'dd MMM', { locale: ptBR })} - ${format(currentPeriod.to, 'dd MMM yyyy', { locale: ptBR })}`;
    }
    return 'Selecionar período';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-auto p-3 border-2 hover:border-primary/50 transition-all duration-200 min-w-[200px]",
            currentPeriod && "border-primary/30 bg-primary/5"
          )}
        >
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">
                {getCurrentPeriodText()}
              </div>
              <div className="text-xs text-muted-foreground">
                Período de análise
              </div>
            </div>
            {currentPeriod && (
              <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
                <Filter className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Selecionar Período de Análise</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Periods */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">Períodos Rápidos</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickPeriods.map((period) => {
                const Icon = period.icon;
                return (
                  <Button
                    key={period.value}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-3 hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleQuickPeriod(period)}
                  >
                    <Icon className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{period.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Custom Range */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">Período Personalizado</h4>
            <div className="border rounded-lg p-3 bg-muted/30">
              <CalendarComponent
                mode="range"
                selected={selectedRange}
                onSelect={setSelectedRange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
              
              {selectedRange?.from && selectedRange?.to && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    Período selecionado: {format(selectedRange.from, 'dd MMM', { locale: ptBR })} - {format(selectedRange.to, 'dd MMM yyyy', { locale: ptBR })}
                  </div>
                  <Button
                    onClick={handleCustomRange}
                    className="w-full"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Aplicar Período Personalizado
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};