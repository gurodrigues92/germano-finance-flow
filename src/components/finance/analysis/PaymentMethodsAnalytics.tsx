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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                {!isMobile && <TableHead className="text-right">Valor Total</TableHead>}
                <TableHead className="text-right">{isMobile ? 'Trans.' : 'Transações'}</TableHead>
                {!isMobile && <TableHead className="text-right">Ticket Médio</TableHead>}
                <TableHead className="text-right">{isMobile ? '%' : 'Participação'}</TableHead>
                <TableHead className="text-right">Tendência</TableHead>
                {!isMobile && <TableHead className="text-right">Status</TableHead>}
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
                        <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{method.name}</span>
                      </div>
                    </TableCell>
                    
                    {!isMobile && (
                      <TableCell className="text-right font-mono">
                        {formatCompactCurrency(method.value, isMobile)}
                      </TableCell>
                    )}
                    
                    <TableCell className="text-right">
                      {isMobile ? (
                        <div className="text-center">
                          <div className="font-mono text-sm">{formatCompactCurrency(method.value, true)}</div>
                          <div className="text-xs text-muted-foreground">{method.count} tx</div>
                        </div>
                      ) : (
                        method.count
                      )}
                    </TableCell>
                    
                    {!isMobile && (
                      <TableCell className="text-right font-mono">
                        {formatCompactCurrency(method.ticketMedio, isMobile)}
                      </TableCell>
                    )}
                    
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {method.percentage.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      {isMobile ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant={valueBadge.variant} className="text-xs">
                            {valueBadge.icon && <valueBadge.icon className="w-3 h-3 mr-1" />}
                            {valueBadge.text}
                          </Badge>
                        </div>
                      ) : (
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
                      )}
                    </TableCell>
                    
                    {!isMobile && (
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
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

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