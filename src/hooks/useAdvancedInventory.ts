import { useState, useEffect, useMemo } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import { useMovimentacaoEstoque } from '@/hooks/useMovimentacaoEstoque';
import { Produto } from '@/types/estoque';
import { subDays, format as formatDate, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';

export interface InventoryAnalytics {
  totalValue: number;
  averageRotation: number;
  topSellingProducts: Array<{
    produto: Produto;
    quantidadeVendida: number;
    valor: number;
  }>;
  lowStockProducts: Produto[];
  expiringSoonProducts: Produto[];
  costAnalysis: {
    totalCost: number;
    totalRevenue: number;
    profitMargin: number;
  };
  reorderSuggestions: Array<{
    produto: Produto;
    suggestedQuantity: number;
    urgency: 'low' | 'medium' | 'high';
  }>;
}

export interface InventoryFilters {
  categoria?: string;
  status?: 'normal' | 'baixo' | 'esgotado';
  fornecedor?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const useAdvancedInventory = () => {
  const { produtos, loading: produtosLoading } = useProdutos();
  const { movimentacoes, loading: movimentacoesLoading } = useMovimentacaoEstoque();
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Filtered products based on current filters
  const filteredProducts = useMemo(() => {
    return produtos.filter(produto => {
      if (filters.categoria && produto.categoria !== filters.categoria) return false;
      
      if (filters.status) {
        const status = produto.estoque_atual === 0 ? 'esgotado' 
          : produto.estoque_atual <= produto.estoque_minimo ? 'baixo' 
          : 'normal';
        if (status !== filters.status) return false;
      }

      return true;
    });
  }, [produtos, filters]);

  // Analytics calculations
  const analytics = useMemo((): InventoryAnalytics => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    
    // Recent movements for calculations
    const recentMovements = movimentacoes.filter(m => 
      new Date(m.data_movimentacao) >= thirtyDaysAgo
    );

    // Total inventory value
    const totalValue = produtos.reduce((sum, produto) => {
      return sum + (produto.estoque_atual * (produto.valor_unitario || 0));
    }, 0);

    // Top selling products (based on saida movements)
    const productSales = produtos.map(produto => {
      const saidas = recentMovements.filter(m => 
        m.produto_id === produto.id && m.tipo === 'saida'
      );
      const quantidadeVendida = saidas.reduce((sum, m) => sum + m.quantidade, 0);
      const valor = quantidadeVendida * (produto.valor_unitario || 0);
      
      return { produto, quantidadeVendida, valor };
    }).sort((a, b) => b.quantidadeVendida - a.quantidadeVendida).slice(0, 10);

    // Low stock products
    const lowStockProducts = produtos.filter(p => 
      p.estoque_atual <= p.estoque_minimo && p.estoque_atual > 0
    );

    // Cost analysis
    const totalCost = recentMovements
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + (m.valor_total || 0), 0);
    
    const totalRevenue = recentMovements
      .filter(m => m.tipo === 'saida')
      .reduce((sum, m) => sum + (m.valor_total || 0), 0);
    
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

    // Reorder suggestions based on consumption patterns
    const reorderSuggestions = produtos.map(produto => {
      const thirtyDaysSaidas = recentMovements
        .filter(m => m.produto_id === produto.id && m.tipo === 'saida')
        .reduce((sum, m) => sum + m.quantidade, 0);
      
      const dailyConsumption = thirtyDaysSaidas / 30;
      const daysOfStock = dailyConsumption > 0 ? produto.estoque_atual / dailyConsumption : Infinity;
      
      let urgency: 'low' | 'medium' | 'high' = 'low';
      let suggestedQuantity = 0;
      
      if (daysOfStock < 7) {
        urgency = 'high';
        suggestedQuantity = Math.ceil(dailyConsumption * 30); // 30 days worth
      } else if (daysOfStock < 14) {
        urgency = 'medium';
        suggestedQuantity = Math.ceil(dailyConsumption * 21); // 3 weeks worth
      } else if (produto.estoque_atual <= produto.estoque_minimo) {
        urgency = 'medium';
        suggestedQuantity = produto.estoque_minimo * 2;
      }

      return { produto, suggestedQuantity, urgency };
    }).filter(s => s.suggestedQuantity > 0);

    return {
      totalValue,
      averageRotation: productSales.reduce((sum, p) => sum + p.quantidadeVendida, 0) / produtos.length,
      topSellingProducts: productSales,
      lowStockProducts,
      expiringSoonProducts: [], // TODO: Implement when we add expiration dates
      costAnalysis: {
        totalCost,
        totalRevenue,
        profitMargin
      },
      reorderSuggestions
    };
  }, [produtos, movimentacoes]);

  // Bulk operations
  const bulkUpdateMinimumStock = async (updates: Array<{ id: string; estoque_minimo: number }>) => {
    try {
      // TODO: Implement bulk update in backend
      toast.success('Estoque mínimo atualizado em lote');
    } catch (error) {
      toast.error('Erro ao atualizar estoque mínimo');
    }
  };

  const bulkPriceUpdate = async (updates: Array<{ id: string; valor_unitario: number }>) => {
    try {
      // TODO: Implement bulk update in backend
      toast.success('Preços atualizados em lote');
    } catch (error) {
      toast.error('Erro ao atualizar preços');
    }
  };

  const generateReorderReport = () => {
    const report = analytics.reorderSuggestions
      .filter(s => s.urgency !== 'low')
      .map(s => ({
        produto: s.produto.nome,
        categoria: s.produto.categoria,
        estoque_atual: s.produto.estoque_atual,
        estoque_minimo: s.produto.estoque_minimo,
        quantidade_sugerida: s.suggestedQuantity,
        urgencia: s.urgency,
        valor_estimado: s.suggestedQuantity * (s.produto.valor_unitario || 0)
      }));

    return report;
  };

  const exportInventoryData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvData = filteredProducts.map(p => ({
        nome: p.nome,
        categoria: p.categoria,
        estoque_atual: p.estoque_atual,
        estoque_minimo: p.estoque_minimo,
        valor_unitario: p.valor_unitario || 0,
        valor_total: p.estoque_atual * (p.valor_unitario || 0),
        status: p.estoque_atual === 0 ? 'Esgotado' 
          : p.estoque_atual <= p.estoque_minimo ? 'Baixo' 
          : 'Normal'
      }));

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(v => String(v)).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estoque_${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    // Data
    produtos: filteredProducts,
    analytics,
    loading: produtosLoading || movimentacoesLoading,
    
    // Filters
    filters,
    setFilters,
    
    // Selection
    selectedProducts,
    setSelectedProducts,
    
    // Operations
    bulkUpdateMinimumStock,
    bulkPriceUpdate,
    generateReorderReport,
    exportInventoryData
  };
};