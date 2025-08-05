import { useState } from 'react';
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
import { TIPOS_BLOQUEIO } from '@/types/salon';
import { Profissional } from '@/types/salon';

interface BloqueioDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bloqueioData: {
    profissional_id: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    tipo: string;
    motivo?: string;
    cor: string;
  }) => void;
  profissionais: Profissional[];
  initialData?: {
    profissional_id?: string;
    data?: string;
    hora_inicio?: string;
  };
}

export const BloqueioDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  profissionais, 
  initialData 
}: BloqueioDialogProps) => {
  const [formData, setFormData] = useState({
    profissional_id: initialData?.profissional_id || '',
    data: initialData?.data || '',
    hora_inicio: initialData?.hora_inicio || '',
    hora_fim: '',
    tipo: '',
    motivo: '',
    cor: '#6B7280'
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.data ? new Date(initialData.data) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.profissional_id || !formData.data || !formData.hora_inicio || !formData.hora_fim || !formData.tipo) {
      return;
    }

    const tipoSelecionado = TIPOS_BLOQUEIO.find(t => t.value === formData.tipo);
    
    onSubmit({
      ...formData,
      cor: tipoSelecionado?.color || '#6B7280'
    });
    
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

  const handleTipoChange = (tipo: string) => {
    const tipoSelecionado = TIPOS_BLOQUEIO.find(t => t.value === tipo);
    setFormData(prev => ({
      ...prev,
      tipo,
      cor: tipoSelecionado?.color || '#6B7280'
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Bloqueio</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
                    {prof.nome}
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

          {/* Horários */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora Início</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora_fim">Hora Fim</Label>
              <Input
                id="hora_fim"
                type="time"
                value={formData.hora_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fim: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <Label>Tipo de Bloqueio</Label>
            <Select value={formData.tipo} onValueChange={handleTipoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_BLOQUEIO.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tipo.color }}
                      />
                      {tipo.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motivo */}
          <div>
            <Label htmlFor="motivo">Motivo (opcional)</Label>
            <Textarea
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
              placeholder="Descreva o motivo do bloqueio..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Bloqueio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};