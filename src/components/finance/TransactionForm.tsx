import React, { useState } from 'react';
import { Transaction } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomRates } from '@/lib/finance/calculations';
import { TransactionFormFields } from './TransactionFormFields';
import { CustomRatesSection } from './CustomRatesSection';
import { TransactionPreview } from './TransactionPreview';

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
    
    const studioShare = totalLiquido * studioRate;
    const eduShare = totalLiquido * eduRate;
    const kamShare = eduShare * kamRate; // KAM recebe 10% do valor do EDU
    
    return {
      totalBruto,
      taxaDebito,
      taxaCredito,
      totalLiquido,
      studioShare,
      eduShare,
      kamShare,
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

  const handleToggleCustomRates = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      useCustomRates: checked,
      customRates: checked ? { studioRate: 60, eduRate: 40, kamRate: 10 } : undefined
    }));
  };

  const handleUpdateCustomRates = (rates: CustomRates) => {
    setFormData(prev => ({
      ...prev,
      customRates: rates
    }));
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

  const hasValues = formData.dinheiro || formData.pix || formData.debito || formData.credito;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <DialogTitle className="text-lg sm:text-xl">
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pb-4">
            <TransactionFormFields 
              formData={formData}
              setFormData={setFormData}
            />

            <CustomRatesSection
              useCustomRates={formData.useCustomRates}
              customRates={formData.customRates}
              onToggleCustomRates={handleToggleCustomRates}
              onUpdateCustomRates={handleUpdateCustomRates}
            />

            {hasValues && (
              <TransactionPreview calculations={previewCalculation()} />
            )}
          </form>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 pt-2 border-t bg-background">
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={loading} 
            className="flex-1 text-base sm:text-lg py-2 sm:py-3"
          >
            {editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="px-4 sm:px-6"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};