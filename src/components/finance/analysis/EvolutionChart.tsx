import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartConfig, formatCompactCurrency } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface EvolutionChartProps {
  evolutionData: Array<{
    month: string;
    fullMonth: string;
    bruto: number;
    liquido: number;
    taxas: number;
    studio: number;
    edu: number;
    kam: number;
    transacoes: number;
  }>;
}

export const EvolutionChart = ({ evolutionData }: EvolutionChartProps) => {
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução dos Últimos 12 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartConfig.areaChart.height}>
          <AreaChart data={evolutionData}>
            <defs>
              <linearGradient id="colorBruto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--finance-income))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--finance-income))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorLiquido" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--finance-net))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--finance-net))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-sm"
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis 
              className="text-sm"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={(value) => 
                isMobile ? formatCompactCurrency(value) :
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value)
              }
            />
            <Tooltip 
              formatter={(value) => formatCompactCurrency(Number(value))}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullMonth;
                }
                return label;
              }}
            />
            <Area
              type="monotone"
              dataKey="bruto"
              stroke="hsl(var(--finance-income))"
              fillOpacity={1}
              fill="url(#colorBruto)"
              name="Total Bruto"
            />
            <Area
              type="monotone"
              dataKey="liquido"
              stroke="hsl(var(--finance-net))"
              fillOpacity={1}
              fill="url(#colorLiquido)"
              name="Total Líquido"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};