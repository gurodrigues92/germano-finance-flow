import { Users, UserCheck, CreditCard, Receipt, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/components/finance/MetricCard';
import { formatCurrency } from '@/lib/formatUtils';

interface SalonMetricsProps {
  metrics: {
    totalComandas: number;
    comandasAbertas: number;
    comandasFechadas: number;
    totalFaturamento: number;
    clientesAtivos: number;
    clientesCredito: number;
    clientesDebito: number;
    profissionaisAtivos: number;
    servicosAtivos: number;
  };
}

export const SalonMetrics = ({ metrics }: SalonMetricsProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <MetricCard
          title="Comandas do Mês"
          value={metrics.totalComandas}
          icon={Receipt}
          colorClass="bg-blue-500"
        />
        
        <MetricCard
          title="Faturamento do Mês"
          value={metrics.totalFaturamento}
          icon={TrendingUp}
          colorClass="bg-green-500"
          format="currency"
        />
        
        <MetricCard
          title="Clientes Ativos"
          value={metrics.clientesAtivos}
          icon={Users}
          colorClass="bg-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <MetricCard
          title="Profissionais Ativos"
          value={metrics.profissionaisAtivos}
          icon={UserCheck}
          colorClass="bg-indigo-500"
        />
        
        <MetricCard
          title="Serviços Disponíveis"
          value={metrics.servicosAtivos}
          icon={CreditCard}
          colorClass="bg-pink-500"
        />
      </div>
    </div>
  );
};