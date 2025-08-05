import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ClienteFilters } from '@/types/salon';
import { 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ClienteAdvancedFiltersProps {
  filters: ClienteFilters;
  onFiltersChange: (filters: ClienteFilters) => void;
  onClearFilters: () => void;
}

export const ClienteAdvancedFilters = ({
  filters,
  onFiltersChange,
  onClearFilters
}: ClienteAdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDataNascimentoChange = (field: string, value: string) => {
    onFiltersChange({
      ...filters,
      data_nascimento: {
        ...filters.data_nascimento,
        [field]: field === 'mes' ? parseInt(value) : value
      }
    });
  };

  const handleUltimaVisitaChange = (periodo: string) => {
    onFiltersChange({
      ...filters,
      ultima_visita: { periodo: periodo as any }
    });
  };

  const handleValorGastoChange = (field: string, value: string | number) => {
    onFiltersChange({
      ...filters,
      valor_gasto: {
        ...filters.valor_gasto,
        [field]: typeof value === 'string' ? value : parseFloat(value.toString())
      }
    });
  };

  const handleOrdenacaoChange = (campo: string) => {
    onFiltersChange({
      ...filters,
      ordenacao: campo as any
    });
  };

  const handleDirecaoChange = (direcao: string) => {
    onFiltersChange({
      ...filters,
      direcao: direcao as any
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.data_nascimento?.mes || filters.data_nascimento?.periodo) count++;
    if (filters.ultima_visita?.periodo) count++;
    if (filters.valor_gasto?.min || filters.valor_gasto?.max || filters.valor_gasto?.periodo) count++;
    if (filters.ordenacao && filters.ordenacao !== 'nome') count++;
    return count;
  };

  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <CardTitle className="text-sm">Filtros Avançados</CardTitle>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Data de Nascimento
                </Label>
                <Select
                  value={filters.data_nascimento?.periodo || ''}
                  onValueChange={(value) => handleDataNascimentoChange('periodo', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="este_mes">Este mês</SelectItem>
                    <SelectItem value="proximo_mes">Próximo mês</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.data_nascimento?.mes?.toString() || ''}
                  onValueChange={(value) => handleDataNascimentoChange('mes', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Mês específico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {meses.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value.toString()}>
                        {mes.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Última Visita */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Última Visita
                </Label>
                <Select
                  value={filters.ultima_visita?.periodo || ''}
                  onValueChange={handleUltimaVisitaChange}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="ultimos_7_dias">Últimos 7 dias</SelectItem>
                    <SelectItem value="ultimos_30_dias">Últimos 30 dias</SelectItem>
                    <SelectItem value="mais_de_30_dias">Mais de 30 dias</SelectItem>
                    <SelectItem value="mais_de_90_dias">Mais de 90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Valor Gasto */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Valor Gasto
                </Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="h-8"
                    value={filters.valor_gasto?.min || ''}
                    onChange={(e) => handleValorGastoChange('min', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    className="h-8"
                    value={filters.valor_gasto?.max || ''}
                    onChange={(e) => handleValorGastoChange('max', e.target.value)}
                  />
                </div>
                <Select
                  value={filters.valor_gasto?.periodo || 'total'}
                  onValueChange={(value) => handleValorGastoChange('periodo', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="ultimo_mes">Último mês</SelectItem>
                    <SelectItem value="ultimo_ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenação */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  Ordenação
                </Label>
                <Select
                  value={filters.ordenacao || 'nome'}
                  onValueChange={handleOrdenacaoChange}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome">Nome</SelectItem>
                    <SelectItem value="ultima_visita">Última visita</SelectItem>
                    <SelectItem value="valor_gasto">Valor gasto</SelectItem>
                    <SelectItem value="saldo">Saldo</SelectItem>
                    <SelectItem value="data_cadastro">Data cadastro</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.direcao || 'asc'}
                  onValueChange={handleDirecaoChange}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Crescente</SelectItem>
                    <SelectItem value="desc">Decrescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botão Limpar Filtros */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex justify-end mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClearFilters}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar filtros avançados
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};