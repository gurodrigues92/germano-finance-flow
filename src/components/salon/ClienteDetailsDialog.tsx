import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Cliente, ClienteFormData } from '@/types/salon';
import { useClientes } from '@/hooks/salon/useClientes';
import { useComandas } from '@/hooks/salon/useComandas';
import { formatCurrency, formatDate } from '@/lib/formatUtils';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit, 
  DollarSign, 
  History,
  CreditCard,
  Plus,
  Minus,
  Receipt
} from 'lucide-react';

interface ClienteDetailsDialogProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClienteDetailsDialog = ({
  cliente,
  isOpen,
  onOpenChange
}: ClienteDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSaldo, setIsAddingSaldo] = useState(false);
  const [saldoValue, setSaldoValue] = useState('');
  const [saldoMotivo, setSaldoMotivo] = useState('');
  
  const { updateCliente, updateSaldoCliente } = useClientes();
  const { comandas, loading: comandasLoading } = useComandas();

  const [formData, setFormData] = useState<ClienteFormData>({
    nome: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    endereco: '',
    observacoes: ''
  });

  React.useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        data_nascimento: cliente.data_nascimento || '',
        endereco: cliente.endereco || '',
        observacoes: cliente.observacoes || ''
      });
    }
  }, [cliente]);

  const clienteComandas = comandas.filter(c => c.cliente_id === cliente?.id);
  const totalAtendimentos = clienteComandas.length;
  const valorTotalGasto = clienteComandas.reduce((sum, c) => sum + c.total_liquido, 0);
  const ultimoAtendimento = clienteComandas.sort((a, b) => 
    new Date(b.data_abertura).getTime() - new Date(a.data_abertura).getTime()
  )[0];

  const handleSaveEdit = async () => {
    if (!cliente) return;
    
    try {
      await updateCliente(cliente.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleUpdateSaldo = async (tipo: 'credito' | 'debito') => {
    if (!cliente || !saldoValue) return;
    
    try {
      const valor = parseFloat(saldoValue);
      const novoSaldo = tipo === 'credito' 
        ? cliente.saldo + valor 
        : cliente.saldo - valor;
      
      await updateSaldoCliente(cliente.id, novoSaldo);
      setIsAddingSaldo(false);
      setSaldoValue('');
      setSaldoMotivo('');
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
    }
  };

  if (!cliente) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              {cliente.nome}
              {!cliente.ativo && (
                <Badge variant="destructive">Inativo</Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Nome completo</Label>
                        <Input
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de nascimento</Label>
                        <Input
                          type="date"
                          value={formData.data_nascimento}
                          onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {cliente.telefone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{cliente.telefone}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{cliente.email}</span>
                        </div>
                      )}
                      {cliente.data_nascimento && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDate(cliente.data_nascimento)}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Endereço e Observações */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endereço & Observações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label>Endereço</Label>
                        <Textarea
                          value={formData.endereco}
                          onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Observações</Label>
                        <Textarea
                          value={formData.observacoes}
                          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {cliente.endereco && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Endereço</span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6">{cliente.endereco}</p>
                        </div>
                      )}
                      {cliente.observacoes && (
                        <div className="space-y-1">
                          <span className="font-medium">Observações</span>
                          <p className="text-sm text-muted-foreground">{cliente.observacoes}</p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Salvar alterações
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{totalAtendimentos}</div>
                  <div className="text-sm text-muted-foreground">Atendimentos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{formatCurrency(valorTotalGasto, true)}</div>
                  <div className="text-sm text-muted-foreground">Total gasto</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {totalAtendimentos ? formatCurrency(valorTotalGasto / totalAtendimentos, true) : 'R$ 0,00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Ticket médio</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {ultimoAtendimento ? formatDate(ultimoAtendimento.data_abertura) : 'Nunca'}
                  </div>
                  <div className="text-sm text-muted-foreground">Último atendimento</div>
                </CardContent>
              </Card>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {comandasLoading ? (
                  <div className="text-center py-8">Carregando histórico...</div>
                ) : clienteComandas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    Nenhum atendimento encontrado
                  </div>
                ) : (
                  clienteComandas.map((comanda) => (
                    <Card key={comanda.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Receipt className="w-4 h-4" />
                              <span className="font-medium">
                                Comanda #{comanda.numero_comanda}
                              </span>
                              <Badge 
                                variant={comanda.status === 'fechada' ? 'default' : 'secondary'}
                              >
                                {comanda.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(comanda.data_abertura)}
                              {comanda.profissional_principal && (
                                <> • {comanda.profissional_principal.nome}</>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(comanda.total_liquido, true)}
                            </div>
                            {comanda.desconto > 0 && (
                              <div className="text-sm text-muted-foreground">
                                Desc: {formatCurrency(comanda.desconto, true)}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6">
            {/* Saldo Atual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Saldo Atual
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingSaldo(true)}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Ajustar Saldo
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className={`text-4xl font-bold ${
                    cliente.saldo > 0 
                      ? 'text-green-600' 
                      : cliente.saldo < 0 
                      ? 'text-red-600' 
                      : 'text-muted-foreground'
                  }`}>
                    {formatCurrency(cliente.saldo, true)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {cliente.saldo > 0 
                      ? 'Cliente possui crédito' 
                      : cliente.saldo < 0 
                      ? 'Cliente possui débito' 
                      : 'Saldo zerado'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adicionar/Remover Saldo */}
            {isAddingSaldo && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajustar Saldo do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={saldoValue}
                      onChange={(e) => setSaldoValue(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Motivo (opcional)</Label>
                    <Input
                      placeholder="Ex: Pagamento em dinheiro, Crédito promocional..."
                      value={saldoMotivo}
                      onChange={(e) => setSaldoMotivo(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleUpdateSaldo('credito')}
                      disabled={!saldoValue}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Crédito
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleUpdateSaldo('debito')}
                      disabled={!saldoValue}
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Debitar Valor
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddingSaldo(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo Cliente */}
            <div className="text-xs text-muted-foreground">
              Cliente desde {formatDate(cliente.created_at)}
              {cliente.updated_at !== cliente.created_at && (
                <> • Última atualização: {formatDate(cliente.updated_at)}</>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};