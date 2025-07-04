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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Custos Fixos do Mês */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Custos Fixos do Mês
          </CardTitle>
          <DollarSign className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalGeral)}
          </div>
          <p className="text-xs text-red-100">
            {Object.keys(totalPorCategoria).length} categorias ativas
          </p>
        </CardContent>
      </Card>

      {/* Maior Custo */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Maior Custo Individual
          </CardTitle>
          <TrendingDown className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {maiorCusto ? formatCurrency(Number(maiorCusto.valor)) : formatCurrency(0)}
          </div>
          <p className="text-xs text-orange-100">
            {maiorCusto ? `${maiorCusto.categoria} - ${maiorCusto.subcategoria}` : "Nenhum custo cadastrado"}
          </p>
        </CardContent>
      </Card>

      {/* Custos vs Receita */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Custos vs Receita
          </CardTitle>
          <Percent className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {percentualReceita.toFixed(1)}%
          </div>
          <p className="text-xs text-purple-100">
            {receita > 0 ? `Receita: ${formatCurrency(receita)}` : "Receita não informada"}
          </p>
        </CardContent>
      </Card>

      {/* Cards por Categoria */}
      {Object.entries(totalPorCategoria).map(([categoria, total]) => (
        <Card key={categoria} className="border-l-4 border-l-studio-gold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {categoria}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-fees">
              {formatCurrency(total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((total / totalGeral) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}