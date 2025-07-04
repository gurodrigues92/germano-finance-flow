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
    className={`flex flex-col items-center justify-center space-y-1 py-2 px-1 ${
      active ? 'text-finance-studio' : 'text-muted-foreground'
    } hover:text-finance-studio transition-colors`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs font-medium">{label}</span>
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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-4 h-16">
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