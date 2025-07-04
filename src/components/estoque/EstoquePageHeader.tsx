import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EstoquePageHeaderProps {
  onAddProduct: () => void;
}

export function EstoquePageHeader({ onAddProduct }: EstoquePageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Controle de Estoque</h2>
        <p className="text-sm text-muted-foreground">Gerencie produtos e movimentações</p>
      </div>
      <Button 
        onClick={onAddProduct}
        className="bg-finance-studio hover:bg-finance-studio/90 text-finance-studio-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        Novo Produto
      </Button>
    </div>
  );
}