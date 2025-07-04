import { useState } from "react";
import { useCustosFixos } from "@/hooks/useCustosFixos";
import { CustosForm } from "@/components/custos/CustosForm";
import { CustosTable } from "@/components/custos/CustosTable";
import { CustosSummary } from "@/components/custos/CustosSummary";
import { CustoFixo } from "@/types/custos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageLayout } from "@/components/layout/PageLayout";
import { Plus } from "lucide-react";

export function CustosFixos() {
  const [editingCusto, setEditingCusto] = useState<CustoFixo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    custos,
    loading,
    createCusto,
    updateCusto,
    deleteCusto,
    totalPorCategoria,
    totalGeral,
    maiorCusto
  } = useCustosFixos();

  const handleCreate = async (data: any) => {
    await createCusto(data);
    setShowForm(false);
  };

  const handleEdit = (custo: CustoFixo) => {
    setEditingCusto(custo);
  };

  const handleUpdate = async (data: any) => {
    if (editingCusto) {
      await updateCusto(editingCusto.id, data);
      setEditingCusto(null);
    }
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteCusto(deletingId);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout 
      title="Custos Fixos"
      subtitle="Gerencie os custos fixos mensais"
      onFabClick={() => setShowForm(true)}
    >
      {/* Summary Cards */}
      <CustosSummary
        totalGeral={totalGeral}
        maiorCusto={maiorCusto}
        totalPorCategoria={totalPorCategoria}
      />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Custo Fixo</DialogTitle>
          </DialogHeader>
          <CustosForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCusto} onOpenChange={() => setEditingCusto(null)}>
        <DialogContent className="max-w-4xl">
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table */}
      <CustosTable
        custos={custos}
        onEdit={handleEdit}
        onDelete={setDeletingId}
      />
    </PageLayout>
  );
}