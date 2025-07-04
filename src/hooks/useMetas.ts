import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MetaFinanceira, MetaFinanceiraInput } from '@/types/metas';

export const useMetas = () => {
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar metas
  const loadMetas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('metas_financeiras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetas((data || []) as MetaFinanceira[]);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar meta
  const addMeta = async (metaData: MetaFinanceiraInput) => {
    try {
      const { data, error } = await supabase
        .from('metas_financeiras')
        .insert([metaData])
        .select();

      if (error) throw error;
      if (data) {
        setMetas(prev => [data[0] as MetaFinanceira, ...prev]);
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      return { success: false, error };
    }
  };

  // Atualizar meta
  const updateMeta = async (id: string, metaData: Partial<MetaFinanceiraInput>) => {
    try {
      const { data, error } = await supabase
        .from('metas_financeiras')
        .update(metaData)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data) {
        setMetas(prev => prev.map(meta => 
          meta.id === id ? data[0] as MetaFinanceira : meta
        ));
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      return { success: false, error };
    }
  };

  // Deletar meta
  const deleteMeta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('metas_financeiras')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMetas(prev => prev.filter(meta => meta.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      return { success: false, error };
    }
  };

  // Atualizar progresso da meta
  const updateProgresso = async (id: string, novoValor: number) => {
    return updateMeta(id, { valor_atual: novoValor });
  };

  // Estatísticas das metas
  const getEstatisticas = () => {
    const metasAtivas = metas.filter(m => m.status === 'ativa');
    const metasConcluidas = metas.filter(m => m.status === 'concluida');
    
    const totalMetas = metasAtivas.length;
    const totalValorMetas = metasAtivas.reduce((acc, meta) => acc + meta.valor_meta, 0);
    const totalValorAtual = metasAtivas.reduce((acc, meta) => acc + meta.valor_atual, 0);
    const progressoGeral = totalValorMetas > 0 ? (totalValorAtual / totalValorMetas) * 100 : 0;

    return {
      totalMetas,
      metasConcluidas: metasConcluidas.length,
      totalValorMetas,
      totalValorAtual,
      progressoGeral
    };
  };

  useEffect(() => {
    loadMetas();
  }, []);

  return {
    metas,
    loading,
    addMeta,
    updateMeta,
    deleteMeta,
    updateProgresso,
    getEstatisticas,
    refetch: loadMetas
  };
};