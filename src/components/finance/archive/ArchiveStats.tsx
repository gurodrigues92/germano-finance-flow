import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ArchiveStatsProps {
  monthCount: number;
  transactionCount: number;
  totalBruto: number;
  totalLiquido: number;
}

export const ArchiveStats = ({
  monthCount,
  transactionCount,
  totalBruto,
  totalLiquido
}: ArchiveStatsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {monthCount}
        </div>
        <div className="text-sm text-muted-foreground">Meses</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">
          {transactionCount}
        </div>
        <div className="text-sm text-muted-foreground">Transações</div>
      </div>
      
      <div className="text-center">
        <div className="text-xl md:text-2xl font-bold text-foreground">
          {formatCompactCurrency(totalBruto, isMobile)}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Faturamento</div>
      </div>
      
      <div className="text-center">
        <div className="text-xl md:text-2xl font-bold text-foreground">
          {formatCompactCurrency(totalLiquido, isMobile)}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">Líquido</div>
      </div>
    </div>
  );
};