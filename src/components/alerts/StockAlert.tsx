import { AlertTriangle, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { stockProducts, getLowStockProducts } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

export const StockAlert = () => {
  const lowStockProducts = getLowStockProducts();
  const isMobile = useIsMobile();

  if (lowStockProducts.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <Alert className="border-destructive bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription>
          <div className="space-y-3">
            <p className="font-semibold text-destructive">
              ⚠️ {lowStockProducts.length} produto(s) com estoque baixo
            </p>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 2).map(product => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium truncate">{product.nome}</span>
                  </div>
                  <Badge variant="destructive" className="text-xs ml-2">
                    {product.estoqueAtual === 0 ? 'ZERADO' : `${product.estoqueAtual}`}
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{lowStockProducts.length - 2} outros produtos
                </p>
              )}
            </div>
            <Button size="sm" variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
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
              ⚠️ {lowStockProducts.length} produto(s) com estoque baixo
            </p>
            <div className="space-y-1">
              {lowStockProducts.slice(0, 3).map(product => (
                <div key={product.id} className="flex items-center gap-2 text-sm">
                  <Package className="h-3 w-3" />
                  <span className="font-medium">{product.nome}</span>
                  <Badge variant="destructive" className="text-xs">
                    {product.estoqueAtual === 0 ? 'ZERADO' : `${product.estoqueAtual} restante(s)`}
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{lowStockProducts.length - 3} outros produtos
                </p>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            Ver Estoque
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};