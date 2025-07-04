import { useState } from "react";
import { useCustosFixos } from "@/hooks/useCustosFixos";
import { CustosForm } from "@/components/custos/CustosForm";
import { CustosTable } from "@/components/custos/CustosTable";
import { CustosSummary } from "@/components/custos/CustosSummary";
import { CustoFixo } from "@/types/custos";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";

export function CustosFixos() {
  const [editingCusto, setEditingCusto] = useState<CustoFixo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-studio-gold"></div>
        </div>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="p-6">
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
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Custos Fixos</h2>
          <p className="text-sm text-muted-foreground">Gerencie os custos fixos mensais</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-finance-studio hover:bg-finance-studio/90 text-finance-studio-foreground sm:hidden"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Custo
        </Button>
      </div>
      {/* Summary Cards */}
      <CustosSummary
        totalGeral={totalGeral}
        maiorCusto={maiorCusto}
        totalPorCategoria={totalPorCategoria}
        receita={0}
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
    </div>
  );
}