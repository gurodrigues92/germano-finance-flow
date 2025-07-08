import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/contexts/UserProfileContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProtectedPageProps {
  children: ReactNode;
  permission: string;
  fallbackPath?: string;
}

export const ProtectedPage = ({ 
  children, 
  permission, 
  fallbackPath = '/' 
}: ProtectedPageProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};