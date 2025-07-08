import { NavLink, useLocation } from 'react-router-dom';
import { usePermissions } from '@/contexts/UserProfileContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Archive,
  TrendingUp,
  Receipt,
  Package,
  TrendingUp as TrendingUpIcon,
  Target
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

const allMenuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    description: 'Visão geral e métricas',
    permission: 'view_dashboard'
  },
  {
    title: 'Transações',
    url: '/transacoes',
    icon: PlusCircle,
    description: 'Gerenciar transações',
    permission: 'view_transactions'
  },
  {
    title: 'Análise',
    url: '/analise',
    icon: BarChart3,
    description: 'Relatórios e gráficos',
    permission: 'view_analysis'
  },
  {
    title: 'Arquivo',
    url: '/arquivo',
    icon: Archive,
    description: 'Histórico mensal',
    permission: 'view_archive'
  },
  {
    title: 'Custos Fixos',
    url: '/custos-fixos',
    icon: Receipt,
    description: 'Gastos mensais fixos',
    permission: 'view_fixed_costs'
  },
  {
    title: 'Estoque',
    url: '/estoque',
    icon: Package,
    description: 'Controle de produtos',
    permission: 'view_stock'
  },
  {
    title: 'Investimentos',
    url: '/investimentos',
    icon: TrendingUpIcon,
    description: 'Investimentos e reserva',
    permission: 'view_investments'
  },
  {
    title: 'Metas',
    url: '/metas',
    icon: Target,
    description: 'Metas e objetivos',
    permission: 'view_goals'
  }
];

export const FinanceSidebar = () => {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  // Filtrar itens do menu baseado nas permissões
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission));

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/financeiro') {
      return location.pathname === '/' || location.pathname === '/financeiro';
    }
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active 
      ? "!bg-gradient-to-r !from-purple-600 !to-orange-500 !text-white font-semibold [&>*]:!text-white glass shadow-lg hover:shadow-xl transform hover:scale-[1.02]" 
      : "!text-gray-900 dark:!text-gray-100 hover:!bg-purple-50 dark:hover:!bg-purple-900/20 [&>*]:!text-gray-900 dark:[&>*]:!text-gray-100 hover:shadow-md transform hover:scale-[1.01]";
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
            <SidebarMenu className="space-y-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-16 sm:h-14">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      onClick={handleNavClick}
                      className={`${getNavClasses(item.url)} transition-all duration-300 ease-in-out rounded-xl p-4 min-h-[64px] sm:min-h-[56px]`}
                    >
                      <item.icon className="h-6 w-6 sm:h-5 sm:w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col items-start ml-4 sm:ml-3 min-w-0">
                          <span className="font-semibold text-sm sm:text-sm truncate w-full">{item.title}</span>
                          <span className="text-xs opacity-80 truncate w-full">{item.description}</span>
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