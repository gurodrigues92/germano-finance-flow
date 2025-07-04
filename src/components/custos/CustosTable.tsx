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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Custos Cadastrados ({filteredCustos.length})
          </CardTitle>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por subcategoria ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Todas as categorias" />
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
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Todos os meses" />
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
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  );
}