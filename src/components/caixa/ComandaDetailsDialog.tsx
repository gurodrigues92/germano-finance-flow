import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Comanda, ComandaItem } from '@/types/salon';
import { useComandas } from '@/hooks/salon/useComandas';
import { AddItemDialog } from './AddItemDialog';
import { PaymentDialog } from './PaymentDialog';
import { formatCurrency } from '@/lib/formatUtils';
import { Plus, Trash2, Receipt, CreditCard, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ComandaDetailsDialogProps {
  comanda: Comanda | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComandaDetailsDialog = ({
  comanda,
  isOpen,
  onOpenChange
}: ComandaDetailsDialogProps) => {
  const { removeItemComanda, aplicarDesconto, fecharComanda } = useComandas();
  const [itens, setItens] = useState<ComandaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [desconto, setDesconto] = useState(0);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Carregar itens da comanda
  const loadItens = async () => {
    if (!comanda) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comanda_itens')
        .select('*')
        .eq('comanda_id', comanda.id)
        .order('created_at');

      if (error) throw error;
      setItens((data as ComandaItem[]) || []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (comanda && isOpen) {
      loadItens();
      setDesconto(comanda.desconto);
    }
  }, [comanda, isOpen]);

  const handleRemoveItem = async (itemId: string) => {
    if (!comanda) return;
    
    try {
      await removeItemComanda(itemId, comanda.id);
      await loadItens();
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const handleApplyDesconto = async () => {
    if (!comanda) return;
    
    try {
      await aplicarDesconto(comanda.id, desconto);
    } catch (error) {
      console.error('Erro ao aplicar desconto:', error);
    }
  };

  const handleItemAdded = () => {
    loadItens();
    setShowAddItem(false);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    onOpenChange(false);
  };

  if (!comanda) return null;

  const totalItens = itens.reduce((sum, item) => sum + Number(item.valor_total), 0);
  const totalLiquido = totalItens - desconto;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Comanda #{comanda.numero_comanda}
              <Badge variant={comanda.status === 'aberta' ? 'default' : 'secondary'}>
                {comanda.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações da Comanda */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Cliente</Label>
                    <p className="text-sm text-muted-foreground">
                      {comanda.cliente?.nome || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Profissional</Label>
                    <p className="text-sm text-muted-foreground">
                      {comanda.profissional_principal?.nome || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Abertura</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comanda.data_abertura).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Totais */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Totais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(totalItens, true)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="desconto">Desconto</Label>
                    <div className="flex gap-2">
                      <Input
                        id="desconto"
                        type="number"
                        step="0.01"
                        value={desconto}
                        onChange={(e) => setDesconto(Number(e.target.value))}
                        placeholder="0,00"
                      />
                      <Button 
                        size="sm" 
                        onClick={handleApplyDesconto}
                        disabled={comanda.status !== 'aberta'}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(totalLiquido, true)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              {comanda.status === 'aberta' && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowAddItem(true)} 
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                  
                  <Button 
                    onClick={() => setShowPayment(true)} 
                    className="w-full"
                    disabled={totalLiquido <= 0}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Finalizar Pagamento
                  </Button>
                </div>
              )}
            </div>

            {/* Lista de Itens */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Itens da Comanda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {loading ? (
                      <p className="text-center py-4">Carregando itens...</p>
                    ) : itens.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum item adicionado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {itens.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {item.tipo === 'servico' ? 'Serviço' : 'Produto'}
                                </Badge>
                                <span className="font-medium">{item.nome_item}</span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.quantidade}x {formatCurrency(item.valor_unitario, true)} = {formatCurrency(item.valor_total, true)}
                              </div>
                            </div>
                            
                            {comanda.status === 'aberta' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddItemDialog
        isOpen={showAddItem}
        onOpenChange={setShowAddItem}
        comandaId={comanda.id}
        onItemAdded={handleItemAdded}
      />

      <PaymentDialog
        isOpen={showPayment}
        onOpenChange={setShowPayment}
        comanda={comanda}
        totalValue={totalLiquido}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};