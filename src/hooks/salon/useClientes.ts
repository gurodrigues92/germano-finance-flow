import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cliente, ClienteFormData, ClienteFilters } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar clientes
  const loadClientes = async (filters?: ClienteFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('clientes')
        .select('*');

      // Aplicar filtros
      if (filters?.ativo !== undefined) {
        query = query.eq('ativo', filters.ativo);
      }

      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,telefone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      // Ordenação
      const ordenacao = filters?.ordenacao || 'nome';
      const direcao = filters?.direcao || 'asc';
      
      switch (ordenacao) {
        case 'nome':
          query = query.order('nome', { ascending: direcao === 'asc' });
          break;
        case 'data_cadastro':
          query = query.order('created_at', { ascending: direcao === 'asc' });
          break;
        case 'saldo':
          query = query.order('saldo', { ascending: direcao === 'asc' });
          break;
        default:
          query = query.order('nome');
      }

      const { data, error } = await query;

      if (error) throw error;

      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar cliente
  const addCliente = async (clienteData: ClienteFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('clientes')
        .insert({
          ...clienteData,
          user_id: user.id,
          ativo: true,
          saldo: clienteData.saldo || 0
        })
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Cliente adicionado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar cliente
  const updateCliente = async (id: string, clienteData: Partial<ClienteFormData>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => prev.map(cliente => 
        cliente.id === id ? data : cliente
      ));

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar cliente
  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClientes(prev => prev.filter(cliente => cliente.id !== id));
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar saldo do cliente
  const updateSaldoCliente = async (id: string, novoSaldo: number) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update({ saldo: novoSaldo })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClientes(prev => prev.map(cliente => 
        cliente.id === id ? { ...cliente, saldo: novoSaldo } : cliente
      ));

      return data;
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar saldo do cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar cliente por ID
  const getClienteById = (id: string) => {
    return clientes.find(cliente => cliente.id === id);
  };

  // Carregar clientes no mount e configurar realtime
  useEffect(() => {
    loadClientes();

    // Setup realtime subscription
    const channel = supabase
      .channel('clientes-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'clientes',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Cliente inserido:', payload.new);
        setClientes(prev => {
          const exists = prev.find(c => c.id === payload.new.id);
          if (!exists) {
            return [...prev, payload.new as Cliente];
          }
          return prev;
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE', 
        schema: 'public',
        table: 'clientes',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Cliente atualizado:', payload.new);
        setClientes(prev => prev.map(cliente => 
          cliente.id === payload.new.id ? payload.new as Cliente : cliente
        ));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public', 
        table: 'clientes',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Cliente deletado:', payload.old);
        setClientes(prev => prev.filter(cliente => cliente.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    clientes,
    loading,
    loadClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    updateSaldoCliente,
    getClienteById
  };
};