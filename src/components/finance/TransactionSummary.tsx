import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionSummaryProps {
  transactions: Transaction[];
  dateStart?: string;
  dateEnd?: string;
  isCustomPeriod?: boolean;
  totalTransactions?: number;
}

export const TransactionSummary = ({ 
  transactions, 
  dateStart, 
  dateEnd, 
  isCustomPeriod = false,
  totalTransactions 
}: TransactionSummaryProps) => {
  const isMobile = useIsMobile();
  const totals = transactions.reduce(
    (acc, t) => ({
      bruto: acc.bruto + t.totalBruto,
      liquido: acc.liquido + t.totalLiquido,
      taxas: acc.taxas + t.taxaDebito + t.taxaCredito,
      studio: acc.studio + t.studioShare,
      edu: acc.edu + t.eduShare,
      kam: acc.kam + t.kamShare
    }),
    { bruto: 0, liquido: 0, taxas: 0, studio: 0, edu: 0, kam: 0 }
  );

  const formatCurrency = (value: number) => 
    formatCompactCurrency(value, isMobile);

  // Context message
  const getContextMessage = () => {
    if (isCustomPeriod && dateStart && dateEnd) {
      const start = new Date(dateStart).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      const end = new Date(dateEnd).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      return `Período: ${start} - ${end}`;
    }
    if (totalTransactions && transactions.length !== totalTransactions) {
      return `${transactions.length} de ${totalTransactions} transações`;
    }
    return `${transactions.length} transações`;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Resumo Financeiro</CardTitle>
          <Badge variant="outline" className="text-xs">
            {getContextMessage()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Bruto</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totals.bruto)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Líquido</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(totals.liquido)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Taxas</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totals.taxas)}</p>
            <p className="text-xs text-muted-foreground">
              {totals.bruto > 0 ? ((totals.taxas / totals.bruto) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Distribution */}
        <div className="border-t border-border/50 pt-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">Distribuição</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Studio</p>
              <p className="text-sm font-semibold text-blue-600">{formatCurrency(totals.studio)}</p>
              <p className="text-xs text-muted-foreground">
                {totals.liquido > 0 ? ((totals.studio / totals.liquido) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prof</p>
              <p className="text-sm font-semibold text-green-600">{formatCurrency(totals.edu)}</p>
              <p className="text-xs text-muted-foreground">
                {totals.liquido > 0 ? ((totals.edu / totals.liquido) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Assist</p>
              <p className="text-sm font-semibold text-purple-600">{formatCurrency(totals.kam)}</p>
              <p className="text-xs text-muted-foreground">
                {totals.liquido > 0 ? ((totals.kam / totals.liquido) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};