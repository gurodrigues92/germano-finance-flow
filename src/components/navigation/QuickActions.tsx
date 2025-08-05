import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Users, 
  ShoppingCart, 
  Package, 
  Calendar,
  UserPlus,
  Receipt,
  Scissors
} from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Nova Comanda',
      description: 'Abrir nova comanda',
      icon: Receipt,
      to: '/caixa',
      color: 'bg-green-500'
    },
    {
      title: 'Novo Cliente',
      description: 'Cadastrar cliente',
      icon: UserPlus,
      to: '/clientes',
      color: 'bg-blue-500'
    },
    {
      title: 'Novo Agendamento',
      description: 'Agendar serviço',
      icon: Calendar,
      to: '/agenda',
      color: 'bg-purple-500'
    },
    {
      title: 'Estoque',
      description: 'Gerenciar produtos',
      icon: Package,
      to: '/estoque',
      color: 'bg-orange-500'
    },
    {
      title: 'Novo Serviço',
      description: 'Cadastrar serviço',
      icon: Scissors,
      to: '/servicos',
      color: 'bg-pink-500'
    },
    {
      title: 'Novo Profissional',
      description: 'Cadastrar profissional',
      icon: Users,
      to: '/profissionais',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="group"
            >
              <div className="p-3 rounded-lg border hover:border-primary/50 transition-all duration-200 hover:shadow-md group-active:scale-95">
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};