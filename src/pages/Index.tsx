import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Users,
  ArrowRight,
  Building2
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="h-12 w-12 text-finance-studio" />
            <h1 className="text-5xl font-bold text-foreground">Studio Germano</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema completo de controle financeiro. Gerencie transações, 
            acompanhe métricas e analise o desempenho do seu negócio.
          </p>
          
          <Link to="/financeiro">
            <Button size="lg" className="bg-finance-studio hover:bg-finance-studio/90 text-finance-studio-foreground">
              Acessar Sistema Financeiro
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="p-2 rounded-lg bg-finance-income/10 w-fit">
                <DollarSign className="h-6 w-6 text-finance-income" />
              </div>
              <CardTitle className="text-lg">Dashboard Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize métricas, totais e comparativos em tempo real
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="p-2 rounded-lg bg-finance-net/10 w-fit">
                <TrendingUp className="h-6 w-6 text-finance-net" />
              </div>
              <CardTitle className="text-lg">Gestão de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Adicione e gerencie transações com cálculos automáticos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="p-2 rounded-lg bg-finance-studio/10 w-fit">
                <BarChart3 className="h-6 w-6 text-finance-studio" />
              </div>
              <CardTitle className="text-lg">Análises Avançadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gráficos detalhados e relatórios comparativos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="p-2 rounded-lg bg-finance-edu/10 w-fit">
                <Users className="h-6 w-6 text-finance-edu" />
              </div>
              <CardTitle className="text-lg">Divisão Automática</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cotas calculadas automaticamente: 60% Studio, 40% Edu, 10% Kam
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Substituindo Planilhas por Tecnologia
          </h2>
          <div className="grid gap-8 md:grid-cols-3 text-left">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-finance-income/10 w-fit">
                <TrendingUp className="h-6 w-6 text-finance-income" />
              </div>
              <h3 className="font-semibold text-foreground">Cálculos Automáticos</h3>
              <p className="text-muted-foreground">
                Taxas de débito (1,61%) e crédito (3,51%) calculadas automaticamente. 
                Divisão de cotas feita em tempo real.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-finance-net/10 w-fit">
                <BarChart3 className="h-6 w-6 text-finance-net" />
              </div>
              <h3 className="font-semibold text-foreground">Visualizações Inteligentes</h3>
              <p className="text-muted-foreground">
                Gráficos de pizza, barras e evolução temporal. 
                Compare períodos e identifique tendências facilmente.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-finance-studio/10 w-fit">
                <DollarSign className="h-6 w-6 text-finance-studio" />
              </div>
              <h3 className="font-semibold text-foreground">Backup Seguro</h3>
              <p className="text-muted-foreground">
                Dados salvos automaticamente no navegador. 
                Exportação em CSV para backup e análises externas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
