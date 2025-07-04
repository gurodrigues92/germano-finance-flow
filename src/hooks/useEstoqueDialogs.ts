import { useState } from "react";
import { Produto } from "@/types/estoque";

export function useEstoqueDialogs() {
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEditProduto = (produto: Produto) => {
    setEditingProduto(produto);
  };

  const handleDeleteProduto = (id: string) => {
    setDeletingId(id);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return {
    editingProduto,
    setEditingProduto,
    deletingId,
    setDeletingId,
    showForm,
    setShowForm,
    handleEditProduto,
    handleDeleteProduto,
    handleShowForm
  };
}