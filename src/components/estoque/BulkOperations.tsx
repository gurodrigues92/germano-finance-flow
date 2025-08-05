import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  CheckSquare, 
  Package, 
  DollarSign, 
  TrendingDown, 
  Download,
  Upload,
  AlertTriangle
} from "lucide-react";
import { Produto } from "@/types/estoque";
import { formatCurrency } from "@/lib/formatUtils";
import { toast } from "sonner";

interface BulkOperationsProps {
  selectedProducts: string[];
  onSelectionChange: (selected: string[]) => void;
  produtos: Produto[];
  onBulkUpdateMinimumStock: (updates: Array<{ id: string; estoque_minimo: number }>) => Promise<void>;
  onBulkPriceUpdate: (updates: Array<{ id: string; valor_unitario: number }>) => Promise<void>;
}

export function BulkOperations({ 
  selectedProducts, 
  onSelectionChange, 
  produtos,
  onBulkUpdateMinimumStock,
  onBulkPriceUpdate
}: BulkOperationsProps) {
  const [bulkAction, setBulkAction] = useState<'price' | 'minimum' | ''>('');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkMode, setBulkMode] = useState<'set' | 'increase' | 'decrease'>('set');

  const selectedProductsData = produtos.filter(p => selectedProducts.includes(p.id));
  
  const selectAll = () => {
    onSelectionChange(produtos.map(p => p.id));
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  const selectLowStock = () => {
    const lowStockIds = produtos
      .filter(p => p.estoque_atual <= p.estoque_minimo)
      .map(p => p.id);
    onSelectionChange(lowStockIds);
  };

  const handleBulkOperation = async () => {
    if (!bulkValue || selectedProducts.length === 0) {
      toast.error('Selecione produtos e defina um valor');
      return;
    }

    const value = parseFloat(bulkValue);
    if (isNaN(value)) {
      toast.error('Valor inválido');
      return;
    }

    try {
      if (bulkAction === 'price') {
        const updates = selectedProductsData.map(produto => {
          let newValue = value;
          if (bulkMode === 'increase') {
            newValue = (produto.valor_unitario || 0) + value;
          } else if (bulkMode === 'decrease') {
            newValue = Math.max(0, (produto.valor_unitario || 0) - value);
          }
          return { id: produto.id, valor_unitario: newValue };
        });
        await onBulkPriceUpdate(updates);
      } else if (bulkAction === 'minimum') {
        const updates = selectedProductsData.map(produto => {
          let newValue = value;
          if (bulkMode === 'increase') {
            newValue = produto.estoque_minimo + value;
          } else if (bulkMode === 'decrease') {
            newValue = Math.max(0, produto.estoque_minimo - value);
          }
          return { id: produto.id, estoque_minimo: Math.floor(newValue) };
        });
        await onBulkUpdateMinimumStock(updates);
      }
      
      // Reset form
      setBulkAction('');
      setBulkValue('');
      onSelectionChange([]);
    } catch (error) {
      toast.error('Erro ao executar operação em lote');
    }
  };

  const exportSelected = () => {
    if (selectedProducts.length === 0) {
      toast.error('Selecione produtos para exportar');
      return;
    }

    const csvData = selectedProductsData.map(p => ({
      nome: p.nome,
      categoria: p.categoria,
      estoque_atual: p.estoque_atual,
      estoque_minimo: p.estoque_minimo,
      valor_unitario: p.valor_unitario || 0,
      valor_total: p.estoque_atual * (p.valor_unitario || 0)
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produtos_selecionados_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Operações em Lote
          {selectedProducts.length > 0 && (
            <Badge variant="secondary">
              {selectedProducts.length} selecionados
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Selecionar Todos
          </Button>
          <Button variant="outline" size="sm" onClick={selectNone}>
            Desmarcar Todos
          </Button>
          <Button variant="outline" size="sm" onClick={selectLowStock}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            Baixo Estoque
          </Button>
          {selectedProducts.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportSelected}>
              <Download className="h-4 w-4 mr-1" />
              Exportar Selecionados
            </Button>
          )}
        </div>

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Produtos:</span>
                <p className="font-medium">{selectedProducts.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor Total:</span>
                <p className="font-medium">
                  {formatCurrency(
                    selectedProductsData.reduce((sum, p) => 
                      sum + (p.estoque_atual * (p.valor_unitario || 0)), 0
                    )
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Estoque Total:</span>
                <p className="font-medium">
                  {selectedProductsData.reduce((sum, p) => sum + p.estoque_atual, 0)} unidades
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Baixo Estoque:</span>
                <p className="font-medium">
                  {selectedProductsData.filter(p => p.estoque_atual <= p.estoque_minimo).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Operations Form */}
        {selectedProducts.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium">Operação em Lote</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select value={bulkAction} onValueChange={(value: any) => setBulkAction(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a operação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Atualizar Preços</SelectItem>
                  <SelectItem value="minimum">Atualizar Estoque Mínimo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bulkMode} onValueChange={(value: any) => setBulkMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Definir valor</SelectItem>
                  <SelectItem value="increase">Aumentar em</SelectItem>
                  <SelectItem value="decrease">Diminuir em</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Valor"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                min="0"
                step={bulkAction === 'price' ? '0.01' : '1'}
              />

              <Button 
                onClick={handleBulkOperation}
                disabled={!bulkAction || !bulkValue}
                className="w-full"
              >
                Aplicar
              </Button>
            </div>

            {bulkAction && bulkValue && (
              <div className="text-sm text-muted-foreground">
                <p>
                  {bulkMode === 'set' && `Definir ${bulkAction === 'price' ? 'preço' : 'estoque mínimo'} como ${bulkValue}`}
                  {bulkMode === 'increase' && `Aumentar ${bulkAction === 'price' ? 'preço' : 'estoque mínimo'} em ${bulkValue}`}
                  {bulkMode === 'decrease' && `Diminuir ${bulkAction === 'price' ? 'preço' : 'estoque mínimo'} em ${bulkValue}`}
                  {' '}para {selectedProducts.length} produto(s)
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}