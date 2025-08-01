import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/finance';


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
        createdAt: t.created_at,
        customRates: t.custom_rates as { studioRate: number; eduRate: number; kamRate: number; } | undefined
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
    customRates?: {
      studioRate: number;
      eduRate: number;
      kamRate: number;
    };
  }) => {
    try {
      console.log('[Supabase] Iniciando adição de transação:', transactionInput);
      setLoading(true);
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[Supabase] Usuário não autenticado');
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para adicionar transações",
          variant: "destructive"
        });
        return false;
      }

      console.log('[Supabase] Usuário autenticado:', user.id);
      
      // Importar os cálculos existentes
      const { calculateTransaction } = await import('@/lib/finance/calculations');
      const calculations = calculateTransaction(
        transactionInput.dinheiro,
        transactionInput.pix,
        transactionInput.debito,
        transactionInput.credito,
        transactionInput.customRates
      );

      console.log('[Supabase] Cálculos realizados:', calculations);

      const month = transactionInput.date.slice(0, 7); // YYYY-MM format
      const year = parseInt(transactionInput.date.slice(0, 4)); // Extract year from date string
      
      const insertData = {
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
        ano: year,
        custom_rates: transactionInput.customRates || null
      };

      console.log('[Supabase] Dados para inserção:', insertData);
      
      const { data, error } = await supabase
        .from('transacoes')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('[Supabase] Erro SQL:', error);
        throw error;
      }

      console.log('[Supabase] Transação inserida no banco:', data);

      // Atualizar estado local
      await loadTransactions();
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!"
      });

      console.log('[Supabase] Transação adicionada com sucesso');
      return true;
    } catch (error) {
      console.error('[Supabase] Erro completo ao adicionar transação:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      toast({
        title: "Erro",
        description: `Erro ao adicionar transação: ${errorMessage}`,
        variant: "destructive"
      });
      return false;
    } finally {
      console.log('[Supabase] Finalizando addTransaction, setLoading(false)');
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
    customRates?: {
      studioRate: number;
      eduRate: number;
      kamRate: number;
    };
  }) => {
    try {
      setLoading(true);
      // Importar os cálculos existentes e recalcular
      const { calculateTransaction } = await import('@/lib/finance/calculations');
      const calculations = calculateTransaction(
        transactionInput.dinheiro,
        transactionInput.pix,
        transactionInput.debito,
        transactionInput.credito,
        transactionInput.customRates
      );

      const month = transactionInput.date.slice(0, 7); // YYYY-MM format
      const year = parseInt(transactionInput.date.slice(0, 4)); // Extract year from date string

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
        ano: year,
        custom_rates: transactionInput.customRates || null
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