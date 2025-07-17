import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Investimento, InvestimentoInput } from '@/types/investimentos';
import { useToast } from '@/hooks/use-toast';

export function useInvestimentos() {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvestimentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('investimentos')
        .select('*')
        .order('data_compra', { ascending: false });

      if (error) throw error;
      setInvestimentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar investimentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvestimento = async (investimento: InvestimentoInput) => {
    try {
      const { data, error } = await supabase
        .from('investimentos')
        .insert([{ ...investimento, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;

      setInvestimentos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Investimento registrado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar investimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar investimento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvestimento = async (id: string, investimento: Partial<InvestimentoInput>) => {
    try {
      const { data, error } = await supabase
        .from('investimentos')
        .update(investimento)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInvestimentos(prev => prev.map(i => i.id === id ? data : i));
      toast({
        title: "Sucesso",
        description: "Investimento atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar investimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar investimento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteInvestimento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investimentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvestimentos(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Sucesso",
        description: "Investimento removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar investimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover investimento",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchInvestimentos();
  }, []);

  // Estatísticas
  const totalPorCategoria = investimentos.reduce((acc, inv) => {
    acc[inv.categoria] = (acc[inv.categoria] || 0) + Number(inv.valor);
    return acc;
  }, {} as Record<string, number>);

  const totalGeral = investimentos.reduce((total, inv) => total + Number(inv.valor), 0);

  // Investimentos dos últimos 30 dias
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 30);
  
  const investimentosRecentes = investimentos.filter(inv => 
    new Date(inv.data_compra) >= dataLimite
  );

  return {
    investimentos,
    loading,
    createInvestimento,
    updateInvestimento,
    deleteInvestimento,
    refetch: fetchInvestimentos,
    totalPorCategoria,
    totalGeral,
    investimentosRecentes
  };
}