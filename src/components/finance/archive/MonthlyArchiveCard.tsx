import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { MonthDetailsDialog } from './MonthDetailsDialog';

interface MonthlyArchiveCardProps {
  monthData: any;
  onSelectMonth: (month: string) => void;
  onEditTransaction: (transaction: any) => void;
  onDeleteTransaction: (transactionId: string) => void;
  selectedMonthData: any;
}

const formatMonth = (monthStr: string) => {
  const date = new Date(monthStr + '-01');
  return date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
};

export const MonthlyArchiveCard = ({
  monthData,
  onSelectMonth,
  onEditTransaction,
  onDeleteTransaction,
  selectedMonthData
}: MonthlyArchiveCardProps) => {
  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {formatMonth(monthData.month)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {monthData.transactions.length} transações
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectMonth(monthData.month)}
              className="h-10 w-10 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <MonthDetailsDialog
            monthData={selectedMonthData}
            onEditTransaction={onEditTransaction}
            onDeleteTransaction={onDeleteTransaction}
          />
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Líquido:</span>
          <span className="font-semibold text-foreground">
            {monthData.totalLiquido.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxas:</span>
          <span className="font-semibold text-foreground">
            {monthData.totalTaxas.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};