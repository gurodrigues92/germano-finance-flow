import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIAS_CUSTOS, CustoFixoInput, CategoriaCusto } from "@/types/custos";
import { format } from "date-fns";

interface CustosFormProps {
  onSubmit: (custo: CustoFixoInput) => Promise<void>;
  initialData?: Partial<CustoFixoInput>;
  isEdit?: boolean;
}

export function CustosForm({ onSubmit, initialData, isEdit = false }: CustosFormProps) {
  const [categoria, setCategoria] = useState<CategoriaCusto | "">(initialData?.categoria as CategoriaCusto || "");
  const [subcategoria, setSubcategoria] = useState(initialData?.subcategoria || "");
  const [valor, setValor] = useState(initialData?.valor?.toString() || "");
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || "");
  const [mesReferencia, setMesReferencia] = useState(
    initialData?.mes_referencia || format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !subcategoria || !valor) return;

    setLoading(true);
    try {
      await onSubmit({
        categoria,
        subcategoria,
        valor: parseFloat(valor),
        observacoes: observacoes || undefined,
        mes_referencia: mesReferencia,
      });
      
      if (!isEdit) {
        // Reset form only if creating new
        setCategoria("");
        setSubcategoria("");
        setValor("");
        setObservacoes("");
        setMesReferencia(format(new Date(), "yyyy-MM-dd"));
      }
    } catch (error) {
      console.error("Erro ao salvar custo:", error);
    } finally {
      setLoading(false);
    }
  };

  const subcategorias = categoria ? CATEGORIAS_CUSTOS[categoria] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Editar" : "Adicionar"} Custo Fixo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={(value) => {
                setCategoria(value as CategoriaCusto);
                setSubcategoria(""); // Reset subcategoria when categoria changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORIAS_CUSTOS).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <Select value={subcategoria} onValueChange={setSubcategoria} disabled={!categoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma subcategoria" />
                </SelectTrigger>
                <SelectContent>
                  {subcategorias.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mes_referencia">Mês de Referência</Label>
              <Input
                id="mes_referencia"
                type="date"
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Detalhes adicionais sobre este custo..."
            />
          </div>

          <Button type="submit" disabled={loading || !categoria || !subcategoria || !valor}>
            {loading ? "Salvando..." : isEdit ? "Atualizar" : "Adicionar Custo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}