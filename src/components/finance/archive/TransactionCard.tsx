import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { formatDateDisplay } from '@/lib/dateUtils';

interface TransactionCardProps {
  transaction: any;
  onEdit: (transaction: any) => void;
  onDelete: (transactionId: string) => void;
}

export const TransactionCard = ({ transaction, onEdit, onDelete }: TransactionCardProps) => {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-foreground">
          {formatDateDisplay(transaction.date)}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">
            {transaction.totalBruto.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
          <div className="text-sm text-muted-foreground">
            Líquido: {transaction.totalLiquido.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
        {transaction.dinheiro > 0 && (
          <div>Dinheiro: {transaction.dinheiro.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</div>
        )}
        {transaction.pix > 0 && (
          <div>PIX: {transaction.pix.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</div>
        )}
        {transaction.debito > 0 && (
          <div>Débito: {transaction.debito.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</div>
        )}
        {transaction.credito > 0 && (
          <div>Crédito: {transaction.credito.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</div>
        )}
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(transaction)}
          className="gap-1"
        >
          <Edit className="h-3 w-3" />
          Editar
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(transaction.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};