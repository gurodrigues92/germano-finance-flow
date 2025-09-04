import { useState, useEffect } from 'react';
import { Transaction } from '@/types/finance';
import { getLocalDateString, formatDateForInput } from '@/lib/dateUtils';

export interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
  profissionalId: string;
  temAssistente: boolean;
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
    profissionalId: '',
    temAssistente: false
  });

  const [initialFormData, setInitialFormData] = useState<TransactionFormData | null>(null);

  const resetForm = () => {
    setFormData({
      date: getLocalDateString(),
      dinheiro: '',
      pix: '',
      debito: '',
      credito: '',
      profissionalId: '',
      temAssistente: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[TransactionForm] Iniciando submit com dados:', formData);
    
    // Validar se há pelo menos um valor
    const hasValues = formData.dinheiro || formData.pix || formData.debito || formData.credito;
    if (!hasValues) {
      console.log('[TransactionForm] Erro: Nenhum valor informado');
      alert('Informe pelo menos um valor para a transação.');
      return;
    }
    
    // Validar data usando getCurrentBrazilDate para consistência
    try {
      if (!formData.date || !formData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.log('[TransactionForm] Erro: Data inválida');
        alert('Data inválida. Por favor, selecione uma data válida.');
        return;
      }
      
      const selectedDate = new Date(formData.date + 'T12:00:00'); // Use meio-dia para evitar problemas de timezone
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (selectedDate > today) {
        console.log('[TransactionForm] Erro: Data futura selecionada');
        alert('A data não pode ser futura. Por favor, selecione uma data válida.');
        return;
      }
    } catch (error) {
      console.error('[TransactionForm] Erro na validação de data:', error);
      alert('Data inválida. Por favor, selecione uma data válida.');
      return;
    }
    
    console.log('[TransactionForm] Validações passaram, chamando onSubmit');
    onSubmit(formData, !!editingTransaction);
    
    if (!editingTransaction) {
      resetForm();
    }
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
        profissionalId: editingTransaction.profissionalId || '',
        temAssistente: editingTransaction.temAssistente || false
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
        profissionalId: '',
        temAssistente: false
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
    resetForm
  };
};