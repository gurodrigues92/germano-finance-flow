import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X, CheckSquare, Square } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  totalItems: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onCancel: () => void;
}

export const BulkActionBar = ({
  selectedCount,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onCancel
}: BulkActionBarProps) => {
  const isAllSelected = selectedCount === totalItems && totalItems > 0;

  console.log('[Financeiro] BulkActionBar:', { selectedCount, totalItems, isAllSelected });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40 animate-slide-in-bottom">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onClearSelection : onSelectAll}
            className="flex items-center gap-2"
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span className="text-sm">
              {isAllSelected ? 'Desmarcar todas' : 'Selecionar todas'}
            </span>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {selectedCount} de {totalItems} selecionada{selectedCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            disabled={selectedCount === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Excluir ({selectedCount})
          </Button>
        </div>
      </div>
    </div>
  );
};