import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });

  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">📊 Últimas Transações</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              As transações aparecerão aqui conforme forem adicionadas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">
                    {formatDate(transaction.date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PIX: {formatCurrency(transaction.pix)} • 
                    Dinheiro: {formatCurrency(transaction.dinheiro)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(transaction.totalBruto)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Líq: {formatCurrency(transaction.totalLiquido)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};