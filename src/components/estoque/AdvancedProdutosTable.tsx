import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Produto } from "@/types/estoque";
import { Edit, Trash2, Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/formatUtils";

interface AdvancedProdutosTableProps {
  produtos: Produto[];
  selectedProducts: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
  analytics?: {
    topSellingProducts: Array<{
      produto: Produto;
      quantidadeVendida: number;
      valor: number;
    }>;
  };
}

export function AdvancedProdutosTable({ 
  produtos, 
  selectedProducts, 
  onSelectionChange, 
  onEdit, 
  onDelete,
  analytics 
}: AdvancedProdutosTableProps) {
  const getStatusBadge = (produto: Produto) => {
    if (produto.estoque_atual === 0) {
      return <Badge variant="destructive">Esgotado</Badge>;
    }
    if (produto.estoque_atual <= produto.estoque_minimo) {
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Baixo</Badge>;
    }
    return <Badge variant="secondary" className="bg-success text-success-foreground">Normal</Badge>;
  };

  const getStockPercentage = (produto: Produto) => {
    const target = produto.estoque_minimo * 2; // Consider double minimum as "good stock"
    return Math.min((produto.estoque_atual / target) * 100, 100);
  };

  const getSalesData = (produto: Produto) => {
    return analytics?.topSellingProducts.find(p => p.produto.id === produto.id);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(produtos.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const isAllSelected = produtos.length > 0 && selectedProducts.length === produtos.length;
  const isPartiallySelected = selectedProducts.length > 0 && selectedProducts.length < produtos.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos Cadastrados ({produtos.length})
          </div>
          {selectedProducts.length > 0 && (
            <Badge variant="secondary">
              {selectedProducts.length} selecionados
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className={isPartiallySelected ? "data-[state=checked]:bg-muted" : ""}
                  />
                </TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Vendas (30d)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((produto) => {
                  const salesData = getSalesData(produto);
                  const stockPercentage = getStockPercentage(produto);
                  
                  return (
                    <TableRow 
                      key={produto.id}
                      className={selectedProducts.includes(produto.id) ? "bg-muted/50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(produto.id)}
                          onCheckedChange={(checked) => handleSelectProduct(produto.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-muted-foreground">{produto.unidade_medida}</p>
                        </div>
                      </TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{produto.estoque_atual}</span>
                            <span className="text-sm text-muted-foreground">/ {produto.estoque_minimo}</span>
                          </div>
                          <Progress value={stockPercentage} className="h-1 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {produto.valor_unitario ? formatCurrency(produto.valor_unitario) : "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {produto.valor_unitario 
                          ? formatCurrency(produto.estoque_atual * produto.valor_unitario) 
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        {salesData ? (
                          <div className="text-sm">
                            <p className="font-medium flex items-center gap-1">
                              {salesData.quantidadeVendida > 0 ? (
                                <TrendingUp className="h-3 w-3 text-success" />
                              ) : (
                                <Minus className="h-3 w-3 text-muted-foreground" />
                              )}
                              {salesData.quantidadeVendida}
                            </p>
                            <p className="text-muted-foreground">{formatCurrency(salesData.valor)}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(produto)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => onEdit(produto)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(produto.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {produtos.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhum produto encontrado
            </div>
          ) : (
            produtos.map((produto) => {
              const salesData = getSalesData(produto);
              const stockPercentage = getStockPercentage(produto);
              
              return (
                <Card 
                  key={produto.id} 
                  className={`p-4 ${selectedProducts.includes(produto.id) ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedProducts.includes(produto.id)}
                        onCheckedChange={(checked) => handleSelectProduct(produto.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-base">{produto.nome}</p>
                        <p className="text-sm text-muted-foreground">{produto.categoria} • {produto.unidade_medida}</p>
                      </div>
                    </div>
                    {getStatusBadge(produto)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Estoque:</span>
                      <div className="mt-1">
                        <p className="font-medium">{produto.estoque_atual} / {produto.estoque_minimo}</p>
                        <Progress value={stockPercentage} className="h-2 mt-1" />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Unit.:</span>
                      <p className="font-medium">
                        {produto.valor_unitario ? formatCurrency(produto.valor_unitario) : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Total:</span>
                      <p className="font-medium">
                        {produto.valor_unitario 
                          ? formatCurrency(produto.estoque_atual * produto.valor_unitario) 
                          : "-"
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vendas (30d):</span>
                      {salesData ? (
                        <p className="font-medium flex items-center gap-1">
                          {salesData.quantidadeVendida > 0 ? (
                            <TrendingUp className="h-3 w-3 text-success" />
                          ) : (
                            <Minus className="h-3 w-3 text-muted-foreground" />
                          )}
                          {salesData.quantidadeVendida}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="h-9 w-9 p-0"
                      onClick={() => onEdit(produto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(produto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}