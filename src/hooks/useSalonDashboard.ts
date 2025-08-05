import { useMemo } from 'react';
import { useComandas } from '@/hooks/salon/useComandas';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useServicos } from '@/hooks/salon/useServicos';

export const useSalonDashboard = (currentMonth: string) => {
  const { comandas } = useComandas();
  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();
  const { servicos } = useServicos();

  // Filter data for current month
  const monthlyComandas = useMemo(() => {
    return comandas.filter(comanda => {
      const comandaMonth = comanda.data_abertura.slice(0, 7);
      return comandaMonth === currentMonth;
    });
  }, [comandas, currentMonth]);

  // Salon metrics for current month
  const salonMetrics = useMemo(() => {
    const totalComandas = monthlyComandas.length;
    const comandasAbertas = monthlyComandas.filter(c => c.status === 'aberta').length;
    const comandasFechadas = monthlyComandas.filter(c => c.status === 'fechada').length;
    
    const totalFaturamento = monthlyComandas
      .filter(c => c.status === 'fechada')
      .reduce((sum, c) => sum + c.total_bruto, 0);

    const clientesAtivos = clientes.filter(c => c.ativo).length;
    const clientesCredito = clientes.filter(c => c.saldo > 0).length;
    const clientesDebito = clientes.filter(c => c.saldo < 0).length;

    const profissionaisAtivos = profissionais.filter(p => p.ativo).length;
    const servicosAtivos = servicos.filter(s => s.ativo).length;

    return {
      totalComandas,
      comandasAbertas,
      comandasFechadas,
      totalFaturamento,
      clientesAtivos,
      clientesCredito,
      clientesDebito,
      profissionaisAtivos,
      servicosAtivos
    };
  }, [monthlyComandas, clientes, profissionais, servicos]);

  // Performance by professional
  const profissionalPerformance = useMemo(() => {
    return profissionais.map(prof => {
      const profComandas = monthlyComandas.filter(c => 
        c.profissional_principal_id === prof.id && c.status === 'fechada'
      );
      
      const totalAtendimentos = profComandas.length;
      const totalFaturamento = profComandas.reduce((sum, c) => sum + c.total_bruto, 0);
      const comissaoTotal = totalFaturamento * (prof.percentual_comissao / 100);

      return {
        id: prof.id,
        nome: prof.nome,
        totalAtendimentos,
        totalFaturamento,
        comissaoTotal,
        cor: prof.cor_agenda
      };
    }).filter(p => p.totalAtendimentos > 0);
  }, [profissionais, monthlyComandas]);

  // Service popularity - we'll implement this when comanda_itens is properly integrated
  const servicoPopularidade = useMemo(() => {
    // For now, return empty array until comanda_itens relationship is established
    return [];
  }, [monthlyComandas]);

  return {
    salonMetrics,
    profissionalPerformance,
    servicoPopularidade,
    monthlyComandas
  };
};