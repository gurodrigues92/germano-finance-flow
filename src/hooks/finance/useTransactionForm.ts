import { useState, useEffect } from 'react';
import { Transaction } from '@/types/finance';
import { CustomRates } from '@/lib/finance/calculations';
import { getLocalDateString, formatDateForInput } from '@/lib/dateUtils';

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
    date: getLocalDateString(),
    dinheiro: '',
    pix: '',
    debito: '',
    credito: '',
    useCustomRates: false
  });

  const [initialFormData, setInitialFormData] = useState<TransactionFormData | null>(null);

  const resetForm = () => {
    setFormData({
      date: getLocalDateString(),
      dinheiro: '',
      pix: '',
      debito: '',
      credito: '',
      useCustomRates: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar data não pode ser futura
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    
    if (selectedDate > today) {
      alert('A data não pode ser futura. Por favor, selecione uma data válida.');
      return;
    }
    
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
        kamRate: 10
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
      const editingData = {
        date: formatDateForInput(editingTransaction.date),
        dinheiro: editingTransaction.dinheiro.toString(),
        pix: editingTransaction.pix.toString(),
        debito: editingTransaction.debito.toString(),
        credito: editingTransaction.credito.toString(),
        useCustomRates: !!editingTransaction.customRates,
        customRates: editingTransaction.customRates
      };
      setFormData(editingData);
      setInitialFormData(editingData);
    } else {
      const defaultData = {
        date: getLocalDateString(),
        dinheiro: '',
        pix: '',
        debito: '',
        credito: '',
        useCustomRates: false
      };
      setFormData(defaultData);
      setInitialFormData(defaultData);
    }
  }, [editingTransaction]);

  const hasValues = formData.dinheiro || formData.pix || formData.debito || formData.credito;
  
  // Check if form has changes from initial state
  const hasChanges = initialFormData && JSON.stringify(formData) !== JSON.stringify(initialFormData);

  return {
    formData,
    setFormData,
    hasValues,
    hasChanges: !!hasChanges,
    handleSubmit,
    handleToggleCustomRates,
    handleUpdateCustomRates,
    resetForm
  };
};