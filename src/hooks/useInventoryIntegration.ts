import { useCallback } from 'react';
import { useMovimentacaoEstoque } from '@/hooks/useMovimentacaoEstoque';
import { useProdutos } from '@/hooks/useProdutos';
import { toast } from 'sonner';

export const useInventoryIntegration = () => {
  const { createMovimentacao } = useMovimentacaoEstoque();
  const { produtos } = useProdutos();

  // Function to automatically update inventory when products are sold
  const processInventorySale = useCallback(async (items: Array<{
    produto_id: string;
    quantidade: number;
    valor_unitario: number;
  }>, comandaId: string) => {
    try {
      for (const item of items) {
        const produto = produtos.find(p => p.id === item.produto_id);
        
        if (!produto) {
          console.warn(`Produto não encontrado: ${item.produto_id}`);
          continue;
        }

        // Check if there's enough stock
        if (produto.estoque_atual < item.quantidade) {
          toast.error(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque_atual}, Solicitado: ${item.quantidade}`);
          continue;
        }

        // Create stock movement for the sale
        await createMovimentacao({
          produto_id: item.produto_id,
          tipo: 'saida',
          quantidade: item.quantidade,
          motivo: 'Uso em atendimento',
          valor_total: item.valor_unitario * item.quantidade,
          data_movimentacao: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Erro ao processar saída de estoque:', error);
      toast.error('Erro ao atualizar estoque automaticamente');
    }
  }, [createMovimentacao, produtos]);

  // Function to check if a product has low stock
  const checkLowStock = useCallback((produtoId: string): boolean => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return false;
    return produto.estoque_atual <= produto.estoque_minimo;
  }, [produtos]);

  // Function to get available stock for a product
  const getAvailableStock = useCallback((produtoId: string): number => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto?.estoque_atual || 0;
  }, [produtos]);

  // Function to validate if sale is possible with current stock
  const validateSale = useCallback((items: Array<{
    produto_id: string;
    quantidade: number;
  }>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    for (const item of items) {
      const produto = produtos.find(p => p.id === item.produto_id);
      
      if (!produto) {
        errors.push(`Produto não encontrado`);
        continue;
      }

      if (produto.estoque_atual < item.quantidade) {
        errors.push(`${produto.nome}: estoque insuficiente (disponível: ${produto.estoque_atual}, solicitado: ${item.quantidade})`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }, [produtos]);

  return {
    processInventorySale,
    checkLowStock,
    getAvailableStock,
    validateSale
  };
};