import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={editingTransaction ? 'Editar Transação' : 'Nova Transação'}
      className="max-w-[600px]"
    >
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        {isMobile ? (
          // Mobile: Use native scrolling for better keyboard handling
          <div className="flex-1 overflow-y-auto">
            <div className={cn("space-y-6 pb-4", isMobile && "space-y-4")}>
              {children}
            </div>
          </div>
        ) : (
          // Desktop: Use ScrollArea
          <ScrollArea className="flex-1">
            <div className="space-y-8 p-1">
              {children}
            </div>
          </ScrollArea>
        )}

        {/* Fixed bottom action bar */}
        <div className={cn(
          "sticky bottom-0 bg-background border-t space-y-4 shrink-0",
          isMobile ? "p-4 space-y-3" : "p-6 space-y-4"
        )}>
          <Button 
            type="submit"
            disabled={loading} 
            size="lg"
            className={cn(
              "w-full font-medium",
              isMobile ? "h-12 text-base" : "h-14 text-lg"
            )}
          >
            {loading ? 'Salvando...' : (editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className={cn(
              "w-full",
              isMobile ? "h-10 text-sm" : "h-12 text-base"
            )}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
};