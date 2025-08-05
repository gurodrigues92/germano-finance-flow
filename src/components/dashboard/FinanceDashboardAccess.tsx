import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Archive, DollarSign } from 'lucide-react';

export const FinanceDashboardAccess = () => {
  const navigate = useNavigate();

  const financialActions = [
    {
      title: 'Dashboard Financeiro',
      description: 'Métricas e relatórios',
      icon: DollarSign,
      path: '/financeiro',
      color: 'bg-finance-studio'
    },
    {
      title: 'Transações',
      description: 'Gerenciar entradas e saídas',
      icon: TrendingUp,
      path: '/transacoes',
      color: 'bg-finance-studio'
    },
    {
      title: 'Análises',
      description: 'Relatórios e gráficos',
      icon: BarChart3,
      path: '/analise',
      color: 'bg-finance-edu'
    },
    {
      title: 'Arquivo',
      description: 'Histórico financeiro',
      icon: Archive,
      path: '/arquivo',
      color: 'bg-finance-kam'
    }
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-finance-studio" />
          Dashboard Financeiro
        </CardTitle>
        <CardDescription>
          Acesso completo às funcionalidades financeiras do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {financialActions.map((action) => (
            <Button
              key={action.path}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-sm"
              onClick={() => navigate(action.path)}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};