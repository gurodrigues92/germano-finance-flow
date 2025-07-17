import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/finance';
import { parseDateBrazil } from '@/lib/dateUtils';

export const useSupabaseTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Carregar transações do Supabase
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;

      // Converter formato do Supabase para formato do sistema
      const convertedTransactions: Transaction[] = (data || []).map(t => ({
        id: t.id,
        date: t.data,
        dinheiro: Number(t.dinheiro),
        pix: Number(t.pix),
        debito: Number(t.debito),
        credito: Number(t.credito),
        totalBruto: Number(t.total_bruto),
        taxaDebito: Number(t.taxa_debito),
        taxaCredito: Number(t.taxa_credito),
        totalLiquido: Number(t.total_liquido),
        studioShare: Number(t.studio_share),
        eduShare: Number(t.edu_share),
        kamShare: Number(t.kam_share),
        month: t.mes_referencia,
        year: t.ano,
        createdAt: t.created_at
      }));

      setTransactions(convertedTransactions);
      console.log('[Supabase] Transações carregadas:', convertedTransactions.length);
    } catch (error) {
      console.error('[Supabase] Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar transações do banco de dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova transação
  const addTransaction = async (transactionInput: {
    date: string;
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  }) => {
    try {
      setLoading(true);
      // Importar os cálculos existentes
      const { calculateTransaction } = await import('@/lib/finance/calculations');
      const calculations = calculateTransaction(
        transactionInput.dinheiro,
        transactionInput.pix,
        transactionInput.debito,
        transactionInput.credito
      );

      const date = parseDateBrazil(transactionInput.date);
      const month = transactionInput.date.slice(0, 7); // YYYY-MM format
      const year = date.getFullYear();
      
      const { data, error } = await supabase
        .from('transacoes')
        .insert({
          data: transactionInput.date,
          dinheiro: transactionInput.dinheiro,
          pix: transactionInput.pix,
          debito: transactionInput.debito,
          credito: transactionInput.credito,
          total_bruto: calculations.totalBruto,
          taxa_debito: calculations.taxaDebito,
          taxa_credito: calculations.taxaCredito,
          total_liquido: calculations.totalLiquido,
          studio_share: calculations.studioShare,
          edu_share: calculations.eduShare,
          kam_share: calculations.kamShare,
          mes_referencia: month,
          ano: year
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      await loadTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!"
      });

      console.log('[Supabase] Transação adicionada:', data);
      return true;
    } catch (error) {
      console.error('[Supabase] Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar transação
  const updateTransaction = async (id: string, transactionInput: {
    date: string;
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  }) => {
    try {
      setLoading(true);
      // Importar os cálculos existentes e recalcular
      const { calculateTransaction } = await import('@/lib/finance/calculations');
      const calculations = calculateTransaction(
        transactionInput.dinheiro,
        transactionInput.pix,
        transactionInput.debito,
        transactionInput.credito
      );

      const date = parseDateBrazil(transactionInput.date);
      const month = transactionInput.date.slice(0, 7); // YYYY-MM format
      const year = date.getFullYear();

      const updateData = {
        data: transactionInput.date,
        dinheiro: transactionInput.dinheiro,
        pix: transactionInput.pix,
        debito: transactionInput.debito,
        credito: transactionInput.credito,
        total_bruto: calculations.totalBruto,
        taxa_debito: calculations.taxaDebito,
        taxa_credito: calculations.taxaCredito,
        total_liquido: calculations.totalLiquido,
        studio_share: calculations.studioShare,
        edu_share: calculations.eduShare,
        kam_share: calculations.kamShare,
        mes_referencia: month,
        ano: year
      };

      const { error } = await supabase
        .from('transacoes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      await loadTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso!"
      });

      console.log('[Supabase] Transação atualizada:', id);
      return true;
    } catch (error) {
      console.error('[Supabase] Erro ao atualizar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Deletar transação
  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      await loadTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação removida com sucesso!"
      });

      console.log('[Supabase] Transação removida:', id);
      return true;
    } catch (error) {
      console.error('[Supabase] Erro ao remover transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover transação",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Migrar dados do localStorage para Supabase
  const migrateFromLocalStorage = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do localStorage
      const localData = localStorage.getItem('studio_germano_finance');
      if (!localData) {
        console.log('[Migração] Nenhum dado encontrado no localStorage');
        return false;
      }

      const parsed = JSON.parse(localData);
      const localTransactions = parsed.transactions || [];

      if (localTransactions.length === 0) {
        console.log('[Migração] Nenhuma transação para migrar');
        return false;
      }

      console.log('[Migração] Migrando', localTransactions.length, 'transações para Supabase');

      // Verificar se já existem dados no Supabase
      const { data: existingData } = await supabase
        .from('transacoes')
        .select('id')
        .limit(1);

      if (existingData && existingData.length > 0) {
        console.log('[Migração] Dados já existem no Supabase, pulando migração');
        return false;
      }

      // Migrar transações em lotes
      const batchSize = 10;
      for (let i = 0; i < localTransactions.length; i += batchSize) {
        const batch = localTransactions.slice(i, i + batchSize);
        
        const supabaseData = batch.map((t: Transaction) => ({
          data: t.date,
          dinheiro: t.dinheiro,
          pix: t.pix,
          debito: t.debito,
          credito: t.credito,
          total_bruto: t.totalBruto,
          taxa_debito: t.taxaDebito,
          taxa_credito: t.taxaCredito,
          total_liquido: t.totalLiquido,
          studio_share: t.studioShare,
          edu_share: t.eduShare,
          kam_share: t.kamShare,
          mes_referencia: t.month,
          ano: t.year
        }));

        const { error } = await supabase
          .from('transacoes')
          .insert(supabaseData);

        if (error) throw error;
        
        console.log(`[Migração] Lote ${i / batchSize + 1} migrado com sucesso`);
      }

      toast({
        title: "Migração Concluída",
        description: `${localTransactions.length} transações migradas para o Supabase com sucesso!`
      });

      console.log('[Migração] Migração concluída com sucesso');
      return true;
    } catch (error) {
      console.error('[Migração] Erro na migração:', error);
      toast({
        title: "Erro na Migração",
        description: "Erro ao migrar dados para o Supabase",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carregar transações na inicialização
  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    migrateFromLocalStorage
  };
};