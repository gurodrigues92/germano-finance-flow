import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Agendamento, AgendamentoFormData, AgendaFilters } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar agendamentos com filtros
  const loadAgendamentos = async (filters?: AgendaFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('agendamentos')
        .select(`
          *,
          cliente:clientes(*),
          profissional:profissionais(*),
          servico:servicos(*)
        `)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true });

      // Aplicar filtros de data
      if (filters?.data_inicio) {
        query = query.gte('data', filters.data_inicio);
      }
      if (filters?.data_fim) {
        query = query.lte('data', filters.data_fim);
      }

      // Filtrar por profissional
      if (filters?.profissional_id) {
        query = query.eq('profissional_id', filters.profissional_id);
      }

      // Filtrar por status
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAgendamentos((data as any) || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar agendamento
  const addAgendamento = async (agendamentoData: AgendamentoFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar dados do serviço para calcular hora_fim e valor
      const { data: servico } = await supabase
        .from('servicos')
        .select('duracao_minutos, preco')
        .eq('id', agendamentoData.servico_id)
        .single();

      if (!servico) throw new Error('Serviço não encontrado');

      // Calcular hora_fim
      const [horas, minutos] = agendamentoData.hora_inicio.split(':').map(Number);
      const inicioMinutos = horas * 60 + minutos;
      const fimMinutos = inicioMinutos + servico.duracao_minutos;
      const horaFim = `${Math.floor(fimMinutos / 60).toString().padStart(2, '0')}:${(fimMinutos % 60).toString().padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('agendamentos')
        .insert({
          ...agendamentoData,
          hora_fim: horaFim,
          valor: servico.preco,
          status: 'agendado',
          user_id: user.id
        })
        .select(`
          *,
          cliente:clientes(*),
          profissional:profissionais(*),
          servico:servicos(*)
        `)
        .single();

      if (error) throw error;

      setAgendamentos(prev => [...prev, data as any]);
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar status do agendamento
  const updateStatusAgendamento = async (id: string, status: Agendamento['status']) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(*),
          profissional:profissionais(*),
          servico:servicos(*)
        `)
        .single();

      if (error) throw error;

      setAgendamentos(prev => prev.map(agendamento => 
        agendamento.id === id ? (data as any) : agendamento
      ));

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar agendamento
  const deleteAgendamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id));
      toast({
        title: "Sucesso",
        description: "Agendamento removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover agendamento",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar agendamentos do dia
  const getAgendamentosDoDia = (data: string) => {
    return agendamentos.filter(agendamento => agendamento.data === data);
  };

  // Buscar próximos agendamentos
  const getProximosAgendamentos = (limite = 5) => {
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date().toTimeString().slice(0, 5);
    
    return agendamentos
      .filter(agendamento => {
        if (agendamento.data > hoje) return true;
        if (agendamento.data === hoje && agendamento.hora_inicio >= agora) return true;
        return false;
      })
      .filter(agendamento => ['agendado', 'confirmado'].includes(agendamento.status))
      .slice(0, limite);
  };

  // Carregar agendamentos da semana atual por padrão
  useEffect(() => {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    loadAgendamentos({
      data_inicio: inicioSemana.toISOString().split('T')[0],
      data_fim: fimSemana.toISOString().split('T')[0]
    });
  }, []);

  return {
    agendamentos,
    loading,
    loadAgendamentos,
    addAgendamento,
    updateStatusAgendamento,
    deleteAgendamento,
    getAgendamentosDoDia,
    getProximosAgendamentos
  };
};