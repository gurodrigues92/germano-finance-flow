import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useCustosFixos } from '@/hooks/useCustosFixos';
import { useInvestimentos } from '@/hooks/useInvestimentos';
import { useProdutos } from '@/hooks/useProdutos';
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
import { useChartConfig, formatCompactCurrency } from '@/hooks/useChartConfig';
import { useIsMobile } from '@/hooks/use-mobile';

export const Analysis = () => {
  const { currentMonth, setCurrentMonth, getMonthlyData, transactions } = useFinance();
  const { custos, totalPorCategoria: totalCustosPorCategoria, totalGeral: totalCustos } = useCustosFixos(currentMonth);
  const { investimentos, totalPorCategoria: totalInvestimentosPorCategoria, totalGeral: totalInvestimentos } = useInvestimentos();
  const { produtos, produtosBaixoEstoque, valorTotalEstoque } = useProdutos();
  
  const currentData = getMonthlyData(currentMonth);
  const chartConfig = useChartConfig();
  const isMobile = useIsMobile();

  // Generate month options - from March 2025 onwards (matching Dashboard logic)
  const monthOptions = useMemo(() => {
    const options = [];
    const startDate = new Date('2025-03-01'); // Start from March 2025 (first month with data)
    const currentDate = new Date();
    
    // Generate months from March 2025 to current month
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth();
    
    // Calculate total months from start to current
    const totalMonths = (currentYear - startYear) * 12 + (currentMonthNum - startMonth) + 1;
    
    for (let i = 0; i < totalMonths; i++) {
      const date = new Date(startYear, startMonth + i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      options.unshift({ // Add to beginning for reverse chronological order
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

  // Fixed Costs by Category
  const custosData = useMemo(() => {
    return Object.entries(totalCustosPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: categoria === 'Infraestrutura' ? 'hsl(var(--destructive))' :
             categoria === 'Serviços Profissionais' ? 'hsl(var(--warning))' :
             'hsl(var(--primary))',
      percentage: totalCustos > 0 ? (valor / totalCustos * 100) : 0
    }));
  }, [totalCustosPorCategoria, totalCustos]);

  // Investments by Category
  const investimentosData = useMemo(() => {
    return Object.entries(totalInvestimentosPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: categoria === 'Equipamentos' ? 'hsl(var(--chart-1))' :
             categoria === 'Mobiliário' ? 'hsl(var(--chart-2))' :
             categoria === 'Desenvolvimento' ? 'hsl(var(--chart-3))' :
             'hsl(var(--chart-4))',
      percentage: totalInvestimentos > 0 ? (valor / totalInvestimentos * 100) : 0
    }));
  }, [totalInvestimentosPorCategoria, totalInvestimentos]);

  // Stock Status
  const estoqueData = useMemo(() => {
    const produtosOk = produtos.filter(p => p.estoque_atual > p.estoque_minimo);
    const produtosBaixo = produtos.filter(p => p.estoque_atual <= p.estoque_minimo && p.estoque_atual > 0);
    const produtosSemEstoque = produtos.filter(p => p.estoque_atual === 0);

    const valorOk = produtosOk.reduce((sum, p) => sum + (p.estoque_atual * (p.valor_unitario || 0)), 0);
    const valorBaixo = produtosBaixo.reduce((sum, p) => sum + (p.estoque_atual * (p.valor_unitario || 0)), 0);
    const valorSemEstoque = produtosSemEstoque.reduce((sum, p) => sum + (p.estoque_atual * (p.valor_unitario || 0)), 0);

    return [
      {
        name: 'Estoque OK',
        value: valorOk,
        count: produtosOk.length,
        color: 'hsl(var(--success))',
        percentage: valorTotalEstoque > 0 ? (valorOk / valorTotalEstoque * 100) : 0
      },
      {
        name: 'Estoque Baixo',
        value: valorBaixo,
        count: produtosBaixo.length,
        color: 'hsl(var(--warning))',
        percentage: valorTotalEstoque > 0 ? (valorBaixo / valorTotalEstoque * 100) : 0
      },
      {
        name: 'Sem Estoque',
        value: valorSemEstoque,
        count: produtosSemEstoque.length,
        color: 'hsl(var(--destructive))',
        percentage: valorTotalEstoque > 0 ? (valorSemEstoque / valorTotalEstoque * 100) : 0
      }
    ].filter(item => item.count > 0);
  }, [produtos, valorTotalEstoque]);

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
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
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
                <ResponsiveContainer width="100%" height={chartConfig.pieChart.height}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy={isMobile ? "40%" : "50%"}
                      innerRadius={chartConfig.pieChart.innerRadius}
                      outerRadius={chartConfig.pieChart.outerRadius}
                      paddingAngle={5}
                      dataKey="value"
                      label={!isMobile ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCompactCurrency(Number(value))}
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
                        <span className="text-xs font-medium">{formatCompactCurrency(item.value)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: chartConfig.pieChart.height }} className="flex items-center justify-center text-muted-foreground">
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
            <ResponsiveContainer width="100%" height={chartConfig.barChart.height}>
              <BarChart data={sharesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number"
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
                <YAxis 
                  dataKey="name" 
                  type="category"
                  className="text-sm"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 80 : 100}
                />
                <Tooltip 
                  formatter={(value) => formatCompactCurrency(Number(value))}
                />
                <Bar dataKey="value" fill="hsl(var(--finance-studio))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Operational Charts Grid */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
        {/* Fixed Costs by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Custos Fixos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {custosData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={chartConfig.pieChart.height - 50}>
                  <PieChart>
                    <Pie
                      data={custosData}
                      cx="50%"
                      cy={isMobile ? "40%" : "50%"}
                      innerRadius={isMobile ? 40 : 50}
                      outerRadius={isMobile ? 80 : 100}
                      paddingAngle={5}
                      dataKey="value"
                      label={!isMobile ? ({ name, percent }) => `${percent.toFixed(0)}%` : false}
                    >
                      {custosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCompactCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2 mt-4">
                  {custosData.map((item, index) => (
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
              <div style={{ height: chartConfig.pieChart.height - 50 }} className="flex items-center justify-center text-muted-foreground">
                Nenhum custo encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investments by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Investimentos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investimentosData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={chartConfig.pieChart.height - 50}>
                  <PieChart>
                    <Pie
                      data={investimentosData}
                      cx="50%"
                      cy={isMobile ? "40%" : "50%"}
                      innerRadius={isMobile ? 40 : 50}
                      outerRadius={isMobile ? 80 : 100}
                      paddingAngle={5}
                      dataKey="value"
                      label={!isMobile ? ({ name, percent }) => `${percent.toFixed(0)}%` : false}
                    >
                      {investimentosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCompactCurrency(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2 mt-4">
                  {investimentosData.map((item, index) => (
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
              <div style={{ height: chartConfig.pieChart.height - 50 }} className="flex items-center justify-center text-muted-foreground">
                Nenhum investimento encontrado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Status do Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            {estoqueData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={chartConfig.pieChart.height - 50}>
                  <PieChart>
                    <Pie
                      data={estoqueData}
                      cx="50%"
                      cy={isMobile ? "40%" : "50%"}
                      innerRadius={isMobile ? 40 : 50}
                      outerRadius={isMobile ? 80 : 100}
                      paddingAngle={5}
                      dataKey="value"
                      label={!isMobile ? ({ name, percent }) => `${percent.toFixed(0)}%` : false}
                    >
                      {estoqueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        formatCompactCurrency(Number(value)),
                        `${name} (${props.payload.count} produtos)`
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2 mt-4">
                  {estoqueData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground flex-1">
                        {item.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: chartConfig.pieChart.height - 50 }} className="flex items-center justify-center text-muted-foreground">
                Nenhum produto encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evolution Chart */}
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