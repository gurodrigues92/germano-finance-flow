import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  realTransactions, 
  stockProducts, 
  fixedCosts, 
  DATA_INITIALIZED_KEY,
  BACKUP_DATA_KEY,
  type RealTransaction
} from '@/data/mockData';
import { Transaction, FinanceState } from '@/types/finance';
import { loadFinanceData, saveFinanceData } from '@/lib/finance/storage';

// Converter dados reais para formato do sistema existente
const convertRealTransactionToFinanceTransaction = (realTx: RealTransaction): Transaction => ({
  id: realTx.id,
  date: realTx.date,
  dinheiro: realTx.dinheiro,
  pix: realTx.pix,
  debito: realTx.debito,
  credito: realTx.credito,
  totalBruto: realTx.totalBruto,
  taxaDebito: realTx.taxaDebito,
  taxaCredito: realTx.taxaCredito,
  totalLiquido: realTx.totalLiquido,
  studioShare: realTx.studioShare,
  eduShare: realTx.eduShare,
  kamShare: realTx.kamShare,
  month: realTx.month,
  year: realTx.year,
  createdAt: realTx.createdAt
});

export const useDataInitializer = () => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = () => {
      try {
        // Verificar se já foi inicializado
        const alreadyInitialized = localStorage.getItem(DATA_INITIALIZED_KEY);
        if (alreadyInitialized) {
          console.log('[DataInitializer] Dados já foram inicializados anteriormente');
          return;
        }

        // Verificar se já existem dados do usuário
        const existingData = loadFinanceData();
        
        // Se existem dados, fazer backup antes de sobrescrever
        if (existingData && existingData.transactions.length > 0) {
          console.log('[DataInitializer] Fazendo backup dos dados existentes');
          localStorage.setItem(BACKUP_DATA_KEY, JSON.stringify(existingData));
          
          toast({
            title: "Dados existentes",
            description: "Backup criado dos seus dados anteriores",
          });
        }

        // Converter transações reais para formato do sistema
        const convertedTransactions = realTransactions.map(convertRealTransactionToFinanceTransaction);

        // Criar estado inicial com dados reais (sem sobrescrever mês atual)
        const existingState = loadFinanceData();
        const currentMonth = existingState?.currentMonth || new Date().toISOString().slice(0, 7);
        
        const initialState: FinanceState = {
          transactions: convertedTransactions,
          currentMonth: currentMonth,
          currentYear: Math.max(new Date().getFullYear(), 2025),
          archivedData: existingState?.archivedData || []
        };

        // Salvar dados reais no sistema
        saveFinanceData(initialState);

        // Marcar como inicializado
        localStorage.setItem(DATA_INITIALIZED_KEY, 'true');

        console.log('[DataInitializer] Dados reais inicializados com sucesso');
        console.log('- Transações:', convertedTransactions.length);
        console.log('- Produtos estoque:', stockProducts.length);
        console.log('- Custos fixos:', fixedCosts.length);

        toast({
          title: "Sistema Inicializado",
          description: `Dados reais do Studio Germano carregados com sucesso! ${convertedTransactions.length} transações adicionadas.`,
        });

      } catch (error) {
        console.error('[DataInitializer] Erro ao inicializar dados:', error);
        toast({
          title: "Erro na Inicialização",
          description: "Erro ao carregar dados iniciais do sistema",
          variant: "destructive"
        });
      }
    };

    // Executar inicialização após um pequeno delay para evitar problemas de renderização
    const timer = setTimeout(initializeData, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  // Função para resetar dados para originais
  const resetToOriginalData = () => {
    try {
      const convertedTransactions = realTransactions.map(convertRealTransactionToFinanceTransaction);
      
      const initialState: FinanceState = {
        transactions: convertedTransactions,
        currentMonth: new Date().toISOString().slice(0, 7),
        currentYear: Math.max(new Date().getFullYear(), 2025),
        archivedData: []
      };

      saveFinanceData(initialState);
      
      toast({
        title: "Dados Resetados",
        description: "Sistema restaurado para dados originais do Studio Germano",
      });

      // Refetch data instead of reloading
      setTimeout(() => {
        window.dispatchEvent(new Event('dataReset'));
      }, 500);
    } catch (error) {
      console.error('[DataInitializer] Erro ao resetar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao resetar dados",
        variant: "destructive"
      });
    }
  };

  // Função para restaurar backup do usuário
  const restoreBackup = () => {
    try {
      const backupData = localStorage.getItem(BACKUP_DATA_KEY);
      if (!backupData) {
        toast({
          title: "Nenhum Backup",
          description: "Não foram encontrados dados de backup",
          variant: "destructive"
        });
        return;
      }

      const parsedBackup = JSON.parse(backupData);
      saveFinanceData(parsedBackup);
      
      toast({
        title: "Backup Restaurado",
        description: "Seus dados anteriores foram restaurados",
      });

      // Refetch data instead of reloading
      setTimeout(() => {
        window.dispatchEvent(new Event('backupRestored'));
      }, 500);
    } catch (error) {
      console.error('[DataInitializer] Erro ao restaurar backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao restaurar backup",
        variant: "destructive"
      });
    }
  };

  return {
    resetToOriginalData,
    restoreBackup,
    hasBackup: !!localStorage.getItem(BACKUP_DATA_KEY)
  };
};