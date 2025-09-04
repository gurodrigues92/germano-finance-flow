import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, X } from 'lucide-react';
import { DatePicker } from './DatePicker';

interface SimpleDateFilterProps {
  onDateRangeChange: (start?: string, end?: string) => void;
  className?: string;
}

export const SimpleDateFilter = ({ onDateRangeChange, className }: SimpleDateFilterProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isActive, setIsActive] = useState(false);

  const applyDateRange = () => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        alert('Data de início não pode ser maior que data final');
        return;
      }
      
      onDateRangeChange(startDate, endDate);
      setIsActive(true);
    }
  };

  const clearDates = () => {
    setStartDate('');
    setEndDate('');
    setIsActive(false);
    onDateRangeChange(undefined, undefined);
  };

  const applyQuickFilter = (days: number) => {
    const today = new Date().toISOString().split('T')[0];
    const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setStartDate(pastDate);
    setEndDate(today);
    onDateRangeChange(pastDate, today);
    setIsActive(true);
  };

  return (
    <Card className={`border-primary/20 ${className}`}>
      <CardContent className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium">Filtro de Período</h3>
          </div>
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDates}
              className="h-6 px-2 text-xs"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(7)}
            className="h-8 text-xs"
          >
            7 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(30)}
            className="h-8 text-xs"
          >
            30 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(90)}
            className="h-8 text-xs"
          >
            90 dias
          </Button>
        </div>

        {/* Custom Date Range */}
        <div className="grid grid-cols-2 gap-2">
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="Início"
            className="h-9 text-xs"
          />
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="Fim"
            className="h-9 text-xs"
          />
        </div>

        <Button
          size="sm"
          onClick={applyDateRange}
          disabled={!startDate || !endDate}
          className="w-full h-8 text-xs"
        >
          Aplicar Filtro
        </Button>

        {/* Active Filter Indicator */}
        {isActive && startDate && endDate && (
          <div className="bg-primary/10 border border-primary/20 rounded p-2">
            <Badge variant="secondary" className="text-xs">
              {new Date(startDate).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short' 
              })} - {new Date(endDate).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short' 
              })}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};