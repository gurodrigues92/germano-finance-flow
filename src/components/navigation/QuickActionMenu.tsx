import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  Receipt,
  Package,
  TrendingUp,
  Target,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const QuickActionMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleAction = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const actions = [
    {
      label: 'Nova Transação',
      icon: DollarSign,
      path: '/transacoes',
      description: 'Registrar receita ou despesa'
    },
    {
      label: 'Nova Meta',
      icon: Target,
      path: '/metas',
      description: 'Definir objetivo financeiro'
    },
    {
      label: 'Novo Investimento',
      icon: TrendingUp,
      path: '/investimentos',
      description: 'Adicionar investimento'
    },
    {
      label: 'Novo Custo Fixo',
      icon: Receipt,
      path: '/custos-fixos',
      description: 'Registrar gasto mensal'
    },
    {
      label: 'Novo Produto',
      icon: Package,
      path: '/estoque',
      description: 'Adicionar ao estoque'
    }
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-20 right-4 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-orange-500 hover:shadow-xl hover:scale-105 text-white z-50 transition-all duration-200"
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-56 sm:w-64 glass border border-purple-100 shadow-xl z-50"
      >
        <DropdownMenuLabel className="text-purple-600 font-semibold">
          Ações Rápidas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.path}
            onClick={() => handleAction(action.path)}
            className="flex items-start gap-3 p-3 cursor-pointer hover:bg-purple-50/50 transition-colors rounded-lg"
          >
            <action.icon className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{action.label}</span>
              <span className="text-xs text-muted-foreground">{action.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};