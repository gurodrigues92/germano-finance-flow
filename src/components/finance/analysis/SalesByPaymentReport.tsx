import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/formatUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface SalesByPaymentReportProps {
  transactions: Transaction[];
  period: string;
}

export const SalesByPaymentReport = ({ transactions, period }: SalesByPaymentReportProps) => {
  const paymentData = [
    {
      method: 'Dinheiro',
      value: transactions.reduce((sum, t) => sum + t.dinheiro, 0),
      color: '#22c55e',
      tax: 0
    },
    {
      method: 'PIX',
      value: transactions.reduce((sum, t) => sum + t.pix, 0),
      color: '#6366f1',
      tax: 0
    },
    {
      method: 'Débito',
      value: transactions.reduce((sum, t) => sum + t.debito, 0),
      color: '#f59e0b',
      tax: transactions.reduce((sum, t) => sum + t.taxaDebito, 0)
    },
    {
      method: 'Crédito',
      value: transactions.reduce((sum, t) => sum + t.credito, 0),
      color: '#ef4444',
      tax: transactions.reduce((sum, t) => sum + t.taxaCredito, 0)
    }
  ].filter(item => item.value > 0);

  const totalValue = paymentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Vendas por Método de Pagamento</h3>
        <p className="text-muted-foreground">{period}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, value }) => `${method}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparativo de Valores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#8884d8">
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Método</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium border-b pb-2">
              <div>Método</div>
              <div>Valor Bruto</div>
              <div>Taxa</div>
              <div>Valor Líquido</div>
              <div>% do Total</div>
            </div>
            
            {paymentData.map((item) => (
              <div key={item.method} className="grid grid-cols-5 gap-4 text-sm py-2 border-b">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  {item.method}
                </div>
                <div>{formatCurrency(item.value)}</div>
                <div className="text-red-600">
                  {item.tax > 0 ? formatCurrency(item.tax) : '-'}
                </div>
                <div className="font-medium">
                  {formatCurrency(item.value - item.tax)}
                </div>
                <div>
                  {((item.value / totalValue) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};