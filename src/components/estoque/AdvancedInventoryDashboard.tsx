import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAdvancedInventory } from "@/hooks/useAdvancedInventory";
import { 
  Package, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Download
} from "lucide-react";
import { formatCurrency } from "@/lib/formatUtils";

export function AdvancedInventoryDashboard() {
  const { analytics, loading, generateReorderReport, exportInventoryData } = useAdvancedInventory();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total do Estoque
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              {formatCurrency(analytics.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              valor estimado do inventário
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem de Lucro
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              {analytics.costAnalysis.profitMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos Baixo Estoque
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-fees">
              {analytics.lowStockProducts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              precisam de reposição
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sugestões de Reposição
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analytics.reorderSuggestions.filter(s => s.urgency !== 'low').length}
            </div>
            <p className="text-xs text-muted-foreground">
              produtos para repor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportInventoryData('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const report = generateReorderReport();
                console.log('Reorder Report:', report);
                // TODO: Display or export report
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Relatório de Reposição
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos Mais Vendidos (30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topSellingProducts.slice(0, 5).map((item, index) => (
              <div key={item.produto.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.produto.nome}</p>
                    <p className="text-sm text-muted-foreground">{item.produto.categoria}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.quantidadeVendida} und</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.valor)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reorder Suggestions */}
      {analytics.reorderSuggestions.filter(s => s.urgency !== 'low').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Sugestões de Reposição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.reorderSuggestions
                .filter(s => s.urgency !== 'low')
                .slice(0, 10)
                .map((suggestion) => (
                <div key={suggestion.produto.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{suggestion.produto.nome}</p>
                      <Badge variant={getUrgencyColor(suggestion.urgency) as any}>
                        {suggestion.urgency === 'high' ? 'Urgente' : 'Médio'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Estoque atual: {suggestion.produto.estoque_atual} | 
                      Mínimo: {suggestion.produto.estoque_minimo}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Nível do estoque</span>
                        <span>
                          {suggestion.produto.estoque_atual} / {suggestion.produto.estoque_minimo * 2}
                        </span>
                      </div>
                      <Progress 
                        value={(suggestion.produto.estoque_atual / (suggestion.produto.estoque_minimo * 2)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-medium text-primary">
                      {suggestion.suggestedQuantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(suggestion.suggestedQuantity * (suggestion.produto.valor_unitario || 0))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}