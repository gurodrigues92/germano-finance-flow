import { useProdutos } from "@/hooks/useProdutos";
import { useMovimentacaoEstoque } from "@/hooks/useMovimentacaoEstoque";
import { useEstoqueDialogs } from "@/hooks/useEstoqueDialogs";
import { useAdvancedInventory } from "@/hooks/useAdvancedInventory";
import { MovimentacaoTabs } from "@/components/estoque/MovimentacaoTabs";
import { EstoqueAlerts } from "@/components/estoque/EstoqueAlerts";
import { AdvancedInventoryDashboard } from "@/components/estoque/AdvancedInventoryDashboard";
import { InventoryFilters } from "@/components/estoque/InventoryFilters";
import { BulkOperations } from "@/components/estoque/BulkOperations";
import { AdvancedProdutosTable } from "@/components/estoque/AdvancedProdutosTable";
import { EstoqueDialogs } from "@/components/estoque/EstoqueDialogs";
import { PageLayout } from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, Package } from "lucide-react";

export function Estoque() {
  const {
    produtos: allProdutos,
    loading: produtosLoading,
    createProduto,
    updateProduto,
    deleteProduto,
    produtosBaixoEstoque,
    valorTotalEstoque
  } = useProdutos();

  const {
    createMovimentacao
  } = useMovimentacaoEstoque();

  const {
    produtos: filteredProdutos,
    analytics,
    loading: analyticsLoading,
    filters,
    setFilters,
    selectedProducts,
    setSelectedProducts,
    bulkUpdateMinimumStock,
    bulkPriceUpdate
  } = useAdvancedInventory();

  const {
    editingProduto,
    setEditingProduto,
    deletingId,
    setDeletingId,
    showForm,
    setShowForm,
    handleEditProduto,
    handleDeleteProduto: handleDeleteId,
    handleShowForm
  } = useEstoqueDialogs();

  const handleCreateProduto = async (data: any) => {
    await createProduto(data);
    setShowForm(false);
  };

  const handleUpdateProduto = async (data: any) => {
    if (editingProduto) {
      await updateProduto(editingProduto.id, data);
      setEditingProduto(null);
    }
  };

  const handleDeleteProduto = async () => {
    if (deletingId) {
      await deleteProduto(deletingId);
      setDeletingId(null);
    }
  };

  if (produtosLoading || analyticsLoading) {
    return (
      <PageLayout title="Estoque Avançado" subtitle="Gestão inteligente de produtos e estoque">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Estoque Avançado" 
      subtitle="Gestão inteligente de produtos e estoque"
      onFabClick={handleShowForm}
      fabIcon={<Plus className="h-5 w-5" />}
    >
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="bulk">Operações em Lote</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AdvancedInventoryDashboard />
          
          <EstoqueAlerts
            produtosBaixoEstoque={produtosBaixoEstoque}
            totalProdutos={allProdutos.length}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <InventoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalProducts={allProdutos.length}
            filteredCount={filteredProdutos.length}
          />

          <AdvancedProdutosTable
            produtos={filteredProdutos}
            selectedProducts={selectedProducts}
            onSelectionChange={setSelectedProducts}
            onEdit={handleEditProduto}
            onDelete={handleDeleteId}
            analytics={analytics}
          />
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          {allProdutos.length > 0 && (
            <MovimentacaoTabs
              produtos={allProdutos}
              onSubmit={createMovimentacao}
            />
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <BulkOperations
            selectedProducts={selectedProducts}
            onSelectionChange={setSelectedProducts}
            produtos={allProdutos}
            onBulkUpdateMinimumStock={bulkUpdateMinimumStock}
            onBulkPriceUpdate={bulkPriceUpdate}
          />
        </TabsContent>
      </Tabs>

      <EstoqueDialogs
        showForm={showForm}
        setShowForm={setShowForm}
        editingProduto={editingProduto}
        setEditingProduto={setEditingProduto}
        deletingId={deletingId}
        setDeletingId={setDeletingId}
        onCreateProduto={handleCreateProduto}
        onUpdateProduto={handleUpdateProduto}
        onDeleteProduto={handleDeleteProduto}
      />
    </PageLayout>
  );
}