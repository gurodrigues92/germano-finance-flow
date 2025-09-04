import { NavLink, useLocation } from 'react-router-dom';
import { usePermissions } from '@/contexts/UserProfileContext';
import { 
  Calendar, 
  Calculator, 
  BarChart3, 
  Users,
  Scissors,
  Receipt,
  Package,
  CreditCard,
  Settings,
  TrendingUp
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
    title: 'Financeiro',
    url: '/financeiro',
    icon: BarChart3,
    description: 'Dashboard financeiro completo',
    permission: 'view_financial_metrics',
    color: '#9C27B0' // Roxo
  },
  {
    title: 'Agenda',
    url: '/agenda',
    icon: Calendar,
    description: 'Agenda visual de agendamentos',
    permission: 'view_appointments',
    color: '#4CAF50' // Verde
  },
  {
    title: 'Caixa',
    url: '/caixa',
    icon: Calculator,
    description: 'Sistema de comandas e vendas',
    permission: 'manage_payments',
    color: '#2196F3' // Azul
  },
  {
    title: 'Relatórios',
    url: '/analise',
    icon: BarChart3,
    description: 'Análises financeiras e operacionais',
    permission: 'view_analysis',
    color: '#9C27B0' // Roxo
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
    description: 'Gestão completa de clientes',
    permission: 'view_clients',
    color: '#FF9800' // Laranja
  },
  {
    title: 'Profissionais',
    url: '/profissionais',
    icon: Scissors,
    description: 'Gestão de profissionais',
    permission: 'manage_professionals',
    color: '#4CAF50' // Verde
  },
  {
    title: 'Serviços',
    url: '/servicos',
    icon: Receipt,
    description: 'Catálogo de serviços',
    permission: 'manage_services',
    color: '#E91E63' // Rosa
  },
  {
    title: 'Produtos',
    url: '/estoque',
    icon: Package,
    description: 'Gestão de produtos e estoque',
    permission: 'view_stock',
    color: '#00BCD4' // Ciano
  },
  {
    title: 'Despesas',
    url: '/custos-fixos',
    icon: CreditCard,
    description: 'Controle de gastos fixos',
    permission: 'view_fixed_costs',
    color: '#FF5722' // Vermelho
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
    description: 'Configurações do sistema',
    permission: 'view_dashboard', // Permissão genérica para configurações
    color: '#607D8B' // Cinza
  }
];

export const SalonSidebar = () => {
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
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string, color: string) => {
    const active = isActive(path);
    return active 
      ? `!bg-white !text-foreground font-semibold shadow-xl border-l-4 transform scale-[1.02]` 
      : `!text-gray-700 hover:!bg-white/60 hover:scale-[1.02] hover:shadow-lg hover:glow transition-all duration-300 ease-in-out`;
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-72"} style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <SidebarContent className="text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-bold text-lg mb-6 px-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              {!collapsed && "Studio Germano"}
            </div>
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      onClick={handleNavClick}
                      className={`${getNavClasses(item.url, item.color)} rounded-xl p-4 min-h-[72px] flex items-center gap-4 mx-2`}
                      style={{
                        borderLeftColor: isActive(item.url) ? item.color : 'transparent'
                      }}
                    >
                      <div 
                        className="p-2 rounded-lg flex-shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: isActive(item.url) ? `${item.color}20` : 'rgba(255,255,255,0.15)',
                          color: item.color,
                          boxShadow: isActive(item.url) ? `0 0 20px ${item.color}30` : 'none'
                        }}
                      >
                        <item.icon className="h-6 w-6 transition-transform duration-300" />
                      </div>
                      {!collapsed && (
                        <div className="flex flex-col items-start min-w-0">
                          <span className="font-semibold text-base truncate w-full">{item.title}</span>
                          <span className="text-sm opacity-80 truncate w-full">{item.description}</span>
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