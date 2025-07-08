import React, { useState } from 'react';
import { Transaction } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Settings } from 'lucide-react';
import { NOMENCLATURE } from '@/lib/finance/nomenclature';
import { CustomRates } from '@/lib/finance/calculations';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
  useCustomRates: boolean;
  customRates?: CustomRates;
}

interface TransactionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTransaction: Transaction | null;
  onSubmit: (data: TransactionFormData, isEditing: boolean) => void;
  loading: boolean;
}

export const TransactionForm = ({ 
  isOpen, 
  onOpenChange, 
  editingTransaction, 
  onSubmit, 
  loading 
}: TransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    dinheiro: '',
    pix: '',
    debito: '',
    credito: '',
    useCustomRates: false
  });

  // Cálculo em tempo real dos valores
  const previewCalculation = () => {
    const dinheiro = parseFloat(formData.dinheiro) || 0;
    const pix = parseFloat(formData.pix) || 0;
    const debito = parseFloat(formData.debito) || 0;
    const credito = parseFloat(formData.credito) || 0;
    
    const totalBruto = dinheiro + pix + debito + credito;
    const taxaDebito = debito * 0.0161;
    const taxaCredito = credito * 0.0351;
    const totalLiquido = totalBruto - taxaDebito - taxaCredito;
    
    // Usar taxas customizadas se definidas, senão usar padrão
    const studioRate = formData.useCustomRates && formData.customRates 
      ? formData.customRates.studioRate / 100 
      : 0.6;
    const eduRate = formData.useCustomRates && formData.customRates 
      ? formData.customRates.eduRate / 100 
      : 0.4; 
    const kamRate = formData.useCustomRates && formData.customRates 
      ? formData.customRates.kamRate / 100 
      : 0.1;
    
    return {
      totalBruto,
      taxaDebito,
      taxaCredito,
      totalLiquido,
      studioShare: totalLiquido * studioRate,
      eduShare: totalLiquido * eduRate,
      kamShare: totalLiquido * kamRate,
      studioRate: studioRate * 100,
      eduRate: eduRate * 100,
      kamRate: kamRate * 100
    };
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      dinheiro: '',
      pix: '',
      debito: '',
      credito: '',
      useCustomRates: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, !!editingTransaction);
    resetForm();
    onOpenChange(false);
  };

  // Set form data when editing
  React.useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        dinheiro: editingTransaction.dinheiro.toString(),
        pix: editingTransaction.pix.toString(),
        debito: editingTransaction.debito.toString(),
        credito: editingTransaction.credito.toString(),
        useCustomRates: !!editingTransaction.customRates,
        customRates: editingTransaction.customRates
      });
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
              className="text-lg p-3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dinheiro">Dinheiro (R$)</Label>
              <Input
                id="dinheiro"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.dinheiro}
                onChange={(e) => setFormData(prev => ({ ...prev, dinheiro: e.target.value }))}
                className="text-lg p-3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pix">PIX (R$)</Label>
              <Input
                id="pix"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.pix}
                onChange={(e) => setFormData(prev => ({ ...prev, pix: e.target.value }))}
                className="text-lg p-3"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debito">Débito (R$)</Label>
              <Input
                id="debito"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.debito}
                onChange={(e) => setFormData(prev => ({ ...prev, debito: e.target.value }))}
                className="text-lg p-3"
              />
              <p className="text-xs text-muted-foreground">Taxa: 1,61%</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credito">Crédito (R$)</Label>
              <Input
                id="credito"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.credito}
                onChange={(e) => setFormData(prev => ({ ...prev, credito: e.target.value }))}
                className="text-lg p-3"
              />
              <p className="text-xs text-muted-foreground">Taxa: 3,51%</p>
            </div>
          </div>

          {/* Seção de Distribuição */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="customRates" className="text-sm font-medium">
                  Distribuição Personalizada
                </Label>
                <p className="text-xs text-muted-foreground">
                  Por padrão: Studio 60%, {NOMENCLATURE.PROFISSIONAL_LABEL} 40%, {NOMENCLATURE.ASSISTENTE_LABEL} 10%
                </p>
              </div>
              <Switch
                id="customRates"
                checked={formData.useCustomRates}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    useCustomRates: checked,
                    customRates: checked ? { studioRate: 60, eduRate: 40, kamRate: 10 } : undefined
                  }))
                }
              />
            </div>

            {/* Campos de taxas customizadas */}
            {formData.useCustomRates && (
              <div className="space-y-3 bg-muted/20 rounded-lg p-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Definir Taxas Personalizadas
                </h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Studio (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.customRates?.studioRate || 60}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          customRates: {
                            ...prev.customRates!,
                            studioRate: value
                          }
                        }));
                      }}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">{NOMENCLATURE.PROFISSIONAL_LABEL} (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.customRates?.eduRate || 40}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          customRates: {
                            ...prev.customRates!,
                            eduRate: value
                          }
                        }));
                      }}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">{NOMENCLATURE.ASSISTENTE_LABEL} (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={formData.customRates?.kamRate || 10}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setFormData(prev => ({
                          ...prev,
                          customRates: {
                            ...prev.customRates!,
                            kamRate: value
                          }
                        }));
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                {/* Validação das taxas */}
                {formData.customRates && (
                  <div className="text-xs">
                    {(() => {
                      const total = (formData.customRates.studioRate || 0) + 
                                    (formData.customRates.eduRate || 0) + 
                                    (formData.customRates.kamRate || 0);
                      if (total === 100) {
                        return <span className="text-green-600">✓ Total: 100% (válido)</span>;
                      } else {
                        return <span className="text-destructive">⚠ Total: {total}% (deve somar 100%)</span>;
                      }
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview dos cálculos */}
          {(formData.dinheiro || formData.pix || formData.debito || formData.credito) && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">Preview dos Cálculos:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Bruto:</span>
                  <span className="ml-2 font-medium text-finance-income">
                    {previewCalculation().totalBruto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Líquido:</span>
                  <span className="ml-2 font-medium text-finance-net">
                    {previewCalculation().totalLiquido.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Studio ({previewCalculation().studioRate.toFixed(0)}%):</span>
                  <span className="ml-2 font-medium text-finance-studio">
                    {previewCalculation().studioShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{NOMENCLATURE.PROFISSIONAL_LABEL} ({previewCalculation().eduRate.toFixed(0)}%):</span>
                  <span className="ml-2 font-medium text-finance-edu">
                    {previewCalculation().eduShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{NOMENCLATURE.ASSISTENTE_LABEL} ({previewCalculation().kamRate.toFixed(0)}%):</span>
                  <span className="ml-2 font-medium text-finance-kam">
                    {previewCalculation().kamShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 text-lg py-3">
              {editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};