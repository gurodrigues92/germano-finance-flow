import { Calendar, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatUtils';
import { useNavigate } from 'react-router-dom';

interface SalonDashboardProps {
  metrics: {
    totalComandas: number;
    comandasAbertas: number;
    comandasFechadas: number;
    totalFaturamento: number;
    clientesAtivos: number;
    clientesCredito: number;
    clientesDebito: number;
    profissionaisAtivos: number;
    servicosAtivos: number;
  };
  agendamentosHoje?: any[];
  proximosAgendamentos?: any[];
}

export const SalonDashboard = ({ 
  metrics, 
  agendamentosHoje = [],
  proximosAgendamentos = []
}: SalonDashboardProps) => {
  const navigate = useNavigate();

  const alertas = [
    ...(metrics.comandasAbertas > 0 ? [{
      tipo: 'comandas',
      titulo: `${metrics.comandasAbertas} comandas abertas`,
      descricao: 'Comandas aguardando fechamento',
      acao: () => navigate('/caixa')
    }] : []),
    ...(metrics.clientesDebito > 0 ? [{
      tipo: 'debito',
      titulo: `${metrics.clientesDebito} clientes em débito`,
      descricao: 'Clientes com saldo negativo',
      acao: () => navigate('/clientes')
    }] : [])
  ];

  return (
    <div className="space-y-6">
      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Agendamentos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosHoje.length}</div>
            <p className="text-xs text-muted-foreground">
              Próximo às {proximosAgendamentos[0]?.hora_inicio || '--:--'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Faturamento Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalFaturamento)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.comandasFechadas} comandas fechadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Comandas Abertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.comandasAbertas}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando fechamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clientesAtivos}</div>
            <div className="flex gap-2 mt-1">
              {metrics.clientesCredito > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {metrics.clientesCredito} crédito
                </Badge>
              )}
              {metrics.clientesDebito > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {metrics.clientesDebito} débito
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações Rápidas */}
      {alertas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Atenção Necessária
            </CardTitle>
            <CardDescription>
              Itens que precisam da sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertas.map((alerta, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{alerta.titulo}</p>
                    <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={alerta.acao}>
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Agendamentos */}
      {proximosAgendamentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
            <CardDescription>
              Agendamentos confirmados para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximosAgendamentos.slice(0, 3).map((agendamento) => (
                <div key={agendamento.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{agendamento.cliente?.nome || 'Cliente não informado'}</p>
                      <p className="text-sm text-muted-foreground">
                        {agendamento.hora_inicio} - {agendamento.servico?.nome || 'Serviço'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {agendamento.status}
                  </Badge>
                </div>
              ))}
            </div>
            {proximosAgendamentos.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/agenda')}>
                  Ver todos os agendamentos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};