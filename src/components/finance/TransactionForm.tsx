import React, { useState } from 'react';
import { Transaction } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
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
    credito: ''
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
    
    return {
      totalBruto,
      taxaDebito,
      taxaCredito,
      totalLiquido,
      studioShare: totalLiquido * 0.6,
      eduShare: totalLiquido * 0.4,
      kamShare: totalLiquido * 0.1
    };
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      dinheiro: '',
      pix: '',
      debito: '',
      credito: ''
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
        credito: editingTransaction.credito.toString()
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
                  <span className="text-muted-foreground">Studio (60%):</span>
                  <span className="ml-2 font-medium text-finance-studio">
                    {previewCalculation().studioShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Edu (40%):</span>
                  <span className="ml-2 font-medium text-finance-edu">
                    {previewCalculation().eduShare.toLocaleString('pt-BR', {
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