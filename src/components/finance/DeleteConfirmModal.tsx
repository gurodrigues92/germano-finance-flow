import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
  loading?: boolean;
}

export const DeleteConfirmModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  count,
  loading = false
}: DeleteConfirmModalProps) => {
  const isBulkDelete = count > 1;

  const getTitle = () => {
    return isBulkDelete 
      ? `Excluir ${count} transações?`
      : 'Excluir transação?';
  };

  const getDescription = () => {
    return isBulkDelete
      ? `Você está prestes a excluir ${count} transações. Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos permanentemente.`
      : 'Você está prestes a excluir esta transação. Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos permanentemente.';
  };

  console.log('[Financeiro] DeleteConfirmModal:', { isOpen, count, isBulkDelete });

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-left">
              {getTitle()}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left mt-2">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? 'Excluindo...' : 'Excluir Definitivamente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};