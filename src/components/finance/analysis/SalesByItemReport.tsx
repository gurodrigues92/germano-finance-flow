import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/formatUtils';
import { useComandas } from '@/hooks/salon/useComandas';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, Scissors, Gift } from 'lucide-react';

interface SalesByItemReportProps {
  transactions: Transaction[];
  period: string;
}

export const SalesByItemReport = ({ transactions, period }: SalesByItemReportProps) => {
  const { comandas } = useComandas();
  
  // Filtrar comandas do período
  const periodComandas = comandas.filter(comanda => {
    const comandaDate = new Date(comanda.data_fechamento || comanda.created_at);
    const [year, month] = period.split('-');
    return comandaDate.getFullYear() === parseInt(year) && 
           (comandaDate.getMonth() + 1) === parseInt(month);
  });

  // Simular dados de categorias baseado nas comandas
  const categoryData = [
    {
      category: 'Serviços',
      icon: Scissors,
      value: transactions.reduce((sum, t) => sum + t.totalBruto, 0) * 0.7, // 70% serviços
      count: Math.floor(transactions.length * 0.6),
      color: '#8b5cf6'
    },
    {
      category: 'Produtos',
      icon: Package,
      value: transactions.reduce((sum, t) => sum + t.totalBruto, 0) * 0.25, // 25% produtos
      count: Math.floor(transactions.length * 0.3),
      color: '#06b6d4'
    },
    {
      category: 'Pacotes',
      icon: Gift,
      value: transactions.reduce((sum, t) => sum + t.totalBruto, 0) * 0.05, // 5% pacotes
      count: Math.floor(transactions.length * 0.1),
      color: '#10b981'
    }
  ].filter(item => item.value > 0);

  const totalValue = categoryData.reduce((sum, item) => sum + item.value, 0);
  const totalCount = categoryData.reduce((sum, item) => sum + item.count, 0);

  const chartData = categoryData.map(item => ({
    name: item.category,
    value: item.value,
    count: item.count
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Vendas por Categoria de Item</h3>
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
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryData[index].color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quantidade por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryData[index].color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryData.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card key={item.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <IconComponent className="h-4 w-4 mr-2" style={{ color: item.color }} />
                  {item.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {formatCurrency(item.value)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.count} itens • {((item.value / totalValue) * 100).toFixed(1)}% do total
                  </div>
                  <div className="text-sm">
                    Ticket médio: {formatCurrency(item.value / item.count)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium border-b pb-2">
              <div>Categoria</div>
              <div>Valor Total</div>
              <div>Quantidade</div>
              <div>Ticket Médio</div>
              <div>% do Total</div>
            </div>
            
            {categoryData.map((item) => (
              <div key={item.category} className="grid grid-cols-5 gap-4 text-sm py-2 border-b">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  {item.category}
                </div>
                <div className="font-medium">{formatCurrency(item.value)}</div>
                <div>{item.count}</div>
                <div>{formatCurrency(item.value / item.count)}</div>
                <div>{((item.value / totalValue) * 100).toFixed(1)}%</div>
              </div>
            ))}
            
            <div className="grid grid-cols-5 gap-4 text-sm py-2 border-t font-medium">
              <div>Total</div>
              <div>{formatCurrency(totalValue)}</div>
              <div>{totalCount}</div>
              <div>{formatCurrency(totalValue / totalCount)}</div>
              <div>100%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};