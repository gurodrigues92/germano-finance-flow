import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from './DatePicker';
import { X, Calendar } from 'lucide-react';
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
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Filtro Período Customizado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Início</label>
            <DatePicker
              value={filters.customDateStart}
              onChange={(value) => handleDateChange('customDateStart', value)}
              placeholder="Selecione data inicial"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Fim</label>
            <DatePicker
              value={filters.customDateEnd}
              onChange={(value) => handleDateChange('customDateEnd', value)}
              placeholder="Selecione data final"
            />
          </div>
          
          <Button 
            onClick={applyCustomDate}
            disabled={!filters.customDateStart || !filters.customDateEnd}
            className="h-12"
          >
            Aplicar
          </Button>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('first-half')}
          >
            1ª Quinzena
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('second-half')}
          >
            2ª Quinzena
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('last-7')}
          >
            Últimos 7 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('last-15')}
          >
            Últimos 15 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter('current-month')}
          >
            Mês Completo
          </Button>
        </div>

        {/* Active Filter Badge */}
        {filters.isCustomDateActive && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-2">
              📅 Período: {formatDateRange(filters.customDateStart, filters.customDateEnd)}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};