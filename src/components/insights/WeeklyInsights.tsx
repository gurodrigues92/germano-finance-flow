import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InsightCard } from './InsightCard';
import { ActionableInsight } from './ActionableInsight';
import { TrendingUp, TrendingDown, Calendar, Target, Zap, DollarSign, CreditCard, Percent } from 'lucide-react';

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

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

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

  // Cálculos dinâmicos baseados no mês atual
  const currentDate = new Date();
  const targetDate = new Date(currentMonth + '-01');
  const isCurrentMonth = targetDate.getMonth() === currentDate.getMonth() && 
                         targetDate.getFullYear() === currentDate.getFullYear();
  
  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
  const daysPassed = isCurrentMonth ? currentDate.getDate() : daysInMonth;
  const daysRemaining = Math.max(0, daysInMonth - daysPassed);

  // Projeção mensal mais precisa
  const dailyAverage = transactions.length > 0 ? currentMonthTotals.totalBruto / transactions.length : 0;
  const projectedMonthly = isCurrentMonth && transactions.length > 0 ? 
    currentMonthTotals.totalBruto + (dailyAverage * daysRemaining) : 
    currentMonthTotals.totalBruto;
  
  // Meta mensal configurável (pode ser expandido para configuração do usuário)
  const monthlyGoal = 50000;
  const goalProgress = projectedMonthly / monthlyGoal;
  
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

  // Top método de pagamento
  const paymentMethods = [
    { name: 'PIX', value: currentMonthTotals.totalPix },
    { name: 'Crédito', value: currentMonthTotals.totalCredito },
    { name: 'Débito', value: currentMonthTotals.totalDebito },
    { name: 'Dinheiro', value: currentMonthTotals.totalDinheiro }
  ].filter(method => method.value > 0).sort((a, b) => b.value - a.value);

  const topPaymentMethod = paymentMethods[0];
  const efficiency = currentMonthTotals.totalBruto > 0 ? 
    (currentMonthTotals.totalLiquido / currentMonthTotals.totalBruto) * 100 : 0;

  // Insights acionáveis
  const getActionableInsights = () => {
    const insights = [];
    
    if (goalProgress >= 1.1) {
      insights.push({
        type: 'success' as const,
        title: 'Meta superada!',
        description: `Você já superou a meta mensal em ${((goalProgress - 1) * 100).toFixed(1)}%`,
        action: 'Considere aumentar a meta para o próximo mês.',
        priority: 'high' as const
      });
    } else if (goalProgress < 0.8 && isCurrentMonth && daysRemaining <= 5) {
      insights.push({
        type: 'warning' as const,
        title: 'Meta em risco',
        description: `Restam ${daysRemaining} dias e você está a ${((1 - goalProgress) * 100).toFixed(1)}% da meta`,
        action: 'Foque em estratégias para aumentar o movimento nos próximos dias.',
        priority: 'high' as const
      });
    }

    if (efficiency < 85) {
      insights.push({
        type: 'info' as const,
        title: 'Eficiência pode melhorar',
        description: `Sua eficiência está em ${efficiency.toFixed(1)}% (líquido vs bruto)`,
        action: 'Revise as taxas dos métodos de pagamento mais utilizados.',
        priority: 'medium' as const
      });
    }

    if (topPaymentMethod && (topPaymentMethod.value / currentMonthTotals.totalBruto) > 0.6) {
      insights.push({
        type: 'trend' as const,
        title: 'Concentração de pagamentos',
        description: `${topPaymentMethod.name} representa ${((topPaymentMethod.value / currentMonthTotals.totalBruto) * 100).toFixed(1)}% dos recebimentos`,
        action: 'Considere diversificar os métodos de pagamento para reduzir riscos.',
        priority: 'low' as const
      });
    }

    return insights;
  };

  const actionableInsights = getActionableInsights();

  // Nome do mês para exibição
  const monthName = new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Insights do Período
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Análise de {monthName} • {transactions.length} transações
            {isCurrentMonth && ` • ${daysRemaining} dias restantes`}
          </p>
        </CardHeader>
      </Card>

      {/* Insights Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Projeção/Meta */}
        <InsightCard
          title="Meta Mensal"
          value={formatCompactCurrency(projectedMonthly)}
          subtitle={isCurrentMonth ? "Projeção atual" : "Total do mês"}
          icon={Target}
          variant={goalProgress >= 1 ? 'success' : goalProgress >= 0.8 ? 'default' : 'warning'}
          progress={{
            value: Math.min(projectedMonthly, monthlyGoal),
            max: monthlyGoal,
            label: `Meta: ${formatCompactCurrency(monthlyGoal)}`
          }}
          badge={{
            text: `${(goalProgress * 100).toFixed(1)}%`,
            variant: goalProgress >= 1 ? 'default' : goalProgress >= 0.8 ? 'secondary' : 'destructive'
          }}
          size="large"
        />

        {/* Eficiência */}
        <InsightCard
          title="Eficiência"
          value={`${efficiency.toFixed(1)}%`}
          subtitle="Líquido vs Bruto"
          icon={Percent}
          variant={efficiency >= 90 ? 'success' : efficiency >= 85 ? 'default' : 'warning'}
          trend={{
            value: efficiency - 87, // comparação com benchmark
            label: "vs padrão ideal",
            isPositive: efficiency >= 87
          }}
        />

        {/* Média Diária */}
        <InsightCard
          title="Média Diária"
          value={formatCompactCurrency(dailyAverage)}
          subtitle={`${transactions.length} dias analisados`}
          icon={TrendingUp}
          variant="default"
        />

        {/* Melhor Dia da Semana */}
        {bestDay && bestDay[1].total > 0 && (
          <InsightCard
            title="Melhor Dia"
            value={bestDay[0].charAt(0).toUpperCase() + bestDay[0].slice(1)}
            subtitle={formatCompactCurrency(bestDay[1].total)}
            icon={Calendar}
            variant="success"
            badge={{
              text: `${bestDay[1].count} transações`,
              variant: 'secondary'
            }}
          />
        )}

        {/* Método Preferido */}
        {topPaymentMethod && (
          <InsightCard
            title="Método Preferido"
            value={topPaymentMethod.name}
            subtitle={formatCompactCurrency(topPaymentMethod.value)}
            icon={CreditCard}
            variant="default"
            badge={{
              text: `${((topPaymentMethod.value / currentMonthTotals.totalBruto) * 100).toFixed(1)}%`,
              variant: 'secondary'
            }}
          />
        )}

        {/* Faturamento Bruto */}
        <InsightCard
          title="Faturamento Bruto"
          value={formatCompactCurrency(currentMonthTotals.totalBruto)}
          subtitle="Total do período"
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* Insights Acionáveis */}
      {actionableInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Insights Acionáveis</h3>
          <div className="space-y-3">
            {actionableInsights.map((insight, index) => (
              <ActionableInsight key={index} {...insight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};