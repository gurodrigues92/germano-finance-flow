import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const RecentTransactions = ({ transactions, onEdit, onDelete }: RecentTransactionsProps) => {
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

  // Ordenar transações por data decrescente (mais recentes primeiro) e pegar as 15 primeiras
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            💸 Últimas Transações
          </CardTitle>
          <div className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
            {recentTransactions.length} recentes
          </div>
        </div>
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
                className="group relative flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-card via-card to-primary/5 hover:from-primary/5 hover:via-primary/10 hover:to-primary/15 transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-foreground">
                      {formatDate(transaction.date)}
                    </p>
                    <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {[
                      transaction.dinheiro > 0 && `💵 Dinheiro: ${formatCurrency(transaction.dinheiro)}`,
                      transaction.pix > 0 && `📱 PIX: ${formatCurrency(transaction.pix)}`,
                      transaction.debito > 0 && `💳 Débito: ${formatCurrency(transaction.debito)}`,
                      transaction.credito > 0 && `💎 Crédito: ${formatCurrency(transaction.credito)}`
                    ].filter(Boolean).join(' • ')}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">
                      {formatCurrency(transaction.totalBruto)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Líq: {formatCurrency(transaction.totalLiquido)}
                    </p>
                  </div>
                  
                  {(onEdit || onDelete) && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(transaction)}
                          className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta transação de {formatCurrency(transaction.totalBruto)}? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(transaction.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};