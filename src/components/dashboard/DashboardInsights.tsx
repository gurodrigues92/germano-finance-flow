import { MotivationalSection } from '@/components/dashboard/MotivationalSection';
import { WeeklyInsights } from '@/components/insights/WeeklyInsights';

interface DashboardInsightsProps {
  transactions: any[];
  currentMonth: string;
}

export const DashboardInsights = ({ transactions, currentMonth }: DashboardInsightsProps) => {
  return (
    <>
      <MotivationalSection />
      <WeeklyInsights transactions={transactions} currentMonth={currentMonth} />
    </>
  );
};