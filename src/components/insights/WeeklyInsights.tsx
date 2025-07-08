import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Target, Zap } from 'lucide-react';

interface WeeklyInsightsProps {
  transactions: any[];
  currentMonth: string;
}

export const WeeklyInsights = ({ transactions, currentMonth }: WeeklyInsightsProps) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  // Calcular totais do período atual
  const currentMonthTotals = transactions.reduce(
    (acc, tx) => ({
      totalBruto: acc.totalBruto + tx.totalBruto,
      totalLiquido: acc.totalLiquido + tx.totalLiquido,
      totalPix: acc.totalPix + tx.pix,
      totalCredito: acc.totalCredito + tx.credito,
      totalDebito: acc.totalDebito + tx.debito,
      totalDinheiro: acc.totalDinheiro + tx.dinheiro,
    }),
    { totalBruto: 0, totalLiquido: 0, totalPix: 0, totalCredito: 0, totalDebito: 0, totalDinheiro: 0 }
  );

  // Análise por dia da semana
  const dayAnalysis = transactions.reduce((acc, tx) => {
    const dayName = new Date(tx.date).toLocaleDateString('pt-BR', { weekday: 'long' });
    if (!acc[dayName]) acc[dayName] = { total: 0, count: 0 };
    acc[dayName].total += tx.totalBruto;
    acc[dayName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const bestDay = Object.entries(dayAnalysis)
    .sort(([,a], [,b]) => (b as { total: number; count: number }).total - (a as { total: number; count: number }).total)[0] as [string, { total: number; count: number }] | undefined;

  // Projeção mensal baseada nos dias com transações
  const dailyAverage = transactions.length > 0 ? currentMonthTotals.totalBruto / transactions.length : 0;
  const projectedMonthly = dailyAverage * 30; // 30 dias no mês
  
  // Meta mensal (exemplo fixo de R$ 50.000 - pode ser configurável)
  const monthlyGoal = 50000;
  const goalProgress = monthlyGoal > 0 ? (currentMonthTotals.totalBruto / monthlyGoal) * 100 : 0;

  // Top método de pagamento
  const paymentMethods = [
    { name: 'PIX', value: currentMonthTotals.totalPix, color: 'bg-finance-net' },
    { name: 'Crédito', value: currentMonthTotals.totalCredito, color: 'bg-warning' },
    { name: 'Débito', value: currentMonthTotals.totalDebito, color: 'bg-finance-kam' },
    { name: 'Dinheiro', value: currentMonthTotals.totalDinheiro, color: 'bg-success' }
  ].filter(method => method.value > 0).sort((a, b) => b.value - a.value);

  const topPaymentMethod = paymentMethods[0];

  // Nome do mês para exibição
  const monthName = new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Insights do Período
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise de {monthName} • {transactions.length} transações
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Projeção Mensal */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Projeção Mensal</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{formatCurrency(projectedMonthly)}</p>
            <Badge variant={goalProgress >= 100 ? 'default' : 'secondary'} className="text-xs">
              {goalProgress.toFixed(1)}% da meta ({formatCurrency(monthlyGoal)})
            </Badge>
          </div>
        </div>

        {/* Melhor Dia */}
        {bestDay && bestDay[1].total > 0 && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Melhor Dia</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-700 capitalize">{bestDay[0]}</p>
              <p className="text-xs text-green-600">{formatCurrency(bestDay[1].total)}</p>
            </div>
          </div>
        )}

        {/* Top Método de Pagamento */}
        {topPaymentMethod && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Método Preferido</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-700">{topPaymentMethod.name}</p>
              <p className="text-xs text-blue-600">
                {currentMonthTotals.totalBruto > 0 ? 
                  ((topPaymentMethod.value / currentMonthTotals.totalBruto) * 100).toFixed(1) : 0}% do total
              </p>
            </div>
          </div>
        )}

        {/* Média Diária */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Média Diária</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-700">{formatCurrency(dailyAverage)}</p>
            <p className="text-xs text-gray-500">{transactions.length} dias analisados</p>
          </div>
        </div>

        {/* Eficiência (Líquido vs Bruto) */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Eficiência</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-purple-700">
              {((currentMonthTotals.totalLiquido / currentMonthTotals.totalBruto) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-purple-600">Líquido vs Bruto</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};