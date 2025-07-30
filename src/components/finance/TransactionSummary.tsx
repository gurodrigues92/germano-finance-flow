import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export const TransactionSummary = ({ transactions }: TransactionSummaryProps) => {
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
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-4">
      {/* Main Financial Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Bruto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--chart-2))' }}>
              {formatCurrency(totals.bruto)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--chart-1))' }}>
              {formatCurrency(totals.liquido)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Taxas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--destructive))' }}>
              {formatCurrency(totals.taxas)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Distribuição de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: 'hsl(var(--chart-3))' }}>
                {formatCurrency(totals.studio)}
              </div>
              <div className="text-xs text-muted-foreground">Studio (60%)</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: 'hsl(var(--chart-4))' }}>
                {formatCurrency(totals.edu)}
              </div>
              <div className="text-xs text-muted-foreground">Profissional (40%)</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: 'hsl(var(--chart-5))' }}>
                {formatCurrency(totals.kam)}
              </div>
              <div className="text-xs text-muted-foreground">Assistente (4%)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};