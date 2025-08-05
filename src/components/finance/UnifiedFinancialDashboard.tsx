import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Eye,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { useClientFinancialAnalytics } from '@/hooks/useClientFinancialAnalytics';
import { useProfessionalFinancialAnalytics } from '@/hooks/useProfessionalFinancialAnalytics';
import { useComandas } from '@/hooks/salon/useComandas';
import { formatCurrency } from '@/lib/formatUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UnifiedFinancialDashboard = () => {
  const { 
    clientProfiles, 
    loading: clientLoading,
    getTopClients,
    getClientsByCategory,
    getTotalRevenue: getClientRevenue,
    getAverageTicket
  } = useClientFinancialAnalytics();

  const {
    professionalProfiles,
    loading: professionalLoading,
    getTopProfessionals,
    getTotalRevenue: getProfessionalRevenue,
    getTotalCommissions,
    getAverageConversionRate
  } = useProfessionalFinancialAnalytics();

  const { comandas } = useComandas();

  const comandasAbertas = comandas.filter(c => c.status === 'aberta');
  const comandasFechadas = comandas.filter(c => c.status === 'fechada');
  const receitaPendente = comandasAbertas.reduce((sum, c) => sum + c.total_bruto, 0);
  const receitaDiaria = comandasFechadas
    .filter(c => c.data_fechamento && 
      format(new Date(c.data_fechamento), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, c) => sum + c.total_liquido, 0);

  const topClients = getTopClients(5);
  const topProfessionals = getTopProfessionals(5);
  const clientesVIP = getClientsByCategory('VIP');
  const totalRevenue = getClientRevenue();
  const averageTicket = getAverageTicket();
  const totalCommissions = getTotalCommissions();
  const averageConversionRate = getAverageConversionRate();

  if (clientLoading || professionalLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-32 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-white/60">
              {clientProfiles.length} clientes ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaDiaria)}</div>
            <p className="text-xs text-muted-foreground">
              {comandasFechadas.filter(c => 
                c.data_fechamento && 
                format(new Date(c.data_fechamento), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              ).length} comandas fechadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageTicket)}</div>
            <p className="text-xs text-muted-foreground">
              Por atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--warning))]">
              {formatCurrency(receitaPendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {comandasAbertas.length} comandas abertas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análises Detalhadas */}
      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Análise de Clientes</TabsTrigger>
          <TabsTrigger value="professionals">Performance Profissionais</TabsTrigger>
          <TabsTrigger value="operational">Operacional</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[hsl(var(--primary))]" />
                  Top 5 Clientes
                </CardTitle>
                <CardDescription>
                  Clientes que mais geram receita
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={client.cliente_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{client.cliente_nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.numero_transacoes} atendimentos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(client.total_gasto)}</p>
                      <Badge variant={
                        client.categoria_cliente === 'VIP' ? 'default' :
                        client.categoria_cliente === 'Regular' ? 'secondary' : 'outline'
                      }>
                        {client.categoria_cliente}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Segmentação de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[hsl(var(--primary))]" />
                  Segmentação de Clientes
                </CardTitle>
                <CardDescription>
                  Distribuição por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Clientes VIP</span>
                    <span className="text-sm text-muted-foreground">
                      {clientesVIP.length} ({((clientesVIP.length / clientProfiles.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress 
                    value={(clientesVIP.length / clientProfiles.length) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Clientes Regulares</span>
                    <span className="text-sm text-muted-foreground">
                      {getClientsByCategory('Regular').length} ({((getClientsByCategory('Regular').length / clientProfiles.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress 
                    value={(getClientsByCategory('Regular').length / clientProfiles.length) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Clientes Eventuais</span>
                    <span className="text-sm text-muted-foreground">
                      {getClientsByCategory('Eventual').length} ({((getClientsByCategory('Eventual').length / clientProfiles.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress 
                    value={(getClientsByCategory('Eventual').length / clientProfiles.length) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>{clientesVIP.length}</strong> clientes VIP geram{' '}
                    <strong>{formatCurrency(clientesVIP.reduce((sum, c) => sum + c.total_gasto, 0))}</strong>{' '}
                    ({((clientesVIP.reduce((sum, c) => sum + c.total_gasto, 0) / totalRevenue) * 100).toFixed(1)}% da receita)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professionals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Profissionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
                  Ranking de Performance
                </CardTitle>
                <CardDescription>
                  Profissionais por receita gerada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topProfessionals.map((professional) => (
                  <div key={professional.profissional_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--success))] text-white flex items-center justify-center text-sm font-medium">
                        {professional.ranking_receita}
                      </div>
                      <div>
                        <p className="font-medium">{professional.profissional_nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {professional.numero_atendimentos} atendimentos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(professional.total_receita_gerada)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(professional.comissao_total)} comissão
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Métricas de Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[hsl(var(--primary))]" />
                  Métricas Gerais
                </CardTitle>
                <CardDescription>
                  Performance geral da equipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--primary))]" />
                    <div className="text-2xl font-bold">{formatCurrency(totalCommissions)}</div>
                    <p className="text-sm text-muted-foreground">Total Comissões</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--success))]" />
                    <div className="text-2xl font-bold">{averageConversionRate.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Taxa de Conversão por Profissional</h4>
                  {professionalProfiles.slice(0, 3).map((prof) => (
                    <div key={prof.profissional_id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{prof.profissional_nome}</span>
                        <span className="text-sm font-medium">{prof.taxa_conversao.toFixed(1)}%</span>
                      </div>
                      <Progress value={prof.taxa_conversao} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Operacional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[hsl(var(--warning))]" />
                  Status Operacional
                </CardTitle>
                <CardDescription>
                  Comandas e fluxo de caixa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-[hsl(var(--warning))]">
                      {comandasAbertas.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Comandas Abertas</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-[hsl(var(--success))]">
                      {comandasFechadas.filter(c => 
                        c.data_fechamento && 
                        format(new Date(c.data_fechamento), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Fechadas Hoje</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Receita Confirmada Hoje</span>
                    <span className="font-medium">{formatCurrency(receitaDiaria)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Receita Pendente</span>
                    <span className="font-medium text-[hsl(var(--warning))]">
                      {formatCurrency(receitaPendente)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Projetado</span>
                    <span className="font-bold">
                      {formatCurrency(receitaDiaria + receitaPendente)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alertas e Ações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[hsl(var(--destructive))]" />
                  Alertas e Ações
                </CardTitle>
                <CardDescription>
                  Itens que precisam de atenção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {comandasAbertas.length > 0 && (
                  <div className="p-3 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg">
                    <p className="text-sm font-medium text-[hsl(var(--warning))]">
                      ⚠️ {comandasAbertas.length} comandas abertas
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor total: {formatCurrency(receitaPendente)}
                    </p>
                  </div>
                )}

                {getClientsByCategory('VIP').filter(c => {
                  const ultimaTransacao = new Date(c.ultima_transacao);
                  const diasSemTransacao = Math.floor(
                    (new Date().getTime() - ultimaTransacao.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return diasSemTransacao > 30;
                }).length > 0 && (
                  <div className="p-3 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-lg">
                    <p className="text-sm font-medium text-[hsl(var(--primary))]">
                      💎 Clientes VIP inativos
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getClientsByCategory('VIP').filter(c => {
                        const ultimaTransacao = new Date(c.ultima_transacao);
                        const diasSemTransacao = Math.floor(
                          (new Date().getTime() - ultimaTransacao.getTime()) / (1000 * 60 * 60 * 24)
                        );
                        return diasSemTransacao > 30;
                      }).length} clientes VIP sem movimentação há mais de 30 dias
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Exportar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};