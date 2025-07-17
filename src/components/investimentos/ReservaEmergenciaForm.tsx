import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReservaEmergenciaInput } from "@/types/investimentos";
import { format } from "date-fns";
import { PiggyBank, Target } from "lucide-react";
import { DatePicker } from "@/components/finance/DatePicker";

interface ReservaEmergenciaFormProps {
  onSubmit: (reserva: ReservaEmergenciaInput) => Promise<void>;
  valorAtual?: number;
  metaAtual?: number;
  percentualMeta: number;
}

export function ReservaEmergenciaForm({ 
  onSubmit, 
  valorAtual = 0, 
  metaAtual = 0,
  percentualMeta 
}: ReservaEmergenciaFormProps) {
  const [valorReserva, setValorReserva] = useState(valorAtual.toString());
  const [metaValor, setMetaValor] = useState(metaAtual.toString());
  const [mesReferencia, setMesReferencia] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valorReserva || !metaValor) return;

    setLoading(true);
    try {
      await onSubmit({
        valor_atual: parseFloat(valorReserva),
        meta_valor: parseFloat(metaValor),
        mes_referencia: mesReferencia,
      });
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const previewValor = parseFloat(valorReserva) || 0;
  const previewMeta = parseFloat(metaValor) || 0;
  const previewPercentual = previewMeta > 0 ? (previewValor / previewMeta) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Atualizar Reserva de Emergência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valor_atual">Valor Atual na Reserva (R$)</Label>
              <Input
                id="valor_atual"
                type="number"
                step="0.01"
                min="0"
                value={valorReserva}
                onChange={(e) => setValorReserva(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_valor">Meta da Reserva (R$)</Label>
              <Input
                id="meta_valor"
                type="number"
                step="0.01"
                min="0"
                value={metaValor}
                onChange={(e) => setMetaValor(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mes_referencia">Mês de Referência</Label>
              <DatePicker
                value={mesReferencia}
                onChange={setMesReferencia}
                placeholder="Selecione o mês de referência"
              />
            </div>

            <Button type="submit" disabled={loading || !valorReserva || !metaValor}>
              {loading ? "Salvando..." : "Atualizar Reserva"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview da Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Visualização da Meta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da Meta</span>
              <span>{previewPercentual.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(previewPercentual, 100)} 
              className="h-3"
            />
          </div>

          {/* Valores */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Valor Atual:</span>
              <span className="font-bold text-lg">{formatCurrency(previewValor)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Meta:</span>
              <span className="font-bold text-lg">{formatCurrency(previewMeta)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">Falta:</span>
              <span className="font-bold text-lg text-primary">
                {formatCurrency(Math.max(0, previewMeta - previewValor))}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            {previewPercentual >= 100 ? (
              <div className="text-green-600 font-medium">
                🎉 Meta atingida! Parabéns!
              </div>
            ) : previewPercentual >= 75 ? (
              <div className="text-blue-600 font-medium">
                📈 Quase lá! Faltam apenas {(100 - previewPercentual).toFixed(1)}%
              </div>
            ) : previewPercentual >= 50 ? (
              <div className="text-orange-600 font-medium">
                💪 Metade do caminho! Continue assim!
              </div>
            ) : (
              <div className="text-gray-600 font-medium">
                🚀 Comece sua jornada para a segurança financeira!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}