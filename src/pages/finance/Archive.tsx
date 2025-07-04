import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { useToast } from '@/hooks/use-toast';
import { 
  Archive as ArchiveIcon, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';

export const Archive = () => {
  const { transactions, exportToCSV, updateTransaction, deleteTransaction, loading } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();

  // Group transactions by month (2025 onwards only)
  const monthlyArchive = useMemo(() => {
    // Filter transactions from 2025 onwards only
    const filteredTransactions = transactions.filter(t => 
      new Date(t.date).getFullYear() >= 2025
    );
    
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const month = transaction.month;
      if (!acc[month]) {
        acc[month] = {
          month,
          year: transaction.year,
          transactions: [],
          totalBruto: 0,
          totalLiquido: 0,
          totalTaxas: 0,
          totalStudio: 0,
          totalEdu: 0,
          totalKam: 0
        };
      }
      
      acc[month].transactions.push(transaction);
      acc[month].totalBruto += transaction.totalBruto;
      acc[month].totalLiquido += transaction.totalLiquido;
      acc[month].totalTaxas += transaction.taxaDebito + transaction.taxaCredito;
      acc[month].totalStudio += transaction.studioShare;
      acc[month].totalEdu += transaction.eduShare;
      acc[month].totalKam += transaction.kamShare;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).sort((a: any, b: any) => b.month.localeCompare(a.month));
  }, [transactions]);

  const selectedMonthData = useMemo(() => {
    return monthlyArchive.find((month: any) => month.month === selectedMonth);
  }, [monthlyArchive, selectedMonth]);

  const formatMonth = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const exportMonthData = (monthData: any) => {
    try {
      const headers = [
        'Data',
        'Dinheiro',
        'PIX',
        'Débito',
        'Crédito',
        'Total Bruto',
        'Taxa Débito',
        'Taxa Crédito',
        'Total Líquido',
        'Studio (60%)',
        'Edu (40%)',
        'Kam (10%)'
      ];

      const csvContent = [
        headers.join(','),
        ...monthData.transactions.map((t: any) => [
          t.date,
          t.dinheiro,
          t.pix,
          t.debito,
          t.credito,
          t.totalBruto,
          t.taxaDebito,
          t.taxaCredito,
          t.totalLiquido,
          t.studioShare,
          t.eduShare,
          t.kamShare
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studio_germano_${monthData.month}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[Financeiro] Error exporting month data:', error);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditForm(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
    toast({
      title: "Transação excluída",
      description: "A transação foi removida do arquivo."
    });
  };

  const handleFormSubmit = (formData: any, isEditing: boolean) => {
    if (isEditing && editingTransaction) {
      updateTransaction(editingTransaction.id, {
        date: formData.date,
        dinheiro: parseFloat(formData.dinheiro) || 0,
        pix: parseFloat(formData.pix) || 0,
        debito: parseFloat(formData.debito) || 0,
        credito: parseFloat(formData.credito) || 0
      });
      setEditingTransaction(null);
      setShowEditForm(false);
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada no arquivo."
      });
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Arquivo Histórico</h1>
          <p className="text-muted-foreground mt-1">Histórico completo de transações organizadas por mês</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {monthlyArchive.length}
          </div>
          <div className="text-sm text-muted-foreground">Meses</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {transactions.length}
          </div>
          <div className="text-sm text-muted-foreground">Transações</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {transactions.reduce((sum, t) => sum + t.totalBruto, 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
          <div className="text-sm text-muted-foreground">Faturamento</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {transactions.reduce((sum, t) => sum + t.totalLiquido, 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </div>
          <div className="text-sm text-muted-foreground">Líquido</div>
        </div>
      </div>

      {/* Monthly Archive */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Arquivo por Mês</h2>
        
        {monthlyArchive.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum dado arquivado encontrado.</p>
            <p className="text-sm mt-1">Adicione transações para ver o histórico.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {monthlyArchive.map((monthData: any) => (
              <div key={monthData.month} className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {formatMonth(monthData.month)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {monthData.transactions.length} transações
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedMonth(monthData.month)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {formatMonth(monthData.month)}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedMonthData && (
                          <div className="space-y-6">
                            {/* Month Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-4 border border-border rounded-lg">
                                <div className="text-xl font-bold text-foreground">
                                  {selectedMonthData.totalBruto.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  })}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Bruto</div>
                              </div>
                              
                              <div className="text-center p-4 border border-border rounded-lg">
                                <div className="text-xl font-bold text-foreground">
                                  {selectedMonthData.totalLiquido.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  })}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Líquido</div>
                              </div>
                              
                              <div className="text-center p-4 border border-border rounded-lg">
                                <div className="text-xl font-bold text-foreground">
                                  {selectedMonthData.totalTaxas.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  })}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Taxas</div>
                              </div>
                            </div>

                            {/* Transactions List */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-foreground">Transações</h4>
                              {selectedMonthData.transactions.map((transaction: any) => (
                                <div key={transaction.id} className="border border-border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="text-sm font-medium text-foreground">
                                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
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
                                      onClick={() => handleEditTransaction(transaction)}
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
                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      onClick={() => exportMonthData(monthData)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Líquido:</span>
                    <span className="font-semibold text-foreground">
                      {monthData.totalLiquido.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxas:</span>
                    <span className="font-semibold text-foreground">
                      {monthData.totalTaxas.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Transaction Form */}
      <TransactionForm 
        isOpen={showEditForm}
        onOpenChange={setShowEditForm}
        editingTransaction={editingTransaction}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  );
};