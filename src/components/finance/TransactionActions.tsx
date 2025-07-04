import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Download } from 'lucide-react';

interface TransactionActionsProps {
  onImportCSV: (file: File) => void;
  onExportCSV: () => void;
  onNewTransaction: () => void;
  loading: boolean;
}

export const TransactionActions = ({
  onImportCSV,
  onExportCSV,
  onNewTransaction,
  loading
}: TransactionActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportCSV(file);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DialogTrigger asChild>
        <Button 
          onClick={onNewTransaction}
          className="bg-finance-income hover:bg-finance-income/90 text-finance-income-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importar CSV
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onExportCSV}
        disabled={loading}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar CSV
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />
    </div>
  );
};