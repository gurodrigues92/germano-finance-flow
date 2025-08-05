import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceByDayChartProps {
  data: Array<{
    day: string;
    revenue: number;
    transactions: number;
    avgTicket: number;
  }>;
}

export const PerformanceByDayChart = ({ data }: PerformanceByDayChartProps) => {
  const isMobile = useIsMobile();

  // Colors for each day
  const dayColors = [
    '#ef4444', // Sunday - Red
    '#3b82f6', // Monday - Blue  
    '#10b981', // Tuesday - Green
    '#f59e0b', // Wednesday - Yellow
    '#8b5cf6', // Thursday - Purple
    '#06b6d4', // Friday - Cyan
    '#84cc16'  // Saturday - Lime
  ];

  const formatTooltip = (value: any, name: string) => {
    if (name === 'revenue' || name === 'avgTicket') {
      return [formatCurrency(value), name === 'revenue' ? 'Receita' : 'Ticket Médio'];
    }
    if (name === 'transactions') {
      return [value, 'Transações'];
    }
    return [value, name];
  };

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const bestDay = data.find(d => d.revenue === maxRevenue);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalTransactions = data.reduce((sum, d) => sum + d.transactions, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-foreground`}>
          Performance por Dia da Semana
        </CardTitle>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Total: {formatCurrency(totalRevenue)}</span>
          <span>Transações: {totalTransactions}</span>
          {bestDay && (
            <span className="text-green-600 font-medium">
              Melhor dia: {bestDay.day} ({formatCurrency(bestDay.revenue)})
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* Revenue by Day */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-muted-foreground">Receita por Dia</h4>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="revenue" radius={[2, 2, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={dayColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transactions by Day */}
          <div>
            <h4 className="font-medium mb-3 text-sm text-muted-foreground">Transações por Dia</h4>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  axisLine={false}
                />
                <Tooltip formatter={formatTooltip} />
                <Bar dataKey="transactions" radius={[2, 2, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={dayColors[index]} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={`grid gap-3 mt-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {data.map((day, index) => (
            <div 
              key={day.day}
              className="bg-gray-50 rounded-lg p-3 text-center"
              style={{ borderTop: `3px solid ${dayColors[index]}` }}
            >
              <div className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: dayColors[index] }}>
                {day.day}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 space-y-1`}>
                <div>{formatCurrency(day.revenue, true)}</div>
                <div>{day.transactions} transações</div>
                <div className="font-medium">{formatCurrency(day.avgTicket, true)} ticket</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};