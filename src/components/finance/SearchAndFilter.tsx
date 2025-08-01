import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  searchText: string;
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'all';
  paymentMethods: string[];
  valueRange: {
    min: string;
    max: string;
  };
  customDateStart: string;
  customDateEnd: string;
  isCustomDateActive: boolean;
}

interface SearchAndFilterProps {
  filters: FilterState;
  onFiltersChange: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
}

export const SearchAndFilter = ({
  filters,
  onFiltersChange,
  totalResults
}: SearchAndFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange(prev => ({
      ...prev,
      searchText: value
    }));
  };

  const handleDateRangeChange = (value: string) => {
    onFiltersChange(prev => ({
      ...prev,
      dateRange: value as FilterState['dateRange'],
      isCustomDateActive: false // Reset custom date when using standard range
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    const newMethods = filters.paymentMethods.includes(method)
      ? filters.paymentMethods.filter(m => m !== method)
      : [...filters.paymentMethods, method];
    
    onFiltersChange(prev => ({
      ...prev,
      paymentMethods: newMethods
    }));
  };

  const handleValueRangeChange = (field: 'min' | 'max', value: string) => {
    onFiltersChange(prev => ({
      ...prev,
      valueRange: {
        ...prev.valueRange,
        [field]: value
      }
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange(prev => ({
      ...prev,
      searchText: '',
      dateRange: 'all',
      paymentMethods: [],
      valueRange: { min: '', max: '' },
      customDateStart: '',
      customDateEnd: '',
      isCustomDateActive: false
    }));
  };

  const hasActiveFilters = filters.searchText || 
    filters.dateRange !== 'all' || 
    filters.paymentMethods.length > 0 ||
    filters.valueRange.min ||
    filters.valueRange.max ||
    filters.isCustomDateActive;

  const dateRangeOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' }
  ];

  const paymentMethodOptions = [
    { value: 'dinheiro', label: 'Dinheiro', color: 'bg-green-100 text-green-800' },
    { value: 'pix', label: 'PIX', color: 'bg-blue-100 text-blue-800' },
    { value: 'debito', label: 'Débito', color: 'bg-violet-100 text-violet-800' },
    { value: 'credito', label: 'Crédito', color: 'bg-amber-100 text-amber-800' }
  ];

  const quickFilters = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' }
  ];

  console.log('[Financeiro] SearchAndFilter filters:', filters);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar transações..."
            value={filters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 relative">
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-primary-foreground rounded-full" />
                </div>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] max-h-[500px]">
            <SheetHeader className="text-left mb-4">
              <SheetTitle>Filtros Avançados</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-4 overflow-y-auto max-h-[400px]">
              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Valor</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.valueRange.min}
                    onChange={(e) => handleValueRangeChange('min', e.target.value)}
                    className="h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.valueRange.max}
                    onChange={(e) => handleValueRangeChange('max', e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-sm font-medium mb-2 block">Métodos</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethodOptions.map((method) => (
                    <label key={method.value} className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-border hover:bg-accent">
                      <input
                        type="checkbox"
                        checked={filters.paymentMethods.includes(method.value)}
                        onChange={() => handlePaymentMethodToggle(method.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        filters.paymentMethods.includes(method.value) 
                          ? 'bg-primary border-primary' 
                          : 'border-border'
                      }`}>
                        {filters.paymentMethods.includes(method.value) && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${method.color}`} />
                        <span className="text-sm">{method.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Button */}
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full h-9"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Quick Chips */}
      {quickFilters.some(filter => filters.dateRange === filter.value) || hasActiveFilters ? (
        <div className="flex flex-wrap gap-1">
          {quickFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant={filters.dateRange === filter.value ? "default" : "outline"}
              className="cursor-pointer text-xs h-6 px-2"
              onClick={() => handleDateRangeChange(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      ) : null}

      {/* Results */}
      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground">
          {totalResults} resultado{totalResults !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};