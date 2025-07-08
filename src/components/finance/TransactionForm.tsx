import React from 'react';
import { Transaction } from '@/types/finance';
import { TransactionFormFields } from './TransactionFormFields';
import { CustomRatesSection } from './CustomRatesSection';
import { TransactionPreview } from './TransactionPreview';
import { TransactionFormDialog } from './TransactionFormDialog';
import { useTransactionForm, TransactionFormData } from '@/hooks/finance/useTransactionForm';
import { calculateTransactionPreview } from '@/lib/finance/transactionCalculations';

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
  const {
    formData,
    setFormData,
    hasValues,
    handleSubmit,
    handleToggleCustomRates,
    handleUpdateCustomRates
  } = useTransactionForm({ editingTransaction, onSubmit, onOpenChange });

  const calculations = calculateTransactionPreview(
    formData.dinheiro,
    formData.pix,
    formData.debito,
    formData.credito,
    formData.useCustomRates,
    formData.customRates
  );

  return (
    <TransactionFormDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      editingTransaction={editingTransaction}
      loading={loading}
      onSubmit={handleSubmit}
    >
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
        <TransactionPreview calculations={calculations} />
      )}
    </TransactionFormDialog>
  );
};