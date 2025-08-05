import { useState } from 'react';
import { SalonLayout } from '@/components/salon/SalonLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { useProdutos } from '@/hooks/useProdutos';

export default function Produtos() {
  const { 
    produtos, 
    loading, 
    produtosBaixoEstoque, 
    valorTotalEstoque 
  } = useProdutos();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || produto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));

  return (
    <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Gestão completa de produtos e estoque</p>
          </div>
          <Button className="bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,32%)] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-[hsl(200,100%,50%)]" />
                <span className="text-2xl font-bold">{produtos.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-[hsl(14,100%,57%)]" />
                <span className="text-2xl font-bold text-[hsl(14,100%,57%)]">{produtosBaixoEstoque.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-[hsl(291,64%,42%)]" />
                <span className="text-2xl font-bold">{categorias.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-[hsl(142,76%,36%)]" />
                <span className="text-2xl font-bold">R$ {valorTotalEstoque.toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'todos' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('todos')}
                >
                  Todos ({produtos.length})
                </Button>
                {categorias.map(categoria => {
                  const count = produtos.filter(p => p.categoria === categoria).length;
                  return (
                    <Button
                      key={categoria}
                      variant={selectedCategory === categoria ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(categoria)}
                    >
                      {categoria} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Product List</span>
              <Badge variant="secondary">
                {filteredProdutos.length} produtos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando produtos...
              </div>
            ) : filteredProdutos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProdutos.map((produto) => {
                    const isLowStock = produto.estoque_atual <= produto.estoque_minimo;
                    
                    return (
                      <TableRow key={produto.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{produto.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {produto.unidade_medida}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{produto.categoria}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {produto.valor_unitario ? (
                            `R$ ${produto.valor_unitario.toFixed(2)}`
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={isLowStock ? 'text-[hsl(14,100%,57%)] font-medium' : ''}>
                              {produto.estoque_atual}
                            </span>
                            {isLowStock && (
                              <AlertTriangle className="w-4 h-4 text-[hsl(14,100%,57%)]" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-[hsl(14,100%,57%)] hover:text-[hsl(14,100%,57%)]">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </div>
  );
}