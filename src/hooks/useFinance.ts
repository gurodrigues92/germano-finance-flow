import { useState, useEffect } from 'react';
import { Transaction, MonthlyData, FinanceState, DEBIT_TAX_RATE, CREDIT_TAX_RATE, STUDIO_SHARE, EDU_SHARE, KAM_SHARE } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'studio_germano_finance';

export const useFinance = () => {
  const { toast } = useToast();
  const [state, setState] = useState<FinanceState>({
    transactions: [],
    currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    currentYear: new Date().getFullYear(),
    archivedData: []
  });

  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('[Financeiro] Loading data from localStorage');
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setState(parsedData);
        console.log('[Financeiro] Data loaded successfully', parsedData);
      }
    } catch (error) {
      console.error('[Financeiro] Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados salvos",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Save to localStorage whenever state changes
  const saveToStorage = (newState: FinanceState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      console.log('[Financeiro] Data saved to localStorage');
    } catch (error) {
      console.error('[Financeiro] Error saving data:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados",
        variant: "destructive"
      });
    }
  };

  const calculateTransaction = (
    dinheiro: number,
    pix: number,
    debito: number,
    credito: number
  ) => {
    const totalBruto = dinheiro + pix + debito + credito;
    const taxaDebito = debito * DEBIT_TAX_RATE;
    const taxaCredito = credito * CREDIT_TAX_RATE;
    const totalLiquido = totalBruto - taxaDebito - taxaCredito;
    
    return {
      totalBruto,
      taxaDebito,
      taxaCredito,
      totalLiquido,
      studioShare: totalLiquido * STUDIO_SHARE,
      eduShare: totalLiquido * EDU_SHARE,
      kamShare: totalLiquido * KAM_SHARE
    };
  };

  const addTransaction = (transactionData: {
    date: string;
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  }) => {
    setLoading(true);
    
    try {
      const calculations = calculateTransaction(
        transactionData.dinheiro,
        transactionData.pix,
        transactionData.debito,
        transactionData.credito
      );

      const transaction: Transaction = {
        id: Date.now().toString(),
        ...transactionData,
        ...calculations,
        month: transactionData.date.slice(0, 7),
        year: new Date(transactionData.date).getFullYear(),
        createdAt: new Date().toISOString()
      };

      const newState = {
        ...state,
        transactions: [transaction, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction added:', transaction);
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso"
      });

      return transaction;
    } catch (error) {
      console.error('[Financeiro] Error adding transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = (id: string, transactionData: {
    date: string;
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  }) => {
    setLoading(true);
    
    try {
      const calculations = calculateTransaction(
        transactionData.dinheiro,
        transactionData.pix,
        transactionData.debito,
        transactionData.credito
      );

      const updatedTransaction: Transaction = {
        ...state.transactions.find(t => t.id === id)!,
        ...transactionData,
        ...calculations,
        month: transactionData.date.slice(0, 7),
        year: new Date(transactionData.date).getFullYear(),
      };

      const newState = {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === id ? updatedTransaction : t
        )
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction updated:', id);
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error updating transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = (id: string) => {
    setLoading(true);
    
    try {
      const newState = {
        ...state,
        transactions: state.transactions.filter(t => t.id !== id)
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Transaction deleted:', id);
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error deleting transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir transação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = (month?: string): MonthlyData => {
    const targetMonth = month || state.currentMonth;
    const transactions = state.transactions.filter(t => t.month === targetMonth);
    
    const totals = transactions.reduce(
      (acc, t) => ({
        totalBruto: acc.totalBruto + t.totalBruto,
        totalLiquido: acc.totalLiquido + t.totalLiquido,
        totalStudio: acc.totalStudio + t.studioShare,
        totalEdu: acc.totalEdu + t.eduShare,
        totalKam: acc.totalKam + t.kamShare,
        totalTaxas: acc.totalTaxas + t.taxaDebito + t.taxaCredito
      }),
      {
        totalBruto: 0,
        totalLiquido: 0,
        totalStudio: 0,
        totalEdu: 0,
        totalKam: 0,
        totalTaxas: 0
      }
    );

    return {
      month: targetMonth,
      year: parseInt(targetMonth.split('-')[0]),
      transactions,
      ...totals
    };
  };

  const importFromCSV = (file: File) => {
    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('Arquivo CSV vazio ou inválido');
        }

        const importedTransactions: Transaction[] = [];
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 5 && values[0].trim()) {
            const transactionData = {
              date: values[0].trim(),
              dinheiro: parseFloat(values[1]) || 0,
              pix: parseFloat(values[2]) || 0,
              debito: parseFloat(values[3]) || 0,
              credito: parseFloat(values[4]) || 0
            };

            const calculations = calculateTransaction(
              transactionData.dinheiro,
              transactionData.pix,
              transactionData.debito,
              transactionData.credito
            );

            const transaction: Transaction = {
              id: `import_${Date.now()}_${i}`,
              ...transactionData,
              ...calculations,
              month: transactionData.date.slice(0, 7),
              year: new Date(transactionData.date).getFullYear(),
              createdAt: new Date().toISOString()
            };

            importedTransactions.push(transaction);
          }
        }

        if (importedTransactions.length === 0) {
          throw new Error('Nenhuma transação válida encontrada no arquivo');
        }

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

    reader.onerror = () => {
      setLoading(false);
      toast({
        title: "Erro",
        description: "Erro ao ler arquivo",
        variant: "destructive"
      });
    };

    reader.readAsText(file);
  };

  const exportToCSV = () => {
    try {
      const headers = [
        'Data',
        'Dinheiro',
        'PIX',
        'Débito',
        'Crédito',
        'Total Bruto',
        'Taxa Débito',
        'Taxa Crédito',
        'Total Líquido',
        'Studio (60%)',
        'Edu (40%)',
        'Kam (10%)'
      ];

      const csvContent = [
        headers.join(','),
        ...state.transactions.map(t => [
          t.date,
          t.dinheiro,
          t.pix,
          t.debito,
          t.credito,
          t.totalBruto,
          t.taxaDebito,
          t.taxaCredito,
          t.totalLiquido,
          t.studioShare,
          t.eduShare,
          t.kamShare
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studio_germano_${state.currentMonth}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

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

  const loadSampleData = () => {
    setLoading(true);
    
    try {
      const sampleTransactions = [
        { date: '2024-12-01', dinheiro: 150, pix: 280, debito: 320, credito: 450 },
        { date: '2024-12-02', dinheiro: 200, pix: 350, debito: 180, credito: 380 },
        { date: '2024-12-03', dinheiro: 120, pix: 420, debito: 250, credito: 300 },
        { date: '2024-12-04', dinheiro: 180, pix: 380, debito: 200, credito: 520 },
        { date: '2024-12-05', dinheiro: 220, pix: 310, debito: 180, credito: 480 }
      ].map((data, index) => {
        const calculations = calculateTransaction(data.dinheiro, data.pix, data.debito, data.credito);
        return {
          id: `sample_${Date.now()}_${index}`,
          ...data,
          ...calculations,
          month: data.date.slice(0, 7),
          year: new Date(data.date).getFullYear(),
          createdAt: new Date().toISOString()
        };
      });

      const newState = {
        ...state,
        transactions: [...sampleTransactions, ...state.transactions]
      };

      setState(newState);
      saveToStorage(newState);

      console.log('[Financeiro] Sample data loaded');
      toast({
        title: "Sucesso",
        description: "Dados de exemplo carregados com sucesso"
      });
    } catch (error) {
      console.error('[Financeiro] Error loading sample data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de exemplo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...state,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyData,
    exportToCSV,
    importFromCSV,
    loadSampleData,
    setCurrentMonth: (month: string) => setState(prev => ({ ...prev, currentMonth: month })),
    setCurrentYear: (year: number) => setState(prev => ({ ...prev, currentYear: year }))
  };
};