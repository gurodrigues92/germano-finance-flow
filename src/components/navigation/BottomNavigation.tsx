import { Link, useLocation } from 'react-router-dom';
import { Home, DollarSign, Package, MoreHorizontal, LogOut, Target, Receipt, TrendingUp, BarChart3, Archive } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, href, active }: NavItemProps) => (
  <Link 
    to={href}
      className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 transition-all duration-200 active:scale-95 ${
        active 
          ? 'text-purple-600' 
          : 'text-muted-foreground hover:text-purple-600 hover:scale-105'
      }`}
    >
      <div className={`p-1 rounded-lg transition-colors duration-200 ${
        active ? 'bg-purple-100 shadow-sm' : 'hover:bg-purple-50'
      }`}>
        <Icon className={`w-6 h-6 ${active ? 'text-purple-600' : ''}`} />
      </div>
      <span className={`text-xs font-medium ${active ? 'text-purple-600' : ''}`}>
      {label}
    </span>
  </Link>
);

export const BottomNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  
  const mainNavItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: DollarSign, label: 'Transações', href: '/transacoes' },
    { icon: Package, label: 'Estoque', href: '/estoque' },
  ];

  const menuItems = [
    { label: 'Metas Financeiras', href: '/metas', icon: Target },
    { label: 'Custos Fixos', href: '/custos-fixos', icon: Receipt },
    { label: 'Investimentos', href: '/investimentos', icon: TrendingUp },
    { label: 'Análise', href: '/analise', icon: BarChart3 },
    { label: 'Arquivo', href: '/arquivo', icon: Archive },
  ];

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong border-t border-purple-100 z-50 shadow-lg pb-safe">
      <div className="grid grid-cols-4 h-20">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
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