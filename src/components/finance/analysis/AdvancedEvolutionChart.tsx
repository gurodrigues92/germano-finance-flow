import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useChartConfig } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface EvolutionDataPoint {
  month: string;
  fullMonth: string;
  bruto: number;
  liquido: number;
  transacoes: number;
  ticketMedio: number;
  margem: number;
}

interface AdvancedEvolutionChartProps {
  data: EvolutionDataPoint[];
}

const metricOptions = [
  { value: 'bruto', label: 'Faturamento Bruto', color: '#10b981' },
  { value: 'liquido', label: 'Faturamento Líquido', color: '#3b82f6' },
  { value: 'transacoes', label: 'Total de Transações', color: '#8b5cf6' },
  { value: 'ticketMedio', label: 'Ticket Médio', color: '#f59e0b' },
  { value: 'margem', label: 'Margem (%)', color: '#ef4444' }
];

export const AdvancedEvolutionChart = ({ data }: AdvancedEvolutionChartProps) => {
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();
  const [selectedMetric, setSelectedMetric] = useState('bruto');

  const currentMetric = metricOptions.find(m => m.value === selectedMetric)!;

  // Calculate trend line
  const calculateTrend = () => {
    if (data.length < 2) return null;
    
    const values = data.map(d => d[selectedMetric as keyof EvolutionDataPoint] as number);
    const n = values.length;
    const xSum = (n * (n - 1)) / 2;
    const ySum = values.reduce((sum, val) => sum + val, 0);
    const xySum = values.reduce((sum, val, index) => sum + (val * index), 0);
    const xSquareSum = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;
    
    return data.map((_, index) => ({
      month: data[index].month,
      trend: slope * index + intercept
    }));
  };

  const trendData = calculateTrend();

  const formatValue = (value: number) => {
    if (selectedMetric === 'margem') return `${value.toFixed(1)}%`;
    if (selectedMetric === 'transacoes') return value.toString();
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatTooltipValue = (value: number) => {
    if (selectedMetric === 'margem') return [`${value.toFixed(1)}%`, currentMetric.label];
    if (selectedMetric === 'transacoes') return [value.toString(), currentMetric.label];
    return [formatValue(value), currentMetric.label];
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução Temporal Avançada
          </CardTitle>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className={`${isMobile ? 'w-[160px]' : 'w-[200px]'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartConfig.areaChart.height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.05} />
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
              tickFormatter={(value) => {
                if (selectedMetric === 'margem') return `${value}%`;
                if (selectedMetric === 'transacoes') return value.toString();
                return isMobile ? 
                  `R$ ${(value / 1000).toFixed(0)}K` :
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }).format(value);
              }}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(label) => data.find(d => d.month === label)?.fullMonth || label}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={2}
              fill={`url(#gradient-${selectedMetric})`}
            />
            {trendData && (
              <ReferenceLine 
                segment={trendData.map((d, index) => ({ x: index, y: d.trend }))}
                stroke="#6b7280"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Insights */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Insight:</strong> {currentMetric.label} mostra{' '}
            {trendData && trendData.length > 1 && 
              (trendData[trendData.length - 1].trend > trendData[0].trend ? 
                'tendência de crescimento' : 'tendência de declínio')
            } ao longo do período analisado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};