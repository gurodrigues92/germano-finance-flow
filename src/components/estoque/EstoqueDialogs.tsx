import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProdutoForm } from "./ProdutoForm";
import { Produto } from "@/types/estoque";

interface EstoqueDialogsProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingProduto: Produto | null;
  setEditingProduto: (produto: Produto | null) => void;
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  onCreateProduto: (data: any) => Promise<void>;
  onUpdateProduto: (data: any) => Promise<void>;
  onDeleteProduto: () => Promise<void>;
}

export function EstoqueDialogs({
  showForm,
  setShowForm,
  editingProduto,
  setEditingProduto,
  deletingId,
  setDeletingId,
  onCreateProduto,
  onUpdateProduto,
  onDeleteProduto
}: EstoqueDialogsProps) {
  return (
    <>
      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Produto</DialogTitle>
          </DialogHeader>
          <ProdutoForm onSubmit={onCreateProduto} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduto} onOpenChange={() => setEditingProduto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduto && (
            <ProdutoForm
              onSubmit={onUpdateProduto}
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
            <AlertDialogAction onClick={onDeleteProduto} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}