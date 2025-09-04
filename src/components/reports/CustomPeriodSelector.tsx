import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ReportFilter } from '@/hooks/useAdvancedReports';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomPeriodSelectorProps {
  filters: ReportFilter;
  onChange: (filters: ReportFilter) => void;
}

export const CustomPeriodSelector = ({ filters, onChange }: CustomPeriodSelectorProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );
  const isMobile = useIsMobile();

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      onChange({ 
        ...filters, 
        startDate: dateStr,
        // If no end date is set, set it to the same as start date
        endDate: filters.endDate || dateStr
      });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      onChange({ 
        ...filters, 
        endDate: dateStr,
        // If no start date is set, set it to the same as end date
        startDate: filters.startDate || dateStr
      });
    }
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    const today = new Date().toISOString().split('T')[0];
    onChange({ ...filters, startDate: today, endDate: today });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Período Personalizado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* Start Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    const minDate = startDate || new Date('1900-01-01');
                    return date > today || date < minDate;
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Period Preview */}
        {startDate && endDate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Período selecionado:</div>
            <div className="font-medium">
              {format(startDate, "dd/MM/yyyy")} até {format(endDate, "dd/MM/yyyy")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} dias
            </div>
          </div>
        )}

        {/* Clear Button */}
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={clearDates} className="w-full">
            Limpar Período
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};