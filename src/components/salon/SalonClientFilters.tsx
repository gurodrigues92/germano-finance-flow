import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Users, Calendar, DollarSign, CreditCard, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClienteFilters as ClienteFiltersType } from '@/types/salon';

interface SalonClientFiltersProps {
  filters: ClienteFiltersType;
  onFiltersChange: (filters: ClienteFiltersType) => void;
  totalClientes: number;
  filteredCount: number;
  onAddClient?: () => void;
}

export const SalonClientFilters = ({ 
  filters, 
  onFiltersChange, 
  totalClientes, 
  filteredCount,
  onAddClient
}: SalonClientFiltersProps) => {
  const filterCategories = [
    {
      id: 'all',
      label: 'All clients',
      icon: Users,
      color: '#2196F3', // Azul
      count: totalClientes,
      description: 'Todos os clientes cadastrados',
      active: !filters.status && filters.ativo === undefined
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      icon: Calendar,
      color: '#FF9800', // Laranja
      count: 0, // TODO: Implementar contagem
      description: 'Clientes com agendamentos',
      active: filters.status === 'agendados'
    },
    {
      id: 'credit',
      label: 'Clients with credit',
      icon: DollarSign,
      color: '#4CAF50', // Verde
      count: 0, // TODO: Implementar contagem
      description: 'Balance > R$ 0,00',
      active: filters.status === 'com_credito'
    },
    {
      id: 'debt',
      label: 'Clients in debt',
      icon: CreditCard,
      color: '#F44336', // Vermelho
      count: 0, // TODO: Implementar contagem
      description: 'Balance < R$ 0,00',
      active: filters.status === 'em_debito'
    },
    {
      id: 'package',
      label: 'Clients with package',
      icon: Package,
      color: '#9C27B0', // Roxo
      count: 0, // TODO: Implementar contagem
      description: 'Pacotes ativos',
      active: filters.status === 'com_pacote'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      onFiltersChange({ ...filters, status: undefined, ativo: undefined });
    } else {
      const statusMap: Record<string, ClienteFiltersType['status']> = {
        'scheduled': 'agendados',
        'credit': 'com_credito',
        'debt': 'em_debito',
        'package': 'com_pacote'
      };
      onFiltersChange({ ...filters, status: statusMap[categoryId] });
    }
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof ClienteFiltersType] !== undefined && 
    filters[key as keyof ClienteFiltersType] !== ''
  );

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filterCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                category.active ? 'ring-2 ring-offset-2 shadow-lg' : 'hover:scale-[1.02]'
              }`}
              style={{
                borderColor: category.active ? category.color : undefined
              }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{category.label}</h3>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: category.color }}
                >
                  {category.id === 'all' ? totalClientes : category.count}
                </div>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onAddClient}
                className="bg-green-500 text-white border-green-500 hover:bg-green-600"
              >
                <Users className="w-4 h-4 mr-2" />
                Add Client
              </Button>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {filters.search && (
                <Badge variant="secondary">
                  Busca: "{filters.search}"
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary">
                  Status: {filters.status}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs h-6"
              >
                Limpar filtros
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            Mostrando {filteredCount} de {totalClientes} clientes
          </div>
        </CardContent>
      </Card>
    </div>
  );
};