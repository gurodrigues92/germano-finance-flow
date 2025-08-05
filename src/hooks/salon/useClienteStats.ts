import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClienteStats {
  aniversariantes: number;
  inativos30Dias: number;
  comCredito: number;
  primeiraVisita: number;
  agendadosHoje: number;
  vip: number;
  totalClientes: number;
  clientesAtivos: number;
  ticketMedio: number;
  retencao30Dias: number;
}

export const useClienteStats = () => {
  const [stats, setStats] = useState<ClienteStats>({
    aniversariantes: 0,
    inativos30Dias: 0,
    comCredito: 0,
    primeiraVisita: 0,
    agendadosHoje: 0,
    vip: 0,
    totalClientes: 0,
    clientesAtivos: 0,
    ticketMedio: 0,
    retencao30Dias: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();
      const dataHoje = hoje.toISOString().split('T')[0];
      const data30DiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Buscar todos os clientes
      const { data: clientes, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id);

      if (clientesError) throw clientesError;

      // Aniversariantes do mês
      const aniversariantes = clientes?.filter(cliente => {
        if (!cliente.data_nascimento) return false;
        const dataNasc = new Date(cliente.data_nascimento);
        return dataNasc.getMonth() + 1 === mesAtual;
      }).length || 0;

      // Clientes com crédito
      const comCredito = clientes?.filter(cliente => cliente.saldo > 0).length || 0;

      // Total de clientes e ativos
      const totalClientes = clientes?.length || 0;
      const clientesAtivos = clientes?.filter(cliente => cliente.ativo).length || 0;

      // Agendamentos de hoje
      const { data: agendamentosHoje, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('cliente_id')
        .eq('user_id', user.id)
        .eq('data', dataHoje);

      if (agendamentosError) throw agendamentosError;

      const agendadosHoje = new Set(agendamentosHoje?.map(a => a.cliente_id)).size || 0;

      // Comandas para calcular estatísticas financeiras
      const { data: comandas, error: comandasError } = await supabase
        .from('comandas')
        .select(`
          total_liquido,
          cliente_id,
          data_fechamento,
          created_at
        `)
        .eq('user_id', user.id)
        .eq('status', 'fechada');

      if (comandasError) throw comandasError;

      // Calcular ticket médio
      const totalReceita = comandas?.reduce((sum, comanda) => sum + (comanda.total_liquido || 0), 0) || 0;
      const ticketMedio = totalClientes > 0 ? totalReceita / totalClientes : 0;

      // Clientes VIP (gastaram mais de R$ 1000 no último ano)
      const umAnoAtras = new Date(hoje.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      const gastoPorCliente = new Map<string, number>();
      
      comandas?.forEach(comanda => {
        if (comanda.data_fechamento && comanda.data_fechamento >= umAnoAtras && comanda.cliente_id) {
          const atual = gastoPorCliente.get(comanda.cliente_id) || 0;
          gastoPorCliente.set(comanda.cliente_id, atual + (comanda.total_liquido || 0));
        }
      });

      const vip = Array.from(gastoPorCliente.values()).filter(valor => valor >= 1000).length;

      // Primeira visita (clientes criados nos últimos 30 dias)
      const primeiraVisita = clientes?.filter(cliente => {
        return cliente.created_at && cliente.created_at >= data30DiasAtras;
      }).length || 0;

      // Clientes inativos há mais de 30 dias
      const clientesComComandas = new Set(comandas?.map(c => c.cliente_id));
      const clientesRecentesSet = new Set(
        comandas?.filter(c => c.data_fechamento && c.data_fechamento >= data30DiasAtras)
          .map(c => c.cliente_id)
      );
      
      const inativos30Dias = clientes?.filter(cliente => 
        clientesComComandas.has(cliente.id) && !clientesRecentesSet.has(cliente.id)
      ).length || 0;

      // Retenção 30 dias (clientes que voltaram nos últimos 30 dias)
      const retencao30Dias = clientesRecentesSet.size;

      setStats({
        aniversariantes,
        inativos30Dias,
        comCredito,
        primeiraVisita,
        agendadosHoje,
        vip,
        totalClientes,
        clientesAtivos,
        ticketMedio,
        retencao30Dias
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas dos clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    loadStats
  };
};