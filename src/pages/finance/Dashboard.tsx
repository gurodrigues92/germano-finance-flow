import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { MetricCard } from '@/components/finance/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Star,
  Receipt
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const Dashboard = () => {
  const { currentMonth, setCurrentMonth, getMonthlyData, transactions } = useFinance();
  
  const currentData = getMonthlyData(currentMonth);
  
  // Previous month data for comparison
  const previousMonth = useMemo(() => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  }, [currentMonth]);
  
  const previousData = getMonthlyData(previousMonth);

  // Calculate trends
  const trends = useMemo(() => ({
    bruto: currentData.totalBruto - previousData.totalBruto,
    liquido: currentData.totalLiquido - previousData.totalLiquido,
    studio: currentData.totalStudio - previousData.totalStudio,
    edu: currentData.totalEdu - previousData.totalEdu,
    kam: currentData.totalKam - previousData.totalKam
  }), [currentData, previousData]);

  // Payment methods data for chart
  const paymentData = useMemo(() => {
    const totals = currentData.transactions.reduce(
      (acc, t) => ({
        dinheiro: acc.dinheiro + t.dinheiro,
        pix: acc.pix + t.pix,
        debito: acc.debito + t.debito,
        credito: acc.credito + t.credito
      }),
      { dinheiro: 0, pix: 0, debito: 0, credito: 0 }
    );

    return [
      { name: 'Dinheiro', value: totals.dinheiro, color: '#10b981' },
      { name: 'PIX', value: totals.pix, color: '#3b82f6' },
      { name: 'Débito', value: totals.debito, color: '#8b5cf6' },
      { name: 'Crédito', value: totals.credito, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [currentData]);

  // Last 6 months data for bar chart
  const monthlyChart = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentMonth);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const data = getMonthlyData(monthStr);
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        bruto: data.totalBruto,
        liquido: data.totalLiquido,
        taxas: data.totalTaxas
      });
    }
    return months;
  }, [currentMonth, getMonthlyData]);

  // Generate month options for the last 12 months
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      options.push({
        value: monthStr,
        label: date.toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        })
      });
    }
    return options;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas do Studio Germano
          </p>
        </div>
        
        <Select value={currentMonth} onValueChange={setCurrentMonth}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar mês" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          title="Total Bruto"
          value={currentData.totalBruto}
          icon={DollarSign}
          colorClass="bg-finance-income"
          trend={{
            value: trends.bruto,
            isPositive: trends.bruto >= 0
          }}
        />
        
        <MetricCard
          title="Total Líquido"
          value={currentData.totalLiquido}
          icon={TrendingUp}
          colorClass="bg-finance-net"
          trend={{
            value: trends.liquido,
            isPositive: trends.liquido >= 0
          }}
        />
        
        <MetricCard
          title="Studio (60%)"
          value={currentData.totalStudio}
          icon={Users}
          colorClass="bg-finance-studio"
          trend={{
            value: trends.studio,
            isPositive: trends.studio >= 0
          }}
        />
        
        <MetricCard
          title="Edu (40%)"
          value={currentData.totalEdu}
          icon={GraduationCap}
          colorClass="bg-finance-edu"
          trend={{
            value: trends.edu,
            isPositive: trends.edu >= 0
          }}
        />
        
        <MetricCard
          title="Kam (10%)"
          value={currentData.totalKam}
          icon={Star}
          colorClass="bg-finance-kam"
          trend={{
            value: trends.kam,
            isPositive: trends.kam >= 0
          }}
        />
        
        <MetricCard
          title="Taxas"
          value={currentData.totalTaxas}
          icon={Receipt}
          colorClass="bg-finance-fees"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução dos Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-sm"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-sm"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0
                    }).format(value)
                  }
                />
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(value))
                  }
                />
                <Bar dataKey="bruto" fill="hsl(var(--finance-income))" name="Bruto" />
                <Bar dataKey="liquido" fill="hsl(var(--finance-net))" name="Líquido" />
                <Bar dataKey="taxas" fill="hsl(var(--finance-fees))" name="Taxas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formas de Pagamento - {currentMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => 
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(Number(value))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma transação encontrada para este mês
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-foreground">
                {currentData.transactions.length}
              </div>
              <div className="text-sm text-muted-foreground">Transações</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-foreground">
                {currentData.transactions.length > 0 
                  ? (currentData.totalBruto / currentData.transactions.length).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  : 'R$ 0,00'
                }
              </div>
              <div className="text-sm text-muted-foreground">Ticket Médio</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-foreground">
                {currentData.totalTaxas > 0 
                  ? ((currentData.totalTaxas / currentData.totalBruto) * 100).toFixed(1)
                  : '0'
                }%
              </div>
              <div className="text-sm text-muted-foreground">Taxa Média</div>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-foreground">
                {currentData.totalLiquido > 0 
                  ? ((currentData.totalLiquido / currentData.totalBruto) * 100).toFixed(1)
                  : '0'
                }%
              </div>
              <div className="text-sm text-muted-foreground">Margem Líquida</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};