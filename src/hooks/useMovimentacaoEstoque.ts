import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MovimentacaoEstoque, MovimentacaoInput } from '@/types/estoque';
import { useToast } from '@/hooks/use-toast';

export function useMovimentacaoEstoque(produtoId?: string) {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('movimentacao_estoque')
        .select('*')
        .order('data_movimentacao', { ascending: false })
        .order('created_at', { ascending: false });

      if (produtoId) {
        query = query.eq('produto_id', produtoId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMovimentacoes((data as MovimentacaoEstoque[]) || []);
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar movimentações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMovimentacao = async (movimentacao: MovimentacaoInput) => {
    try {
      const { data, error } = await supabase
        .from('movimentacao_estoque')
        .insert([movimentacao])
        .select()
        .single();

      if (error) throw error;

      setMovimentacoes(prev => [data as MovimentacaoEstoque, ...prev]);
      toast({
        title: "Sucesso",
        description: `${movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso`,
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar movimentação",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMovimentacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movimentacao_estoque')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMovimentacoes(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Sucesso",
        description: "Movimentação removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar movimentação:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover movimentação",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, [produtoId]);

  // Estatísticas dos últimos 30 dias
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 30);

  const movimentacoesRecentes = movimentacoes.filter(m => 
    new Date(m.data_movimentacao) >= dataLimite
  );

  const entradasRecentes = movimentacoesRecentes.filter(m => m.tipo === 'entrada');
  const saidasRecentes = movimentacoesRecentes.filter(m => m.tipo === 'saida');

  return {
    movimentacoes,
    loading,
    createMovimentacao,
    deleteMovimentacao,
    refetch: fetchMovimentacoes,
    movimentacoesRecentes,
    entradasRecentes,
    saidasRecentes
  };
}