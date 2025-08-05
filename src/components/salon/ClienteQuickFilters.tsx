import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClienteFilters } from '@/types/salon';
import { 
  Calendar, 
  CreditCard, 
  UserX, 
  TrendingUp, 
  Gift,
  Clock,
  Heart,
  Star
} from 'lucide-react';

interface ClienteQuickFiltersProps {
  onFilterSelect: (filter: Partial<ClienteFilters>) => void;
  currentFilters: ClienteFilters;
  stats: {
    aniversariantes: number;
    inativos30Dias: number;
    comCredito: number;
    primeiraVisita: number;
    agendadosHoje: number;
    vip: number;
  };
}

export const ClienteQuickFilters = ({ 
  onFilterSelect, 
  currentFilters,
  stats 
}: ClienteQuickFiltersProps) => {
  const quickFilters = [
    {
      id: 'aniversariantes',
      label: 'Aniversariantes',
      description: 'Aniversariantes do mês',
      icon: Calendar,
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      textColor: 'text-pink-700',
      count: stats.aniversariantes,
      filter: { status: 'aniversariantes' as const }
    },
    {
      id: 'credito',
      label: 'Com Crédito',
      description: 'Clientes com saldo positivo',
      icon: CreditCard,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      textColor: 'text-green-700',
      count: stats.comCredito,
      filter: { status: 'com_credito' as const }
    },
    {
      id: 'inativos',
      label: 'Inativos 30d',
      description: 'Sem visita há 30+ dias',
      icon: UserX,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      textColor: 'text-orange-700',
      count: stats.inativos30Dias,
      filter: { ultima_visita: { periodo: 'mais_de_30_dias' as const } }
    },
    {
      id: 'primeira_visita',
      label: 'Primeira Visita',
      description: 'Novos clientes',
      icon: Star,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      textColor: 'text-blue-700',
      count: stats.primeiraVisita,
      filter: { status: 'primeira_visita' as const }
    },
    {
      id: 'agendados_hoje',
      label: 'Agendados Hoje',
      description: 'Com atendimento hoje',
      icon: Clock,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      textColor: 'text-purple-700',
      count: stats.agendadosHoje,
      filter: { status: 'agendados' as const }
    },
    {
      id: 'vip',
      label: 'Clientes VIP',
      description: 'Alto valor gasto',
      icon: Heart,
      color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      textColor: 'text-amber-700',
      count: stats.vip,
      filter: { valor_gasto: { min: 1000, periodo: 'ultimo_ano' as const } }
    }
  ];

  const isFilterActive = (filterId: string) => {
    switch (filterId) {
      case 'aniversariantes':
        return currentFilters.status === 'aniversariantes';
      case 'credito':
        return currentFilters.status === 'com_credito';
      case 'inativos':
        return currentFilters.ultima_visita?.periodo === 'mais_de_30_dias';
      case 'primeira_visita':
        return currentFilters.status === 'primeira_visita';
      case 'agendados_hoje':
        return currentFilters.status === 'agendados';
      case 'vip':
        return currentFilters.valor_gasto?.min === 1000;
      default:
        return false;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {quickFilters.map((filter) => {
        const Icon = filter.icon;
        const isActive = isFilterActive(filter.id);
        
        return (
          <Card
            key={filter.id}
            className={`cursor-pointer transition-all duration-200 ${
              isActive 
                ? 'ring-2 ring-primary shadow-lg scale-105' 
                : filter.color
            }`}
            onClick={() => onFilterSelect(filter.filter)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : filter.textColor}`} />
                <Badge 
                  variant={isActive ? 'default' : 'secondary'} 
                  className="text-xs px-2 py-1"
                >
                  {filter.count}
                </Badge>
              </div>
              <div>
                <p className={`font-medium text-sm ${isActive ? 'text-primary' : filter.textColor}`}>
                  {filter.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {filter.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};