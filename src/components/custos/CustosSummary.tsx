import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, DollarSign, Percent } from "lucide-react";
import { CustoFixo } from "@/types/custos";

interface CustosSummaryProps {
  totalGeral: number;
  maiorCusto: CustoFixo | null;
  totalPorCategoria: Record<string, number>;
  receita?: number; // Para calcular % de custos vs receita
}

export function CustosSummary({ 
  totalGeral, 
  maiorCusto, 
  totalPorCategoria,
  receita = 0 
}: CustosSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const percentualReceita = receita > 0 ? (totalGeral / receita) * 100 : 0;
  const categoriaComMaiorCusto = Object.entries(totalPorCategoria)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {/* Total Custos Fixos do Mês */}
      <Card className="border-l-4 border-l-destructive">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Custos Fixos
          </CardTitle>
          <DollarSign className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totalGeral)}
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(totalPorCategoria).length} categorias ativas
          </p>
        </CardContent>
      </Card>

      {/* Maior Custo */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Maior Custo Individual
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {maiorCusto ? formatCurrency(Number(maiorCusto.valor)) : formatCurrency(0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {maiorCusto ? `${maiorCusto.categoria} - ${maiorCusto.subcategoria}` : "Nenhum custo cadastrado"}
          </p>
        </CardContent>
      </Card>

      {/* Custos vs Receita */}
      <Card className="border-l-4 border-l-secondary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Custos vs Receita
          </CardTitle>
          <Percent className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {percentualReceita.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {receita > 0 ? `Receita: ${formatCurrency(receita)}` : "Receita não informada"}
          </p>
        </CardContent>
      </Card>

        {/* Cards por Categoria */}
        {Object.entries(totalPorCategoria).map(([categoria, total]) => (
          <Card key={categoria} className="border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {categoria}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {formatCurrency(total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {((total / totalGeral) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}