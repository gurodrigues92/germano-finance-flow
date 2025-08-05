import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
// Types moved inline since metas module was removed
interface RelatorioSalvo {
  id: string;
  nome: string;
  tipo: 'mensal' | 'trimestral' | 'anual' | 'personalizado';
  configuracao: Record<string, any>;
  data_inicio?: string;
  data_fim?: string;
  created_at: string;
  updated_at: string;
}

interface RelatorioSalvoInput {
  nome: string;
  tipo: 'mensal' | 'trimestral' | 'anual' | 'personalizado';
  configuracao: Record<string, any>;
  data_inicio?: string;
  data_fim?: string;
}

export const useRelatorios = () => {
  const [relatorios, setRelatorios] = useState<RelatorioSalvo[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar relatórios
  const loadRelatorios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('relatorios_salvos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRelatorios((data || []) as RelatorioSalvo[]);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Salvar relatório
  const saveRelatorio = async (relatorioData: RelatorioSalvoInput) => {
    try {
      const { data, error } = await supabase
        .from('relatorios_salvos')
        .insert([relatorioData])
        .select();

      if (error) throw error;
      if (data) {
        setRelatorios(prev => [data[0] as RelatorioSalvo, ...prev]);
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      return { success: false, error };
    }
  };

  // Deletar relatório
  const deleteRelatorio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('relatorios_salvos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRelatorios(prev => prev.filter(rel => rel.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    loadRelatorios();
  }, []);

  return {
    relatorios,
    loading,
    saveRelatorio,
    deleteRelatorio,
    refetch: loadRelatorios
  };
};