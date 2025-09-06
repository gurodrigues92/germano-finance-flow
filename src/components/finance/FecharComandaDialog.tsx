import React, { useState, useEffect } from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/formatUtils';
import { calculateTransactionPreview } from '@/lib/finance/transactionCalculations';
import { Receipt, DollarSign, CreditCard, Smartphone, Banknote, TrendingUp } from 'lucide-react';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { formatDateDisplay } from '@/lib/dateUtils';

interface FecharComandaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  comanda: Transaction | null;
  onFecharComanda: (comandaId: string, metodosPagamento: any) => void;
  loading?: boolean;
}

export const FecharComandaDialog = ({ 
  isOpen, 
  onOpenChange, 
  comanda,
  onFecharComanda,
  loading = false 
}: FecharComandaDialogProps) => {
  const [dinheiro, setDinheiro] = useState('');
  const [pix, setPix] = useState('');
  const [debito, setDebito] = useState('');
  const [credito, setCredito] = useState('');

  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();

  // Resetar form quando abrir/fechar dialog
  useEffect(() => {
    if (isOpen && comanda) {
      // Pre-preencher com o valor total da comanda
      setDinheiro(comanda.totalBruto.toString());
      setPix('');
      setDebito('');
      setCredito('');
    } else {
      setDinheiro('');
      setPix('');
      setDebito('');
      setCredito('');
    }
  }, [isOpen, comanda]);

  if (!comanda) return null;

  const cliente = clientes.find(c => c.id === comanda.clienteId);
  const profissional = profissionais.find(p => p.id === comanda.profissionalId);

  // Calcular preview dos pagamentos
  const calculationResult = calculateTransactionPreview(
    dinheiro,
    pix,
    debito,
    credito,
    false // não usar taxas customizadas por enquanto
  );

  const totalPagamento = calculationResult.totalBruto;
  const diferencaPagamento = totalPagamento - comanda.totalBruto;

  const handleSubmit = async () => {
    const metodosPagamento = {
      dinheiro: parseFloat(dinheiro) || 0,
      pix: parseFloat(pix) || 0,
      debito: parseFloat(debito) || 0,
      credito: parseFloat(credito) || 0
    };

    await onFecharComanda(comanda.id, metodosPagamento);
    onOpenChange(false);
  };

  const isFormValid = totalPagamento > 0 && Math.abs(diferencaPagamento) < 0.01;

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Fechar Comanda"
      className="max-w-[500px]"
    >
      <div className="px-4 sm:px-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pb-4">
        {/* Informações da Comanda */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detalhes da Comanda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cliente:</span>
              <span className="font-medium">{cliente?.nome || 'Não informado'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Profissional:</span>
              <span className="font-medium">{profissional?.nome || 'Não informado'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Data:</span>
              <span className="font-medium">{formatDateDisplay(comanda.date)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total da Comanda:</span>
              <span className="text-primary">{formatCurrency(comanda.totalBruto)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dinheiro" className="flex items-center gap-2 text-sm">
                  <Banknote className="h-4 w-4" />
                  Dinheiro
                </Label>
                <Input
                  id="dinheiro"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={dinheiro}
                  onChange={(e) => setDinheiro(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pix" className="flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4" />
                  PIX
                </Label>
                <Input
                  id="pix"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={pix}
                  onChange={(e) => setPix(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debito" className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Débito
                </Label>
                <Input
                  id="debito"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={debito}
                  onChange={(e) => setDebito(e.target.value)}
                />
                <div className="text-xs text-muted-foreground">Taxa: 1,61%</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credito" className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Crédito
                </Label>
                <Input
                  id="credito"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={credito}
                  onChange={(e) => setCredito(e.target.value)}
                />
                <div className="text-xs text-muted-foreground">Taxa: 3,51%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo do Pagamento */}
        <Card className={`${diferencaPagamento === 0 ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800'}`}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Pagamento:</span>
              <span className="font-medium">{formatCurrency(totalPagamento)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Comanda:</span>
              <span className="font-medium">{formatCurrency(comanda.totalBruto)}</span>
            </div>
            <div className={`flex justify-between text-base font-bold border-t pt-2 ${
              diferencaPagamento === 0 ? 'text-green-600' : 
              diferencaPagamento > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              <span>Diferença:</span>
              <span>{formatCurrency(diferencaPagamento)}</span>
            </div>
            {Math.abs(diferencaPagamento) > 0.01 && (
              <div className="text-xs text-muted-foreground text-center">
                {diferencaPagamento > 0 ? 'Valor excedente' : 'Falta receber'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview dos Cálculos */}
        {totalPagamento > 0 && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Cálculos Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Bruto:</span>
                <span>{formatCurrency(calculationResult.totalBruto)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxas:</span>
                <span>-{formatCurrency(calculationResult.taxaDebito + calculationResult.taxaCredito)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Líquido:</span>
                <span>{formatCurrency(calculationResult.totalLiquido)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Studio (60%):</span>
                <span>{formatCurrency(calculationResult.studioShare)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Eduardo (40%):</span>
                <span>{formatCurrency(calculationResult.eduShare)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Kamlley (4%):</span>
                <span>{formatCurrency(calculationResult.kamShare)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-2 p-4 sm:p-6 pt-2 border-t bg-background">
        <Button 
          onClick={handleSubmit}
          disabled={loading || !isFormValid} 
          className="flex-1 text-base sm:text-lg py-2 sm:py-3"
        >
          {loading ? 'Fechando...' : 'Fechar Comanda'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="px-4 sm:px-6"
        >
          Cancelar
        </Button>
      </div>
    </ResponsiveDialog>
  );
};