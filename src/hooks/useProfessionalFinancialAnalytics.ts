import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProfessionalFinancialProfile {
  profissional_id: string;
  profissional_nome: string;
  total_receita_gerada: number;
  numero_atendimentos: number;
  numero_agendamentos: number;
  ticket_medio: number;
  comissao_total: number;
  comissao_percentual: number;
  receita_por_hora: number;
  taxa_conversao: number; // agendamentos que viraram atendimentos
  ranking_receita: number;
  crescimento_mensal: number;
  clientes_fidelizados: number;
  ultima_transacao: string;
  primeira_transacao: string;
}

export interface ProfessionalPerformanceHistory {
  data: string;
  receita: number;
  atendimentos: number;
  agendamentos: number;
  comissao: number;
}

export const useProfessionalFinancialAnalytics = () => {
  const [professionalProfiles, setProfessionalProfiles] = useState<ProfessionalFinancialProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProfessionalFinancialProfiles = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      // Buscar transações com dados do profissional
      let transacoesQuery = supabase
        .from('transacoes')
        .select(`
          *,
          profissional:profissionais(id, nome, percentual_comissao)
        `)
        .not('profissional_id', 'is', null);

      if (startDate) transacoesQuery = transacoesQuery.gte('data', startDate);
      if (endDate) transacoesQuery = transacoesQuery.lte('data', endDate);

      // Buscar agendamentos para calcular taxa de conversão
      let agendamentosQuery = supabase
        .from('agendamentos')
        .select(`
          profissional_id,
          status,
          data,
          profissional:profissionais(id, nome)
        `);

      if (startDate) agendamentosQuery = agendamentosQuery.gte('data', startDate);
      if (endDate) agendamentosQuery = agendamentosQuery.lte('data', endDate);

      const [transacoesResult, agendamentosResult] = await Promise.all([
        transacoesQuery,
        agendamentosQuery
      ]);

      if (transacoesResult.error) throw transacoesResult.error;
      if (agendamentosResult.error) throw agendamentosResult.error;

      const transacoes = transacoesResult.data || [];
      const agendamentos = agendamentosResult.data || [];

      // Agrupar por profissional
      const profissionalMap = new Map<string, {
        profissional_id: string;
        profissional_nome: string;
        percentual_comissao: number;
        transacoes: any[];
        agendamentos: any[];
        atendimentos_concluidos: any[];
      }>();

      // Processar transações
      transacoes.forEach(transacao => {
        if (!transacao.profissional?.id) return;

        const profissionalId = transacao.profissional.id;
        if (!profissionalMap.has(profissionalId)) {
          profissionalMap.set(profissionalId, {
            profissional_id: profissionalId,
            profissional_nome: transacao.profissional.nome,
            percentual_comissao: transacao.profissional.percentual_comissao || 40,
            transacoes: [],
            agendamentos: [],
            atendimentos_concluidos: []
          });
        }

        profissionalMap.get(profissionalId)!.transacoes.push(transacao);
      });

      // Processar agendamentos
      agendamentos.forEach(agendamento => {
        if (!agendamento.profissional?.id) return;

        const profissionalId = agendamento.profissional.id;
        if (!profissionalMap.has(profissionalId)) {
          profissionalMap.set(profissionalId, {
            profissional_id: profissionalId,
            profissional_nome: agendamento.profissional.nome,
            percentual_comissao: 40, // valor padrão
            transacoes: [],
            agendamentos: [],
            atendimentos_concluidos: []
          });
        }

        const prof = profissionalMap.get(profissionalId)!;
        prof.agendamentos.push(agendamento);
        
        if (agendamento.status === 'concluido') {
          prof.atendimentos_concluidos.push(agendamento);
        }
      });

      // Calcular métricas
      const profiles: ProfessionalFinancialProfile[] = Array.from(profissionalMap.values()).map((prof, index) => {
        const totalReceita = prof.transacoes.reduce((sum, t) => sum + t.total_bruto, 0);
        const numeroAtendimentos = prof.transacoes.length;
        const numeroAgendamentos = prof.agendamentos.length;
        const ticketMedio = numeroAtendimentos > 0 ? totalReceita / numeroAtendimentos : 0;
        
        // Comissão calculada sobre o valor líquido do edu_share
        const comissaoTotal = prof.transacoes.reduce((sum, t) => {
          const eduShare = t.edu_share || 0;
          return sum + (eduShare * (prof.percentual_comissao / 100));
        }, 0);

        // Taxa de conversão (agendamentos que viraram atendimentos)
        const taxaConversao = numeroAgendamentos > 0 
          ? (prof.atendimentos_concluidos.length / numeroAgendamentos) * 100 
          : 0;

        // Receita por hora (estimando 8h por dia útil)
        const diasComTransacao = new Set(prof.transacoes.map(t => t.data)).size;
        const receitaPorHora = diasComTransacao > 0 ? totalReceita / (diasComTransacao * 8) : 0;

        // Clientes fidelizados (clientes que retornaram)
        const clientesUnicos = new Set(prof.transacoes.map(t => t.cliente_id).filter(Boolean));
        const clientesFidelizados = clientesUnicos.size > 0 
          ? prof.transacoes.length - clientesUnicos.size 
          : 0;

        const sortedTransacoes = prof.transacoes.sort((a, b) => 
          new Date(a.data).getTime() - new Date(b.data).getTime()
        );

        return {
          profissional_id: prof.profissional_id,
          profissional_nome: prof.profissional_nome,
          total_receita_gerada: totalReceita,
          numero_atendimentos: numeroAtendimentos,
          numero_agendamentos: numeroAgendamentos,
          ticket_medio: ticketMedio,
          comissao_total: comissaoTotal,
          comissao_percentual: prof.percentual_comissao,
          receita_por_hora: receitaPorHora,
          taxa_conversao: taxaConversao,
          ranking_receita: index + 1, // será recalculado após ordenação
          crescimento_mensal: 0, // TODO: implementar cálculo temporal
          clientes_fidelizados: clientesFidelizados,
          ultima_transacao: sortedTransacoes[sortedTransacoes.length - 1]?.data || '',
          primeira_transacao: sortedTransacoes[0]?.data || ''
        };
      });

      // Ordenar por receita e atualizar ranking
      profiles.sort((a, b) => b.total_receita_gerada - a.total_receita_gerada);
      profiles.forEach((profile, index) => {
        profile.ranking_receita = index + 1;
      });

      setProfessionalProfiles(profiles);
    } catch (error) {
      console.error('Erro ao carregar perfis financeiros dos profissionais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar análise financeira dos profissionais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProfessionalPerformanceHistory = async (
    profissionalId: string,
    groupBy: 'day' | 'week' | 'month' = 'month'
  ): Promise<ProfessionalPerformanceHistory[]> => {
    try {
      const { data: transacoes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('data, total_bruto, edu_share')
        .eq('profissional_id', profissionalId)
        .order('data', { ascending: true });

      const { data: agendamentos, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('data, status')
        .eq('profissional_id', profissionalId)
        .order('data', { ascending: true });

      if (transacoesError) throw transacoesError;
      if (agendamentosError) throw agendamentosError;

      // Agrupar por período
      const groupedData = new Map<string, {
        receita: number;
        atendimentos: number;
        agendamentos: number;
        comissao: number;
      }>();

      transacoes?.forEach(transacao => {
        const key = transacao.data; // Simplificado - usar data completa
        if (!groupedData.has(key)) {
          groupedData.set(key, { receita: 0, atendimentos: 0, agendamentos: 0, comissao: 0 });
        }
        const group = groupedData.get(key)!;
        group.receita += transacao.total_bruto;
        group.atendimentos += 1;
        group.comissao += (transacao.edu_share || 0) * 0.4; // 40% de comissão padrão
      });

      agendamentos?.forEach(agendamento => {
        const key = agendamento.data;
        if (!groupedData.has(key)) {
          groupedData.set(key, { receita: 0, atendimentos: 0, agendamentos: 0, comissao: 0 });
        }
        groupedData.get(key)!.agendamentos += 1;
      });

      return Array.from(groupedData.entries()).map(([data, values]) => ({
        data,
        receita: values.receita,
        atendimentos: values.atendimentos,
        agendamentos: values.agendamentos,
        comissao: values.comissao
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico do profissional:', error);
      return [];
    }
  };

  const getTopProfessionals = (limit = 10) => {
    return professionalProfiles.slice(0, limit);
  };

  const getTotalRevenue = () => {
    return professionalProfiles.reduce((total, profile) => total + profile.total_receita_gerada, 0);
  };

  const getTotalCommissions = () => {
    return professionalProfiles.reduce((total, profile) => total + profile.comissao_total, 0);
  };

  const getAverageConversionRate = () => {
    const totalRate = professionalProfiles.reduce((sum, profile) => sum + profile.taxa_conversao, 0);
    return professionalProfiles.length > 0 ? totalRate / professionalProfiles.length : 0;
  };

  useEffect(() => {
    loadProfessionalFinancialProfiles();
  }, []);

  return {
    professionalProfiles,
    loading,
    loadProfessionalFinancialProfiles,
    getProfessionalPerformanceHistory,
    getTopProfessionals,
    getTotalRevenue,
    getTotalCommissions,
    getAverageConversionRate
  };
};