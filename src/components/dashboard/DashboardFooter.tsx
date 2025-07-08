import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { Transaction } from '@/types/finance';

interface DashboardFooterProps {
  transactions: Transaction[];
}

export const DashboardFooter = ({ transactions }: DashboardFooterProps) => {
  return (
    <RecentTransactions transactions={transactions} />
  );
};