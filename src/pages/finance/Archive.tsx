import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Archive as ArchiveIcon, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  DollarSign,
  ChevronRight
} from 'lucide-react';

export const Archive = () => {
  const { transactions, exportToCSV } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

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

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Arquivo Histórico</h1>
          <p className="text-muted-foreground">Histórico completo de transações organizadas por mês</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Summary Cards - Mobile First */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {monthlyArchive.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <ArchiveIcon className="h-3 w-3" />
              Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {transactions.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-finance-income">
              {transactions.reduce((sum, t) => sum + t.totalBruto, 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-finance-net">
              {transactions.reduce((sum, t) => sum + t.totalLiquido, 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Archive - Mobile Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArchiveIcon className="h-5 w-5" />
            Arquivo por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyArchive.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum dado arquivado encontrado.
              <br />
              Adicione transações para ver o histórico.
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyArchive.map((monthData: any) => (
                <Card key={monthData.month} className="border bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {formatMonth(monthData.month)}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {monthData.transactions.length} transações
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedMonth(monthData.month)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg">
                                {formatMonth(monthData.month)}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedMonthData && (
                              <div className="space-y-4">
                                {/* Month Summary - Mobile */}
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="text-base font-bold text-finance-income">
                                      {selectedMonthData.totalBruto.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                      })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total Bruto</div>
                                  </div>
                                  
                                  <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="text-base font-bold text-finance-net">
                                      {selectedMonthData.totalLiquido.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                      })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total Líquido</div>
                                  </div>
                                  
                                  <div className="text-center p-3 rounded-lg bg-muted/50">
                                    <div className="text-base font-bold text-finance-fees">
                                      {selectedMonthData.totalTaxas.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                      })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total Taxas</div>
                                  </div>
                                </div>

                                {/* Transactions - Mobile Cards */}
                                <div className="space-y-2">
                                  <h4 className="font-medium">Transações</h4>
                                  {selectedMonthData.transactions.map((transaction: any) => (
                                    <Card key={transaction.id} className="border bg-background">
                                      <CardContent className="p-3">
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="text-sm font-medium">
                                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                          </div>
                                          <div className="text-right">
                                            <div className="text-sm font-bold text-finance-income">
                                              {transaction.totalBruto.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                              })}
                                            </div>
                                            <div className="text-xs text-finance-net">
                                              Líq: {transaction.totalLiquido.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
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
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportMonthData(monthData)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Líquido:</span>
                        <span className="font-medium text-finance-net">
                          {monthData.totalLiquido.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxas:</span>
                        <span className="text-finance-fees">
                          {monthData.totalTaxas.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};