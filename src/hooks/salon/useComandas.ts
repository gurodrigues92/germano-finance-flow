import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Comanda, ComandaItem, ComandaFormData } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';
import { calculateTransaction } from '@/lib/finance/calculations';

export const useComandas = () => {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar comandas
  const loadComandas = async (status?: 'aberta' | 'fechada' | 'cancelada') => {
    setLoading(true);
    try {
      let query = supabase
        .from('comandas')
        .select(`
          *,
          cliente:clientes(*),
          profissional_principal:profissionais(*)
        `)
        .order('data_abertura', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      setComandas((data as any) || []);
    } catch (error) {
      console.error('Erro ao carregar comandas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar comandas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar nova comanda
  const createComanda = async (comandaData: ComandaFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('comandas')
        .insert({
          ...comandaData,
          user_id: user.id,
          status: 'aberta',
          total_bruto: 0,
          total_liquido: 0,
          desconto: 0,
          dinheiro: 0,
          pix: 0,
          debito: 0,
          credito: 0
        })
        .select(`
          *,
          cliente:clientes(*),
          profissional_principal:profissionais(*)
        `)
        .single();

      if (error) throw error;

      setComandas(prev => [data as any, ...prev]);
      toast({
        title: "Sucesso",
        description: `Comanda #${data.numero_comanda} criada com sucesso`
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar comanda",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Adicionar item à comanda
  const addItemComanda = async (
    comandaId: string, 
    item: {
      tipo: 'servico' | 'produto';
      item_id: string;
      nome_item: string;
      quantidade: number;
      valor_unitario: number;
      profissional_id?: string;
    }
  ) => {
    try {
      const valor_total = item.quantidade * item.valor_unitario;

      const { data, error } = await supabase
        .from('comanda_itens')
        .insert({
          comanda_id: comandaId,
          ...item,
          valor_total
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar totais da comanda
      await updateTotaisComanda(comandaId);

      toast({
        title: "Sucesso",
        description: "Item adicionado à comanda"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar item à comanda",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Remover item da comanda
  const removeItemComanda = async (itemId: string, comandaId: string) => {
    try {
      const { error } = await supabase
        .from('comanda_itens')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Atualizar totais da comanda
      await updateTotaisComanda(comandaId);

      toast({
        title: "Sucesso",
        description: "Item removido da comanda"
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover item da comanda",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar totais da comanda
  const updateTotaisComanda = async (comandaId: string) => {
    try {
      // Buscar todos os itens da comanda
      const { data: itens, error: itensError } = await supabase
        .from('comanda_itens')
        .select('valor_total')
        .eq('comanda_id', comandaId);

      if (itensError) throw itensError;

      const totalBruto = itens?.reduce((sum, item) => sum + Number(item.valor_total), 0) || 0;

      // Buscar desconto atual
      const { data: comanda, error: comandaError } = await supabase
        .from('comandas')
        .select('desconto')
        .eq('id', comandaId)
        .single();

      if (comandaError) throw comandaError;

      const totalLiquido = totalBruto - (comanda.desconto || 0);

      // Atualizar comanda
      const { error: updateError } = await supabase
        .from('comandas')
        .update({
          total_bruto: totalBruto,
          total_liquido: totalLiquido
        })
        .eq('id', comandaId);

      if (updateError) throw updateError;

      // Atualizar estado local
      setComandas(prev => prev.map(cmd => 
        cmd.id === comandaId 
          ? { ...cmd, total_bruto: totalBruto, total_liquido: totalLiquido }
          : cmd
      ));
    } catch (error) {
      console.error('Erro ao atualizar totais:', error);
    }
  };

  // Aplicar desconto
  const aplicarDesconto = async (comandaId: string, desconto: number) => {
    try {
      const comanda = comandas.find(c => c.id === comandaId);
      if (!comanda) throw new Error('Comanda não encontrada');

      const totalLiquido = comanda.total_bruto - desconto;

      const { error } = await supabase
        .from('comandas')
        .update({
          desconto,
          total_liquido: totalLiquido
        })
        .eq('id', comandaId);

      if (error) throw error;

      setComandas(prev => prev.map(cmd => 
        cmd.id === comandaId 
          ? { ...cmd, desconto, total_liquido: totalLiquido }
          : cmd
      ));

      toast({
        title: "Sucesso",
        description: "Desconto aplicado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao aplicar desconto:', error);
      toast({
        title: "Erro",
        description: "Erro ao aplicar desconto",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Fechar comanda e integrar com transações
  const fecharComanda = async (
    comandaId: string,
    metodsPagamento: {
      dinheiro: number;
      pix: number;
      debito: number;
      credito: number;
    }
  ) => {
    try {
      const comanda = comandas.find(c => c.id === comandaId);
      if (!comanda) throw new Error('Comanda não encontrada');

      // Verificar se total dos pagamentos confere
      const totalPagamentos = Object.values(metodsPagamento).reduce((sum, valor) => sum + valor, 0);
      if (Math.abs(totalPagamentos - comanda.total_liquido) > 0.01) {
        throw new Error('Total dos pagamentos não confere com o valor da comanda');
      }

      // Calcular valores para transação usando a lógica existente
      const transactionCalc = calculateTransaction(
        metodsPagamento.dinheiro,
        metodsPagamento.pix,
        metodsPagamento.debito,
        metodsPagamento.credito
      );

      // Criar transação automática
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const hoje = new Date();
      const dataTransacao = hoje.toISOString().split('T')[0];
      const mesReferencia = dataTransacao.slice(0, 7);
      const ano = hoje.getFullYear();

      const { data: transacao, error: transacaoError } = await supabase
        .from('transacoes')
        .insert({
          data: dataTransacao,
          dinheiro: metodsPagamento.dinheiro,
          pix: metodsPagamento.pix,
          debito: metodsPagamento.debito,
          credito: metodsPagamento.credito,
          total_bruto: transactionCalc.totalBruto,
          taxa_debito: transactionCalc.taxaDebito,
          taxa_credito: transactionCalc.taxaCredito,
          total_liquido: transactionCalc.totalLiquido,
          studio_share: transactionCalc.studioShare,
          edu_share: transactionCalc.eduShare,
          kam_share: transactionCalc.kamShare,
          mes_referencia: mesReferencia,
          ano: ano
        })
        .select()
        .single();

      if (transacaoError) throw transacaoError;

      // Fechar comanda
      const { data: comandaFechada, error: comandaError } = await supabase
        .from('comandas')
        .update({
          status: 'fechada',
          data_fechamento: new Date().toISOString(),
          dinheiro: metodsPagamento.dinheiro,
          pix: metodsPagamento.pix,
          debito: metodsPagamento.debito,
          credito: metodsPagamento.credito,
          transacao_id: transacao.id
        })
        .eq('id', comandaId)
        .select(`
          *,
          cliente:clientes(*),
          profissional_principal:profissionais(*)
        `)
        .single();

      if (comandaError) throw comandaError;

      setComandas(prev => prev.map(cmd => 
        cmd.id === comandaId ? (comandaFechada as any) : cmd
      ));

      toast({
        title: "Sucesso",
        description: `Comanda #${comandaFechada.numero_comanda} fechada e transação criada automaticamente`
      });

      return { comanda: comandaFechada, transacao };
    } catch (error) {
      console.error('Erro ao fechar comanda:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fechar comanda",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar comandas abertas
  const getComandasAbertas = () => {
    return comandas.filter(comanda => comanda.status === 'aberta');
  };

  // Carregar comandas no mount e configurar realtime
  useEffect(() => {
    loadComandas();

    // Setup realtime subscription for comandas
    const comandasChannel = supabase
      .channel('comandas-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comandas',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, async (payload) => {
        console.log('Comanda inserida:', payload.new);
        // Fetch complete data with relationships
        const { data } = await supabase
          .from('comandas')
          .select(`
            *,
            cliente:clientes(*),
            profissional_principal:profissionais(*)
          `)
          .eq('id', payload.new.id)
          .single();
        
        if (data) {
          setComandas(prev => {
            const exists = prev.find(c => c.id === payload.new.id);
            if (!exists) {
              return [data as any, ...prev];
            }
            return prev;
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'comandas',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, async (payload) => {
        console.log('Comanda atualizada:', payload.new);
        // Fetch complete updated data
        const { data } = await supabase
          .from('comandas')
          .select(`
            *,
            cliente:clientes(*),
            profissional_principal:profissionais(*)
          `)
          .eq('id', payload.new.id)
          .single();
        
        if (data) {
          setComandas(prev => prev.map(comanda => 
            comanda.id === payload.new.id ? data as any : comanda
          ));
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'comandas',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Comanda deletada:', payload.old);
        setComandas(prev => prev.filter(comanda => comanda.id !== payload.old.id));
      })
      .subscribe();

    // Setup realtime subscription for comanda_itens
    const itensChannel = supabase
      .channel('comanda-itens-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comanda_itens'
      }, (payload) => {
        console.log('Item de comanda inserido:', payload.new);
        // Refresh totals for affected comanda
        updateTotaisComanda(payload.new.comanda_id);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'comanda_itens'
      }, (payload) => {
        console.log('Item de comanda atualizado:', payload.new);
        updateTotaisComanda(payload.new.comanda_id);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'comanda_itens'
      }, (payload) => {
        console.log('Item de comanda deletado:', payload.old);
        updateTotaisComanda(payload.old.comanda_id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(comandasChannel);
      supabase.removeChannel(itensChannel);
    };
  }, []);

  return {
    comandas,
    loading,
    loadComandas,
    createComanda,
    addItemComanda,
    removeItemComanda,
    aplicarDesconto,
    fecharComanda,
    getComandasAbertas,
    updateTotaisComanda
  };
};