import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { GreetingHeader } from '@/components/dashboard/GreetingHeader';
import { MotivationalSection } from '@/components/dashboard/MotivationalSection';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { PageLayout } from '@/components/layout/PageLayout';
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

  const handleAddTransaction = () => {
    // TODO: Open transaction form modal
    console.log('Add transaction clicked');
  };

  return (
    <PageLayout 
      title=""
      showGreeting={true}
      onFabClick={handleAddTransaction}
      subtitle="Sistema Financeiro"
    >
      {/* Month Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">Métricas do Mês</h2>
        <Select value={currentMonth} onValueChange={setCurrentMonth}>
          <SelectTrigger className="w-[180px]">
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

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Total Bruto"
          value={currentData.totalBruto}
          icon={DollarSign}
          colorClass="bg-finance-income"
          trend={{
            value: trends.bruto,
            isPositive: trends.bruto >= 0
          }}
          subtitle="Receita total"
        />
        
        <MetricCard
          title="Total Líquido"
          value={currentData.totalLiquido}
          icon={Calculator}
          colorClass="bg-finance-net"
          trend={{
            value: trends.liquido,
            isPositive: trends.liquido >= 0
          }}
          subtitle="Após taxas"
        />
      </div>

      {/* Payment Methods */}
      <div className="mb-4">
        <h3 className="text-md font-medium text-muted-foreground mb-3">Métodos de Pagamento</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            title="Dinheiro"
            value={currentData.totalDinheiro}
            icon={Banknote}
            colorClass="bg-finance-income"
            trend={{
              value: trends.dinheiro,
              isPositive: trends.dinheiro >= 0
            }}
            subtitle={`${currentData.totalBruto > 0 ? ((currentData.totalDinheiro / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
          
          <MetricCard
            title="PIX"
            value={currentData.totalPix}
            icon={Smartphone}
            colorClass="bg-finance-net"
            trend={{
              value: trends.pix,
              isPositive: trends.pix >= 0
            }}
            subtitle={`${currentData.totalBruto > 0 ? ((currentData.totalPix / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
          
          <MetricCard
            title="Débito"
            value={currentData.totalDebito}
            icon={CreditCard}
            colorClass="bg-finance-studio"
            trend={{
              value: trends.debito,
              isPositive: trends.debito >= 0
            }}
            subtitle={`${currentData.totalBruto > 0 ? ((currentData.totalDebito / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
          
          <MetricCard
            title="Crédito"
            value={currentData.totalCredito}
            icon={CreditCard}
            colorClass="bg-finance-fees"
            trend={{
              value: trends.credito,
              isPositive: trends.credito >= 0
            }}
            subtitle={`${currentData.totalBruto > 0 ? ((currentData.totalCredito / currentData.totalBruto) * 100).toFixed(1) : 0}%`}
          />
        </div>
      </div>

      {/* Distribution & Fees */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-muted-foreground mb-3">Distribuição e Taxas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

      {/* Motivational Section */}
      <MotivationalSection />

      {/* Recent Transactions */}
      <RecentTransactions transactions={currentData.transactions} />
    </PageLayout>
  );
};