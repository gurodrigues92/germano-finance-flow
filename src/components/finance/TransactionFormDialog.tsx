import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Transaction } from '@/types/finance';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface TransactionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTransaction: Transaction | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: (id: string) => void;
  children: React.ReactNode;
}

export const TransactionFormDialog = ({
  isOpen,
  onOpenChange,
  editingTransaction,
  loading,
  onSubmit,
  onDelete,
  children
}: TransactionFormDialogProps) => {
  const isMobile = useIsMobile();
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  
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
          <div className={cn("flex gap-3", isMobile ? "flex-col gap-3" : "items-center")}>
            <Button 
              type="submit"
              disabled={loading}
              size={isMobile ? "xl" : "lg"}
              className={cn(
                "flex-1 font-semibold shadow-md hover:shadow-lg",
                isMobile && "order-1"
              )}
            >
              {loading ? "Salvando..." : editingTransaction ? "Atualizar Transação" : "Adicionar Transação"}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              size={isMobile ? "xl" : "lg"}
              className={cn(
                "font-medium",
                isMobile ? "order-3" : "min-w-[120px]"
              )}
            >
              Cancelar
            </Button>

            {editingTransaction && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size={isMobile ? "xl" : "lg"}
                    disabled={loading}
                    className={cn(
                      "text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 font-medium",
                      isMobile ? "order-2" : "min-w-[120px]"
                    )}
                  >
                    <Trash2 className={cn("h-4 w-4", !isMobile && "mr-2")} />
                    {!isMobile && "Excluir"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta transação de {formatCurrency(editingTransaction.totalBruto)}? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onDelete(editingTransaction.id);
                        onOpenChange(false);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
};