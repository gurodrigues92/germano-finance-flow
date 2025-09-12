import React, { useState } from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useServicos } from '@/hooks/salon/useServicos';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { User, Scissors, Receipt } from 'lucide-react';

interface NovaComandaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComandaCreated: (comandaData: any) => void;
  loading?: boolean;
}

interface ServicoSelecionado {
  id: string;
  nome: string;
  preco: number;
  profissionalId: string;
}

export const NovaComandaDialog = ({ 
  isOpen, 
  onOpenChange, 
  onComandaCreated,
  loading = false 
}: NovaComandaDialogProps) => {
  const isMobile = useIsMobile();
  const [clienteId, setClienteId] = useState('');
  const [profissionalPrincipalId, setProfissionalPrincipalId] = useState('');
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [observacoes, setObservacoes] = useState('');

  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();
  const { servicos } = useServicos();

  const resetForm = () => {
    setClienteId('');
    setProfissionalPrincipalId('');
    setServicosSelecionados([]);
    setObservacoes('');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleServicoToggle = (servico: any, checked: boolean) => {
    if (checked) {
      setServicosSelecionados(prev => [...prev, {
        id: servico.id,
        nome: servico.nome,
        preco: servico.preco,
        profissionalId: profissionalPrincipalId
      }]);
    } else {
      setServicosSelecionados(prev => prev.filter(s => s.id !== servico.id));
    }
  };

  const totalComanda = servicosSelecionados.reduce((total, servico) => total + servico.preco, 0);

  const handleSubmit = async () => {
    if (!clienteId || !profissionalPrincipalId || servicosSelecionados.length === 0) {
      return;
    }

    const comandaData = {
      tipo: 'comanda' as const,
      clienteId,
      profissionalId: profissionalPrincipalId,
      status: 'aberta' as const,
      observacoes,
      servicosSelecionados,
      totalEstimado: totalComanda
    };

    await onComandaCreated(comandaData);
    resetForm();
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={handleClose}
      title="Nova Comanda"
      className="max-w-[500px]"
    >
      <ScrollArea className="max-h-[calc(90vh-120px)] px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6 pb-4">
          {/* Seleção de Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente *
            </label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.filter(cliente => cliente.id).map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Profissional Principal */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Profissional Principal *
            </label>
            <Select value={profissionalPrincipalId} onValueChange={setProfissionalPrincipalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {profissionais.filter(p => p.ativo && p.id).map((profissional) => (
                  <SelectItem key={profissional.id} value={profissional.id}>
                    {profissional.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Serviços */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Serviços *</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {servicos.filter(s => s.ativo).map((servico) => (
                <Card key={servico.id} className="border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`servico-${servico.id}`}
                        checked={servicosSelecionados.some(s => s.id === servico.id)}
                        onCheckedChange={(checked) => handleServicoToggle(servico, checked as boolean)}
                      />
                      <div className="flex-1">
                        <label htmlFor={`servico-${servico.id}`} className="text-sm font-medium cursor-pointer">
                          {servico.nome}
                        </label>
                        <div className="text-xs text-muted-foreground">
                          {servico.categoria} • {formatCurrency(servico.preco)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Total Estimado */}
          {servicosSelecionados.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Estimado:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(totalComanda)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {servicosSelecionados.length} serviço{servicosSelecionados.length > 1 ? 's' : ''} selecionado{servicosSelecionados.length > 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea
              placeholder="Observações adicionais (opcional)"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </ScrollArea>

      <div className={cn(
        "sticky bottom-0 bg-background border-t space-y-4 shrink-0",
        isMobile ? "p-4 space-y-3" : "p-6 space-y-4"
      )}>
        <div className={cn("flex gap-3", isMobile ? "flex-col gap-3" : "items-center")}>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={loading || !clienteId || !profissionalPrincipalId || servicosSelecionados.length === 0}
            size={isMobile ? "xl" : "lg"}
            className={cn(
              "flex-1 font-semibold shadow-md hover:shadow-lg",
              isMobile && "order-1"
            )}
          >
            {loading ? 'Criando...' : 'Criar Comanda'}
          </Button>
          
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => handleClose(false)}
            disabled={loading}
            size={isMobile ? "xl" : "lg"}
            className={cn(
              "font-medium",
              isMobile ? "order-2" : "min-w-[120px]"
            )}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};