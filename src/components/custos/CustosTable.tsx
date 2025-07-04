import { useState } from "react";
import { CustoFixo } from "@/types/custos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CustosTableProps {
  custos: CustoFixo[];
  onEdit: (custo: CustoFixo) => void;
  onDelete: (id: string) => void;
}

export function CustosTable({ custos, onEdit, onDelete }: CustosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [filterMes, setFilterMes] = useState<string>("all");

  const filteredCustos = custos.filter((custo) => {
    const matchesSearch = 
      custo.subcategoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custo.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filterCategoria === "all" || custo.categoria === filterCategoria;
    const matchesMes = filterMes === "all" || custo.mes_referencia.startsWith(filterMes);

    return matchesSearch && matchesCategoria && matchesMes;
  });

  const categorias = [...new Set(custos.map(c => c.categoria))];
  const meses = [...new Set(custos.map(c => c.mes_referencia.substring(0, 7)))];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Custos Cadastrados ({filteredCustos.length})
          </CardTitle>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por subcategoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-full sm:w-40 min-w-0 max-w-full">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterMes} onValueChange={setFilterMes}>
              <SelectTrigger className="w-full sm:w-28 min-w-0 max-w-full">
                <SelectValue placeholder="Meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os meses</SelectItem>
                {meses.sort().reverse().map((mes) => (
                  <SelectItem key={mes} value={mes}>
                    {format(new Date(mes + '-01'), 'MMM/yyyy', { locale: ptBR })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Subcategoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Mês</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {custos.length === 0 ? "Nenhum custo cadastrado ainda" : "Nenhum custo encontrado com os filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustos.map((custo) => (
                    <TableRow key={custo.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{custo.categoria}</TableCell>
                      <TableCell>{custo.subcategoria}</TableCell>
                      <TableCell className="font-medium text-destructive">
                        {formatCurrency(Number(custo.valor))}
                      </TableCell>
                      <TableCell>
                        {format(new Date(custo.mes_referencia), 'MMM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {custo.observacoes || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(custo)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(custo.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {filteredCustos.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {custos.length === 0 ? "Nenhum custo cadastrado ainda" : "Nenhum custo encontrado com os filtros aplicados"}
            </div>
          ) : (
            filteredCustos.map((custo) => (
              <Card key={custo.id} className="p-4 border hover:shadow-sm transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="font-medium text-sm text-muted-foreground">{custo.categoria}</div>
                      <div className="font-semibold truncate">{custo.subcategoria}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-destructive">
                        {formatCurrency(Number(custo.valor))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(custo.mes_referencia), 'MMM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  {custo.observacoes && (
                    <div className="text-sm text-muted-foreground border-t pt-2">
                      {custo.observacoes}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(custo)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(custo.id)}
                      className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}