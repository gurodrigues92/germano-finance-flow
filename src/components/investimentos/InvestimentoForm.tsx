import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestimentoInput, CATEGORIAS_INVESTIMENTOS, CategoriaInvestimento } from "@/types/investimentos";
import { format } from "date-fns";

interface InvestimentoFormProps {
  onSubmit: (investimento: InvestimentoInput) => Promise<void>;
  initialData?: Partial<InvestimentoInput>;
  isEdit?: boolean;
}

export function InvestimentoForm({ onSubmit, initialData, isEdit = false }: InvestimentoFormProps) {
  const [categoria, setCategoria] = useState<CategoriaInvestimento | "">(initialData?.categoria as CategoriaInvestimento || "");
  const [subcategoria, setSubcategoria] = useState(initialData?.subcategoria || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [valor, setValor] = useState(initialData?.valor?.toString() || "");
  const [dataCompra, setDataCompra] = useState(
    initialData?.data_compra || format(new Date(), "yyyy-MM-dd")
  );
  const [fornecedor, setFornecedor] = useState(initialData?.fornecedor || "");
  const [garantiaMeses, setGarantiaMeses] = useState(initialData?.garantia_meses?.toString() || "");
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !subcategoria || !descricao || !valor) return;

    setLoading(true);
    try {
      await onSubmit({
        categoria,
        subcategoria,
        descricao,
        valor: parseFloat(valor),
        data_compra: dataCompra,
        fornecedor: fornecedor || undefined,
        garantia_meses: garantiaMeses ? parseInt(garantiaMeses) : undefined,
        observacoes: observacoes || undefined,
      });
      
      if (!isEdit) {
        // Reset form only if creating new
        setCategoria("");
        setSubcategoria("");
        setDescricao("");
        setValor("");
        setDataCompra(format(new Date(), "yyyy-MM-dd"));
        setFornecedor("");
        setGarantiaMeses("");
        setObservacoes("");
      }
    } catch (error) {
      console.error("Erro ao salvar investimento:", error);
    } finally {
      setLoading(false);
    }
  };

  const subcategorias = categoria ? CATEGORIAS_INVESTIMENTOS[categoria] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Editar" : "Registrar"} Investimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={(value) => {
                setCategoria(value as CategoriaInvestimento);
                setSubcategoria(""); // Reset subcategoria when categoria changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORIAS_INVESTIMENTOS).map((cat) => (
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o investimento em detalhes"
                required
              />
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
              <Label htmlFor="data_compra">Data da Compra</Label>
              <Input
                id="data_compra"
                type="date"
                value={dataCompra}
                onChange={(e) => setDataCompra(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor (opcional)</Label>
              <Input
                id="fornecedor"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                placeholder="Nome do fornecedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="garantia_meses">Garantia (meses)</Label>
              <Input
                id="garantia_meses"
                type="number"
                min="0"
                value={garantiaMeses}
                onChange={(e) => setGarantiaMeses(e.target.value)}
                placeholder="Período de garantia em meses"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais sobre o investimento..."
            />
          </div>

          <Button type="submit" disabled={loading || !categoria || !subcategoria || !descricao || !valor}>
            {loading ? "Salvando..." : isEdit ? "Atualizar" : "Registrar Investimento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}