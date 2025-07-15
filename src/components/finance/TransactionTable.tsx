import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionMobileCard } from './TransactionMobileCard';

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
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      onDelete(id);
    }
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Dinheiro</TableHead>
                <TableHead>PIX</TableHead>
                <TableHead>Débito</TableHead>
                <TableHead>Crédito</TableHead>
                <TableHead>Total Bruto</TableHead>
                <TableHead>Taxas</TableHead>
                <TableHead>Total Líquido</TableHead>
                <TableHead>Studio (60%)</TableHead>
                <TableHead>Profissional (40%)</TableHead>
                <TableHead>Assistente (4%)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {transaction.dinheiro > 0 && (
                      <Badge variant="secondary">
                        {transaction.dinheiro.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.pix > 0 && (
                      <Badge variant="secondary">
                        {transaction.pix.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.debito > 0 && (
                      <Badge variant="secondary">
                        {transaction.debito.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.credito > 0 && (
                      <Badge variant="secondary">
                        {transaction.credito.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.totalBruto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                  <TableCell className="text-finance-fees">
                    {(transaction.taxaDebito + transaction.taxaCredito).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-finance-net">
                    {transaction.totalLiquido.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                  <TableCell className="text-finance-studio">
                    {transaction.studioShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                  <TableCell className="text-finance-profissional">
                    {transaction.eduShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                  <TableCell className="text-finance-assistente">
                    {transaction.kamShare.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
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