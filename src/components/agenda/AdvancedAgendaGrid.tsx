import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Plus, LayoutGrid, Eye } from 'lucide-react';
import { Agendamento, Profissional, BloqueioAgenda } from '@/types/salon';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
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

// Componente Drop Zone
const DropZone = ({ 
  id, 
  children, 
  onNewAgendamento 
}: { 
  id: string; 
  children: React.ReactNode; 
  onNewAgendamento?: () => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[60px] transition-colors ${isOver ? 'bg-primary/10' : ''}`}
      onClick={onNewAgendamento}
    >
      {children}
    </div>
  );
};

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

type ViewMode = 'day' | 'week' | 'professional';

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 23; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 23) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
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
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [draggedAgendamento, setDraggedAgendamento] = useState<Agendamento | null>(null);

  const timeSlots = generateTimeSlots();

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

    try {
      await updateAgendamento(agendamentoId, {
        profissional_id: profissionalId,
        data: data,
        hora_inicio: hora
      });

      toast({
        title: "Agendamento movido",
        description: "O agendamento foi reagendado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível mover o agendamento",
        variant: "destructive"
      });
    }
  };

  const getAgendamentoSlot = (profissionalId: string, data: string, hora: string) => {
    return agendamentos.find(a => 
      a.profissional_id === profissionalId && 
      a.data === data &&
      a.hora_inicio <= hora && 
      a.hora_fim > hora
    );
  };

  const renderDayView = () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid border-b bg-muted/50" style={{ gridTemplateColumns: `120px repeat(${filteredProfissionais.length}, 1fr)` }}>
            <div className="p-4 border-r font-medium">Horário</div>
            {filteredProfissionais.map(profissional => (
              <div key={profissional.id} className="p-4 border-r font-medium text-center">
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: profissional.cor_agenda }}
                  />
                  {profissional.nome}
                </div>
              </div>
            ))}
          </div>

          {timeSlots.map(time => (
            <div 
              key={time} 
              className="grid border-b hover:bg-muted/20" 
              style={{ gridTemplateColumns: `120px repeat(${filteredProfissionais.length}, 1fr)` }}
            >
              <div className="p-3 border-r text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {time}
              </div>

              {filteredProfissionais.map(profissional => {
                const agendamento = getAgendamentoSlot(profissional.id, dateString, time);
                const dropZoneId = `${profissional.id}-${dateString}-${time}`;

                return (
                  <DropZone
                    key={dropZoneId}
                    id={dropZoneId}
                    onNewAgendamento={() => onNewAgendamento({ 
                      data: dateString, 
                      hora_inicio: time, 
                      profissional_id: profissional.id 
                    })}
                  >
                    <div className="p-2 border-r min-h-[60px]">
                      {agendamento ? (
                        <AgendamentoCard
                          agendamento={agendamento}
                          onEdit={onEditAgendamento}
                          onIniciarAtendimento={onIniciarAtendimento}
                          onFinalizarAtendimento={onFinalizarAtendimento}
                          isDragging={draggedAgendamento?.id === agendamento.id}
                        />
                      ) : (
                        <div className="w-full h-full rounded border-2 border-dashed border-transparent hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center group cursor-pointer">
                          <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                      )}
                    </div>
                  </DropZone>
                );
              })}
            </div>
          ))}
        </div>
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
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agenda Avançada
              </CardTitle>
              
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="professional">Profissional</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDateChange(subDays(selectedDate, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: ptBR })}
                </h3>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDateChange(addDays(selectedDate, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            {renderDayView()}
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