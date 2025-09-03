import { useMemo } from 'react';
import { Comanda, Profissional, Cliente, Servico } from '@/types/salon';
import { startOfMonth, endOfMonth } from 'date-fns';

interface UseSalonDashboardProps {
  comandas: Comanda[];
  profissionais: Profissional[];
  clientes: Cliente[];
  servicos: Servico[];
}

export const useSalonDashboard = ({ comandas, profissionais, clientes, servicos }: UseSalonDashboardProps) => {
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

    // Contadores totais do cadastro (não baseado em comandas)
    const totalClientes = clientes.length;
    const totalProfissionais = profissionais.length;
    const totalServicos = servicos.length;

    // Clientes com crédito e débito
    const clientesCredito = clientes.filter(c => c.saldo > 0).length;
    const clientesDebito = clientes.filter(c => c.saldo < 0).length;

    return {
      totalComandas,
      comandasAbertas,
      comandasFechadas,
      totalFaturamento: totalReceita,
      clientesAtivos: totalClientes,
      clientesCredito,
      clientesDebito,
      profissionaisAtivos: totalProfissionais,
      servicosAtivos: totalServicos
    };
  }, [monthlyComandas, clientes, profissionais, servicos]);

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