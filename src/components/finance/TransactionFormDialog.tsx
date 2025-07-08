import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <DialogTitle className="text-lg sm:text-xl">
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] px-4 sm:px-6">
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 pb-4">
            {children}
          </form>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 pt-2 border-t bg-background">
          <Button 
            type="button"
            onClick={onSubmit}
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