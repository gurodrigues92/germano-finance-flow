import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionCard } from './TransactionCard';

interface MonthDetailsDialogProps {
  monthData: any;
  onEditTransaction: (transaction: any) => void;
  onDeleteTransaction: (transactionId: string) => void;
}

const formatMonth = (monthStr: string) => {
  const date = new Date(monthStr + '-01');
  return date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
};

export const MonthDetailsDialog = ({
  monthData,
  onEditTransaction,
  onDeleteTransaction
}: MonthDetailsDialogProps) => {
  if (!monthData) return null;

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">
          {formatMonth(monthData.month)}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Month Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-border rounded-lg">
            <div className="text-xl font-bold text-foreground">
              {monthData.totalBruto.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
            <div className="text-sm text-muted-foreground">Total Bruto</div>
          </div>
          
          <div className="text-center p-4 border border-border rounded-lg">
            <div className="text-xl font-bold text-foreground">
              {monthData.totalLiquido.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
            <div className="text-sm text-muted-foreground">Total Líquido</div>
          </div>
          
          <div className="text-center p-4 border border-border rounded-lg">
            <div className="text-xl font-bold text-foreground">
              {monthData.totalTaxas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
            <div className="text-sm text-muted-foreground">Total Taxas</div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Transações</h4>
          {monthData.transactions.map((transaction: any) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
            />
          ))}
        </div>
      </div>
    </DialogContent>
  );
};