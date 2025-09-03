import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Users, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/formatUtils';
import { Comanda } from '@/types/salon';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailySalesDashboardProps {
  comandas: Comanda[];
  selectedDate?: Date;
}

export const DailySalesDashboard = ({ comandas, selectedDate = new Date() }: DailySalesDashboardProps) => {
  const dailyData = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Filtrar comandas fechadas do dia
    const dailyComandas = comandas.filter(
      c => c.status === 'fechada' && 
      format(new Date(c.data_fechamento || c.data_abertura), 'yyyy-MM-dd') === dateStr
    );

    const totalVendas = dailyComandas.reduce((sum, c) => sum + c.total_liquido, 0);
    const totalAtendimentos = dailyComandas.length;
    const ticketMedio = totalAtendimentos > 0 ? totalVendas / totalAtendimentos : 0;

    // Agrupar por profissional
    const profissionais = dailyComandas.reduce((acc, comanda) => {
      const profId = comanda.profissional_principal_id;
      const profNome = comanda.profissional_principal?.nome || 'Não informado';
      
      if (!acc[profId]) {
        acc[profId] = {
          nome: profNome,
          vendas: 0,
          atendimentos: 0
        };
      }
      
      acc[profId].vendas += comanda.total_liquido;
      acc[profId].atendimentos += 1;
      
      return acc;
    }, {} as Record<string, { nome: string; vendas: number; atendimentos: number }>);

    // Métodos de pagamento
    const pagamentos = dailyComandas.reduce((acc, comanda) => {
      acc.dinheiro += comanda.dinheiro || 0;
      acc.pix += comanda.pix || 0;
      acc.debito += comanda.debito || 0;
      acc.credito += comanda.credito || 0;
      return acc;
    }, { dinheiro: 0, pix: 0, debito: 0, credito: 0 });

    return {
      totalVendas,
      totalAtendimentos,
      ticketMedio,
      profissionais: Object.values(profissionais),
      pagamentos,
      comandas: dailyComandas
    };
  }, [comandas, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Header com data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Vendas Diárias - {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendas Totais</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(dailyData.totalVendas, true)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Comandas</p>
                <p className="text-xl font-bold">{dailyData.totalAtendimentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Receipt className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-xl font-bold">
                  {formatCurrency(dailyData.ticketMedio, true)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance por profissional */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyData.profissionais.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum atendimento registrado hoje
              </p>
            ) : (
              dailyData.profissionais.map((prof, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{prof.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {prof.atendimentos} atendimento{prof.atendimentos !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatCurrency(prof.vendas, true)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métodos de pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Método de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dailyData.pagamentos).map(([metodo, valor]) => (
              <div key={metodo} className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                   {metodo === 'dinheiro' ? 'Dinheiro' : 
                    metodo === 'pix' ? 'PIX' : 
                    metodo === 'debito' ? 'Débito' : 
                    metodo === 'credito' ? 'Cartão de Crédito' : metodo}
                </p>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(valor, true)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de comandas do dia */}
      <Card>
        <CardHeader>
          <CardTitle>Comandas Fechadas de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyData.comandas.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma comanda fechada hoje
              </p>
            ) : (
              dailyData.comandas.map((comanda) => (
                <div key={comanda.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{comanda.numero_comanda}</Badge>
                      <span className="font-medium">{comanda.cliente?.nome || 'Cliente não informado'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comanda.profissional_principal?.nome} • {' '}
                      {new Date(comanda.data_fechamento || comanda.data_abertura).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatCurrency(comanda.total_liquido, true)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};