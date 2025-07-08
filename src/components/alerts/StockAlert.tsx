import { AlertTriangle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProdutos } from '@/hooks/useProdutos';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

export const StockAlert = () => {
  const { produtosBaixoEstoque } = useProdutos();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (produtosBaixoEstoque.length === 0) {
    return null;
  }

  const handleVerEstoque = () => {
    navigate('/estoque');
  };

  if (isMobile) {
    return (
      <Alert className="border-destructive bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription>
          <div className="space-y-3">
            <p className="font-semibold text-destructive">
              ⚠️ {produtosBaixoEstoque.length} produto(s) com estoque baixo
            </p>
            <div className="space-y-2">
              {produtosBaixoEstoque.slice(0, 2).map(produto => (
                <div key={produto.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium truncate">{produto.nome}</span>
                  </div>
                  <Badge variant="destructive" className="text-xs ml-2">
                    {produto.estoque_atual === 0 ? 'ZERADO' : `${produto.estoque_atual}`}
                  </Badge>
                </div>
              ))}
              {produtosBaixoEstoque.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{produtosBaixoEstoque.length - 2} outros produtos
                </p>
              )}
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleVerEstoque}
            >
              Ver Estoque
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-destructive bg-destructive/5">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-destructive mb-2">
              ⚠️ {produtosBaixoEstoque.length} produto(s) com estoque baixo
            </p>
            <div className="space-y-1">
              {produtosBaixoEstoque.slice(0, 3).map(produto => (
                <div key={produto.id} className="flex items-center gap-2 text-sm">
                  <Package className="h-3 w-3" />
                  <span className="font-medium">{produto.nome}</span>
                  <Badge variant="destructive" className="text-xs">
                    {produto.estoque_atual === 0 ? 'ZERADO' : `${produto.estoque_atual} restante(s)`}
                  </Badge>
                </div>
              ))}
              {produtosBaixoEstoque.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{produtosBaixoEstoque.length - 3} outros produtos
                </p>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleVerEstoque}
          >
            Ver Estoque
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};