import { useState, useRef } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Upload, Download, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormData {
  date: string;
  dinheiro: string;
  pix: string;
  debito: string;
  credito: string;
}

export const Transactions = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    loading, 
    currentMonth,
    importFromCSV,
    loadSampleData,
    exportToCSV
  } = useFinance();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    dinheiro: '',
    pix: '',
    debito: '',
    credito: ''
  });

  // Cálculo em tempo real dos valores
  const previewCalculation = () => {
    const dinheiro = parseFloat(formData.dinheiro) || 0;
    const pix = parseFloat(formData.pix) || 0;
    const debito = parseFloat(formData.debito) || 0;
    const credito = parseFloat(formData.credito) || 0;
    
    const totalBruto = dinheiro + pix + debito + credito;
    const taxaDebito = debito * 0.0161;
    const taxaCredito = credito * 0.0351;
    const totalLiquido = totalBruto - taxaDebito - taxaCredito;
    
    return {
      totalBruto,
      taxaDebito,
      taxaCredito,
      totalLiquido,
      studioShare: totalLiquido * 0.6,
      eduShare: totalLiquido * 0.4,
      kamShare: totalLiquido * 0.1
    };
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      dinheiro: '',
      pix: '',
      debito: '',
      credito: ''
    });
    setEditingTransaction(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      date: formData.date,
      dinheiro: parseFloat(formData.dinheiro) || 0,
      pix: parseFloat(formData.pix) || 0,
      debito: parseFloat(formData.debito) || 0,
      credito: parseFloat(formData.credito) || 0
    };

    if (data.dinheiro + data.pix + data.debito + data.credito <= 0) {
      toast({
        title: "Erro",
        description: "Informe pelo menos um valor para a transação",
        variant: "destructive"
      });
      return;
    }

    console.log('[Financeiro] Submitting transaction:', data);
    
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      resetForm();
      setIsOpen(false);
    } else {
      addTransaction(data);
      resetForm();
      setIsOpen(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      dinheiro: transaction.dinheiro.toString(),
      pix: transaction.pix.toString(),
      debito: transaction.debito.toString(),
      credito: transaction.credito.toString()
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromCSV(file);
      event.target.value = ''; // Reset input
    }
  };

  const currentMonthTransactions = transactions.filter(t => t.month === currentMonth);

  const totals = currentMonthTransactions.reduce(
    (acc, t) => ({
      bruto: acc.bruto + t.totalBruto,
      liquido: acc.liquido + t.totalLiquido,
      taxas: acc.taxas + t.taxaDebito + t.taxaCredito
    }),
    { bruto: 0, liquido: 0, taxas: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Transações</h1>
          <p className="text-muted-foreground">
            Adicione e gerencie as transações do Studio Germano
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-finance-income hover:bg-finance-income/90 text-finance-income-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dinheiro">Dinheiro (R$)</Label>
                    <Input
                      id="dinheiro"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.dinheiro}
                      onChange={(e) => setFormData(prev => ({ ...prev, dinheiro: e.target.value }))}
                      className="text-lg p-3"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pix">PIX (R$)</Label>
                    <Input
                      id="pix"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.pix}
                      onChange={(e) => setFormData(prev => ({ ...prev, pix: e.target.value }))}
                      className="text-lg p-3"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debito">Débito (R$)</Label>
                    <Input
                      id="debito"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.debito}
                      onChange={(e) => setFormData(prev => ({ ...prev, debito: e.target.value }))}
                      className="text-lg p-3"
                    />
                    <p className="text-xs text-muted-foreground">Taxa: 1,61%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="credito">Crédito (R$)</Label>
                    <Input
                      id="credito"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      value={formData.credito}
                      onChange={(e) => setFormData(prev => ({ ...prev, credito: e.target.value }))}
                      className="text-lg p-3"
                    />
                    <p className="text-xs text-muted-foreground">Taxa: 3,51%</p>
                  </div>
                </div>

                {/* Preview dos cálculos */}
                {(formData.dinheiro || formData.pix || formData.debito || formData.credito) && (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-sm">Preview dos Cálculos:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Bruto:</span>
                        <span className="ml-2 font-medium text-finance-income">
                          {previewCalculation().totalBruto.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Líquido:</span>
                        <span className="ml-2 font-medium text-finance-net">
                          {previewCalculation().totalLiquido.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Studio (60%):</span>
                        <span className="ml-2 font-medium text-finance-studio">
                          {previewCalculation().studioShare.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Edu (40%):</span>
                        <span className="ml-2 font-medium text-finance-edu">
                          {previewCalculation().eduShare.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1 text-lg py-3">
                    {editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          
          <Button 
            variant="outline" 
            onClick={loadSampleData}
            disabled={loading}
          >
            <Database className="mr-2 h-4 w-4" />
            Dados Exemplo
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Bruto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-income">
              {totals.bruto.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-net">
              {totals.liquido.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Taxas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-finance-fees">
              {totals.taxas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Transações do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentMonthTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada para este mês.
              <br />
              Clique em "Nova Transação" para começar.
            </div>
          ) : (
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
                    <TableHead>Edu (40%)</TableHead>
                    <TableHead>Kam (10%)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonthTransactions.map((transaction) => (
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
                      <TableCell className="text-finance-edu">
                        {transaction.eduShare.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell className="text-finance-kam">
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
                            onClick={() => handleEdit(transaction)}
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
        </CardContent>
      </Card>
    </div>
  );
};