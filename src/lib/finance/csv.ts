import { Transaction } from '@/types/finance';
import { calculateTransaction } from './calculations';

export const importTransactionsFromCSV = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
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

        resolve(importedTransactions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsText(file);
  });
};

export const exportTransactionsToCSV = (transactions: Transaction[], month: string): void => {
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
      'Profissional (40%)',
      'Assistente (4%)'
    ];

    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
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
    link.download = `studio_germano_${month}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('[Financeiro] Error exporting data:', error);
    throw new Error('Erro ao exportar dados');
  }
};