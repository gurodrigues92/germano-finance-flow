import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionMobileCard } from './TransactionMobileCard';
import { formatDateDisplay } from '@/lib/dateUtils';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onLongPress?: (transactionId: string) => void;
  isSelectionMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
}

export const TransactionTable = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  onLongPress,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelection
}: TransactionTableProps) => {
  const isMobile = useIsMobile();
  
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Transações do Mês</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma transação encontrada para este mês.
          <br />
          Clique em "Nova Transação" para começar.
        </div>
      ) : isMobile ? (
        // Mobile View - Cards
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionMobileCard
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={handleDelete}
              onLongPress={onLongPress}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(transaction.id)}
              onToggleSelection={onToggleSelection}
            />
          ))}
        </div>
      ) : (
        // Desktop View - Table
        <div className="overflow-x-auto -mx-4 px-4">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Data</TableHead>
                <TableHead className="min-w-[80px]">Dinheiro</TableHead>
                <TableHead className="min-w-[80px]">PIX</TableHead>
                <TableHead className="min-w-[80px]">Débito</TableHead>
                <TableHead className="min-w-[80px]">Crédito</TableHead>
                <TableHead className="min-w-[100px]">Total Bruto</TableHead>
                <TableHead className="min-w-[80px]">Taxas</TableHead>
                <TableHead className="min-w-[100px]">Total Líquido</TableHead>
                <TableHead className="min-w-[100px]">Studio (60%)</TableHead>
                <TableHead className="min-w-[120px]">Prof. (40%)</TableHead>
                <TableHead className="min-w-[100px]">Assist. (4%)</TableHead>
                <TableHead className="text-right min-w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>
                    {formatDateDisplay(transaction.date)}
                  </TableCell>
                    <TableCell>
                      {transaction.dinheiro > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          R$ {transaction.dinheiro.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.pix > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          R$ {transaction.pix.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.debito > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          R$ {transaction.debito.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.credito > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          R$ {transaction.credito.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </Badge>
                      )}
                    </TableCell>
                   <TableCell className="font-medium text-sm">
                      R$ {transaction.totalBruto.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-finance-fees text-sm">
                      R$ {(transaction.taxaDebito + transaction.taxaCredito).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="font-medium text-finance-net text-sm">
                      R$ {transaction.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-finance-studio text-sm">
                      R$ {transaction.studioShare.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-finance-profissional text-sm">
                      R$ {transaction.eduShare.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-finance-assistente text-sm">
                      R$ {transaction.kamShare.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-finance-fees hover:text-finance-fees"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};