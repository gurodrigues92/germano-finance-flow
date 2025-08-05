import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Plus, List, Grid3X3, Eye, Bell, Repeat } from 'lucide-react';
import { Agendamento, Profissional, BloqueioAgenda } from '@/types/salon';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable
} from '@dnd-kit/core';
import { AgendamentoCard } from './AgendamentoCard';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

// Componente Drop Zone melhorado
const DropZone = ({ 
  id, 
  children, 
  onNewAgendamento,
  isBlocked = false,
  blockReason = ''
}: { 
  id: string; 
  children: React.ReactNode; 
  onNewAgendamento?: () => void;
  isBlocked?: boolean;
  blockReason?: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "min-h-[60px] transition-all duration-200",
        isOver && !isBlocked ? 'bg-primary/10 ring-2 ring-primary' : '',
        isBlocked ? 'bg-red-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/30'
      )}
      onClick={!isBlocked ? onNewAgendamento : undefined}
      title={isBlocked ? blockReason : 'Clique para agendar'}
    >
      {children}
    </div>
  );
};

// Componente de notificação de conflito
const ConflictNotification = ({ agendamento, onResolve }: { 
  agendamento: Agendamento; 
  onResolve: () => void;
}) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
    <div className="flex items-center gap-2 text-yellow-800">
      <Bell className="w-4 h-4" />
      <span className="text-sm font-medium">Conflito de horário detectado</span>
    </div>
    <p className="text-xs text-yellow-700 mt-1">
      Existe outro agendamento próximo ao horário selecionado
    </p>
    <Button size="sm" variant="outline" onClick={onResolve} className="mt-2">
      Resolver conflito
    </Button>
  </div>
);

