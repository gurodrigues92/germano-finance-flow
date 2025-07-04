import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageLayout } from '@/components/layout/PageLayout';
import { 
  Archive as ArchiveIcon, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const Archive = () => {
  const { transactions, exportToCSV } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Group transactions by month
  const monthlyArchive = useMemo(() => {
    const grouped = transactions.reduce((acc, transaction) => {
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
    <PageLayout 
      title="Arquivo Histórico"
      subtitle="Histórico completo de transações organizadas por mês"
    >
      <div className="flex justify-end mb-6">
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Tudo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meses Arquivados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {monthlyArchive.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ArchiveIcon className="h-4 w-4" />
              Total de Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {transactions.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Faturamento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              {transactions.reduce((sum, t) => sum + t.totalBruto, 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Líquido Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-net">
              {transactions.reduce((sum, t) => sum + t.totalLiquido, 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Archive Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Transações</TableHead>
                    <TableHead>Total Bruto</TableHead>
                    <TableHead>Total Líquido</TableHead>
                    <TableHead>Taxas</TableHead>
                    <TableHead>Studio</TableHead>
                    <TableHead>Edu</TableHead>
                    <TableHead>Kam</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyArchive.map((monthData: any) => (
                    <TableRow key={monthData.month} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {formatMonth(monthData.month)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {monthData.transactions.length} transações
                        </Badge>
                      </TableCell>
                      <TableCell className="text-finance-income font-medium">
                        {monthData.totalBruto.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-finance-net font-medium">
                        {monthData.totalLiquido.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-finance-fees">
                        {monthData.totalTaxas.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-finance-studio">
                        {monthData.totalStudio.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-finance-edu">
                        {monthData.totalEdu.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-finance-kam">
                        {monthData.totalKam.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedMonth(monthData.month)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Detalhes - {formatMonth(monthData.month)}
                                </DialogTitle>
                              </DialogHeader>
                              
                              {selectedMonthData && (
                                <div className="space-y-4">
                                  {/* Month Summary */}
                                  <div className="grid gap-4 md:grid-cols-3">
                                    <div className="text-center p-4 rounded-lg bg-muted/50">
                                      <div className="text-lg font-bold text-finance-income">
                                        {selectedMonthData.totalBruto.toLocaleString('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL'
                                        })}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Total Bruto</div>
                                    </div>
                                    
                                    <div className="text-center p-4 rounded-lg bg-muted/50">
                                      <div className="text-lg font-bold text-finance-net">
                                        {selectedMonthData.totalLiquido.toLocaleString('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL'
                                        })}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Total Líquido</div>
                                    </div>
                                    
                                    <div className="text-center p-4 rounded-lg bg-muted/50">
                                      <div className="text-lg font-bold text-finance-fees">
                                        {selectedMonthData.totalTaxas.toLocaleString('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL'
                                        })}
                                      </div>
                                      <div className="text-sm text-muted-foreground">Total Taxas</div>
                                    </div>
                                  </div>

                                  {/* Transactions Table */}
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
                                          <TableHead>Total Líquido</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedMonthData.transactions.map((transaction: any) => (
                                          <TableRow key={transaction.id}>
                                            <TableCell>
                                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                              {transaction.dinheiro > 0 && (
                                                transaction.dinheiro.toLocaleString('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL'
                                                })
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {transaction.pix > 0 && (
                                                transaction.pix.toLocaleString('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL'
                                                })
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {transaction.debito > 0 && (
                                                transaction.debito.toLocaleString('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL'
                                                })
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {transaction.credito > 0 && (
                                                transaction.credito.toLocaleString('pt-BR', {
                                                  style: 'currency',
                                                  currency: 'BRL'
                                                })
                                              )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                              {transaction.totalBruto.toLocaleString('pt-BR', {
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
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportMonthData(monthData)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};