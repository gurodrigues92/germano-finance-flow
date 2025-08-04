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
        .select('*')
        .order('nome');

      // Aplicar filtros
      if (filters?.ativo !== undefined) {
        query = query.eq('ativo', filters.ativo);
      }

      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,telefone.ilike.%${filters.search}%`);
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

  // Carregar clientes no mount
  useEffect(() => {
    loadClientes();
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