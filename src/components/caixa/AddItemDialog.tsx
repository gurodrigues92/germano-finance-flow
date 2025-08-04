import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComandas } from '@/hooks/salon/useComandas';
import { useServicos } from '@/hooks/salon/useServicos';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useProdutos } from '@/hooks/useProdutos';
import { formatCurrency } from '@/lib/formatUtils';
import { Search, Package, Scissors } from 'lucide-react';

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  comandaId: string;
  onItemAdded: () => void;
}

export const AddItemDialog = ({
  isOpen,
  onOpenChange,
  comandaId,
  onItemAdded
}: AddItemDialogProps) => {
  const { addItemComanda } = useComandas();
  const { servicos, getServicosPorCategoria } = useServicos();
  const { profissionais } = useProfissionais();
  const { produtos } = useProdutos();
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfissional, setSelectedProfissional] = useState<string>('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorCustom, setValorCustom] = useState<number | null>(null);

  const servicosPorCategoria = getServicosPorCategoria();
  
  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddServico = async (servico: any) => {
    if (!selectedProfissional) {
      alert('Selecione um profissional para o serviço');
      return;
    }

    setLoading(true);
    try {
      await addItemComanda(comandaId, {
        tipo: 'servico',
        item_id: servico.id,
        nome_item: servico.nome,
        quantidade: 1,
        valor_unitario: valorCustom || servico.preco,
        profissional_id: selectedProfissional
      });
      onItemAdded();
      setValorCustom(null);
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduto = async (produto: any) => {
    setLoading(true);
    try {
      await addItemComanda(comandaId, {
        tipo: 'produto',
        item_id: produto.id,
        nome_item: produto.nome,
        quantidade,
        valor_unitario: valorCustom || produto.valor_unitario || 0
      });
      onItemAdded();
      setQuantidade(1);
      setValorCustom(null);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSearchTerm('');
    setSelectedProfissional('');
    setQuantidade(1);
    setValorCustom(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Item à Comanda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços ou produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="servicos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="servicos" className="flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Serviços
              </TabsTrigger>
              <TabsTrigger value="produtos" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Produtos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="servicos" className="space-y-4">
              {/* Seleção de Profissional */}
              <div className="space-y-2">
                <Label>Profissional Responsável</Label>
                <Select value={selectedProfissional} onValueChange={setSelectedProfissional}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {profissionais.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valor customizado */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Customizado (opcional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Deixe vazio para usar preço padrão"
                    value={valorCustom || ''}
                    onChange={(e) => setValorCustom(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              {/* Lista de Serviços */}
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {Object.entries(servicosPorCategoria).map(([categoria, servicosCategoria]) => {
                    const servicosFiltrados = servicosCategoria.filter(servico =>
                      servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    
                    if (servicosFiltrados.length === 0) return null;

                    return (
                      <div key={categoria}>
                        <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                          {categoria}
                        </h3>
                        <div className="grid gap-2">
                          {servicosFiltrados.map((servico) => (
                            <Card key={servico.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{servico.nome}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline">{servico.categoria}</Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {servico.duracao_minutos}min
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-lg">
                                      {formatCurrency(valorCustom || servico.preco, true)}
                                    </p>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddServico(servico)}
                                      disabled={loading || !selectedProfissional}
                                    >
                                      Adicionar
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="produtos" className="space-y-4">
              {/* Controles de Produto */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Customizado (opcional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Deixe vazio para usar preço padrão"
                    value={valorCustom || ''}
                    onChange={(e) => setValorCustom(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              {/* Lista de Produtos */}
              <ScrollArea className="h-[400px]">
                <div className="grid gap-2">
                  {filteredProdutos.map((produto) => (
                    <Card key={produto.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{produto.nome}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{produto.categoria}</Badge>
                              <span className="text-sm text-muted-foreground">
                                Estoque: {produto.estoque_atual} {produto.unidade_medida}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatCurrency((valorCustom || produto.valor_unitario || 0) * quantidade, true)}
                            </p>
                            <Button
                              size="sm"
                              onClick={() => handleAddProduto(produto)}
                              disabled={loading || produto.estoque_atual < quantidade}
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};