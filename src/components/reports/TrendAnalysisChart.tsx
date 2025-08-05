import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Bar } from 'recharts';
import { TrendAnalysis } from '@/hooks/useAdvancedReports';
import { formatCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react';

interface TrendAnalysisChartProps {
  data: TrendAnalysis[];
}

export const TrendAnalysisChart = ({ data }: TrendAnalysisChartProps) => {
  const isMobile = useIsMobile();

  const avgGrowth = data.length > 0 ? data.reduce((sum, d) => sum + d.growth, 0) / data.length : 0;
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalTransactions = data.reduce((sum, d) => sum + d.transactions, 0);
  const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const formatTooltip = (value: any, name: string) => {
    if (name === 'revenue' || name === 'avgTicket') {
      return [formatCurrency(value), name === 'revenue' ? 'Receita' : 'Ticket Médio'];
    }
    if (name === 'growth') {
      return [`${value.toFixed(1)}%`, 'Crescimento'];
    }
    if (name === 'transactions') {
      return [value, 'Transações'];
    }
    return [value, name];
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 font-medium">Receita Total</p>
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-green-800`}>
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 font-medium">Crescimento Médio</p>
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-blue-800`}>
                  {avgGrowth >= 0 ? '+' : ''}{avgGrowth.toFixed(1)}%
                </p>
              </div>
              {avgGrowth >= 0 ? 
                <TrendingUp className="w-5 h-5 text-blue-600" /> : 
                <TrendingDown className="w-5 h-5 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-700 font-medium">Total Transações</p>
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-purple-800`}>
                  {totalTransactions}
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-700 font-medium">Ticket Médio</p>
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-orange-800`}>
                  {formatCurrency(avgTicket)}
                </p>
              </div>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* Revenue and Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} text-foreground`}>
              Evolução da Receita e Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="left"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <YAxis 
                  yAxisId="growth"
                  orientation="right"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={formatTooltip} />
                <Area 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.1}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line 
                  yAxisId="growth"
                  type="monotone" 
                  dataKey="growth" 
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transactions and Average Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} text-foreground`}>
              Volume e Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="transactions"
                  orientation="left"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="avgTicket"
                  orientation="right"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip formatter={formatTooltip} />
                <Bar 
                  yAxisId="transactions"
                  dataKey="transactions" 
                  fill="hsl(var(--chart-1))"
                  opacity={0.7}
                  radius={[2, 2, 0, 0]}
                />
                <Line 
                  yAxisId="avgTicket"
                  type="monotone" 
                  dataKey="avgTicket" 
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};