import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingDown } from "lucide-react";

interface EstoqueSummaryCardsProps {
  totalProdutos: number;
  valorTotalEstoque: number;
  produtosBaixoEstoque: number;
}

export function EstoqueSummaryCards({ 
  totalProdutos, 
  valorTotalEstoque, 
  produtosBaixoEstoque 
}: EstoqueSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total de Produtos
          </CardTitle>
          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-lg sm:text-2xl font-bold text-foreground">{totalProdutos}</div>
          <p className="text-xs text-muted-foreground">
            produtos cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Valor Total do Estoque
          </CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-lg sm:text-2xl font-bold text-finance-income">{formatCurrency(valorTotalEstoque)}</div>
          <p className="text-xs text-muted-foreground">
            valor estimado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Produtos Baixo Estoque
          </CardTitle>
          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-lg sm:text-2xl font-bold text-finance-fees">{produtosBaixoEstoque}</div>
          <p className="text-xs text-muted-foreground">
            precisam de atenção
          </p>
        </CardContent>
      </Card>
    </div>
  );
}