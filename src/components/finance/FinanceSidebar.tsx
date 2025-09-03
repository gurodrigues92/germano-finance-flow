import { NavLink, useLocation } from 'react-router-dom';
import { usePermissions } from '@/contexts/UserProfileContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Archive,
  TrendingUp,
  Receipt,
  Package
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
    permission: 'view_dashboard',
    color: '#9C27B0'
  },
  {
    title: 'Transações',
    url: '/transacoes',
    icon: PlusCircle,
    description: 'Gerenciar transações',
    permission: 'view_transactions',
    color: '#2196F3'
  },
  {
    title: 'Análise',
    url: '/analise',
    icon: BarChart3,
    description: 'Relatórios e gráficos',
    permission: 'view_analysis',
    color: '#4CAF50'
  },
  {
    title: 'Arquivo',
    url: '/arquivo',
    icon: Archive,
    description: 'Histórico mensal',
    permission: 'view_archive',
    color: '#FF9800'
  },
  {
    title: 'Custos Fixos',
    url: '/custos-fixos',
    icon: Receipt,
    description: 'Gastos mensais fixos',
    permission: 'view_fixed_costs',
    color: '#FF5722'
  },
  {
    title: 'Estoque',
    url: '/estoque',
    icon: Package,
    description: 'Controle de produtos',
    permission: 'view_stock',
    color: '#00BCD4'
  },
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

  const getNavClasses = (path: string, color: string) => {
    const active = isActive(path);
    return active 
      ? "!bg-gradient-to-r !from-primary !to-secondary !text-primary-foreground font-semibold glass shadow-xl border-l-4 transform scale-[1.02]" 
      : "!text-gray-900 dark:!text-gray-100 hover:!bg-purple-50/80 dark:hover:!bg-purple-900/30 hover:shadow-lg hover:scale-[1.01] transform transition-all duration-300 ease-in-out";
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
                      className={`${getNavClasses(item.url, item.color)} rounded-xl p-4 min-h-[64px] sm:min-h-[56px] flex items-center gap-4`}
                      style={{
                        borderLeftColor: isActive(item.url) ? item.color : 'transparent'
                      }}
                    >
                      <div 
                        className="p-2 rounded-lg flex-shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: isActive(item.url) ? `${item.color}20` : 'rgba(156, 39, 176, 0.1)',
                          color: item.color,
                          boxShadow: isActive(item.url) ? `0 0 15px ${item.color}25` : 'none'
                        }}
                      >
                        <item.icon className="h-6 w-6 sm:h-5 sm:w-5 transition-transform duration-300" />
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col items-start min-w-0">
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