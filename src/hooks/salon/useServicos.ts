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

  // Carregar serviços no mount
  useEffect(() => {
    loadServicos();
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