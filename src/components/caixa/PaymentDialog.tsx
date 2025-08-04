import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Comanda } from '@/types/salon';
import { useComandas } from '@/hooks/salon/useComandas';
import { formatCurrency } from '@/lib/formatUtils';
import { CreditCard, Banknote, Smartphone, Receipt } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  comanda: Comanda;
  totalValue: number;
  onPaymentComplete: () => void;
}

export const PaymentDialog = ({
  isOpen,
  onOpenChange,
  comanda,
  totalValue,
  onPaymentComplete
}: PaymentDialogProps) => {
  const { fecharComanda } = useComandas();
  const [loading, setLoading] = useState(false);
  const [metodsPagamento, setMetodosPagamento] = useState({
    dinheiro: 0,
    pix: 0,
    debito: 0,
    credito: 0
  });

  const totalPagamentos = Object.values(metodsPagamento).reduce((sum, valor) => sum + valor, 0);
  const diferenca = totalPagamentos - totalValue;
  const troco = diferenca > 0 ? diferenca : 0;
  const faltante = diferenca < 0 ? Math.abs(diferenca) : 0;

  const handleMetodoChange = (metodo: keyof typeof metodsPagamento, valor: string) => {
    setMetodosPagamento(prev => ({
      ...prev,
      [metodo]: Number(valor) || 0
    }));
  };

  const handleQuickFill = (metodo: keyof typeof metodsPagamento) => {
    setMetodosPagamento({
      dinheiro: 0,
      pix: 0,
      debito: 0,
      credito: 0,
      [metodo]: totalValue
    });
  };

  const handleFinalizarPagamento = async () => {
    if (Math.abs(totalPagamentos - totalValue) > 0.01) {
      alert('O total dos pagamentos deve ser igual ao valor da comanda');
      return;
    }

    setLoading(true);
    try {
      await fecharComanda(comanda.id, metodsPagamento);
      onPaymentComplete();
    } catch (error) {
      console.error('Erro ao finalizar pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setMetodosPagamento({
      dinheiro: 0,
      pix: 0,
      debito: 0,
      credito: 0
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Finalizar Pagamento - Comanda #{comanda.numero_comanda}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Comanda */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumo da Comanda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span>{comanda.cliente?.nome || 'Não informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profissional:</span>
                  <span>{comanda.profissional_principal?.nome || 'Não informado'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total a Pagar:</span>
                  <span className="text-primary">{formatCurrency(totalValue, true)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métodos de Pagamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dinheiro */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Dinheiro
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFill('dinheiro')}
                  >
                    Pagar tudo
                  </Button>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={metodsPagamento.dinheiro || ''}
                  onChange={(e) => handleMetodoChange('dinheiro', e.target.value)}
                />
              </div>

              {/* PIX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    PIX
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFill('pix')}
                  >
                    Pagar tudo
                  </Button>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={metodsPagamento.pix || ''}
                  onChange={(e) => handleMetodoChange('pix', e.target.value)}
                />
              </div>

              {/* Débito */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Cartão de Débito
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFill('debito')}
                  >
                    Pagar tudo
                  </Button>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={metodsPagamento.debito || ''}
                  onChange={(e) => handleMetodoChange('debito', e.target.value)}
                />
              </div>

              {/* Crédito */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickFill('credito')}
                  >
                    Pagar tudo
                  </Button>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={metodsPagamento.credito || ''}
                  onChange={(e) => handleMetodoChange('credito', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo do Pagamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumo do Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total da Comanda:</span>
                  <span>{formatCurrency(totalValue, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Recebido:</span>
                  <span>{formatCurrency(totalPagamentos, true)}</span>
                </div>
                <Separator />
                {faltante > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Faltante:</span>
                    <span>{formatCurrency(faltante, true)}</span>
                  </div>
                )}
                {troco > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Troco:</span>
                    <span>{formatCurrency(troco, true)}</span>
                  </div>
                )}
                {Math.abs(diferenca) < 0.01 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>✓ Valores conferem!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFinalizarPagamento}
              disabled={loading || Math.abs(totalPagamentos - totalValue) > 0.01}
              className="flex-1"
            >
              {loading ? 'Processando...' : 'Finalizar Pagamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};