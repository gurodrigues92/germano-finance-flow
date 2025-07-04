import { FinanceState } from '@/types/finance';
import { importTransactionsFromCSV, exportTransactionsToCSV } from '@/lib/finance/csv';
import { useToast } from '@/hooks/use-toast';

export const useFinanceIO = (
  state: FinanceState,
  setState: (newState: FinanceState) => void,
  saveToStorage: (newState: FinanceState) => void,
  setLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

  const importFromCSV = async (file: File) => {
    setLoading(true);
    
    try {
      const importedTransactions = await importTransactionsFromCSV(file);
      
      const newState = {
        ...state,
        transactions: [...importedTransactions, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Imported transactions:', importedTransactions.length);
      toast({
        title: "Sucesso",
        description: `${importedTransactions.length} transações importadas com sucesso`
      });
    } catch (error) {
      console.error('[Financeiro] Error importing CSV:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao importar arquivo CSV",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      exportTransactionsToCSV(state.transactions, state.currentMonth);
      toast({
        title: "Sucesso",
        description: "Dados exportados com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error exporting data:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar dados",
        variant: "destructive"
      });
    }
  };

  return {
    importFromCSV,
    exportToCSV
  };
};