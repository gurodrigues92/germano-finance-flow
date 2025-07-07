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

  // Ordenar transações por data decrescente (mais recentes primeiro) e pegar as 5 primeiras
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="border-purple-100 glass">
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
                className="flex items-center justify-between p-3 rounded-lg bg-purple-50/50 hover:bg-purple-100/50 transition-colors border border-purple-100/50"
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