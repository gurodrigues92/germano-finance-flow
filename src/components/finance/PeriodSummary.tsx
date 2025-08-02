import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';
import { Transaction } from '@/types/finance';
import { formatDateRange } from '@/lib/dateUtils';

interface PeriodSummaryProps {
  transactions: Transaction[];
  dateStart: string;
  dateEnd: string;
  isActive: boolean;
}

export const PeriodSummary = ({ transactions, dateStart, dateEnd, isActive }: PeriodSummaryProps) => {
  if (!isActive || !dateStart || !dateEnd) {
    return null;
  }

  const totals = transactions.reduce(
    (acc, t) => ({
      bruto: acc.bruto + t.totalBruto,
      liquido: acc.liquido + t.totalLiquido,
      studio: acc.studio + t.studioShare,
      edu: acc.edu + t.eduShare,
      kam: acc.kam + t.kamShare,
      taxas: acc.taxas + t.taxaDebito + t.taxaCredito
    }),
    { bruto: 0, liquido: 0, studio: 0, edu: 0, kam: 0, taxas: 0 }
  );

  const formatCurrency = (value: number) => 
    value.toLocaleString('pt-BR');

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Calendar className="h-5 w-5" />
          Resumo do Período Selecionado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Period Info */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              📅 {formatDateRange(dateStart, dateEnd)}
            </span>
            <span className="text-sm font-medium">
              {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''}
            </span>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Bruto</div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(totals.bruto)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Líquido</div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(totals.liquido)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Taxas</div>
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(totals.taxas)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Margem
              </div>
              <div className="text-lg font-bold">
                {totals.bruto > 0 ? ((totals.liquido / totals.bruto) * 100).toFixed(1) : '0.0'}%
              </div>
            </div>
          </div>

          {/* Commissions Breakdown */}
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Distribuição de Comissões:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Studio (60%):</span>
                <span className="font-medium">{formatCurrency(totals.studio)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profissional (40%):</span>
                <span className="font-medium">{formatCurrency(totals.edu)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Assistente (4%):</span>
                <span className="font-medium text-primary">{formatCurrency(totals.kam)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};