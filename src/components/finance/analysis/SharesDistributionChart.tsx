import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useChartConfig, formatChartCurrency } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface SharesDistributionChartProps {
  sharesData: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
}

export const SharesDistributionChart = ({ sharesData }: SharesDistributionChartProps) => {
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Distribuição de Cotas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartConfig.barChart.height}>
          <BarChart 
            data={sharesData} 
            layout="horizontal"
            margin={chartConfig.barChart.margin}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              type="number"
              className="text-sm"
              tick={{ fontSize: isMobile ? 9 : 12 }}
              tickFormatter={(value) => formatChartCurrency(value)}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              className="text-sm"
              tick={{ fontSize: isMobile ? 9 : 12 }}
              width={isMobile ? 60 : 100}
            />
            <Tooltip 
              formatter={(value) => formatChartCurrency(Number(value))}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--finance-studio))"
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};