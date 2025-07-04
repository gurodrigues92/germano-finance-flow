import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProdutoInput, CATEGORIAS_PRODUTOS, UNIDADES_MEDIDA } from "@/types/estoque";

interface ProdutoFormProps {
  onSubmit: (produto: ProdutoInput) => Promise<void>;
  initialData?: Partial<ProdutoInput>;
  isEdit?: boolean;
}

export function ProdutoForm({ onSubmit, initialData, isEdit = false }: ProdutoFormProps) {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [categoria, setCategoria] = useState(initialData?.categoria || "");
  const [unidadeMedida, setUnidadeMedida] = useState(initialData?.unidade_medida || "");
  const [estoqueMinimo, setEstoqueMinimo] = useState(initialData?.estoque_minimo?.toString() || "");
  const [valorUnitario, setValorUnitario] = useState(initialData?.valor_unitario?.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !categoria || !unidadeMedida || !estoqueMinimo) return;

    setLoading(true);
    try {
      await onSubmit({
        nome,
        categoria,
        unidade_medida: unidadeMedida,
        estoque_minimo: parseInt(estoqueMinimo),
        valor_unitario: valorUnitario ? parseFloat(valorUnitario) : undefined,
      });
      
      if (!isEdit) {
        // Reset form only if creating new
        setNome("");
        setCategoria("");
        setUnidadeMedida("");
        setEstoqueMinimo("");
        setValorUnitario("");
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Editar" : "Cadastrar"} Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Shampoo Hidratante"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_PRODUTOS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidade_medida">Unidade de Medida</Label>
              <Select value={unidadeMedida} onValueChange={setUnidadeMedida}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNIDADES_MEDIDA.map((unidade) => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                min="0"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                placeholder="Quantidade mínima"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="valor_unitario">Valor Unitário (R$) - Opcional</Label>
              <Input
                id="valor_unitario"
                type="number"
                step="0.01"
                min="0"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !nome || !categoria || !unidadeMedida || !estoqueMinimo}>
            {loading ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar Produto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}