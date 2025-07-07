import { MetricCard } from '@/components/dashboard/MetricCard';
import { Scissors, User, Receipt } from 'lucide-react';

interface DistributionGridProps {
  totalStudio: number;
  totalEdu: number;
  totalKam: number;
  totalTaxas: number;
  trends: {
    studio: number;
    edu: number;
    kam: number;
    taxas: number;
  };
}

export const DistributionGrid = ({ 
  totalStudio,
  totalEdu,
  totalKam,
  totalTaxas,
  trends 
}: DistributionGridProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-sm sm:text-md font-semibold text-foreground mb-3 sm:mb-4">Distribuição e Taxas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <MetricCard
          title="Studio (60%)"
          value={totalStudio}
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
          value={totalEdu}
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
          value={totalKam}
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
          value={totalTaxas}
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
  );
};