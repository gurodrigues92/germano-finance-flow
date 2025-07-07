import { HeroCard } from '@/components/dashboard/HeroCard';
import { DollarSign, Calculator } from 'lucide-react';

interface HeroMetricsProps {
  totalBruto: number;
  totalLiquido: number;
  trends: {
    bruto: number;
    liquido: number;
  };
}

export const HeroMetrics = ({ totalBruto, totalLiquido, trends }: HeroMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <HeroCard
        title="Total Bruto"
        value={totalBruto}
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
        value={totalLiquido}
        icon={Calculator}
        gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        trend={{
          value: trends.liquido,
          isPositive: trends.liquido >= 0
        }}
        subtitle="Após taxas"
      />
    </div>
  );
};