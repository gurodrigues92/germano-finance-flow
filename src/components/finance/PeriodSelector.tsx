import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DatePicker } from './DatePicker';
import { X, Calendar, Clock } from 'lucide-react';
import { getFirstHalfMonth, getSecondHalfMonth, getLastNDays, getLocalDateString } from '@/lib/dateUtils';
import { FilterState } from '@/hooks/finance/useTransactionFilters';
import { formatCurrency } from '@/lib/formatUtils';

interface PeriodSelectorProps {
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  transactions?: any[];
}

export const PeriodSelector = ({ filters, onFiltersChange, transactions = [] }: PeriodSelectorProps) => {
  const handleDateChange = (field: 'customDateStart' | 'customDateEnd', value: string) => {
    onFiltersChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyCustomDate = () => {
    if (filters.customDateStart && filters.customDateEnd) {
      if (filters.customDateStart > filters.customDateEnd) {
        alert('Data de início não pode ser maior que data final');
        return;
      }
      
      const today = getLocalDateString();
      if (filters.customDateStart > today || filters.customDateEnd > today) {
        alert('Não é possível selecionar datas futuras');
        return;
      }

      onFiltersChange(prev => ({
        ...prev,
        isCustomDateActive: true,
        dateRange: 'all'
      }));
    }
  };

  const applyQuickFilter = (type: 'today' | 'yesterday' | 'last-7' | 'last-15' | 'first-half' | 'second-half' | 'current-month') => {
    const today = getLocalDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let dateRange;
    
    switch (type) {
      case 'today':
        dateRange = { start: today, end: today };
        break;
      case 'yesterday':
        dateRange = { start: yesterday, end: yesterday };
        break;
      case 'last-7':
        dateRange = getLastNDays(7);
        break;
      case 'last-15':
        dateRange = getLastNDays(15);
        break;
      case 'first-half':
        dateRange = getFirstHalfMonth();
        break;
      case 'second-half':
        dateRange = getSecondHalfMonth();
        break;
      case 'current-month':
        onFiltersChange(prev => ({
          ...prev,
          isCustomDateActive: false,
          customDateStart: '',
          customDateEnd: '',
          dateRange: 'month'
        }));
        return;
    }

    onFiltersChange(prev => ({
      ...prev,
      customDateStart: dateRange.start,
      customDateEnd: dateRange.end,
      isCustomDateActive: true,
      dateRange: 'all'
    }));
  };

  const clearFilters = () => {
    onFiltersChange(prev => ({
      ...prev,
      customDateStart: '',
      customDateEnd: '',
      isCustomDateActive: false,
      dateRange: 'all'
    }));
  };

  // Calcular total do período selecionado
  const periodTotal = React.useMemo(() => {
    if (!filters.isCustomDateActive || !filters.customDateStart || !filters.customDateEnd) {
      return 0;
    }
    
    return transactions
      .filter(t => t.date >= filters.customDateStart && t.date <= filters.customDateEnd)
      .reduce((sum, t) => sum + (t.totalBruto || 0), 0);
  }, [transactions, filters.isCustomDateActive, filters.customDateStart, filters.customDateEnd]);

  const quickFilterButtons = [
    { key: 'today', label: 'Hoje', icon: Clock },
    { key: 'yesterday', label: 'Ontem', icon: Clock },
    { key: 'last-7', label: 'Últimos 7 dias', icon: Calendar },
    { key: 'last-15', label: 'Últimos 15 dias', icon: Calendar },
    { key: 'first-half', label: '1ª Quinzena', icon: Calendar },
    { key: 'second-half', label: '2ª Quinzena', icon: Calendar },
  ];

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-medium">Filtro por Período</h3>
          </div>
          {filters.isCustomDateActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickFilterButtons.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(key as any)}
              className="h-9 text-xs justify-start gap-2"
            >
              <Icon className="w-3 h-3" />
              {label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground px-2">Período Personalizado</span>
            <div className="h-px bg-border flex-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="startDate" className="text-xs font-medium">
                Data de Início
              </Label>
              <DatePicker
                value={filters.customDateStart}
                onChange={(value) => handleDateChange('customDateStart', value)}
                placeholder="Selecionar..."
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate" className="text-xs font-medium">
                Data Final
              </Label>
              <DatePicker
                value={filters.customDateEnd}
                onChange={(value) => handleDateChange('customDateEnd', value)}
                placeholder="Selecionar..."
              />
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={applyCustomDate}
            disabled={!filters.customDateStart || !filters.customDateEnd}
            className="w-full"
          >
            Aplicar Período Personalizado
          </Button>
        </div>

        {/* Active Filter Indicator */}
        {filters.isCustomDateActive && filters.customDateStart && filters.customDateEnd && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  Período Ativo
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(filters.customDateStart).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                  })} - {new Date(filters.customDateEnd).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            {periodTotal > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                <span className="text-sm font-medium">Total do Período:</span>
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(periodTotal)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};