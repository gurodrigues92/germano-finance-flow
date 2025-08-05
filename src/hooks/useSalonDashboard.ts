import { useMemo } from 'react';
import { Comanda, Profissional } from '@/types/salon';
import { startOfMonth, endOfMonth } from 'date-fns';

interface UseSalonDashboardProps {
  comandas: Comanda[];
  profissionais: Profissional[];
}

export const useSalonDashboard = ({ comandas, profissionais }: UseSalonDashboardProps) => {
  const currentMonth = useMemo(() => {
    const now = new Date();
    return {
      start: startOfMonth(now),
      end: endOfMonth(now)
    };
  }, []);

  // Filtrar comandas do mês atual
  const monthlyComandas = useMemo(() => {
    return comandas.filter(comanda => {
      const comandaDate = new Date(comanda.data_abertura);
      return comandaDate >= currentMonth.start && comandaDate <= currentMonth.end;
    });
  }, [comandas, currentMonth]);

  // Métricas do salão
  const salonMetrics = useMemo(() => {
    const totalComandas = monthlyComandas.length;
    const comandasAbertas = monthlyComandas.filter(c => c.status === 'aberta').length;
    const comandasFechadas = monthlyComandas.filter(c => c.status === 'fechada').length;
    const totalReceita = monthlyComandas
      .filter(c => c.status === 'fechada')
      .reduce((sum, comanda) => sum + comanda.total_liquido, 0);

    // Clientes únicos (baseado nas comandas)
    const clientesAtivos = new Set(
      monthlyComandas.filter(c => c.cliente_id).map(c => c.cliente_id)
    ).size;

    // Profissionais ativos (baseado nas comandas)
    const profissionaisAtivos = new Set(
      monthlyComandas.filter(c => c.profissional_principal_id).map(c => c.profissional_principal_id)
    ).size;

    return {
      totalComandas,
      comandasAbertas,
      comandasFechadas,
      totalFaturamento: totalReceita, // usar totalReceita como totalFaturamento
      clientesAtivos,
      clientesCredito: 0, // placeholder
      clientesDebito: 0,  // placeholder
      profissionaisAtivos,
      servicosAtivos: 0   // placeholder
    };
  }, [monthlyComandas]);

  // Performance dos profissionais
  const profissionalPerformance = useMemo(() => {
    return profissionais.map(profissional => {
      const comandasProfissional = monthlyComandas.filter(
        comanda => comanda.profissional_principal_id === profissional.id && comanda.status === 'fechada'
      );

      const totalAtendimentos = comandasProfissional.length;
      const totalReceita = comandasProfissional.reduce((sum, comanda) => sum + comanda.total_liquido, 0);
      const totalComissao = totalReceita * (profissional.percentual_comissao / 100);

      return {
        id: profissional.id,
        nome: profissional.nome,
        totalAtendimentos,
        totalFaturamento: totalReceita, // usar totalReceita como totalFaturamento  
        comissaoTotal: totalComissao,   // usar totalComissao como comissaoTotal
        cor: profissional.cor_agenda || '#8B5CF6'
      };
    });
  }, [profissionais, monthlyComandas]);

  // Popularidade dos serviços (placeholder - seria necessário dados de comanda_itens)
  const servicoPopularidade = useMemo(() => {
    // Retorna array vazio por enquanto, pois não temos dados de comanda_itens aqui
    return [];
  }, []);

  return {
    salonMetrics,
    profissionalPerformance,
    servicoPopularidade,
    monthlyComandas
  };
};