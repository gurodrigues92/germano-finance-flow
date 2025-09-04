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
      className="max-w-[600px]"
    >
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="space-y-8 p-1">
            {children}
          </div>
        </ScrollArea>

        {/* Fixed bottom action bar */}
        <div className="sticky bottom-0 bg-background border-t p-6 space-y-4">
          <Button 
            type="submit"
            disabled={loading} 
            size="lg"
            className="w-full h-14 text-lg font-medium"
          >
            {loading ? 'Salvando...' : (editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full h-12 text-base"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
};