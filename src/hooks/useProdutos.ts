import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Produto, ProdutoInput } from '@/types/estoque';
import { useToast } from '@/hooks/use-toast';

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduto = async (produto: ProdutoInput) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([{ ...produto, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;

      setProdutos(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduto = async (id: string, produto: Partial<ProdutoInput>) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(produto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProdutos(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProdutos(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Produtos com baixo estoque
  const produtosBaixoEstoque = produtos.filter(p => p.estoque_atual <= p.estoque_minimo);
  
  // Valor total do estoque
  const valorTotalEstoque = produtos.reduce((total, produto) => {
    return total + (produto.estoque_atual * (produto.valor_unitario || 0));
  }, 0);

  return {
    produtos,
    loading,
    createProduto,
    updateProduto,
    deleteProduto,
    refetch: fetchProdutos,
    produtosBaixoEstoque,
    valorTotalEstoque
  };
}