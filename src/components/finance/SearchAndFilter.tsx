import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

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

  console.log('[Financeiro] SearchAndFilter filters:', filters);

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Busca e Filtros
        </h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por data, valor ou observações..."
          value={filters.searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
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
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Faixa de Valor
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.valueRange.min}
              onChange={(e) => handleValueRangeChange('min', e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.valueRange.max}
              onChange={(e) => handleValueRangeChange('max', e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Payment Methods Filter */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Métodos de Pagamento
          </label>
          <div className="flex flex-wrap gap-2">
            {paymentMethodOptions.map(method => (
              <Badge
                key={method.value}
                variant={filters.paymentMethods.includes(method.value) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
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
      </div>

      {/* Results Count */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground pt-2 border-t">
          {totalResults} {totalResults === 1 ? 'transação encontrada' : 'transações encontradas'}
        </div>
      )}
    </div>
  );
};