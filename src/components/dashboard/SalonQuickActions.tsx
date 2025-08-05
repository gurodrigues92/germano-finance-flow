import { Calendar, Plus, Receipt, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SalonQuickActionsProps {
  onNewAgendamento?: () => void;
  onNewComanda?: () => void;
  onNewCliente?: () => void;
}

export const SalonQuickActions = ({
  onNewAgendamento,
  onNewComanda,
  onNewCliente
}: SalonQuickActionsProps) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Calendar,
      title: 'Novo Agendamento',
      description: 'Agendar cliente',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onNewAgendamento || (() => navigate('/agenda'))
    },
    {
      icon: Receipt,
      title: 'Nova Comanda',
      description: 'Iniciar atendimento',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: onNewComanda || (() => navigate('/caixa'))
    },
    {
      icon: Users,
      title: 'Novo Cliente',
      description: 'Cadastrar cliente',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: onNewCliente || (() => navigate('/clientes'))
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Ajustar sistema',
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => navigate('/servicos')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        <CardDescription>
          Acesso rápido às principais funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col gap-2 p-4"
                onClick={action.onClick}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};