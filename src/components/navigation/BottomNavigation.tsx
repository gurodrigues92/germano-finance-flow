import { Link, useLocation } from 'react-router-dom';
import { Home, DollarSign, Package, MoreHorizontal } from 'lucide-react';

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
        ? 'text-finance-studio' 
        : 'text-muted-foreground hover:text-finance-studio hover:scale-105'
    }`}
  >
    <div className={`p-1 rounded-lg transition-colors duration-200 ${
      active ? 'bg-finance-studio/10' : 'hover:bg-muted'
    }`}>
      <Icon className={`w-6 h-6 ${active ? 'text-finance-studio' : ''}`} />
    </div>
    <span className={`text-xs font-medium ${active ? 'text-finance-studio' : ''}`}>
      {label}
    </span>
  </Link>
);

export const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: DollarSign, label: 'Finanças', href: '/financeiro' },
    { icon: Package, label: 'Estoque', href: '/estoque' },
    { icon: MoreHorizontal, label: 'Mais', href: '/metas' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 shadow-lg pb-safe">
      <div className="grid grid-cols-4 h-20">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={location.pathname === item.href}
          />
        ))}
      </div>
    </nav>
  );
};