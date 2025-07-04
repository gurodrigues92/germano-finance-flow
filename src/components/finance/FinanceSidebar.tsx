import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Archive,
  TrendingUp,
  Receipt,
  Package,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/financeiro',
    icon: LayoutDashboard,
    description: 'Visão geral e métricas'
  },
  {
    title: 'Transações',
    url: '/financeiro/transacoes',
    icon: PlusCircle,
    description: 'Gerenciar transações'
  },
  {
    title: 'Análise',
    url: '/financeiro/analise',
    icon: BarChart3,
    description: 'Relatórios e gráficos'
  },
  {
    title: 'Arquivo',
    url: '/financeiro/arquivo',
    icon: Archive,
    description: 'Histórico mensal'
  },
  {
    title: 'Custos Fixos',
    url: '/custos-fixos',
    icon: Receipt,
    description: 'Gastos mensais fixos'
  },
  {
    title: 'Estoque',
    url: '/estoque',
    icon: Package,
    description: 'Controle de produtos'
  },
  {
    title: 'Investimentos',
    url: '/investimentos',
    icon: TrendingUpIcon,
    description: 'Investimentos e reserva'
  }
];

export const FinanceSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/financeiro') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-finance-studio text-finance-studio-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-finance-studio font-semibold text-base mb-4">
            <TrendingUp className="mr-2 h-5 w-5" />
            {!collapsed && "Financeiro"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/financeiro'}
                      className={`${getNavClasses(item.url)} transition-all duration-200 rounded-lg p-3`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col items-start ml-3">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};