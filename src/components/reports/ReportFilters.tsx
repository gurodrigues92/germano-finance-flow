import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { ReportFilter } from '@/hooks/useAdvancedReports';
import { useIsMobile } from '@/hooks/use-mobile';
import { QuickDateSelector } from './QuickDateSelector';

interface ReportFiltersProps {
  filters: ReportFilter;
  onChange: (filters: ReportFilter) => void;
}

export const ReportFilters = ({ filters, onChange }: ReportFiltersProps) => {
  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();
  const isMobile = useIsMobile();

  const updateFilter = (key: keyof ReportFilter, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <>
      <QuickDateSelector filters={filters} onChange={onChange} />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-foreground`}>
            Filtros Detalhados
          </CardTitle>
        </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter('startDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter('endDate', e.target.value)}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Select
              value={filters.paymentMethod}
              onValueChange={(value) => updateFilter('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os métodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os métodos</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="debito">Débito</SelectItem>
                <SelectItem value="credito">Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select
              value={filters.clienteId || 'all'}
              onValueChange={(value) => updateFilter('clienteId', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profissional */}
          <div className="space-y-2">
            <Label>Profissional</Label>
            <Select
              value={filters.profissionalId || 'all'}
              onValueChange={(value) => updateFilter('profissionalId', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os profissionais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os profissionais</SelectItem>
                {profissionais.map(profissional => (
                  <SelectItem key={profissional.id} value={profissional.id}>
                    {profissional.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value Range */}
          <div className="space-y-2">
            <Label htmlFor="minValue">Valor Mínimo (R$)</Label>
            <Input
              id="minValue"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minValue || ''}
              onChange={(e) => updateFilter('minValue', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxValue">Valor Máximo (R$)</Label>
            <Input
              id="maxValue"
              type="number"
              step="0.01"
              placeholder="999999.99"
              value={filters.maxValue || ''}
              onChange={(e) => updateFilter('maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};