import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/formatUtils';

interface GeneralOverviewReportProps {
  transactions: Transaction[];
  period: string;
}

export const GeneralOverviewReport = ({ transactions, period }: GeneralOverviewReportProps) => {
  const totalBruto = transactions.reduce((sum, t) => sum + t.totalBruto, 0);
  const totalLiquido = transactions.reduce((sum, t) => sum + t.totalLiquido, 0);
  const totalTaxas = totalBruto - totalLiquido;
  const margemLiquida = totalBruto > 0 ? ((totalLiquido / totalBruto) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Relatório Geral de Vendas</h3>
          <p className="text-muted-foreground">{period}</p>
        </div>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              Receita Bruta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalBruto)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Receita Líquida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalLiquido)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
              Total de Taxas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalTaxas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Percent className="h-4 w-4 mr-2 text-blue-500" />
              Margem Líquida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {margemLiquida.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium">Métrica</div>
              <div className="font-medium">Valor</div>
              <div className="font-medium">% do Total</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t">
              <div>Receita Bruta</div>
              <div>{formatCurrency(totalBruto)}</div>
              <div>100%</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t">
              <div>Taxas de Cartão</div>
              <div className="text-red-600">-{formatCurrency(totalTaxas)}</div>
              <div className="text-red-600">-{((totalTaxas / totalBruto) * 100).toFixed(1)}%</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t font-medium">
              <div>Receita Líquida</div>
              <div className="text-green-600">{formatCurrency(totalLiquido)}</div>
              <div className="text-green-600">{margemLiquida.toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};