import { Link, useLocation } from 'react-router-dom';
import { Home, DollarSign, Package, MoreHorizontal, LogOut, Target, Receipt, TrendingUp, BarChart3, Archive, Calendar, Calculator, Users, Scissors } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/UserProfileContext';

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, href, active, color }: NavItemProps & { color?: string }) => (
  <Link 
    to={href}
      className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 transition-all duration-200 active:scale-95 ${
        active 
          ? 'text-blue-600' 
          : 'text-muted-foreground hover:text-blue-600 hover:scale-105'
      }`}
    >
      <div 
        className={`p-1 rounded-lg transition-colors duration-200 ${
          active ? 'shadow-sm' : 'hover:bg-blue-50'
        }`}
        style={{
          backgroundColor: active && color ? `${color}15` : undefined,
          color: active && color ? color : undefined
        }}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className={`text-xs font-medium ${active && color ? '' : ''}`} style={{
        color: active && color ? color : undefined
      }}>
      {label}
    </span>
  </Link>
);

export const BottomNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { hasPermission } = usePermissions();
  
  const allMainNavItems = [
    { icon: Calendar, label: 'Agenda', href: '/agenda', permission: 'view_appointments', color: '#4CAF50' },
    { icon: Calculator, label: 'Caixa', href: '/caixa', permission: 'manage_payments', color: '#2196F3' },
    { icon: DollarSign, label: 'Financeiro', href: '/financeiro', permission: 'view_financial_metrics', color: '#9C27B0' },
    { icon: BarChart3, label: 'Relatórios', href: '/analise', permission: 'view_analysis', color: '#FF5722' },
    { icon: Users, label: 'Clientes', href: '/clientes', permission: 'view_clients', color: '#FF9800' },
  ];

  // Filtrar itens principais baseado nas permissões
  const mainNavItems = allMainNavItems.filter(item => hasPermission(item.permission));

  const allMenuItems = [
    { label: 'Profissionais', href: '/profissionais', icon: Scissors, permission: 'manage_professionals', color: '#4CAF50' },
    { label: 'Serviços', href: '/servicos', icon: Receipt, permission: 'manage_services', color: '#E91E63' },
    { label: 'Produtos', href: '/estoque', icon: Package, permission: 'view_stock', color: '#00BCD4' },
    { label: 'Despesas', href: '/custos-fixos', icon: Target, permission: 'view_fixed_costs', color: '#FF5722' },
    { label: 'Relatórios Avançados', href: '/reports/advanced', icon: TrendingUp, permission: 'view_analysis', color: '#673AB7' },
    { label: 'Arquivo', href: '/arquivo', icon: Archive, permission: 'view_archive', color: '#607D8B' },
  ];

  // Filtrar itens do menu baseado nas permissões
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission));

  const MoreButton = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col items-center justify-center space-y-1 py-3 px-2 transition-all duration-200 active:scale-95 text-muted-foreground hover:text-purple-600 hover:scale-105">
          <div className="p-1 rounded-lg transition-colors duration-200 hover:bg-purple-50">
            <MoreHorizontal className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium">Mais</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] glass-strong border-purple-100">
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <div className="grid gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 p-4 md:p-3 rounded-lg transition-colors hover:bg-purple-50 min-h-[48px] ${
                  location.pathname === item.href 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-base md:text-sm">{item.label}</span>
              </Link>
            ))}
            
            {/* Separador */}
            <div className="border-t border-border my-2"></div>
            
            {/* Botão de Logout */}
            <button 
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 w-full p-4 md:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[48px]"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base md:text-sm">Sair do Sistema</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Calcular número de colunas baseado na quantidade de itens + botão "Mais"
  const totalItems = Math.min(mainNavItems.length + 1, 5); // +1 para o botão "Mais", máximo 5
  const gridCols = totalItems <= 2 ? 'grid-cols-2' : totalItems === 3 ? 'grid-cols-3' : totalItems === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong border-t border-purple-100 z-50 shadow-lg pb-safe" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}>
      <div className={`grid ${gridCols} h-20`}>
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            color={item.color}
            active={
              item.href === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.href)
            }
          />
        ))}
        <MoreButton />
      </div>
    </nav>
  );
};