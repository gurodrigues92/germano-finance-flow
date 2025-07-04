import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Produto } from "@/types/estoque";
import { AlertTriangle, Package } from "lucide-react";

interface EstoqueAlertsProps {
  produtosBaixoEstoque: Produto[];
  totalProdutos: number;
}

export function EstoqueAlerts({ produtosBaixoEstoque, totalProdutos }: EstoqueAlertsProps) {
  const produtosCriticos = produtosBaixoEstoque.filter(p => p.estoque_atual === 0);
  const produtosBaixos = produtosBaixoEstoque.filter(p => p.estoque_atual > 0);

  const getStatusColor = (produto: Produto) => {
    if (produto.estoque_atual === 0) return "bg-destructive";
    if (produto.estoque_atual <= produto.estoque_minimo) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStatusText = (produto: Produto) => {
    if (produto.estoque_atual === 0) return "Esgotado";
    if (produto.estoque_atual <= produto.estoque_minimo) return "Baixo";
    return "Normal";
  };

  return (
    <div className="space-y-4">
      {/* Alert principal */}
      {produtosBaixoEstoque.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Atenção: Produtos com baixo estoque</AlertTitle>
          <AlertDescription className="text-orange-700">
            {produtosBaixoEstoque.length} produto(s) precisam de atenção.
            {produtosCriticos.length > 0 && (
              <> {produtosCriticos.length} produto(s) estão esgotados.</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de produtos com problemas */}
      {produtosBaixoEstoque.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos que Precisam de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {produtosBaixoEstoque.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{produto.nome}</h3>
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(produto)} text-white`}
                      >
                        {getStatusText(produto)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {produto.categoria} • {produto.unidade_medida}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {produto.estoque_atual} / {produto.estoque_minimo}
                    </p>
                    <p className="text-xs text-muted-foreground">atual / mínimo</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo quando tudo está ok */}
      {produtosBaixoEstoque.length === 0 && totalProdutos > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <Package className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Estoque em dia!</AlertTitle>
          <AlertDescription className="text-green-700">
            Todos os {totalProdutos} produtos estão com estoque adequado.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}