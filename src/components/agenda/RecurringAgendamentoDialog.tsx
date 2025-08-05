import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Profissional } from '@/types/salon';
import { CalendarIcon, Clock, Repeat, Users, AlertTriangle } from 'lucide-react';
import { format, addWeeks, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RecurringAgendamentoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (agendamentoData: any[]) => void;
  profissionais: Profissional[];
}

type RecurrencePattern = 'none' | 'weekly' | 'biweekly' | 'monthly';

export const RecurringAgendamentoDialog = ({
  open,
  onClose,
  onSubmit,
  profissionais
}: RecurringAgendamentoDialogProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    profissional_id: '',
    servico_nome: '',
    duracao_minutos: 60,
    valor: 0,
    data_inicio: new Date(),
    hora_inicio: '09:00',
    observacoes: '',
    pattern: 'none' as RecurrencePattern,
    occurrences: 4,
    weekdays: [] as number[], // 0 = domingo, 1 = segunda, etc.
    endDate: addWeeks(new Date(), 8)
  });

  const [previewDates, setPreviewDates] = useState<Date[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const weekdayOptions = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' }
  ];

  const generatePreviewDates = () => {
    const dates: Date[] = [];
    const startDate = formData.data_inicio;
    const endDate = formData.endDate;
    
    if (formData.pattern === 'none') {
      dates.push(startDate);
    } else if (formData.pattern === 'weekly') {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate && dates.length < formData.occurrences) {
        dates.push(new Date(currentDate));
        currentDate = addWeeks(currentDate, 1);
      }
    } else if (formData.pattern === 'biweekly') {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate && dates.length < formData.occurrences) {
        dates.push(new Date(currentDate));
        currentDate = addWeeks(currentDate, 2);
      }
    } else if (formData.pattern === 'monthly') {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate && dates.length < formData.occurrences) {
        dates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    setPreviewDates(dates);
  };

  const handleSubmit = () => {
    if (!formData.profissional_id || !formData.servico_nome) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos necessários",
        variant: "destructive"
      });
      return;
    }

    const agendamentos = previewDates.map(date => ({
      profissional_id: formData.profissional_id,
      data: format(date, 'yyyy-MM-dd'),
      hora_inicio: formData.hora_inicio,
      servico_nome: formData.servico_nome,
      duracao_minutos: formData.duracao_minutos,
      valor: formData.valor,
      observacoes: formData.observacoes,
      status: 'agendado'
    }));

    onSubmit(agendamentos);
    onClose();
    
    // Reset form
    setFormData({
      profissional_id: '',
      servico_nome: '',
      duracao_minutos: 60,
      valor: 0,
      data_inicio: new Date(),
      hora_inicio: '09:00',
      observacoes: '',
      pattern: 'none',
      occurrences: 4,
      weekdays: [],
      endDate: addWeeks(new Date(), 8)
    });
    setPreviewDates([]);
    setShowPreview(false);
  };

  const toggleWeekday = (day: number) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(day) 
        ? prev.weekdays.filter(d => d !== day)
        : [...prev.weekdays, day].sort()
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            Criar Agendamentos Recorrentes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profissional">Profissional *</Label>
              <Select 
                value={formData.profissional_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, profissional_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar profissional" />
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

            <div className="space-y-2">
              <Label htmlFor="servico">Nome do Serviço *</Label>
              <Input
                id="servico"
                value={formData.servico_nome}
                onChange={(e) => setFormData(prev => ({ ...prev, servico_nome: e.target.value }))}
                placeholder="Ex: Corte + Escova"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (minutos)</Label>
              <Input
                id="duracao"
                type="number"
                min="15"
                max="480"
                step="15"
                value={formData.duracao_minutos}
                onChange={(e) => setFormData(prev => ({ ...prev, duracao_minutos: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* Data e hora inicial */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.data_inicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.data_inicio ? format(formData.data_inicio, "PPP", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.data_inicio}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, data_inicio: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Horário</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          {/* Configurações de recorrência */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Recorrência
            </h4>

            <div className="space-y-2">
              <Label>Padrão de Repetição</Label>
              <Select 
                value={formData.pattern} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, pattern: value as RecurrencePattern }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não repetir</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="biweekly">Quinzenal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.pattern !== 'none' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occurrences">Número de Ocorrências</Label>
                    <Input
                      id="occurrences"
                      type="number"
                      min="1"
                      max="52"
                      value={formData.occurrences}
                      onChange={(e) => setFormData(prev => ({ ...prev, occurrences: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Limite</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Seleção de dias da semana (para padrões específicos) */}
                {formData.pattern === 'weekly' && (
                  <div className="space-y-2">
                    <Label>Dias da Semana (opcional)</Label>
                    <div className="flex flex-wrap gap-2">
                      {weekdayOptions.map(day => (
                        <Badge
                          key={day.value}
                          variant={formData.weekdays.includes(day.value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleWeekday(day.value)}
                        >
                          {day.label}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Se nenhum dia for selecionado, usará o dia da semana da data inicial
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          {/* Botão de preview */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                generatePreviewDates();
                setShowPreview(true);
              }}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Visualizar Datas
            </Button>
          </div>

          {/* Preview das datas */}
          {showPreview && previewDates.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Preview - {previewDates.length} agendamento(s)
              </h5>
              
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {previewDates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                    <span>{format(date, "EEE, dd/MM/yyyy", { locale: ptBR })}</span>
                    <span className="text-muted-foreground">{formData.hora_inicio}</span>
                  </div>
                ))}
              </div>

              {previewDates.length >= formData.occurrences && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Limite de ocorrências atingido
                </div>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!showPreview || previewDates.length === 0}
              className="flex items-center gap-2"
            >
              <Repeat className="w-4 h-4" />
              Criar {previewDates.length} Agendamento(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};