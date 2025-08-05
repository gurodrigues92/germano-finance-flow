import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, DollarSign, CalendarDays, List } from 'lucide-react';

interface UnifiedTransactionFiltersProps {
  activeFilter: 'todas' | 'comandas_abertas' | 'transacoes_manuais' | 'hoje';
  onFilterChange: (filter: 'todas' | 'comandas_abertas' | 'transacoes_manuais' | 'hoje') => void;
  counts: {
    todas: number;
    comandas_abertas: number;
    transacoes_manuais: number;
    hoje: number;
  };
}

export const UnifiedTransactionFilters = ({
  activeFilter,
  onFilterChange,
  counts
}: UnifiedTransactionFiltersProps) => {
  const filters = [
    {
      key: 'todas' as const,
      label: 'Todas',
      icon: List,
      count: counts.todas,
      variant: 'default' as const
    },
    {
      key: 'comandas_abertas' as const,
      label: 'Comandas Abertas',
      icon: Receipt,
      count: counts.comandas_abertas,
      variant: 'destructive' as const
    },
    {
      key: 'transacoes_manuais' as const,
      label: 'Transações Manuais',
      icon: DollarSign,
      count: counts.transacoes_manuais,
      variant: 'secondary' as const
    },
    {
      key: 'hoje' as const,
      label: 'Hoje',
      icon: CalendarDays,
      count: counts.hoje,
      variant: 'outline' as const
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.key;
        
        return (
          <Button
            key={filter.key}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center gap-1.5 h-8 ${
              isActive ? '' : 'hover:bg-background'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{filter.label}</span>
            {filter.count > 0 && (
              <Badge 
                variant={isActive ? 'secondary' : filter.variant}
                className={`ml-1 h-4 px-1.5 text-xs ${
                  filter.key === 'comandas_abertas' && !isActive 
                    ? 'bg-destructive/10 text-destructive border-destructive/20' 
                    : ''
                }`}
              >
                {filter.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};