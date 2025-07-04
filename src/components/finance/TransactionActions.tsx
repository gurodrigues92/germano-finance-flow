import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface TransactionActionsProps {
  onNewTransaction: () => void;
}

export const TransactionActions = ({
  onNewTransaction
}: TransactionActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <DialogTrigger asChild>
        <Button 
          onClick={onNewTransaction}
          className="bg-finance-income hover:bg-finance-income/90 text-finance-income-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
    </div>
  );
};