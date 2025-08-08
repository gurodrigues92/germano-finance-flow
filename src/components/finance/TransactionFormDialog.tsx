import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';

interface TransactionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTransaction: Transaction | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const TransactionFormDialog = ({
  isOpen,
  onOpenChange,
  editingTransaction,
  loading,
  onSubmit,
  children
}: TransactionFormDialogProps) => {
  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      className="max-w-[500px]"
    >
      <ScrollArea className="max-h-[calc(90vh-120px)] px-4 sm:px-6">
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 pb-4">
          {children}
        </form>
      </ScrollArea>

      <div className="flex gap-2 p-4 sm:p-6 pt-2 border-t bg-background">
        <Button 
          type="submit"
          disabled={loading} 
          className="flex-1 text-base sm:text-lg py-2 sm:py-3"
        >
          {loading ? 'Salvando...' : (editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação')}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="px-4 sm:px-6"
        >
          Cancelar
        </Button>
      </div>
    </ResponsiveDialog>
  );
};