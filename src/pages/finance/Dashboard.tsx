import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { HeroCard } from '@/components/dashboard/HeroCard';
import { CompactCard } from '@/components/dashboard/CompactCard';
import { GreetingHeader } from '@/components/dashboard/GreetingHeader';
import { MotivationalSection } from '@/components/dashboard/MotivationalSection';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickActionMenu } from '@/components/navigation/QuickActionMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Calculator,
  Scissors, 
  User,
  Receipt,
  Banknote,
  Smartphone,
  CreditCard
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
    kam: currentData.totalKam - previousData.totalKam,
    taxas: currentData.totalTaxas - previousData.totalTaxas,
    dinheiro: currentData.totalDinheiro - previousData.totalDinheiro,
    pix: currentData.totalPix - previousData.totalPix,
    debito: currentData.totalDebito - previousData.totalDebito,
    credito: currentData.totalCredito - previousData.totalCredito
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

  // Generate month options starting from January 2025
  const monthOptions = useMemo(() => {
    const options = [];
    const startDate = new Date('2025-01-01');
    const currentDate = new Date();
    
    // Calculate number of months from January 2025 to current month
    const monthsDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 
      + (currentDate.getMonth() - startDate.getMonth()) + 1;
    
    for (let i = 0; i < monthsDiff; i++) {
      const date = new Date('2025-01-01');
      date.setMonth(date.getMonth() + i);
      const monthStr = date.toISOString().slice(0, 7);
      options.unshift({
        value: monthStr,
        label: date.toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        })
      });
    }
    return options;
  }, []);

  // Transaction count data for pie chart
  const transactionCountData = useMemo(() => {
    const counts = currentData.transactions.reduce(
      (acc, t) => {
        if (t.dinheiro > 0) acc.dinheiro++;
        if (t.pix > 0) acc.pix++;
        if (t.debito > 0) acc.debito++;
        if (t.credito > 0) acc.credito++;
        return acc;
      },
      { dinheiro: 0, pix: 0, debito: 0, credito: 0 }
    );

    return [
      { name: 'Dinheiro', value: counts.dinheiro, color: '#10b981' },
      { name: 'PIX', value: counts.pix, color: '#3b82f6' },
      { name: 'Débito', value: counts.debito, color: '#8b5cf6' },
      { name: 'Crédito', value: counts.credito, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [currentData]);

  // Bi-weekly comparison data
  const biWeeklyData = useMemo(() => {
    const firstHalf = currentData.transactions.filter(t => {
      const day = new Date(t.date).getDate();
      return day <= 15;
    });
    
    const secondHalf = currentData.transactions.filter(t => {
      const day = new Date(t.date).getDate();
      return day > 15;
    });

    const calculateTotals = (transactions: any[]) => 
      transactions.reduce(
        (acc, t) => ({
          bruto: acc.bruto + t.totalBruto,
          liquido: acc.liquido + t.totalLiquido,
          count: acc.count + 1
        }),
        { bruto: 0, liquido: 0, count: 0 }
      );

    return {
      firstHalf: calculateTotals(firstHalf),
      secondHalf: calculateTotals(secondHalf)
    };
  }, [currentData]);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 pb-24">
      {/* Month Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-lg font-semibold text-foreground">Métricas do Mês</h2>
        <Select value={currentMonth} onValueChange={setCurrentMonth}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <HeroCard
          title="Total Bruto"
          value={currentData.totalBruto}
          icon={DollarSign}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
          trend={{
            value: trends.bruto,
            isPositive: trends.bruto >= 0
          }}
          subtitle="Receita total"
        />
        
        <HeroCard
          title="Total Líquido"
          value={currentData.totalLiquido}
          icon={Calculator}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={{
            value: trends.liquido,
            isPositive: trends.liquido >= 0
          }}
          subtitle="Após taxas"
        />
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-foreground mb-4">Métodos de Pagamento</h3>
        <div className="grid grid-cols-2 gap-3">
          <CompactCard
            title="Dinheiro"
            value={currentData.totalDinheiro}
            icon={Banknote}
            iconColor="text-green-600"
            iconBg="bg-green-100"
            trend={{
              value: trends.dinheiro,
              isPositive: trends.dinheiro >= 0
            }}
            percentage={`${currentData.totalBruto > 0 ? ((currentData.totalDinheiro / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
          
          <CompactCard
            title="PIX"
            value={currentData.totalPix}
            icon={Smartphone}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
            trend={{
              value: trends.pix,
              isPositive: trends.pix >= 0
            }}
            percentage={`${currentData.totalBruto > 0 ? ((currentData.totalPix / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
          
          <CompactCard
            title="Débito"
            value={currentData.totalDebito}
            icon={CreditCard}
            iconColor="text-violet-600"
            iconBg="bg-violet-100"
            trend={{
              value: trends.debito,
              isPositive: trends.debito >= 0
            }}
            percentage={`${currentData.totalBruto > 0 ? ((currentData.totalDebito / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
          
          <CompactCard
            title="Crédito"
            value={currentData.totalCredito}
            icon={CreditCard}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
            trend={{
              value: trends.credito,
              isPositive: trends.credito >= 0
            }}
            percentage={`${currentData.totalBruto > 0 ? ((currentData.totalCredito / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
        </div>
      </div>

      {/* Distribution & Fees */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-foreground mb-4">Distribuição e Taxas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            title="Studio (60%)"
            value={currentData.totalStudio}
            icon={Scissors}
            colorClass="bg-finance-studio"
            trend={{
              value: trends.studio,
              isPositive: trends.studio >= 0
            }}
            subtitle="Participação"
          />
          
          <MetricCard
            title="Edu (40%)"
            value={currentData.totalEdu}
            icon={User}
            colorClass="bg-finance-edu"
            trend={{
              value: trends.edu,
              isPositive: trends.edu >= 0
            }}
            subtitle="Cabeleireiro"
          />
          
          <MetricCard
            title="Kam (10%)"
            value={currentData.totalKam}
            icon={User}
            colorClass="bg-finance-kam"
            trend={{
              value: trends.kam,
              isPositive: trends.kam >= 0
            }}
            subtitle="Cabeleireiro"
          />
          
          <MetricCard
            title="Total Taxas"
            value={currentData.totalTaxas}
            icon={Receipt}
            colorClass="bg-finance-fees"
            trend={{
              value: trends.taxas,
              isPositive: trends.taxas <= 0
            }}
            subtitle="Descontos"
          />
        </div>
      </div>

      {/* Transaction Count Pie Chart */}
      {transactionCountData.length > 0 && (
        <Card className="mb-6 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionCountData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                </PieChart>
              </ResponsiveContainer>
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

      {/* Motivational Section */}
      <MotivationalSection />

      {/* Recent Transactions */}
      <RecentTransactions transactions={currentData.transactions} />
      
      {/* Quick Action Menu */}
      <QuickActionMenu />
    </div>
  );
};