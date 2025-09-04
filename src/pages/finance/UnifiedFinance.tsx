import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Download,
  Settings
} from 'lucide-react';
import { UnifiedFinancialDashboard } from '@/components/finance/UnifiedFinancialDashboard';
import { ClientFinancialProfileCard } from '@/components/finance/ClientFinancialProfileCard';
import { useClientFinancialAnalytics } from '@/hooks/useClientFinancialAnalytics';
import { useProfessionalFinancialAnalytics } from '@/hooks/useProfessionalFinancialAnalytics';
import { formatCurrency } from '@/lib/formatUtils';
import { SimpleDateFilter } from '@/components/finance/SimpleDateFilter';

export default function UnifiedFinance() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  const { 
    clientProfiles, 
    loading: clientLoading,
    getClientSpendingHistory,
    getTopClients,
    getTotalRevenue,
    loadClientFinancialProfiles
  } = useClientFinancialAnalytics();

  const {
    professionalProfiles,
    loading: professionalLoading,
    getTotalCommissions,
    loadProfessionalFinancialProfiles
  } = useProfessionalFinancialAnalytics();

  const handleViewClientHistory = async (clientId: string) => {
    const history = await getClientSpendingHistory(clientId);
    console.log('Histórico do cliente:', history);
    // TODO: Abrir modal ou navegar para página de detalhes
  };

  const handleDateRangeChange = (start?: string, end?: string) => {
    setSelectedDateRange({ start, end });
    loadClientFinancialProfiles(start, end);
    loadProfessionalFinancialProfiles(start, end);
  };

  const topClients = getTopClients(6);
  const totalRevenue = getTotalRevenue();
  const totalCommissions = getTotalCommissions();

  return (
    <PageLayout
      title="Centro Financeiro Integrado"
      subtitle="Análise completa de performance financeira - SalonSoft"
    >
      <div className="space-y-6">
        {/* Header com filtros e ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Centro Financeiro</h1>
              <p className="text-sm text-muted-foreground">
                Análise integrada • Receita total: {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SimpleDateFilter 
              onDateRangeChange={handleDateRangeChange}
              className="w-80"
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Indicadores Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[hsl(var(--primary))]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Comissões</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCommissions)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[hsl(var(--success))]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                  <p className="text-2xl font-bold">{clientProfiles.length}</p>
                </div>
                <Users className="w-8 h-8 text-[hsl(var(--primary))]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profissionais</p>
                  <p className="text-2xl font-bold">{professionalProfiles.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-[hsl(var(--warning))]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal com Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard Geral</TabsTrigger>
            <TabsTrigger value="clients">Análise de Clientes</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <UnifiedFinancialDashboard />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Perfis Financeiros dos Clientes</h2>
                <p className="text-sm text-muted-foreground">
                  Análise detalhada de {clientProfiles.length} clientes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  VIP: {clientProfiles.filter(c => c.categoria_cliente === 'VIP').length}
                </Badge>
                <Badge variant="outline">
                  Regular: {clientProfiles.filter(c => c.categoria_cliente === 'Regular').length}
                </Badge>
                <Badge variant="outline">
                  Eventual: {clientProfiles.filter(c => c.categoria_cliente === 'Eventual').length}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topClients.map((client) => (
                <ClientFinancialProfileCard
                  key={client.cliente_id}
                  client={client}
                  onViewHistory={handleViewClientHistory}
                />
              ))}
            </div>

            {clientProfiles.length > 6 && (
              <div className="text-center">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todos os Clientes ({clientProfiles.length})
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="professionals" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Performance dos Profissionais</h2>
                <p className="text-sm text-muted-foreground">
                  Análise de {professionalProfiles.length} profissionais
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {professionalProfiles.slice(0, 4).map((professional) => (
                <Card key={professional.profissional_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{professional.profissional_nome}</CardTitle>
                        <CardDescription>
                          Ranking #{professional.ranking_receita} • {professional.numero_atendimentos} atendimentos
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {professional.comissao_percentual}% comissão
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-[hsl(var(--muted))]/50 rounded-lg">
                        <div className="text-lg font-bold">{formatCurrency(professional.total_receita_gerada)}</div>
                        <p className="text-xs text-muted-foreground">Receita Gerada</p>
                      </div>
                      <div className="text-center p-3 bg-[hsl(var(--muted))]/50 rounded-lg">
                        <div className="text-lg font-bold">{formatCurrency(professional.comissao_total)}</div>
                        <p className="text-xs text-muted-foreground">Comissão</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Ticket Médio</span>
                        <span className="font-medium">{formatCurrency(professional.ticket_medio)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Taxa de Conversão</span>
                        <span className="font-medium">{professional.taxa_conversao.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Receita/Hora</span>
                        <span className="font-medium">{formatCurrency(professional.receita_por_hora)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}