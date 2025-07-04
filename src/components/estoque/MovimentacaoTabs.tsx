import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovimentacaoInput, Produto, MOTIVOS_SAIDA } from "@/types/estoque";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MovimentacaoTabsProps {
  produtos: Produto[];
  onSubmit: (movimentacao: MovimentacaoInput) => Promise<any>;
}

export function MovimentacaoTabs({ produtos, onSubmit }: MovimentacaoTabsProps) {
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [dataMovimentacao, setDataMovimentacao] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (tipo: 'entrada' | 'saida') => {
    if (!produtoId || !quantidade) return;

    setLoading(true);
    try {
      await onSubmit({
        produto_id: produtoId,
        tipo,
        quantidade: parseInt(quantidade),
        motivo: motivo || undefined,
        fornecedor: tipo === 'entrada' ? fornecedor || undefined : undefined,
        valor_total: valorTotal ? parseFloat(valorTotal) : undefined,
        data_movimentacao: dataMovimentacao,
      });
      
      // Reset form
      setQuantidade("");
      setMotivo("");
      setFornecedor("");
      setValorTotal("");
    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
    } finally {
      setLoading(false);
    }
  };

  const produtoSelecionado = produtos.find(p => p.id === produtoId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimentação de Estoque</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Seleção do Produto e Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="produto">Produto</Label>
            <Select value={produtoId} onValueChange={setProdutoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id}>
                    {produto.nome} ({produto.estoque_atual} {produto.unidade_medida})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_movimentacao">Data da Movimentação</Label>
            <Input
              id="data_movimentacao"
              type="date"
              value={dataMovimentacao}
              onChange={(e) => setDataMovimentacao(e.target.value)}
              required
            />
          </div>
        </div>

        {produtoSelecionado && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Estoque atual:</strong> {produtoSelecionado.estoque_atual} {produtoSelecionado.unidade_medida} | 
              <strong> Estoque mínimo:</strong> {produtoSelecionado.estoque_minimo} {produtoSelecionado.unidade_medida}
            </p>
          </div>
        )}

        <Tabs defaultValue="entrada" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entrada" className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              Entrada
            </TabsTrigger>
            <TabsTrigger value="saida" className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              Saída
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entrada" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade_entrada">Quantidade</Label>
                <Input
                  id="quantidade_entrada"
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="Quantidade a receber"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="valor_total_entrada">Valor Total (R$)</Label>
                <Input
                  id="valor_total_entrada"
                  type="number"
                  step="0.01"
                  min="0"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  placeholder="Valor total da compra"
                />
              </div>
            </div>

            <Button
              onClick={() => handleSubmit('entrada')}
              disabled={loading || !produtoId || !quantidade}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Registrando..." : "Registrar Entrada"}
            </Button>
          </TabsContent>

          <TabsContent value="saida" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade_saida">Quantidade</Label>
                <Input
                  id="quantidade_saida"
                  type="number"
                  min="1"
                  max={produtoSelecionado?.estoque_atual || undefined}
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="Quantidade a retirar"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo_saida">Motivo da Saída</Label>
                <Select value={motivo} onValueChange={setMotivo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTIVOS_SAIDA.map((mot) => (
                      <SelectItem key={mot} value={mot}>
                        {mot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => handleSubmit('saida')}
              disabled={loading || !produtoId || !quantidade}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Registrando..." : "Registrar Saída"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}