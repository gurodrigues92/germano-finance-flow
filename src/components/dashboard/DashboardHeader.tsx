import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  monthOptions: Array<{ value: string; label: string; hasData?: boolean; count?: number }>;
}

export const DashboardHeader = ({ currentMonth, setCurrentMonth, monthOptions }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-lg font-medium text-muted-foreground">Período de Análise</h2>
        <p className="text-sm text-muted-foreground">Selecione o mês para visualizar os dados</p>
      </div>
      
      <div className="w-full sm:w-auto">
        <Select value={currentMonth} onValueChange={setCurrentMonth}>
          <SelectTrigger className="w-full sm:w-[280px] h-14 bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <SelectValue placeholder="Selecionar mês" />
            </div>
          </SelectTrigger>
          <SelectContent className="w-[280px]">
            {monthOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="h-12">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${option.hasData ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={`font-medium ${option.hasData ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {option.label}
                    </span>
                  </div>
                  {option.hasData && option.count && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {option.count} transações
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};