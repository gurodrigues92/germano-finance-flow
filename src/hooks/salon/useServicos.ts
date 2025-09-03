import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Servico, ServicoFormData } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';

export const useServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar serviços
  const loadServicos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true)
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;

      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar serviços",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar serviço
  const addServico = async (servicoData: ServicoFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('servicos')
        .insert({
          ...servicoData,
          user_id: user.id,
          ativo: true
        })
        .select()
        .single();

      if (error) throw error;

      setServicos(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Serviço adicionado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar serviço",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar serviço
  const updateServico = async (id: string, servicoData: Partial<ServicoFormData>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .update(servicoData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setServicos(prev => prev.map(servico => 
        servico.id === id ? data : servico
      ));

      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar serviço",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar serviço
  const deleteServico = async (id: string) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      setServicos(prev => prev.filter(servico => servico.id !== id));
      toast({
        title: "Sucesso",
        description: "Serviço desativado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao desativar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao desativar serviço",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar serviço por ID
  const getServicoById = (id: string) => {
    return servicos.find(servico => servico.id === id);
  };

  // Agrupar serviços por categoria
  const getServicosPorCategoria = () => {
    const grupos = servicos.reduce((acc, servico) => {
      if (!acc[servico.categoria]) {
        acc[servico.categoria] = [];
      }
      acc[servico.categoria].push(servico);
      return acc;
    }, {} as Record<string, Servico[]>);

    return grupos;
  };

  // Carregar serviços no mount e configurar realtime
  useEffect(() => {
    loadServicos();

    // Setup realtime subscription
    const channel = supabase
      .channel('servicos-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'servicos',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Serviço inserido:', payload.new);
        if (payload.new.ativo) {
          setServicos(prev => {
            const exists = prev.find(s => s.id === payload.new.id);
            if (!exists) {
              return [...prev, payload.new as Servico];
            }
            return prev;
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'servicos',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Serviço atualizado:', payload.new);
        if (payload.new.ativo) {
          setServicos(prev => prev.map(servico => 
            servico.id === payload.new.id ? payload.new as Servico : servico
          ));
        } else {
          // Remove if deactivated
          setServicos(prev => prev.filter(servico => servico.id !== payload.new.id));
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'servicos',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Serviço deletado:', payload.old);
        setServicos(prev => prev.filter(servico => servico.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    servicos,
    loading,
    loadServicos,
    addServico,
    updateServico,
    deleteServico,
    getServicoById,
    getServicosPorCategoria
  };
};