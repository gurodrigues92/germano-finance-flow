import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DashboardHeaderProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  monthOptions: Array<{ value: string; label: string; hasData?: boolean; count?: number }>;
}

export const DashboardHeader = ({ currentMonth, setCurrentMonth, monthOptions }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <h2 className="text-lg sm:text-lg font-semibold text-foreground">Métricas do Mês</h2>
      <Select value={currentMonth} onValueChange={setCurrentMonth}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Selecionar mês" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center justify-between w-full">
                <span className={option.hasData ? '' : 'text-muted-foreground'}>
                  {option.label}
                </span>
                {option.hasData && option.count && (
                  <span className="text-xs text-primary ml-2">
                    {option.count} transações
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};