interface AdvancedAgendaGridProps {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  bloqueios: BloqueioAgenda[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onNewAgendamento: (data: { data: string; hora_inicio: string; profissional_id?: string }) => void;
  onEditAgendamento: (agendamento: Agendamento) => void;
  onIniciarAtendimento?: (agendamento: Agendamento) => void;
  onFinalizarAtendimento?: (agendamento: Agendamento) => void;
  selectedProfissional: string;
}

type ViewMode = 'day' | 'week' | 'professional' | 'list';
type TimeInterval = 15 | 30 | 60; // minutos

const generateTimeSlots = (interval: TimeInterval = 30) => {
  const slots = [];
  for (let hour = 7; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      if (hour === 23 && minute > 0) break; // Parar em 23:00
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

export const AdvancedAgendaGrid = ({ 
  agendamentos, 
  profissionais, 
  bloqueios, 
  selectedDate, 
  onDateChange,
  onNewAgendamento,
  onEditAgendamento,
  onIniciarAtendimento,
  onFinalizarAtendimento,
  selectedProfissional
}: AdvancedAgendaGridProps) => {
  const { updateAgendamento } = useAgendamentos();
  const { toast } = useToast();
  
  // Estados
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(30);
  const [draggedAgendamento, setDraggedAgendamento] = useState<Agendamento | null>(null);
  const [showConflicts, setShowConflicts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [highlightToday, setHighlightToday] = useState(true);
  
  // Estados para criação rápida
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateData, setQuickCreateData] = useState({
    profissional_id: '',
    duration: 60,
    isRecurring: false,
    recurrenceWeeks: 1
  });

  const timeSlots = generateTimeSlots(timeInterval);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const filteredProfissionais = useMemo(() => {
    return selectedProfissional === 'todos' 
      ? profissionais 
      : profissionais.filter(p => p.id === selectedProfissional);
  }, [profissionais, selectedProfissional]);

  // Detectar conflitos
  const hasConflict = (profissionalId: string, data: string, horaInicio: string, horaFim: string, excludeId?: string) => {
    return agendamentos.some(a => 
      a.id !== excludeId &&
      a.profissional_id === profissionalId && 
      a.data === data &&
      ((horaInicio >= a.hora_inicio && horaInicio < a.hora_fim) ||
       (horaFim > a.hora_inicio && horaFim <= a.hora_fim) ||
       (horaInicio <= a.hora_inicio && horaFim >= a.hora_fim))
    );
  };

  // Verificar se horário está bloqueado
  const isTimeBlocked = (profissionalId: string, data: string, hora: string) => {
    return bloqueios.some(b => 
      b.profissional_id === profissionalId && 
      b.data === data &&
      hora >= b.hora_inicio && 
      hora < b.hora_fim
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const agendamento = agendamentos.find(a => a.id === event.active.id);
    setDraggedAgendamento(agendamento || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedAgendamento(null);

    if (!over || !active.id) return;

    const overId = over.id as string;
    const agendamentoId = active.id as string;
    const [profissionalId, data, hora] = overId.split('-');
    
    if (!profissionalId || !data || !hora) return;

    const agendamento = agendamentos.find(a => a.id === agendamentoId);
    if (!agendamento) return;

    // Verificar conflitos
    const horaFim = calculateEndTime(hora, agendamento.servico?.duracao_minutos || 60);
    if (hasConflict(profissionalId, data, hora, horaFim, agendamentoId)) {
      toast({
        title: "Conflito de horário",
        description: "Já existe um agendamento neste horário",
        variant: "destructive"
      });
      return;
    }

    // Verificar bloqueios
    if (isTimeBlocked(profissionalId, data, hora)) {
      toast({
        title: "Horário bloqueado",
        description: "Este horário está indisponível",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateAgendamento(agendamentoId, {
        profissional_id: profissionalId,
        data: data,
        hora_inicio: hora,
        hora_fim: horaFim
      });

      toast({
        title: "Agendamento reagendado",
        description: "O agendamento foi movido com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível mover o agendamento",
        variant: "destructive"
      });
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const getAgendamentoSlot = (profissionalId: string, data: string, hora: string) => {
    return agendamentos.find(a => 
      a.profissional_id === profissionalId && 
      a.data === data &&
      a.hora_inicio <= hora && 
      a.hora_fim > hora
    );
  };

  const getBloqueioSlot = (profissionalId: string, data: string, hora: string) => {
    return bloqueios.find(b => 
      b.profissional_id === profissionalId && 
      b.data === data &&
      b.hora_inicio <= hora && 
      b.hora_fim > hora
    );
  };

  // Criar agendamento recorrente
  const createRecurringAppointment = async (baseData: any) => {
    const appointments = [];
    const weeksToCreate = quickCreateData.recurrenceWeeks;
    
    for (let week = 0; week < weeksToCreate; week++) {
      const appointmentDate = addWeeks(new Date(baseData.data), week);
      const dateString = format(appointmentDate, 'yyyy-MM-dd');
      
      appointments.push({
        ...baseData,
        data: dateString
      });
    }
    
    // Aqui você chamaria uma função para criar múltiplos agendamentos
    // Por exemplo: await createMultipleAgendamentos(appointments);
    
    toast({
      title: "Agendamentos recorrentes criados",
      description: `${appointments.length} agendamentos foram criados`
    });
  };

  const renderTimeSlotContent = (profissional: Profissional, dateString: string, time: string) => {
    const agendamento = getAgendamentoSlot(profissional.id, dateString, time);
    const bloqueio = getBloqueioSlot(profissional.id, dateString, time);
    const isBlocked = !!bloqueio;
    const dropZoneId = `${profissional.id}-${dateString}-${time}`;

    return (
      <DropZone
        key={dropZoneId}
        id={dropZoneId}
        isBlocked={isBlocked}
        blockReason={bloqueio?.motivo || 'Horário bloqueado'}
        onNewAgendamento={() => onNewAgendamento({ 
          data: dateString, 
          hora_inicio: time, 
          profissional_id: profissional.id 
        })}
      >
        <div className="p-2 border-r min-h-[60px] relative">
          {agendamento ? (
            <>
              {showConflicts && hasConflict(profissional.id, dateString, time, agendamento.hora_fim || time, agendamento.id) && (
                <ConflictNotification 
                  agendamento={agendamento}
                  onResolve={() => onEditAgendamento(agendamento)}
                />
              )}
              <AgendamentoCard
                agendamento={agendamento}
                onEdit={onEditAgendamento}
                onIniciarAtendimento={onIniciarAtendimento}
                onFinalizarAtendimento={onFinalizarAtendimento}
                isDragging={draggedAgendamento?.id === agendamento.id}
                showConflictWarning={showConflicts}
              />
            </>
          ) : isBlocked ? (
            <div className="w-full h-full bg-red-100 border-2 border-red-200 rounded flex items-center justify-center">
              <span className="text-xs text-red-600 font-medium">Bloqueado</span>
            </div>
          ) : (
            <div className="w-full h-full rounded border-2 border-dashed border-transparent hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center group cursor-pointer">
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          )}
          
          {/* Indicador de horário atual */}
          {highlightToday && dateString === format(new Date(), 'yyyy-MM-dd') && time === format(new Date(), 'HH:mm').slice(0, -1) + '0' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded-t"></div>
          )}
        </div>
      </DropZone>
    );
  };

  const renderDayView = () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid border-b bg-muted/50 sticky top-0 z-10" style={{ gridTemplateColumns: `140px repeat(${filteredProfissionais.length}, 1fr)` }}>
            <div className="p-4 border-r font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário
            </div>
            {filteredProfissionais.map(profissional => (
              <div key={profissional.id} className="p-4 border-r font-medium text-center">
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: profissional.cor_agenda }}
                  />
                  <span className="truncate">{profissional.nome}</span>
                  {profissional.tipo === 'assistente' && (
                    <Badge variant="secondary" className="text-xs">Assist.</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map(time => (
            <div 
              key={time} 
              className={cn(
                "grid border-b hover:bg-muted/20 transition-colors",
                time.endsWith(':00') ? 'border-b-2' : ''
              )}
              style={{ gridTemplateColumns: `140px repeat(${filteredProfissionais.length}, 1fr)` }}
            >
              <div className={cn(
                "p-3 border-r text-sm font-medium text-muted-foreground flex items-center gap-2",
                time.endsWith(':00') ? 'bg-muted/30' : ''
              )}>
                <Clock className="w-3 h-3" />
                {time}
              </div>

              {filteredProfissionais.map(profissional => 
                renderTimeSlotContent(profissional, dateString, time)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const endOfCurrentWeek = endOfWeek(selectedDate, { weekStartsOn: 0 });
    const daysInWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid border-b bg-muted/50" style={{ gridTemplateColumns: `120px repeat(${daysInWeek.length}, 1fr)` }}>
            <div className="p-4 border-r font-medium">Profissional</div>
            {daysInWeek.map(day => (
              <div key={day.toISOString()} className="p-4 border-r font-medium text-center">
                <div className="text-sm text-muted-foreground">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-primary' : ''
                )}>
                  {format(day, 'dd')}
                </div>
              </div>
            ))}
          </div>

          {filteredProfissionais.map(profissional => (
            <div key={profissional.id} className="grid border-b hover:bg-muted/20" style={{ gridTemplateColumns: `120px repeat(${daysInWeek.length}, 1fr)` }}>
              <div className="p-4 border-r flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: profissional.cor_agenda }}
                />
                <span className="font-medium">{profissional.nome}</span>
              </div>
              
              {daysInWeek.map(day => {
                const dateString = format(day, 'yyyy-MM-dd');
                const dayAgendamentos = agendamentos.filter(a => 
                  a.profissional_id === profissional.id && a.data === dateString
                );
                
                return (
                  <div key={dateString} className="p-2 border-r min-h-[100px] space-y-1">
                    {dayAgendamentos.map(agendamento => (
                      <AgendamentoCard
                        key={agendamento.id}
                        agendamento={agendamento}
                        onEdit={onEditAgendamento}
                        onIniciarAtendimento={onIniciarAtendimento}
                        onFinalizarAtendimento={onFinalizarAtendimento}
                        compact={true}
                      />
                    ))}
                    
                    {dayAgendamentos.length === 0 && (
                      <div 
                        className="w-full h-16 rounded border-2 border-dashed border-transparent hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center group cursor-pointer"
                        onClick={() => onNewAgendamento({ 
                          data: dateString, 
                          hora_inicio: '09:00', 
                          profissional_id: profissional.id 
                        })}
                      >
                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dayAgendamentos = agendamentos.filter(a => a.data === dateString);
    const sortedAgendamentos = dayAgendamentos.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

    return (
      <div className="space-y-3">
        {sortedAgendamentos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum agendamento para este dia</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => onNewAgendamento({ 
                data: dateString, 
                hora_inicio: '09:00' 
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar agendamento
            </Button>
          </div>
        ) : (
          sortedAgendamentos.map(agendamento => (
            <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <AgendamentoCard
                  agendamento={agendamento}
                  onEdit={onEditAgendamento}
                  onIniciarAtendimento={onIniciarAtendimento}
                  onFinalizarAtendimento={onFinalizarAtendimento}
                  expanded={true}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header com controles avançados */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agenda Avançada
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Configurações */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Configurações
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurações da Agenda</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="conflicts">Mostrar conflitos</Label>
                        <Switch
                          id="conflicts"
                          checked={showConflicts}
                          onCheckedChange={setShowConflicts}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="refresh">Atualização automática</Label>
                        <Switch
                          id="refresh"
                          checked={autoRefresh}
                          onCheckedChange={setAutoRefresh}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="highlight">Destacar horário atual</Label>
                        <Switch
                          id="highlight"
                          checked={highlightToday}
                          onCheckedChange={setHighlightToday}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="interval">Intervalo de tempo</Label>
                        <Select value={timeInterval.toString()} onValueChange={(v) => setTimeInterval(Number(v) as TimeInterval)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Criação rápida */}
                <Dialog open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Repeat className="w-4 h-4 mr-2" />
                      Criar série
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Agendamentos Recorrentes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Profissional</Label>
                        <Select value={quickCreateData.profissional_id} onValueChange={(v) => setQuickCreateData(prev => ({ ...prev, profissional_id: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar profissional" />
                          </SelectTrigger>
                          <SelectContent>
                            {profissionais.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duração (minutos)</Label>
                        <Input
                          type="number"
                          value={quickCreateData.duration}
                          onChange={(e) => setQuickCreateData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={quickCreateData.isRecurring}
                          onCheckedChange={(checked) => setQuickCreateData(prev => ({ ...prev, isRecurring: checked }))}
                        />
                        <Label>Agendamento recorrente</Label>
                      </div>
                      
                      {quickCreateData.isRecurring && (
                        <div className="space-y-2">
                          <Label>Repetir por quantas semanas</Label>
                          <Input
                            type="number"
                            min="1"
                            max="52"
                            value={quickCreateData.recurrenceWeeks}
                            onChange={(e) => setQuickCreateData(prev => ({ ...prev, recurrenceWeeks: Number(e.target.value) }))}
                          />
                        </div>
                      )}
                      
                      <Button onClick={() => setQuickCreateOpen(false)} className="w-full">
                        Criar agendamentos
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Abas de visualização */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="day" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Dia
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Semana
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profissional
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Lista
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Navegação de data */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDateChange(viewMode === 'week' ? subDays(selectedDate, 7) : subDays(selectedDate, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {viewMode === 'week' 
                    ? `${format(startOfWeek(selectedDate), "dd/MM", { locale: ptBR })} - ${format(endOfWeek(selectedDate), "dd/MM/yyyy", { locale: ptBR })}`
                    : format(selectedDate, "EEEE, dd/MM/yyyy", { locale: ptBR })
                  }
                </h3>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDateChange(viewMode === 'week' ? addDays(selectedDate, 7) : addDays(selectedDate, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Conteúdo da agenda */}
        <Card>
          <CardContent className="p-0">
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'list' && (
              <div className="p-6">
                {renderListView()}
              </div>
            )}
            {viewMode === 'professional' && renderDayView()} {/* Mesmo que dia por enquanto */}
          </CardContent>
        </Card>

        <DragOverlay>
          {draggedAgendamento && (
            <AgendamentoCard
              agendamento={draggedAgendamento}
              onEdit={() => {}}
              isDragging={true}
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};