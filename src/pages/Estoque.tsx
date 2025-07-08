import { useProdutos } from "@/hooks/useProdutos";
import { useMovimentacaoEstoque } from "@/hooks/useMovimentacaoEstoque";
import { useEstoqueDialogs } from "@/hooks/useEstoqueDialogs";
import { MovimentacaoTabs } from "@/components/estoque/MovimentacaoTabs";
import { EstoqueAlerts } from "@/components/estoque/EstoqueAlerts";
import { ProdutosTable } from "@/components/estoque/ProdutosTable";
import { EstoqueSummaryCards } from "@/components/estoque/EstoqueSummaryCards";
import { EstoqueDialogs } from "@/components/estoque/EstoqueDialogs";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus } from "lucide-react";

export function Estoque() {
  const {
    produtos,
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

  if (produtosLoading) {
    return (
      <PageLayout title="Estoque" subtitle="Gestão de produtos e movimentação de estoque">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-gold"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Estoque" 
      subtitle="Gestão de produtos e movimentação de estoque"
      onFabClick={handleShowForm}
      fabIcon={<Plus className="h-5 w-5" />}
    >
      <EstoqueSummaryCards
        totalProdutos={produtos.length}
        valorTotalEstoque={valorTotalEstoque}
        produtosBaixoEstoque={produtosBaixoEstoque.length}
      />

      <EstoqueAlerts
        produtosBaixoEstoque={produtosBaixoEstoque}
        totalProdutos={produtos.length}
      />

      {produtos.length > 0 && (
        <MovimentacaoTabs
          produtos={produtos}
          onSubmit={createMovimentacao}
        />
      )}

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

      <ProdutosTable
        produtos={produtos}
        onEdit={handleEditProduto}
        onDelete={handleDeleteId}
      />
    </PageLayout>
  );
}