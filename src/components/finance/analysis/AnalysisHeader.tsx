import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalysisHeaderProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  monthOptions: Array<{ value: string; label: string }>;
  currentData: {
    totalBruto: number;
  };
  growth: number;
}

export const AnalysisHeader = ({ 
  currentMonth, 
  setCurrentMonth, 
  monthOptions, 
  currentData, 
  growth 
}: AnalysisHeaderProps) => {
  return (
    <>
      <div className="flex justify-end mb-6">
        <Select value={currentMonth} onValueChange={setCurrentMonth}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar mês" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Growth Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {currentData.totalBruto.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
              <p className="text-sm text-muted-foreground">Faturamento do Mês</p>
            </div>
            
            <div className="flex items-center gap-2">
              {growth >= 0 ? (
                <TrendingUp className="h-5 w-5 text-finance-income" />
              ) : (
                <TrendingDown className="h-5 w-5 text-finance-fees" />
              )}
              <span className={`font-medium ${growth >= 0 ? 'text-finance-income' : 'text-finance-fees'}`}>
                {Math.abs(growth).toFixed(1)}% vs mês anterior
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};