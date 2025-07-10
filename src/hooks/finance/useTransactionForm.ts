import { useState, useEffect } from 'react';
import { Transaction } from '@/types/finance';
import { CustomRates } from '@/lib/finance/calculations';

export interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
  useCustomRates: boolean;
  customRates?: CustomRates;
}

interface UseTransactionFormProps {
  editingTransaction: Transaction | null;
  onSubmit: (data: TransactionFormData, isEditing: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const useTransactionForm = ({ 
  editingTransaction, 
  onSubmit, 
  onOpenChange 
}: UseTransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    dinheiro: '',
    pix: '',
    debito: '',
    credito: '',
    useCustomRates: false
  });

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
      customRates: checked ? { 
        studioRate: 60, 
        eduRate: 40, 
        kamRate: 10,
        assistenteCalculationMode: 'percentage_of_profissional'
      } : undefined
    }));
  };

  const handleUpdateCustomRates = (rates: CustomRates) => {
    setFormData(prev => ({
      ...prev,
      customRates: rates
    }));
  };

  // Set form data when editing
  useEffect(() => {
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

  return {
    formData,
    setFormData,
    hasValues,
    handleSubmit,
    handleToggleCustomRates,
    handleUpdateCustomRates,
    resetForm
  };
};