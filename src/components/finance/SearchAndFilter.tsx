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
}

interface SearchAndFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalResults: number;
}

export const SearchAndFilter = ({
  filters,
  onFiltersChange,
  totalResults
}: SearchAndFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchText: value
    });
  };

  const handleDateRangeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: value as FilterState['dateRange']
    });
  };

  const handlePaymentMethodToggle = (method: string) => {
    const newMethods = filters.paymentMethods.includes(method)
      ? filters.paymentMethods.filter(m => m !== method)
      : [...filters.paymentMethods, method];
    
    onFiltersChange({
      ...filters,
      paymentMethods: newMethods
    });
  };

  const handleValueRangeChange = (field: 'min' | 'max', value: string) => {
    onFiltersChange({
      ...filters,
      valueRange: {
        ...filters.valueRange,
        [field]: value
      }
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchText: '',
      dateRange: 'all',
      paymentMethods: [],
      valueRange: { min: '', max: '' }
    });
  };

  const hasActiveFilters = filters.searchText || 
    filters.dateRange !== 'all' || 
    filters.paymentMethods.length > 0 ||
    filters.valueRange.min ||
    filters.valueRange.max;

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
    <div className="space-y-3 mb-4">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-3 -mx-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            value={filters.searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-12 h-11"
          />
          {/* Filter Toggle for Mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <SlidersHorizontal className={`h-4 w-4 ${hasActiveFilters ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh]">
              <SheetHeader className="mb-4">
                <SheetTitle>Filtros Avançados</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 pb-6">
                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Período
                  </label>
                  <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRangeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Value Range Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Faixa de Valor
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Valor mínimo"
                      type="number"
                      inputMode="numeric"
                      value={filters.valueRange.min}
                      onChange={(e) => handleValueRangeChange('min', e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Valor máximo"
                      type="number"
                      inputMode="numeric"
                      value={filters.valueRange.max}
                      onChange={(e) => handleValueRangeChange('max', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Payment Methods Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Métodos de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethodOptions.map(method => (
                      <Badge
                        key={method.value}
                        variant={filters.paymentMethods.includes(method.value) ? "default" : "outline"}
                        className={`cursor-pointer transition-all hover:scale-105 justify-center p-3 h-auto ${
                          filters.paymentMethods.includes(method.value) 
                            ? method.color 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handlePaymentMethodToggle(method.value)}
                      >
                        {method.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Quick Filters - Horizontal Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {quickFilters.map(filter => (
          <Button
            key={filter.value}
            variant={filters.dateRange === filter.value ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap h-8 px-3 text-xs flex-shrink-0"
            onClick={() => handleDateRangeChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="whitespace-nowrap h-8 px-3 text-xs flex-shrink-0 text-muted-foreground"
            onClick={clearAllFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Results Count */}
      {hasActiveFilters && (
        <div className="text-xs text-muted-foreground px-1">
          {totalResults} {totalResults === 1 ? 'transação encontrada' : 'transações encontradas'}
        </div>
      )}
    </div>
  );
};