import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profissional, ProfissionalFormData } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';

export const useProfissionais = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar profissionais
  const loadProfissionais = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;

      setProfissionais((data as any) || []);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar profissionais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar profissional
  const addProfissional = async (profissionalData: ProfissionalFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('profissionais')
        .insert({
          ...profissionalData,
          horario_trabalho: profissionalData.horario_trabalho as any,
          user_id: user.id,
          ativo: true
        })
        .select()
        .single();

      if (error) throw error;

      setProfissionais(prev => [...prev, data as any]);
      toast({
        title: "Sucesso",
        description: "Profissional adicionado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar profissional
  const updateProfissional = async (id: string, profissionalData: Partial<ProfissionalFormData>) => {
    try {
      const { data, error } = await supabase
        .from('profissionais')
        .update({
          ...profissionalData,
          horario_trabalho: profissionalData.horario_trabalho as any
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProfissionais(prev => prev.map(profissional => 
        profissional.id === id ? (data as any) : profissional
      ));

      toast({
        title: "Sucesso",
        description: "Profissional atualizado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar profissional
  const deleteProfissional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profissionais')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      setProfissionais(prev => prev.filter(profissional => profissional.id !== id));
      toast({
        title: "Sucesso",
        description: "Profissional desativado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao desativar profissional:', error);
      toast({
        title: "Erro",
        description: "Erro ao desativar profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar profissional por ID
  const getProfissionalById = (id: string) => {
    return profissionais.find(profissional => profissional.id === id);
  };

  // Carregar profissionais no mount e configurar realtime
  useEffect(() => {
    loadProfissionais();

    // Setup realtime subscription
    const channel = supabase
      .channel('profissionais-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profissionais',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Profissional inserido:', payload.new);
        if (payload.new.ativo) {
          setProfissionais(prev => {
            const exists = prev.find(p => p.id === payload.new.id);
            if (!exists) {
              return [...prev, payload.new as Profissional];
            }
            return prev;
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profissionais', 
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Profissional atualizado:', payload.new);
        if (payload.new.ativo) {
          setProfissionais(prev => prev.map(profissional => 
            profissional.id === payload.new.id ? payload.new as Profissional : profissional
          ));
        } else {
          // Remove if deactivated
          setProfissionais(prev => prev.filter(profissional => profissional.id !== payload.new.id));
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'profissionais',
        filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
      }, (payload) => {
        console.log('Profissional deletado:', payload.old);
        setProfissionais(prev => prev.filter(profissional => profissional.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    profissionais,
    loading,
    loadProfissionais,
    addProfissional,
    updateProfissional,
    deleteProfissional,
    getProfissionalById
  };
};