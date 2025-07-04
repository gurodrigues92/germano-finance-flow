import { useState } from "react";
import { useProdutos } from "@/hooks/useProdutos";
import { useMovimentacaoEstoque } from "@/hooks/useMovimentacaoEstoque";
import { ProdutoForm } from "@/components/estoque/ProdutoForm";
import { MovimentacaoTabs } from "@/components/estoque/MovimentacaoTabs";
import { EstoqueAlerts } from "@/components/estoque/EstoqueAlerts";
import { ProdutosTable } from "@/components/estoque/ProdutosTable";
import { Produto } from "@/types/estoque";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, Package, DollarSign, TrendingDown } from "lucide-react";

export function Estoque() {
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleCreateProduto = async (data: any) => {
    await createProduto(data);
    setShowForm(false);
  };

  const handleEditProduto = (produto: Produto) => {
    setEditingProduto(produto);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (produtosLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Controle de Estoque</h2>
        <p className="text-muted-foreground">Gerencie produtos e movimentações</p>
      </div>
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{produtos.length}</div>
            <p className="text-xs text-muted-foreground">
              produtos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total do Estoque
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">{formatCurrency(valorTotalEstoque)}</div>
            <p className="text-xs text-muted-foreground">
              valor estimado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos Baixo Estoque
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-fees">{produtosBaixoEstoque.length}</div>
            <p className="text-xs text-muted-foreground">
              precisam de atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estoque */}
      <EstoqueAlerts
        produtosBaixoEstoque={produtosBaixoEstoque}
        totalProdutos={produtos.length}
      />

      {/* Movimentação de Estoque */}
      {produtos.length > 0 && (
        <MovimentacaoTabs
          produtos={produtos}
          onSubmit={createMovimentacao}
        />
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Produto</DialogTitle>
          </DialogHeader>
          <ProdutoForm onSubmit={handleCreateProduto} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduto} onOpenChange={() => setEditingProduto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduto && (
            <ProdutoForm
              onSubmit={handleUpdateProduto}
              initialData={editingProduto}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir este produto? Esta ação não pode ser desfeita e removerá também todo o histórico de movimentações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduto} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tabela de Produtos */}
      <ProdutosTable
        produtos={produtos}
        onEdit={handleEditProduto}
        onDelete={setDeletingId}
      />
    </div>
  );
}