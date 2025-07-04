import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Produto } from "@/types/estoque";
import { Edit, Trash2, Package } from "lucide-react";

interface ProdutosTableProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

export function ProdutosTable({ produtos, onEdit, onDelete }: ProdutosTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (produto: Produto) => {
    if (produto.estoque_atual === 0) {
      return <Badge variant="destructive">Esgotado</Badge>;
    }
    if (produto.estoque_atual <= produto.estoque_minimo) {
      return <Badge variant="secondary" className="bg-orange-500 text-white">Baixo</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-500 text-white">Normal</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produtos Cadastrados ({produtos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Estoque Mínimo</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum produto cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        <p className="text-sm text-muted-foreground">{produto.unidade_medida}</p>
                      </div>
                    </TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell className="font-medium">
                      {produto.estoque_atual}
                    </TableCell>
                    <TableCell>{produto.estoque_minimo}</TableCell>
                    <TableCell>
                      {produto.valor_unitario ? formatCurrency(produto.valor_unitario) : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(produto)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(produto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(produto.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}