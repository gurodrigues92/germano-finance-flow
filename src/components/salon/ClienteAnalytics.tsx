import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClienteStats } from '@/hooks/salon/useClienteStats';
import { formatCurrency } from '@/lib/formatUtils';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Heart,
  UserCheck,
  Award,
  Target
} from 'lucide-react';

interface ClienteAnalyticsProps {
  stats: ClienteStats;
  loading: boolean;
}

export const ClienteAnalytics = ({ stats, loading }: ClienteAnalyticsProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analytics de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const retentionPercentage = stats.totalClientes > 0 
    ? (stats.retencao30Dias / stats.totalClientes) * 100 
    : 0;

  const activePercentage = stats.totalClientes > 0 
    ? (stats.clientesAtivos / stats.totalClientes) * 100 
    : 0;

  const analyticsData = [
    {
      title: 'Total de Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.clientesAtivos} ativos`
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(stats.ticketMedio),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Por cliente'
    },
    {
      title: 'Retenção 30d',
      value: `${Math.round(retentionPercentage)}%`,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: `${stats.retencao30Dias} clientes`
    },
    {
      title: 'Clientes Ativos',
      value: `${Math.round(activePercentage)}%`,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: `${stats.clientesAtivos}/${stats.totalClientes}`
    }
  ];

  const insights = [
    {
      title: 'Aniversariantes',
      count: stats.aniversariantes,
      icon: Calendar,
      action: 'Enviar promoção'
    },
    {
      title: 'Clientes VIP',
      count: stats.vip,
      icon: Award,
      action: 'Programa fidelidade'
    },
    {
      title: 'Inativos 30d+',
      count: stats.inativos30Dias,
      icon: Target,
      action: 'Campanha reativação'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.description}
                    </p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Taxa de Retenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clientes que retornaram (30 dias)</span>
                <span>{Math.round(retentionPercentage)}%</span>
              </div>
              <Progress value={retentionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.retencao30Dias} de {stats.totalClientes} clientes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Percentual de clientes ativos</span>
                <span>{Math.round(activePercentage)}%</span>
              </div>
              <Progress value={activePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.clientesAtivos} clientes ativos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Insights e Oportunidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{insight.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {insight.count} clientes
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.action}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};