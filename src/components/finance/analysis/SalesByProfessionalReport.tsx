import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/formatUtils';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { User, Users } from 'lucide-react';

interface SalesByProfessionalReportProps {
  transactions: Transaction[];
  period: string;
}

export const SalesByProfessionalReport = ({ transactions, period }: SalesByProfessionalReportProps) => {
  const { profissionais } = useProfissionais();
  
  // Separar transações com e sem profissional
  const transactionsWithProfessional = transactions.filter(t => t.profissionalId);
  const transactionsWithoutProfessional = transactions.filter(t => !t.profissionalId);
  
  // Calcular dados por profissional
  const professionalData = profissionais.map(prof => {
    const profTransactions = transactionsWithProfessional.filter(t => t.profissionalId === prof.id);
    const totalBruto = profTransactions.reduce((sum, t) => sum + t.totalBruto, 0);
    const totalLiquido = profTransactions.reduce((sum, t) => sum + t.totalLiquido, 0);
    const comissao = totalLiquido * (prof.percentual_comissao / 100);
    const totalAssistente = profTransactions
      .filter(t => t.temAssistente)
      .reduce((sum, t) => sum + (t.assistenteTaxa || 0), 0);
    
    return {
      id: prof.id,
      nome: prof.nome,
      totalBruto,
      totalLiquido,
      comissao,
      totalAssistente,
      transactionCount: profTransactions.length,
      percentualComissao: prof.percentual_comissao
    };
  }).filter(data => data.totalBruto > 0);

  // Dados para transações sem profissional
  const generalData = {
    totalBruto: transactionsWithoutProfessional.reduce((sum, t) => sum + t.totalBruto, 0),
    totalLiquido: transactionsWithoutProfessional.reduce((sum, t) => sum + t.totalLiquido, 0),
    transactionCount: transactionsWithoutProfessional.length
  };

  const chartData = professionalData.map(prof => ({
    nome: prof.nome,
    receita: prof.totalLiquido,
    comissao: prof.comissao
  }));

  const totalGeral = professionalData.reduce((sum, prof) => sum + prof.totalBruto, 0) + generalData.totalBruto;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Vendas por Profissional</h3>
        <p className="text-muted-foreground">{period}</p>
      </div>

      {professionalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance por Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="receita" fill="#8884d8" name="Receita Líquida" />
                <Bar dataKey="comissao" fill="#82ca9d" name="Comissão" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {professionalData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Detalhamento por Profissional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-2">
                  <div>Profissional</div>
                  <div>Receita</div>
                  <div>Comissão</div>
                  <div>Assistente</div>
                </div>
                
                {professionalData.map((prof) => (
                  <div key={prof.id} className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-sm py-2 border-b">
                      <div className="font-medium">{prof.nome}</div>
                      <div>{formatCurrency(prof.totalLiquido)}</div>
                      <div className="text-green-600">
                        {formatCurrency(prof.comissao)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({prof.percentualComissao}%)
                        </span>
                      </div>
                      <div className="text-blue-600">
                        {formatCurrency(prof.totalAssistente)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground pl-4">
                      {prof.transactionCount} transação(ões) • {((prof.totalBruto / totalGeral) * 100).toFixed(1)}% do total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {generalData.totalBruto > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Vendas Gerais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Transações não associadas a profissionais específicos
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Receita Bruta:</span>
                    <span className="font-medium">{formatCurrency(generalData.totalBruto)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receita Líquida:</span>
                    <span className="font-medium">{formatCurrency(generalData.totalLiquido)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transações:</span>
                    <span className="font-medium">{generalData.transactionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>% do Total:</span>
                    <span>{((generalData.totalBruto / totalGeral) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};