import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useChartConfig, formatChartCurrency } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentMethodsChartProps {
  paymentMethodsData: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
}

export const PaymentMethodsChart = ({ paymentMethodsData }: PaymentMethodsChartProps) => {
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Distribuição por Forma de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentMethodsData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={isMobile ? 280 : chartConfig.pieChart.height}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy={isMobile ? "45%" : "50%"}
                  innerRadius={isMobile ? 45 : chartConfig.pieChart.innerRadius}
                  outerRadius={isMobile ? 90 : chartConfig.pieChart.outerRadius}
                  paddingAngle={5}
                  dataKey="value"
                  label={!isMobile ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatChartCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className={`grid gap-2 mt-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {paymentMethodsData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground flex-1">
                    {item.name}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium">{formatChartCurrency(item.value)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ height: isMobile ? 280 : chartConfig.pieChart.height }} className="flex items-center justify-center text-muted-foreground">
            Nenhuma transação encontrada
          </div>
        )}
      </CardContent>
    </Card>
  );
};