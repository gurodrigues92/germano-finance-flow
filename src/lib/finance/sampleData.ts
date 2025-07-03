import { Transaction } from '@/types/finance';
import { calculateTransaction } from './calculations';

export const generateSampleTransactions = (): Transaction[] => {
  const sampleData = [
    { date: '2024-12-01', dinheiro: 150, pix: 280, debito: 320, credito: 450 },
    { date: '2024-12-02', dinheiro: 200, pix: 350, debito: 180, credito: 380 },
    { date: '2024-12-03', dinheiro: 120, pix: 420, debito: 250, credito: 300 },
    { date: '2024-12-04', dinheiro: 180, pix: 380, debito: 200, credito: 520 },
    { date: '2024-12-05', dinheiro: 220, pix: 310, debito: 180, credito: 480 }
  ];

  return sampleData.map((data, index) => {
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
};