import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/PageLayout';
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
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export const Analysis = () => {
  const { currentMonth, setCurrentMonth, getMonthlyData, transactions } = useFinance();
  
  const currentData = getMonthlyData(currentMonth);

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

  // Payment methods data
  const paymentMethodsData = useMemo(() => {
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
      { 
        name: 'Dinheiro', 
        value: totals.dinheiro, 
        color: 'hsl(var(--finance-income))',
        percentage: currentData.totalBruto > 0 ? (totals.dinheiro / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'PIX', 
        value: totals.pix, 
        color: 'hsl(var(--finance-net))',
        percentage: currentData.totalBruto > 0 ? (totals.pix / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'Débito', 
        value: totals.debito, 
        color: 'hsl(var(--finance-studio))',
        percentage: currentData.totalBruto > 0 ? (totals.debito / currentData.totalBruto * 100) : 0
      },
      { 
        name: 'Crédito', 
        value: totals.credito, 
        color: 'hsl(var(--finance-fees))',
        percentage: currentData.totalBruto > 0 ? (totals.credito / currentData.totalBruto * 100) : 0
      }
    ].filter(item => item.value > 0);
  }, [currentData]);

  // Last 12 months evolution
  const evolutionData = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const data = getMonthlyData(monthStr);
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        fullMonth: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        bruto: data.totalBruto,
        liquido: data.totalLiquido,
        taxas: data.totalTaxas,
        studio: data.totalStudio,
        edu: data.totalEdu,
        kam: data.totalKam,
        transacoes: data.transactions.length
      });
    }
    return months;
  }, [getMonthlyData]);

  // Shares distribution
  const sharesData = [
    { 
      name: 'Studio (60%)', 
      value: currentData.totalStudio, 
      color: 'hsl(var(--finance-studio))',
      percentage: 60
    },
    { 
      name: 'Edu (40%)', 
      value: currentData.totalEdu, 
      color: 'hsl(var(--finance-edu))',
      percentage: 40
    },
    { 
      name: 'Kam (10%)', 
      value: currentData.totalKam, 
      color: 'hsl(var(--finance-kam))',
      percentage: 10
    }
  ];

  // Calculate month-over-month growth
  const previousMonth = useMemo(() => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  }, [currentMonth]);
  
  const previousData = getMonthlyData(previousMonth);
  const growth = useMemo(() => {
    if (previousData.totalBruto === 0) return 0;
    return ((currentData.totalBruto - previousData.totalBruto) / previousData.totalBruto) * 100;
  }, [currentData.totalBruto, previousData.totalBruto]);

  return (
    <PageLayout 
      title="Análise Financeira"
      subtitle="Relatórios detalhados e insights"
    >
      <div className="flex justify-end mb-6">
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

      {/* Growth Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {currentData.totalBruto.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
              <p className="text-sm text-muted-foreground">Faturamento do Mês</p>
            </div>
            
            <div className="flex items-center gap-2">
              {growth >= 0 ? (
                <TrendingUp className="h-5 w-5 text-finance-income" />
              ) : (
                <TrendingDown className="h-5 w-5 text-finance-fees" />
              )}
              <span className={`font-medium ${growth >= 0 ? 'text-finance-income' : 'text-finance-fees'}`}>
                {Math.abs(growth).toFixed(1)}% vs mês anterior
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Methods Distribution */}
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentMethodsData.map((entry, index) => (
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
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {paymentMethodsData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground flex-1">
                        {item.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {item.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma transação encontrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shares Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição de Cotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sharesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number"
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
                <YAxis 
                  dataKey="name" 
                  type="category"
                  className="text-sm"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(value))
                  }
                />
                <Bar dataKey="value" fill="hsl(var(--finance-studio))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução dos Últimos 12 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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

      {/* Detailed Monthly Report */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado - {currentMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Resumo Financeiro</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Transações:</span>
                  <span className="font-medium">{currentData.transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faturamento Bruto:</span>
                  <span className="font-medium text-finance-income">
                    {currentData.totalBruto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Taxas:</span>
                  <span className="font-medium text-finance-fees">
                    {currentData.totalTaxas.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Faturamento Líquido:</span>
                  <span className="font-bold text-finance-net">
                    {currentData.totalLiquido.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Distribuição de Cotas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Studio (60%):</span>
                  <span className="font-medium text-finance-studio">
                    {currentData.totalStudio.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Edu (40%):</span>
                  <span className="font-medium text-finance-edu">
                    {currentData.totalEdu.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kam (10%):</span>
                  <span className="font-medium text-finance-kam">
                    {currentData.totalKam.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};