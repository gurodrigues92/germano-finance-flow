import { MetricCard } from '@/components/dashboard/MetricCard';
import { Scissors, User, Receipt, Lock } from 'lucide-react';
import { usePermissions } from '@/contexts/UserProfileContext';
import { NOMENCLATURE, getShareLabel } from '@/lib/finance/nomenclature';
import { Card, CardContent } from '@/components/ui/card';

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
  const { hasPermission } = usePermissions();

  if (!hasPermission('view_financial_distribution')) {
    return (
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-md font-semibold text-foreground mb-3 sm:mb-4">Distribuição e Taxas</h3>
        <Card className="p-6 text-center">
          <CardContent className="pt-6">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Informação Restrita</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar a distribuição financeira.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-sm sm:text-md font-semibold text-foreground mb-3 sm:mb-4">Distribuição e Taxas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <MetricCard
          title={`${getShareLabel('studio_share')} (60%)`}
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
          title={`${getShareLabel('edu_share')} (40%)`}
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
          title={`${getShareLabel('kam_share')} (10%)`}
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