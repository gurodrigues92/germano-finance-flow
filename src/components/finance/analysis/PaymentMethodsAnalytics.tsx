import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentMethodData {
  name: string;
  value: number;
  count: number;
  ticketMedio: number;
  percentage: number;
  previousValue: number;
  previousCount: number;
  color: string;
}

interface PaymentMethodsAnalyticsProps {
  data: PaymentMethodData[];
}

export const PaymentMethodsAnalytics = ({ data }: PaymentMethodsAnalyticsProps) => {
  const isMobile = useIsMobile();

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getGrowthBadge = (growth: number) => {
    if (Math.abs(growth) < 5) return { icon: null, variant: 'secondary' as const, text: 'Estável' };
    if (growth > 0) return { icon: TrendingUp, variant: 'default' as const, text: `+${growth.toFixed(1)}%` };
    return { icon: TrendingDown, variant: 'destructive' as const, text: `${growth.toFixed(1)}%` };
  };

  const getAlertLevel = (method: PaymentMethodData) => {
    const valueGrowth = calculateGrowth(method.value, method.previousValue);
    const countGrowth = calculateGrowth(method.count, method.previousCount);
    
    if (valueGrowth < -20 || countGrowth < -20) return 'high';
    if (valueGrowth < -10 || countGrowth < -10) return 'medium';
    return 'low';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Análise de Métodos de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          // Mobile: Card layout
          <div className="space-y-3">
            {data.map((method) => {
              const valueGrowth = calculateGrowth(method.value, method.previousValue);
              const countGrowth = calculateGrowth(method.count, method.previousCount);
              const valueBadge = getGrowthBadge(valueGrowth);
              const countBadge = getGrowthBadge(countGrowth);
              const alertLevel = getAlertLevel(method);
              
              return (
                <div key={method.name} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: method.color }}
                      />
                      <span className="font-medium text-sm">{method.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {method.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Total:</span>
                      <div className="font-semibold">
                        {formatCompactCurrency(method.value, true)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Transações:</span>
                      <div className="font-semibold">{method.count}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground">Ticket:</span>
                      <span className="ml-1 font-medium">
                        {formatCompactCurrency(method.ticketMedio, true)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant={valueBadge.variant} className="text-xs px-1 py-0">
                        {valueBadge.text}
                      </Badge>
                      {alertLevel === 'high' && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          <AlertTriangle className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop: Table layout
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-right">Transações</TableHead>
                  <TableHead className="text-right">Ticket Médio</TableHead>
                  <TableHead className="text-right">Participação</TableHead>
                  <TableHead className="text-right">Tendência</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((method) => {
                  const valueGrowth = calculateGrowth(method.value, method.previousValue);
                  const countGrowth = calculateGrowth(method.count, method.previousCount);
                  const valueBadge = getGrowthBadge(valueGrowth);
                  const countBadge = getGrowthBadge(countGrowth);
                  const alertLevel = getAlertLevel(method);

                  return (
                    <TableRow key={method.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: method.color }}
                          />
                          <span className="font-medium">{method.name}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right font-mono">
                        {formatCompactCurrency(method.value, false)}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        {method.count}
                      </TableCell>
                      
                      <TableCell className="text-right font-mono">
                        {formatCompactCurrency(method.ticketMedio, false)}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <Badge variant="outline">
                          {method.percentage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex flex-col gap-1">
                          <Badge variant={valueBadge.variant} className="text-xs">
                            {valueBadge.icon && <valueBadge.icon className="w-3 h-3 mr-1" />}
                            Valor: {valueBadge.text}
                          </Badge>
                          <Badge variant={countBadge.variant} className="text-xs">
                            {countBadge.icon && <countBadge.icon className="w-3 h-3 mr-1" />}
                            Qtd: {countBadge.text}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        {alertLevel === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Atenção
                          </Badge>
                        )}
                        {alertLevel === 'medium' && (
                          <Badge variant="secondary" className="text-xs">
                            Observar
                          </Badge>
                        )}
                        {alertLevel === 'low' && (
                          <Badge variant="default" className="text-xs">
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary Insights */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">Insights Automáticos:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {data.map((method) => {
              const valueGrowth = calculateGrowth(method.value, method.previousValue);
              const alertLevel = getAlertLevel(method);
              
              if (alertLevel === 'high') {
                return (
                  <li key={method.name} className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>
                      <strong>{method.name}</strong> apresenta queda significativa ({valueGrowth.toFixed(1)}%) - investigar causas
                    </span>
                  </li>
                );
              }
              
              if (valueGrowth > 20) {
                return (
                  <li key={method.name} className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>
                      <strong>{method.name}</strong> em forte crescimento ({valueGrowth.toFixed(1)}%) - oportunidade de investir
                    </span>
                  </li>
                );
              }
              
              return null;
            }).filter(Boolean)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};