import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyReportCardProps {
  currentMonth: string;
  currentData: {
    transactions: any[];
    totalBruto: number;
    totalTaxas: number;
    totalLiquido: number;
    totalStudio: number;
    totalEdu: number;
    totalKam: number;
  };
  monthOptions: Array<{ value: string; label: string }>;
}

export const MonthlyReportCard = ({ currentMonth, currentData, monthOptions }: MonthlyReportCardProps) => {
  const monthLabel = monthOptions.find(m => m.value === currentMonth)?.label || currentMonth;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório Detalhado - {monthLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resumo Financeiro</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Transações:</span>
                <span className="font-medium">{currentData.transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Faturamento Bruto:</span>
                <span className="font-medium text-finance-income">
                  {currentData.totalBruto.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de Taxas:</span>
                <span className="font-medium text-finance-fees">
                  {currentData.totalTaxas.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Faturamento Líquido:</span>
                <span className="font-bold text-finance-net">
                  {currentData.totalLiquido.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Distribuição de Cotas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Studio (60%):</span>
                <span className="font-medium text-finance-studio">
                  {currentData.totalStudio.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profissional (40%):</span>
                <span className="font-medium text-finance-profissional">
                  {currentData.totalEdu.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assistente (4%):</span>
                <span className="font-medium text-finance-assistente">
                  {currentData.totalKam.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};