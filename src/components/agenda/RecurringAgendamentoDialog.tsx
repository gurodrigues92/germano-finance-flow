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
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Repeat className="w-5 h-5" />
            Criar Agendamentos Recorrentes
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-1">
          <div className="space-y-8 p-1">
            {/* Informações básicas */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Informações Básicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="profissional" className="text-sm font-medium">Profissional *</Label>
                  <Select 
                    value={formData.profissional_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, profissional_id: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecionar profissional" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-background border border-border shadow-md">
                      {profissionais.map(prof => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="servico" className="text-sm font-medium">Nome do Serviço *</Label>
                  <Input
                    id="servico"
                    value={formData.servico_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, servico_nome: e.target.value }))}
                    placeholder="Ex: Corte + Escova"
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="duracao" className="text-sm font-medium">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.duracao_minutos}
                    onChange={(e) => setFormData(prev => ({ ...prev, duracao_minutos: Number(e.target.value) }))}
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="valor" className="text-sm font-medium">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Data e hora inicial */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Data e Horário</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal",
                          !formData.data_inicio && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.data_inicio ? format(formData.data_inicio, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[100] bg-background border border-border shadow-md" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.data_inicio}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, data_inicio: date }))}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="hora" className="text-sm font-medium">Horário</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Configurações de recorrência */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg flex items-center gap-2">
                <Repeat className="w-4 h-4" />
                Configurações de Recorrência
              </h4>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Padrão de Repetição</Label>
                <Select 
                  value={formData.pattern} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, pattern: value as RecurrencePattern }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-background border border-border shadow-md">
                    <SelectItem value="none">Não repetir</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="biweekly">Quinzenal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.pattern !== 'none' && (
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="occurrences" className="text-sm font-medium">Número de Ocorrências</Label>
                      <Input
                        id="occurrences"
                        type="number"
                        min="1"
                        max="52"
                        value={formData.occurrences}
                        onChange={(e) => setFormData(prev => ({ ...prev, occurrences: Number(e.target.value) }))}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Data Limite</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal",
                              !formData.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[100] bg-background border border-border shadow-md" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                            initialFocus
                            className="p-3"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Seleção de dias da semana (para padrões específicos) */}
                  {formData.pattern === 'weekly' && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Dias da Semana (opcional)</Label>
                      <div className="flex flex-wrap gap-2">
                        {weekdayOptions.map(day => (
                          <Badge
                            key={day.value}
                            variant={formData.weekdays.includes(day.value) ? "default" : "outline"}
                            className="cursor-pointer h-8 px-3 text-sm transition-all hover:scale-105 active:scale-95"
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
                </div>
              )}
            </div>

            <Separator />

            {/* Observações */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Observações</h4>
              <div className="space-y-3">
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações adicionais..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Botão de preview */}
            <div className="flex justify-center py-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  generatePreviewDates();
                  setShowPreview(true);
                }}
                className="flex items-center gap-2 h-12 px-6"
              >
                <Clock className="w-4 h-4" />
                Visualizar Datas
              </Button>
            </div>

            {/* Preview das datas */}
            {showPreview && previewDates.length > 0 && (
              <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-4">
                <h5 className="font-medium text-lg flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Preview - {previewDates.length} agendamento(s)
                </h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {previewDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between bg-background p-4 rounded-md border border-border shadow-sm">
                      <span className="font-medium">{format(date, "EEE, dd/MM/yyyy", { locale: ptBR })}</span>
                      <span className="text-muted-foreground font-mono">{formData.hora_inicio}</span>
                    </div>
                  ))}
                </div>

                {previewDates.length >= formData.occurrences && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Limite de ocorrências atingido
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom action bar */}
        <div className="sticky bottom-0 bg-background border-t p-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={onClose} 
              size="xl"
              className="font-medium"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!showPreview || previewDates.length === 0}
              size="xl"
              className="flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
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