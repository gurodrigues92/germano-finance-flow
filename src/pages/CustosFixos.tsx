import { useState } from "react";
import { useCustosFixos } from "@/hooks/useCustosFixos";
import { CustosForm } from "@/components/custos/CustosForm";
import { CustosTable } from "@/components/custos/CustosTable";
import { CustosSummary } from "@/components/custos/CustosSummary";
import { CustoFixo } from "@/types/custos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus, AlertCircle } from "lucide-react";

export function CustosFixos() {
  const [editingCusto, setEditingCusto] = useState<CustoFixo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  const {
    custos,
    loading,
    createCusto,
    updateCusto,
    deleteCusto,
    deleteManyeCustos,
    totalPorCategoria,
    totalGeral,
    maiorCusto
  } = useCustosFixos(); // Using current month from the hook

  const handleCreate = async (data: any) => {
    try {
      await createCusto(data);
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao criar custo:", error);
      setRenderError("Erro ao criar custo fixo");
    }
  };

  const handleEdit = (custo: CustoFixo) => {
    setEditingCusto(custo);
  };

  const handleUpdate = async (data: any) => {
    try {
      if (editingCusto) {
        await updateCusto(editingCusto.id, data);
        setEditingCusto(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar custo:", error);
      setRenderError("Erro ao atualizar custo fixo");
    }
  };

  const handleDelete = async () => {
    try {
      if (deletingId) {
        await deleteCusto(deletingId);
        setDeletingId(null);
      }
    } catch (error) {
      console.error("Erro ao deletar custo:", error);
      setRenderError("Erro ao deletar custo fixo");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setBulkDeleteIds(ids);
  };

  const handleConfirmBulkDelete = async () => {
    try {
      if (bulkDeleteIds && bulkDeleteIds.length > 0) {
        await deleteManyeCustos(bulkDeleteIds);
        setBulkDeleteIds(null);
      }
    } catch (error) {
      console.error("Erro ao deletar custos:", error);
      setRenderError("Erro ao deletar custos fixos");
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Custos Fixos"
        subtitle="Gerencie os custos fixos mensais do seu negócio"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (renderError) {
    return (
      <PageLayout
        title="Custos Fixos"
        subtitle="Gerencie os custos fixos mensais do seu negócio"
      >
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erro ao carregar página
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{renderError}</p>
            <Button onClick={() => setRenderError(null)} variant="outline">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Custos Fixos"
      subtitle="Gerencie os custos fixos mensais do seu negócio"
      onFabClick={() => setShowForm(true)}
      fabIcon={<Plus className="h-5 w-5" />}
    >
      {/* Summary Cards */}
      <CustosSummary
        totalGeral={totalGeral}
        maiorCusto={maiorCusto}
        totalPorCategoria={totalPorCategoria}
        receita={0}
      />

      {/* Main Table */}
      <CustosTable
        custos={custos}
        onEdit={handleEdit}
        onDelete={setDeletingId}
        onBulkDelete={handleBulkDelete}
      />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Custo Fixo</DialogTitle>
          </DialogHeader>
          <CustosForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCusto} onOpenChange={() => setEditingCusto(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Custo Fixo</DialogTitle>
          </DialogHeader>
          {editingCusto && (
            <CustosForm
              onSubmit={handleUpdate}
              initialData={editingCusto}
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
              Tem certeza de que deseja excluir este custo fixo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={!!bulkDeleteIds} onOpenChange={() => setBulkDeleteIds(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir {bulkDeleteIds?.length} custos fixos selecionados? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmBulkDelete} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Excluir Todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}