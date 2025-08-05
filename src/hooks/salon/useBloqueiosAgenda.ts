import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BloqueioAgenda } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';

export const useBloqueiosAgenda = () => {
  const [bloqueios, setBloqueios] = useState<BloqueioAgenda[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar bloqueios
  const loadBloqueios = async (dataInicio?: string, dataFim?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('bloqueios_agenda')
        .select(`
          *,
          profissional:profissionais(*)
        `)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (dataInicio) {
        query = query.gte('data', dataInicio);
      }
      if (dataFim) {
        query = query.lte('data', dataFim);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBloqueios((data as any) || []);
    } catch (error) {
      console.error('Erro ao carregar bloqueios:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar bloqueios da agenda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar bloqueio
  const addBloqueio = async (bloqueioData: Omit<BloqueioAgenda, 'id' | 'created_at' | 'profissional'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('bloqueios_agenda')
        .insert({
          ...bloqueioData,
          user_id: user.id
        })
        .select(`
          *,
          profissional:profissionais(*)
        `)
        .single();

      if (error) throw error;

      setBloqueios(prev => [...prev, data as any]);
      toast({
        title: "Sucesso",
        description: "Bloqueio adicionado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar bloqueio:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar bloqueio",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Remover bloqueio
  const removeBloqueio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bloqueios_agenda')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBloqueios(prev => prev.filter(bloqueio => bloqueio.id !== id));
      toast({
        title: "Sucesso",
        description: "Bloqueio removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover bloqueio:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover bloqueio",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar bloqueios do dia
  const getBloqueiosDoDia = (data: string) => {
    return bloqueios.filter(bloqueio => bloqueio.data === data);
  };

  // Buscar bloqueios de um profissional em uma data
  const getBloqueiosProfissionalDia = (profissionalId: string, data: string) => {
    return bloqueios.filter(bloqueio => 
      bloqueio.profissional_id === profissionalId && bloqueio.data === data
    );
  };

  // Verificar se um horário está bloqueado
  const isHorarioBloqueado = (profissionalId: string, data: string, hora: string) => {
    return bloqueios.some(bloqueio => {
      if (bloqueio.profissional_id !== profissionalId || bloqueio.data !== data) {
        return false;
      }
      
      return hora >= bloqueio.hora_inicio && hora <= bloqueio.hora_fim;
    });
  };

  useEffect(() => {
    // Carregar bloqueios da semana atual por padrão
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    loadBloqueios(
      inicioSemana.toISOString().split('T')[0],
      fimSemana.toISOString().split('T')[0]
    );
  }, []);

  return {
    bloqueios,
    loading,
    loadBloqueios,
    addBloqueio,
    removeBloqueio,
    getBloqueiosDoDia,
    getBloqueiosProfissionalDia,
    isHorarioBloqueado
  };
};