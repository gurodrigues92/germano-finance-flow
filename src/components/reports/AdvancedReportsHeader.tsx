import { Button } from '@/components/ui/button';
import { Calendar, Filter, Download, Save, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdvancedReportsHeaderProps {
  onExportTransactions: () => void;
  onExportTrends: () => void;
  onSaveReport: () => void;
  transactionCount: number;
}

export const AdvancedReportsHeader = ({
  onExportTransactions,
  onExportTrends,
  onSaveReport,
  transactionCount
}: AdvancedReportsHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-4 sm:p-6 text-primary-foreground mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>
            Relatórios & Analytics Avançados
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Análises detalhadas, tendências e previsões baseadas em dados históricos
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>{transactionCount} transações analisadas</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
          <Button
            onClick={onExportTransactions}
            variant="secondary"
            size={isMobile ? "sm" : "default"}
            className="bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20 shrink-0"
          >
            <Download className="w-4 h-4" />
            {!isMobile && <span className="ml-1">Exportar CSV</span>}
          </Button>
          
          <Button
            onClick={onExportTrends}
            variant="secondary"
            size={isMobile ? "sm" : "default"}
            className="bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20 shrink-0"
          >
            <Calendar className="w-4 h-4" />
            {!isMobile && <span className="ml-1">Exportar Trends</span>}
          </Button>
          
          <Button
            onClick={onSaveReport}
            variant="secondary"
            size={isMobile ? "sm" : "default"}
            className="bg-white/10 hover:bg-white/20 text-primary-foreground border-white/20 shrink-0"
          >
            <Save className="w-4 h-4" />
            {!isMobile && <span className="ml-1">Salvar</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};