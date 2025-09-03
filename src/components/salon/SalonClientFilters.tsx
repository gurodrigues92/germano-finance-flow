import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Users, Calendar, DollarSign, CreditCard, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClienteFilters as ClienteFiltersType } from '@/types/salon';
import { useTranslations } from '@/lib/translations';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResponsiveButton } from '@/components/ui/responsive-button';

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
  const t = useTranslations();
  const isMobile = useIsMobile();

  const filterCategories = [
    {
      id: 'all',
      label: 'Todos os clientes',
      icon: Users,
      color: '#2196F3', // Azul
      count: totalClientes,
      description: 'Todos os clientes cadastrados',
      active: !filters.status && filters.ativo === undefined
    },
    {
      id: 'scheduled',
      label: 'Agendados',
      icon: Calendar,
      color: '#FF9800', // Laranja
      count: 0, // TODO: Implementar contagem
      description: 'Clientes com agendamentos',
      active: filters.status === 'agendados'
    },
    {
      id: 'credit',
      label: 'Com crédito',
      icon: DollarSign,
      color: '#4CAF50', // Verde
      count: 0, // TODO: Implementar contagem
      description: 'Saldo > R$ 0,00',
      active: filters.status === 'com_credito'
    },
    {
      id: 'debt',
      label: 'Em débito',
      icon: CreditCard,
      color: '#F44336', // Vermelho
      count: 0, // TODO: Implementar contagem
      description: 'Saldo < R$ 0,00',
      active: filters.status === 'em_debito'
    },
    {
      id: 'package',
      label: 'Com pacote',
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
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'}`}>
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
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center`}>
                <div 
                  className={`${isMobile ? 'w-8 h-8 mb-2' : 'w-12 h-12 mb-3'} mx-auto rounded-full flex items-center justify-center`}
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color
                  }}
                >
                  <Icon className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
                <h3 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>{category.label}</h3>
                <div 
                  className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-1`}
                  style={{ color: category.color }}
                >
                  {category.id === 'all' ? totalClientes : category.count}
                </div>
                {!isMobile && (
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'}`}>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t.placeholders.searchClients}
                  value={filters.search || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className={`flex items-center gap-3 ${isMobile ? 'justify-between' : ''}`}>
              <ResponsiveButton 
                variant="outline" 
                onClick={onAddClient}
                className="bg-green-500 text-white border-green-500 hover:bg-green-600"
              >
                <Users className="w-4 h-4 mr-2" />
                {t.actions.add} Cliente
              </ResponsiveButton>
              
              <ResponsiveButton variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Imprimir
              </ResponsiveButton>
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
              <ResponsiveButton 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs h-6"
              >
                Limpar filtros
              </ResponsiveButton>
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