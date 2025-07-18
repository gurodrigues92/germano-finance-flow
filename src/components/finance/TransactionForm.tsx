import React from 'react';
import { Transaction } from '@/types/finance';
import { TransactionFormFields } from './TransactionFormFields';
import { CustomRatesSection } from './CustomRatesSection';
import { TransactionPreview } from './TransactionPreview';
import { TransactionFormDialog } from './TransactionFormDialog';
import { SaveChangesButton } from './SaveChangesButton';
import { TaxaCard } from './TaxaCard';
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
    hasChanges,
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
        <>
          <TransactionPreview calculations={calculations} />
          
          {/* Tax breakdown cards */}
          <div className="space-y-2 mt-4">
            <TaxaCard
              taxaName="Débito"
              percentage={1.61}
              baseValue={parseFloat(formData.debito) || 0}
              taxaValue={calculations.taxaDebito}
              type="debito"
            />
            <TaxaCard
              taxaName="Crédito"
              percentage={3.51}
              baseValue={parseFloat(formData.credito) || 0}
              taxaValue={calculations.taxaCredito}
              type="credito"
            />
          </div>
        </>
      )}

      {/* Floating save button */}
      <SaveChangesButton
        hasChanges={hasChanges}
        onSave={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
        loading={loading}
      />
    </TransactionFormDialog>
  );
};