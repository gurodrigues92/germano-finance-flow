import { useMemo } from 'react';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';
import { format, isToday } from 'date-fns';

export const useAgendamentosHoje = () => {
  const { agendamentos } = useAgendamentos();

  const agendamentosHoje = useMemo(() => {
    const hoje = new Date();
    const hojeStr = format(hoje, 'yyyy-MM-dd');
    
    return agendamentos.filter(agendamento => {
      return agendamento.data === hojeStr;
    }).sort((a, b) => {
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
  }, [agendamentos]);

  const proximosAgendamentos = useMemo(() => {
    return agendamentosHoje.filter(agendamento => 
      agendamento.status === 'agendado' || agendamento.status === 'confirmado'
    );
  }, [agendamentosHoje]);

  const agendamentoAtual = useMemo(() => {
    const agora = new Date();
    const horaAtual = format(agora, 'HH:mm');
    
    return proximosAgendamentos.find(agendamento => {
      const horaInicio = agendamento.hora_inicio;
      const horaFim = agendamento.hora_fim;
      return horaAtual >= horaInicio && horaAtual <= horaFim;
    });
  }, [proximosAgendamentos]);

  const proximoAgendamento = useMemo(() => {
    const agora = new Date();
    const horaAtual = format(agora, 'HH:mm');
    
    return proximosAgendamentos.find(agendamento => {
      return agendamento.hora_inicio > horaAtual;
    });
  }, [proximosAgendamentos]);

  return {
    agendamentosHoje,
    proximosAgendamentos,
    agendamentoAtual,
    proximoAgendamento,
    totalHoje: agendamentosHoje.length,
    pendentesHoje: proximosAgendamentos.length
  };
};