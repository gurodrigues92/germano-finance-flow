import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DatePicker } from './DatePicker';
import { X, Calendar, ChevronDown } from 'lucide-react';
import { getFirstHalfMonth, getSecondHalfMonth, getLastNDays, formatDateRange, getLocalDateString } from '@/lib/dateUtils';
import { FilterState } from '@/hooks/finance/useTransactionFilters';

interface CustomDateFilterProps {
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const CustomDateFilter = ({ filters, onFiltersChange }: CustomDateFilterProps) => {
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
        dateRange: 'all' // Reset standard date range
      }));
    }
  };

  const applyQuickFilter = (type: 'first-half' | 'second-half' | 'last-7' | 'last-15' | 'current-month') => {
    let dateRange;
    
    switch (type) {
      case 'first-half':
        dateRange = getFirstHalfMonth();
        break;
      case 'second-half':
        dateRange = getSecondHalfMonth();
        break;
      case 'last-7':
        dateRange = getLastNDays(7);
        break;
      case 'last-15':
        dateRange = getLastNDays(15);
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

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {filters.isCustomDateActive ? 'Filtro Ativo' : 'Filtro de Data'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="mb-3">
          <CardContent className="p-3 space-y-3">
            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startDate" className="text-xs">Início</Label>
                <DatePicker
                  value={filters.customDateStart}
                  onChange={(value) => handleDateChange('customDateStart', value)}
                  placeholder="Data inicial"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs">Fim</Label>
                <DatePicker
                  value={filters.customDateEnd}
                  onChange={(value) => handleDateChange('customDateEnd', value)}
                  placeholder="Data final"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={applyCustomDate}
                disabled={!filters.customDateStart || !filters.customDateEnd}
                className="flex-1"
              >
                Aplicar
              </Button>
              
              {filters.isCustomDateActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Limpar
                </Button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyQuickFilter('first-half')}
                className="text-xs h-7 px-2"
              >
                1ª Quinzena
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyQuickFilter('second-half')}
                className="text-xs h-7 px-2"
              >
                2ª Quinzena
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyQuickFilter('last-7')}
                className="text-xs h-7 px-2"
              >
                7 dias
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyQuickFilter('last-15')}
                className="text-xs h-7 px-2"
              >
                15 dias
              </Button>
            </div>

            {/* Active Filter Indicator */}
            {filters.isCustomDateActive && filters.customDateStart && filters.customDateEnd && (
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                <Badge variant="secondary" className="text-xs">
                  {new Date(filters.customDateStart).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })} - {new Date(filters.customDateEnd).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-5 w-5 p-0 ml-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};