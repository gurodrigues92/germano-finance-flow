import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useChartConfig, formatCompactCurrency } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionChartsProps {
  transactionCountData: Array<{ name: string; value: number; color: string }>;
  biWeeklyData: {
    firstHalf: { bruto: number; liquido: number; count: number };
    secondHalf: { bruto: number; liquido: number; count: number };
  };
  paymentMethodsData?: Array<{ name: string; value: number; color: string; percentage: number }>;
}

export const TransactionCharts = ({ transactionCountData, biWeeklyData, paymentMethodsData }: TransactionChartsProps) => {
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();

  // Custom legend component for payment methods
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    if (!paymentMethodsData) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {paymentMethodsData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.name}: {formatCompactCurrency(entry.value)} ({entry.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      {/* Transaction Count Pie Chart */}
      {transactionCountData.length > 0 && (
        <Card className="mb-6 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: chartConfig.pieChart.height }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionCountData}
                    cx="50%"
                    cy={isMobile ? "40%" : "50%"}
                    outerRadius={chartConfig.pieChart.outerRadius}
                    fill="#8884d8"
                    dataKey="value"
                    label={!isMobile ? ({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                  >
                    {transactionCountData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  {paymentMethodsData && isMobile && <Legend content={renderCustomLegend} />}
                </PieChart>
              </ResponsiveContainer>
              {paymentMethodsData && !isMobile && renderCustomLegend({})}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bi-weekly Comparison */}
      {(biWeeklyData.firstHalf.count > 0 || biWeeklyData.secondHalf.count > 0) && (
        <Card className="mb-6 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Comparativo Quinzenal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">1ª Quinzena (1-15)</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Transações:</span>
                    <span className="text-xs font-medium">{biWeeklyData.firstHalf.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total Bruto:</span>
                    <span className="text-xs font-medium">R$ {biWeeklyData.firstHalf.bruto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total Líquido:</span>
                    <span className="text-xs font-medium">R$ {biWeeklyData.firstHalf.liquido.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">2ª Quinzena (16-31)</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Transações:</span>
                    <span className="text-xs font-medium">{biWeeklyData.secondHalf.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total Bruto:</span>
                    <span className="text-xs font-medium">R$ {biWeeklyData.secondHalf.bruto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total Líquido:</span>
                    <span className="text-xs font-medium">R$ {biWeeklyData.secondHalf.liquido.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};