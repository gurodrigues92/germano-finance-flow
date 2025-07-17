import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface SaveChangesButtonProps {
  hasChanges: boolean;
  onSave: () => void;
  loading?: boolean;
}

export const SaveChangesButton = ({
  hasChanges,
  onSave,
  loading = false
}: SaveChangesButtonProps) => {
  if (!hasChanges) return null;

  console.log('[Financeiro] SaveChangesButton visible, hasChanges:', hasChanges);

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <Button
        onClick={onSave}
        disabled={loading}
        className="bg-finance-income hover:bg-finance-income/80 text-finance-income-foreground shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:shadow-xl"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Salvar Alterações
      </Button>
    </div>
  );
};