import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Transaction } from '@/types/finance';

interface DashboardFooterProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const DashboardFooter = ({ transactions, onEdit, onDelete }: DashboardFooterProps) => {
  return (
    <RecentTransactions 
      transactions={transactions} 
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};