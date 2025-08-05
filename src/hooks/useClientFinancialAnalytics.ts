import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClientFinancialProfile {
  cliente_id: string;
  cliente_nome: string;
  total_gasto: number;
  numero_transacoes: number;
  ticket_medio: number;
  ultima_transacao: string;
  primeira_transacao: string;
  metodos_pagamento_preferidos: {
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  };
  categoria_cliente: 'VIP' | 'Regular' | 'Eventual';
  score_lucratividade: number;
  frequencia_media_dias: number;
}

export interface ClientSpendingHistory {
  data: string;
  valor: number;
  tipo: string;
  descricao: string;
}

export const useClientFinancialAnalytics = () => {
  const [clientProfiles, setClientProfiles] = useState<ClientFinancialProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadClientFinancialProfiles = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      // Buscar todas as transações com dados do cliente
      let query = supabase
        .from('transacoes')
        .select(`
          *,
          cliente:clientes(id, nome)
        `)
        .not('cliente_id', 'is', null);

      if (startDate) query = query.gte('data', startDate);
      if (endDate) query = query.lte('data', endDate);

      const { data: transacoes, error } = await query;
      if (error) throw error;

      // Agrupar por cliente e calcular métricas
      const clienteMap = new Map<string, {
        cliente_id: string;
        cliente_nome: string;
        transacoes: any[];
        total_gasto: number;
        metodos_pagamento: {
          dinheiro: number;
          pix: number;
          debito: number;
          credito: number;
        };
      }>();

      transacoes?.forEach(transacao => {
        if (!transacao.cliente?.id) return;

        const clienteId = transacao.cliente.id;
        if (!clienteMap.has(clienteId)) {
          clienteMap.set(clienteId, {
            cliente_id: clienteId,
            cliente_nome: transacao.cliente.nome,
            transacoes: [],
            total_gasto: 0,
            metodos_pagamento: {
              dinheiro: 0,
              pix: 0,
              debito: 0,
              credito: 0
            }
          });
        }

        const cliente = clienteMap.get(clienteId)!;
        cliente.transacoes.push(transacao);
        cliente.total_gasto += transacao.total_bruto;
        cliente.metodos_pagamento.dinheiro += transacao.dinheiro || 0;
        cliente.metodos_pagamento.pix += transacao.pix || 0;
        cliente.metodos_pagamento.debito += transacao.debito || 0;
        cliente.metodos_pagamento.credito += transacao.credito || 0;
      });

      // Calcular métricas avançadas
      const profiles: ClientFinancialProfile[] = Array.from(clienteMap.values()).map(cliente => {
        const sortedTransacoes = cliente.transacoes.sort((a, b) => 
          new Date(a.data).getTime() - new Date(b.data).getTime()
        );

        const primeiraTransacao = sortedTransacoes[0]?.data;
        const ultimaTransacao = sortedTransacoes[sortedTransacoes.length - 1]?.data;
        
        const ticketMedio = cliente.total_gasto / cliente.transacoes.length;
        
        // Calcular categoria do cliente baseada no valor total e frequência
        let categoria: 'VIP' | 'Regular' | 'Eventual' = 'Eventual';
        if (cliente.total_gasto > 1000 && cliente.transacoes.length > 5) {
          categoria = 'VIP';
        } else if (cliente.total_gasto > 300 && cliente.transacoes.length > 2) {
          categoria = 'Regular';
        }

        // Score de lucratividade (0-100)
        const scoreLucratividade = Math.min(100, 
          (cliente.total_gasto / 100) + (cliente.transacoes.length * 5) + (ticketMedio / 10)
        );

        // Frequência média entre transações
        let frequenciaMediaDias = 0;
        if (cliente.transacoes.length > 1 && primeiraTransacao && ultimaTransacao) {
          const diasEntrePrimeiraEUltima = Math.floor(
            (new Date(ultimaTransacao).getTime() - new Date(primeiraTransacao).getTime()) / (1000 * 60 * 60 * 24)
          );
          frequenciaMediaDias = diasEntrePrimeiraEUltima / (cliente.transacoes.length - 1);
        }

        return {
          cliente_id: cliente.cliente_id,
          cliente_nome: cliente.cliente_nome,
          total_gasto: cliente.total_gasto,
          numero_transacoes: cliente.transacoes.length,
          ticket_medio: ticketMedio,
          ultima_transacao: ultimaTransacao || '',
          primeira_transacao: primeiraTransacao || '',
          metodos_pagamento_preferidos: cliente.metodos_pagamento,
          categoria_cliente: categoria,
          score_lucratividade: Math.round(scoreLucratividade),
          frequencia_media_dias: Math.round(frequenciaMediaDias)
        };
      });

      // Ordenar por score de lucratividade
      profiles.sort((a, b) => b.score_lucratividade - a.score_lucratividade);

      setClientProfiles(profiles);
    } catch (error) {
      console.error('Erro ao carregar perfis financeiros dos clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar análise financeira dos clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getClientSpendingHistory = async (clienteId: string): Promise<ClientSpendingHistory[]> => {
    try {
      const { data: transacoes, error } = await supabase
        .from('transacoes')
        .select('data, total_bruto, tipo, observacoes')
        .eq('cliente_id', clienteId)
        .order('data', { ascending: false });

      if (error) throw error;

      return transacoes?.map(transacao => ({
        data: transacao.data,
        valor: transacao.total_bruto,
        tipo: transacao.tipo || 'manual',
        descricao: transacao.observacoes || 'Transação'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar histórico do cliente:', error);
      return [];
    }
  };

  const getTopClients = (limit = 10) => {
    return clientProfiles.slice(0, limit);
  };

  const getClientsByCategory = (categoria: 'VIP' | 'Regular' | 'Eventual') => {
    return clientProfiles.filter(profile => profile.categoria_cliente === categoria);
  };

  const getTotalRevenue = () => {
    return clientProfiles.reduce((total, profile) => total + profile.total_gasto, 0);
  };

  const getAverageTicket = () => {
    const totalTickets = clientProfiles.reduce((total, profile) => total + profile.numero_transacoes, 0);
    const totalRevenue = getTotalRevenue();
    return totalTickets > 0 ? totalRevenue / totalTickets : 0;
  };

  useEffect(() => {
    loadClientFinancialProfiles();
  }, []);

  return {
    clientProfiles,
    loading,
    loadClientFinancialProfiles,
    getClientSpendingHistory,
    getTopClients,
    getClientsByCategory,
    getTotalRevenue,
    getAverageTicket
  };
};