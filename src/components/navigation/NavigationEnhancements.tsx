import { useLocation, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface NavigationEnhancementsProps {
  children?: React.ReactNode;
}

export const NavigationEnhancements = ({ children }: NavigationEnhancementsProps) => {
  const location = useLocation();

  // Determine if we should show back button and what the previous route should be
  const getBackRoute = () => {
    const path = location.pathname;
    
    // Only show back button for sub-pages within finance section
    if (path.startsWith('/finance/') && path !== '/finance') return '/finance';
    
    return null;
  };

  // Get related routes based on current location
  const getRelatedRoutes = () => {
    const path = location.pathname;
    
    if (path === '/clientes') {
      return [
        { label: 'Agenda', path: '/agenda', description: 'Ver agendamentos' },
        { label: 'Caixa', path: '/caixa', description: 'Abrir comanda' }
      ];
    }
    
    if (path === '/profissionais') {
      return [
        { label: 'Serviços', path: '/servicos', description: 'Gerenciar serviços' },
        { label: 'Agenda', path: '/agenda', description: 'Ver agenda' }
      ];
    }
    
    if (path === '/caixa') {
      return [
        { label: 'Clientes', path: '/clientes', description: 'Buscar cliente' },
        { label: 'Estoque', path: '/estoque', description: 'Verificar produtos' }
      ];
    }
    
    if (path === '/estoque') {
      return [
        { label: 'Caixa', path: '/caixa', description: 'Usar produtos' }
      ];
    }
    
    return [];
  };

  const backRoute = getBackRoute();
  const relatedRoutes = getRelatedRoutes();

  if (!backRoute && relatedRoutes.length === 0) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {/* Back Navigation */}
      {backRoute && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={backRoute} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      )}

      {/* Related Routes */}
      {relatedRoutes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Ações relacionadas:</span>
          {relatedRoutes.map((route) => (
            <Badge key={route.path} variant="outline" className="hover:bg-muted">
              <Link 
                to={route.path} 
                className="flex items-center gap-1"
                title={route.description}
              >
                {route.label}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Badge>
          ))}
        </div>
      )}

      {children}
    </div>
  );
};