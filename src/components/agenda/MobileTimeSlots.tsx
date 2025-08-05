import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Agendamento, Profissional, BloqueioAgenda } from '@/types/salon';
import { cn } from '@/lib/utils';
import { Clock, Plus, Ban } from 'lucide-react';
import { TouchAgendamentoCard } from './TouchAgendamentoCard';

interface MobileTimeSlotsProps {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  bloqueios: BloqueioAgenda[];
  selectedDate: Date;
  onNewAgendamento: (data: { data: string; hora_inicio: string; profissional_id?: string }) => void;
  onEditAgendamento: (agendamento: Agendamento) => void;
  onIniciarAtendimento?: (agendamento: Agendamento) => void;
  onFinalizarAtendimento?: (agendamento: Agendamento) => void;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const getBloqueioColor = (tipo: string) => {
  switch (tipo) {
    case 'lunch-time': 
    case 'almoco': 
      return 'bg-status-lunch-time/20 border-status-lunch-time text-status-lunch-time';
    case 'lack': 
    case 'falta': 
      return 'bg-status-critico/20 border-status-critico text-status-critico';
    case 'unavailable': 
    case 'indisponivel': 
      return 'bg-status-atencao/20 border-status-atencao text-status-atencao';
    default: 
      return 'bg-muted/50 border-muted-foreground text-muted-foreground';
  }
};

const getBloqueioLabel = (tipo: string) => {
  switch (tipo) {
    case 'lunch-time': 
    case 'almoco': 
      return 'Almoço';
    case 'lack': 
    case 'falta': 
      return 'Falta';
    case 'unavailable': 
    case 'indisponivel': 
      return 'Indisponível';
    default: 
      return tipo;
  }
};

export const MobileTimeSlots = ({
  agendamentos,
  profissionais,
  bloqueios,
  selectedDate,
  onNewAgendamento,
  onEditAgendamento,
  onIniciarAtendimento,
  onFinalizarAtendimento
}: MobileTimeSlotsProps) => {
  const timeSlots = generateTimeSlots();
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const currentTime = format(new Date(), 'HH:mm');
  const isToday = dateString === format(new Date(), 'yyyy-MM-dd');

  const timeSlotData = useMemo(() => {
    return timeSlots.map(time => {
      const slotData = {
        time,
        agendamentos: agendamentos.filter(a => 
          a.data === dateString && 
          a.hora_inicio <= time && 
          a.hora_fim > time
        ),
        bloqueios: bloqueios.filter(b => 
          b.data === dateString && 
          b.hora_inicio <= time && 
          b.hora_fim > time
        ),
        isEmpty: false,
        isPast: false,
        isCurrent: false
      };

      slotData.isEmpty = slotData.agendamentos.length === 0 && slotData.bloqueios.length === 0;
      slotData.isPast = isToday && time < currentTime;
      slotData.isCurrent = isToday && time === currentTime.slice(0, -1) + '0'; // Round to nearest slot

      return slotData;
    });
  }, [timeSlots, agendamentos, bloqueios, dateString, currentTime, isToday]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-1 p-4">
        {timeSlotData.map((slot) => (
          <div key={slot.time} className="relative">
            {/* Current time indicator */}
            {slot.isCurrent && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse z-10" />
            )}
            
            <Card className={cn(
              "p-3 transition-all duration-200",
              slot.isPast && "opacity-60",
              slot.isCurrent && "ring-2 ring-red-500/50 bg-red-50/50",
              slot.isEmpty && !slot.isPast && "hover:bg-muted/50 cursor-pointer"
            )}>
              <div className="flex items-start gap-3">
                {/* Time */}
                <div className="min-w-0 flex-shrink-0">
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    slot.isPast ? "text-muted-foreground" : "text-foreground",
                    slot.isCurrent && "text-red-600"
                  )}>
                    <Clock className="w-3 h-3" />
                    {slot.time}
                  </div>
                  {slot.time.endsWith(':00') && (
                    <div className="w-full h-px bg-border mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {slot.agendamentos.length > 0 ? (
                    <div className="space-y-2">
                      {slot.agendamentos.map(agendamento => (
                        <TouchAgendamentoCard
                          key={agendamento.id}
                          agendamento={agendamento}
                          onEdit={onEditAgendamento}
                          onIniciarAtendimento={onIniciarAtendimento}
                          onFinalizarAtendimento={onFinalizarAtendimento}
                          variant="minimal"
                          showProfessional={profissionais.length > 1}
                        />
                      ))}
                    </div>
                  ) : slot.bloqueios.length > 0 ? (
                    <div className="space-y-1">
                      {slot.bloqueios.map((bloqueio, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-2 rounded border-l-4 text-sm",
                            getBloqueioColor(bloqueio.tipo)
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Ban className="w-3 h-3" />
                            <span className="font-medium">
                              {getBloqueioLabel(bloqueio.tipo)}
                            </span>
                            {bloqueio.motivo && (
                              <span className="text-xs opacity-75">
                                - {bloqueio.motivo}
                              </span>
                            )}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {bloqueio.hora_inicio} - {bloqueio.hora_fim}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ResponsiveButton
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10 text-muted-foreground hover:text-primary",
                        slot.isPast && "cursor-not-allowed opacity-50"
                      )}
                      disabled={slot.isPast}
                      onClick={() => onNewAgendamento({
                        data: dateString,
                        hora_inicio: slot.time,
                        profissional_id: profissionais.length === 1 ? profissionais[0].id : undefined
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agendar horário
                    </ResponsiveButton>
                  )}
                </div>

                {/* Professional indicators for multi-professional view */}
                {profissionais.length > 1 && slot.agendamentos.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {profissionais.map(prof => {
                      const hasAgendamento = slot.agendamentos.some(a => a.profissional_id === prof.id);
                      return (
                        <div
                          key={prof.id}
                          className={cn(
                            "w-3 h-3 rounded-full border-2",
                            hasAgendamento 
                              ? "border-background" 
                              : "border-muted-foreground/20 bg-muted"
                          )}
                          style={{ 
                            backgroundColor: hasAgendamento ? prof.cor_agenda : undefined 
                          }}
                          title={prof.nome}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};