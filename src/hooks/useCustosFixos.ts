import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CustoFixo, CustoFixoInput } from '@/types/custos';
import { useToast } from '@/hooks/use-toast';

export function useCustosFixos(mesReferencia?: string) {
  const [custos, setCustos] = useState<CustoFixo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('custos_fixos')
        .select('*')
        .order('mes_referencia', { ascending: false });

      if (mesReferencia) {
        // Convert "YYYY-MM" to "YYYY-MM-01" for DATE column
        const dateFormat = mesReferencia.length === 7 ? `${mesReferencia}-01` : mesReferencia;
        query = query.eq('mes_referencia', dateFormat);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCustos(data || []);
    } catch (error) {
      console.error('Erro ao buscar custos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar custos fixos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCusto = async (custo: CustoFixoInput) => {
    try {
      const { data, error } = await supabase
        .from('custos_fixos')
        .insert([{ ...custo, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;

      setCustos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Custo fixo adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar custo:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar custo fixo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCusto = async (id: string, custo: Partial<CustoFixoInput>) => {
    try {
      const { data, error } = await supabase
        .from('custos_fixos')
        .update(custo)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCustos(prev => prev.map(c => c.id === id ? data : c));
      toast({
        title: "Sucesso",
        description: "Custo fixo atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar custo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar custo fixo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCusto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custos_fixos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustos(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Sucesso",
        description: "Custo fixo removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar custo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover custo fixo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteManyeCustos = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('custos_fixos')
        .delete()
        .in('id', ids);

      if (error) throw error;

      setCustos(prev => prev.filter(c => !ids.includes(c.id)));
      toast({
        title: "Sucesso",
        description: `${ids.length} custos fixos removidos com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao deletar custos:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover custos fixos",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustos();
  }, [mesReferencia]);

  const totalPorCategoria = custos.reduce((acc, custo) => {
    acc[custo.categoria] = (acc[custo.categoria] || 0) + Number(custo.valor);
    return acc;
  }, {} as Record<string, number>);

  const totalGeral = custos.reduce((total, custo) => total + Number(custo.valor), 0);

  const maiorCusto = custos.reduce((maior, custo) => {
    return Number(custo.valor) > Number(maior?.valor || 0) ? custo : maior;
  }, null as CustoFixo | null);

  return {
    custos,
    loading,
    createCusto,
    updateCusto,
    deleteCusto,
    deleteManyeCustos,
    refetch: fetchCustos,
    totalPorCategoria,
    totalGeral,
    maiorCusto
  };
}