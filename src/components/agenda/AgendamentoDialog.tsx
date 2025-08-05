import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Agendamento, Cliente, Profissional, Servico } from '@/types/salon';
import { useClientes } from '@/hooks/salon/useClientes';

interface AgendamentoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (agendamentoData: {
    cliente_id: string;
    profissional_id: string;
    servico_id: string;
    data: string;
    hora_inicio: string;
    observacoes?: string;
  }) => void;
  profissionais: Profissional[];
  servicos: Servico[];
  initialData?: {
    profissional_id?: string;
    data?: string;
    hora_inicio?: string;
  };
  editingAgendamento?: Agendamento;
}

export const AgendamentoDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  profissionais, 
  servicos,
  initialData,
  editingAgendamento
}: AgendamentoDialogProps) => {
  const { clientes } = useClientes();
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    profissional_id: initialData?.profissional_id || '',
    servico_id: '',
    data: initialData?.data || '',
    hora_inicio: initialData?.hora_inicio || '',
    observacoes: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.data ? new Date(initialData.data) : undefined
  );

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (editingAgendamento) {
      setFormData({
        cliente_id: editingAgendamento.cliente_id,
        profissional_id: editingAgendamento.profissional_id,
        servico_id: editingAgendamento.servico_id,
        data: editingAgendamento.data,
        hora_inicio: editingAgendamento.hora_inicio,
        observacoes: editingAgendamento.observacoes || ''
      });
      setSelectedDate(new Date(editingAgendamento.data));
    }
  }, [editingAgendamento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente_id || !formData.profissional_id || !formData.servico_id || 
        !formData.data || !formData.hora_inicio) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        data: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      profissional_id: initialData?.profissional_id || '',
      servico_id: '',
      data: initialData?.data || '',
      hora_inicio: initialData?.hora_inicio || '',
      observacoes: ''
    });
    setSelectedDate(initialData?.data ? new Date(initialData.data) : undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profissional */}
          <div>
            <Label htmlFor="profissional">Profissional</Label>
            <Select 
              value={formData.profissional_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, profissional_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {profissionais.map(prof => (
                  <SelectItem key={prof.id} value={prof.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: prof.cor_agenda }}
                      />
                      {prof.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Serviço */}
          <div>
            <Label htmlFor="servico">Serviço</Label>
            <Select 
              value={formData.servico_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, servico_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map(servico => (
                  <SelectItem key={servico.id} value={servico.id}>
                    <div>
                      <div className="font-medium">{servico.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {servico.preco.toFixed(2)} • {Math.floor(servico.duracao_minutos / 60)}h{servico.duracao_minutos % 60 > 0 ? ` ${servico.duracao_minutos % 60}min` : ''}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div>
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Hora */}
          <div>
            <Label htmlFor="hora_inicio">Hora</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
              required
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações sobre o agendamento..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingAgendamento ? 'Atualizar' : 'Agendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};