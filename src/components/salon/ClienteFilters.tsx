import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClienteFilters as ClienteFiltersType } from '@/types/salon';
import { Search, Filter, X } from 'lucide-react';

interface ClienteFiltersProps {
  filters: ClienteFiltersType;
  onFiltersChange: (filters: ClienteFiltersType) => void;
  totalClientes: number;
  filteredCount: number;
}

export const ClienteFilters = ({
  filters,
  onFiltersChange,
  totalClientes,
  filteredCount
}: ClienteFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ 
      ...filters, 
      status: status === 'todos' ? undefined : status as any
    });
  };

  const handleAtivoChange = (ativo: string) => {
    onFiltersChange({ 
      ...filters, 
      ativo: ativo === 'all' ? undefined : ativo === 'true'
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.status || filters.ativo !== undefined;

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, telefone ou e-mail..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        {/* Status do Cliente */}
        <Select 
          value={filters.status || 'todos'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os clientes</SelectItem>
            <SelectItem value="com_credito">Com crédito</SelectItem>
            <SelectItem value="em_debito">Em débito</SelectItem>
            <SelectItem value="com_pacote">Com pacote</SelectItem>
          </SelectContent>
        </Select>

        {/* Ativo/Inativo */}
        <Select 
          value={filters.ativo === undefined ? 'all' : filters.ativo.toString()} 
          onValueChange={handleAtivoChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativos</SelectItem>
            <SelectItem value="false">Inativos</SelectItem>
          </SelectContent>
        </Select>

        {/* Limpar Filtros */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Badges de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary">
              Busca: "{filters.search}"
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary">
              {filters.status === 'com_credito' && 'Com crédito'}
              {filters.status === 'em_debito' && 'Em débito'}
              {filters.status === 'com_pacote' && 'Com pacote'}
            </Badge>
          )}
          {filters.ativo === false && (
            <Badge variant="secondary">Inativos</Badge>
          )}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredCount} de {totalClientes} clientes
      </div>
    </div>
  );
};