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
      taxas: acc.taxas + t.taxaDebito + t.taxaCredito
    }),
    { bruto: 0, liquido: 0, taxas: 0 }
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Bruto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-income">
            {totals.bruto.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-net">
            {totals.liquido.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Taxas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-fees">
            {totals.taxas.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};