import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/finance';
import { validateTransaction, validateCalculationIntegrity, sanitizeTransactionData } from '@/lib/finance/validation';
import { auditLogger } from '@/lib/finance/auditLog';


export const useSupabaseTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
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
      setInitialLoadDone(true);
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
      
      // VALIDAÇÃO ROBUSTA DOS DADOS
      const sanitizedData = sanitizeTransactionData(transactionInput);
      const validation = validateTransaction(sanitizedData);
      
      if (!validation.isValid) {
        console.log('[Supabase] Dados inválidos:', validation.errors);
        toast({
          title: "Dados Inválidos",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        return false;
      }
      
      // Importar os cálculos existentes
      const { calculateTransaction } = await import('@/lib/finance/calculations');
      const calculations = calculateTransaction(
        sanitizedData.dinheiro,
        sanitizedData.pix,
        sanitizedData.debito,
        sanitizedData.credito,
        sanitizedData.customRates
      );

      // VALIDAR INTEGRIDADE DOS CÁLCULOS
      validateCalculationIntegrity(sanitizedData, calculations);

      console.log('[Supabase] Cálculos realizados e validados:', calculations);

      const month = sanitizedData.date.slice(0, 7); // YYYY-MM format
      const year = parseInt(sanitizedData.date.slice(0, 4)); // Extract year from date string
      
      const insertData = {
        data: sanitizedData.date,
        dinheiro: sanitizedData.dinheiro,
        pix: sanitizedData.pix,
        debito: sanitizedData.debito,
        credito: sanitizedData.credito,
        total_bruto: calculations.totalBruto,
        taxa_debito: calculations.taxaDebito,
        taxa_credito: calculations.taxaCredito,
        total_liquido: calculations.totalLiquido,
        studio_share: calculations.studioShare,
        edu_share: calculations.eduShare,
        kam_share: calculations.kamShare,
        mes_referencia: month,
        ano: year,
        custom_rates: sanitizedData.customRates || null
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

      // Converter e adicionar ao estado local imediatamente para responsividade
      const newTransaction: Transaction = {
        id: data.id,
        date: data.data,
        dinheiro: Number(data.dinheiro),
        pix: Number(data.pix),
        debito: Number(data.debito),
        credito: Number(data.credito),
        totalBruto: Number(data.total_bruto),
        taxaDebito: Number(data.taxa_debito),
        taxaCredito: Number(data.taxa_credito),
        totalLiquido: Number(data.total_liquido),
        studioShare: Number(data.studio_share),
        eduShare: Number(data.edu_share),
        kamShare: Number(data.kam_share),
        month: data.mes_referencia,
        year: data.ano,
        createdAt: data.created_at,
        customRates: data.custom_rates as { studioRate: number; eduRate: number; kamRate: number; } | undefined
      };

      // Atualizar estado local imediatamente (otimistic update)
      setTransactions(prev => [newTransaction, ...prev]);
      
      // LOG DE AUDITORIA
      await auditLogger.logTransaction('CREATE', data.id, null, newTransaction, user.id);
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!"
      });

      console.log('[Supabase] Transação adicionada com sucesso');
      return true;
    } catch (error: any) {
      console.error('[Supabase] Erro completo ao adicionar transação:', error);
      
      const errorMessage = error?.message || 'Erro desconhecido';
      toast({
        title: "Erro Crítico",
        description: `Falha ao adicionar transação: ${errorMessage}`,
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

      // Atualizar estado local imediatamente para responsividade
      const updatedTransaction: Transaction = {
        id: id,
        date: transactionInput.date,
        dinheiro: transactionInput.dinheiro,
        pix: transactionInput.pix,
        debito: transactionInput.debito,
        credito: transactionInput.credito,
        totalBruto: calculations.totalBruto,
        taxaDebito: calculations.taxaDebito,
        taxaCredito: calculations.taxaCredito,
        totalLiquido: calculations.totalLiquido,
        studioShare: calculations.studioShare,
        eduShare: calculations.eduShare,
        kamShare: calculations.kamShare,
        month: month,
        year: year,
        createdAt: transactions.find(t => t.id === id)?.createdAt || new Date().toISOString(),
        customRates: transactionInput.customRates
      };

      // Otimistic update
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      
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

      // Atualizar estado local imediatamente (otimistic update)
      setTransactions(prev => prev.filter(t => t.id !== id));
      
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

  // Carregar transações na inicialização e configurar realtime
  useEffect(() => {
    loadTransactions();

    // Configurar realtime subscriptions para sincronização automática
    const channel = supabase
      .channel('transacoes-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // escuta INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'transacoes'
        },
        (payload) => {
          console.log('[Supabase Realtime] Mudança detectada:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newTransaction: Transaction = {
              id: payload.new.id,
              date: payload.new.data,
              dinheiro: Number(payload.new.dinheiro),
              pix: Number(payload.new.pix),
              debito: Number(payload.new.debito),
              credito: Number(payload.new.credito),
              totalBruto: Number(payload.new.total_bruto),
              taxaDebito: Number(payload.new.taxa_debito),
              taxaCredito: Number(payload.new.taxa_credito),
              totalLiquido: Number(payload.new.total_liquido),
              studioShare: Number(payload.new.studio_share),
              eduShare: Number(payload.new.edu_share),
              kamShare: Number(payload.new.kam_share),
              month: payload.new.mes_referencia,
              year: payload.new.ano,
              createdAt: payload.new.created_at,
              customRates: payload.new.custom_rates
            };
            
            setTransactions(prev => {
              const exists = prev.find(t => t.id === newTransaction.id);
              if (!exists) {
                return [newTransaction, ...prev];
              }
              return prev;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedTransaction: Transaction = {
              id: payload.new.id,
              date: payload.new.data,
              dinheiro: Number(payload.new.dinheiro),
              pix: Number(payload.new.pix),
              debito: Number(payload.new.debito),
              credito: Number(payload.new.credito),
              totalBruto: Number(payload.new.total_bruto),
              taxaDebito: Number(payload.new.taxa_debito),
              taxaCredito: Number(payload.new.taxa_credito),
              totalLiquido: Number(payload.new.total_liquido),
              studioShare: Number(payload.new.studio_share),
              eduShare: Number(payload.new.edu_share),
              kamShare: Number(payload.new.kam_share),
              month: payload.new.mes_referencia,
              year: payload.new.ano,
              createdAt: payload.new.created_at,
              customRates: payload.new.custom_rates
            };
            
            setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('[Supabase Realtime] Removendo subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    transactions,
    loading,
    initialLoadDone,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    migrateFromLocalStorage
  };
};