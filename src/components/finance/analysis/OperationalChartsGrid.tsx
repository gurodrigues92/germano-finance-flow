import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useChartConfig, formatCompactCurrency } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface OperationalChartsGridProps {
  custosData: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  investimentosData: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  estoqueData: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
    count: number;
  }>;
}

export const OperationalChartsGrid = ({ custosData, investimentosData, estoqueData }: OperationalChartsGridProps) => {
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();

  const ChartCard = ({ 
    title, 
    data, 
    emptyMessage, 
    includeCount = false 
  }: { 
    title: string; 
    data: any[]; 
    emptyMessage: string;
    includeCount?: boolean;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={isMobile ? 240 : chartConfig.pieChart.height - 50}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy={isMobile ? "45%" : "50%"}
                  innerRadius={isMobile ? 35 : 50}
                  outerRadius={isMobile ? 75 : 100}
                  paddingAngle={5}
                  dataKey="value"
                  label={!isMobile ? ({ name, percent }) => `${percent.toFixed(0)}%` : false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => 
                    includeCount ? [
                      formatCompactCurrency(Number(value)),
                      `${name} (${props.payload.count} produtos)`
                    ] : [
                      formatCompactCurrency(Number(value)),
                      name
                    ]
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground flex-1">
                    {item.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {includeCount ? item.count : `${item.percentage.toFixed(1)}%`}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ height: isMobile ? 240 : chartConfig.pieChart.height - 50 }} className="flex items-center justify-center text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`grid gap-6 lg:gap-8 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
      <ChartCard 
        title="Custos Fixos por Categoria"
        data={custosData}
        emptyMessage="Nenhum custo encontrado"
      />
      
      <ChartCard 
        title="Investimentos por Categoria"
        data={investimentosData}
        emptyMessage="Nenhum investimento encontrado"
      />
      
      <ChartCard 
        title="Status do Estoque"
        data={estoqueData}
        emptyMessage="Nenhum produto encontrado"
        includeCount={true}
      />
    </div>
  );
};