import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Plus } from 'lucide-react';
import { Agendamento, Profissional, BloqueioAgenda } from '@/types/salon';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AgendaGridProps {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  bloqueios: BloqueioAgenda[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onNewAgendamento: (data: string, hora: string, profissionalId?: string) => void;
  onEditAgendamento: (agendamento: Agendamento) => void;
  onIniciarAtendimento?: (agendamento: Agendamento) => void;
  onFinalizarAtendimento?: (agendamento: Agendamento) => void;
  selectedProfissional: string;
  onProfissionalChange: (profissionalId: string) => void;
}

// Gerar horários de 7:00 às 23:00
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'agendado': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'confirmado': return 'bg-green-100 border-green-300 text-green-800';
    case 'em_atendimento': return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'concluido': return 'bg-gray-100 border-gray-300 text-gray-800';
    case 'cancelado': return 'bg-red-100 border-red-300 text-red-800';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

const getBloqueioColor = (tipo: string) => {
  switch (tipo) {
    case 'lunch-time': return 'bg-status-lunch-time/20 border-status-lunch-time text-status-lunch-time';
    case 'lack': return 'bg-status-critico/20 border-status-critico text-status-critico';
    case 'unavailable': return 'bg-status-atencao/20 border-status-atencao text-status-atencao';
    // Mantém compatibilidade com valores antigos
    case 'almoco': return 'bg-status-lunch-time/20 border-status-lunch-time text-status-lunch-time';
    case 'falta': return 'bg-status-critico/20 border-status-critico text-status-critico';
    case 'indisponivel': return 'bg-status-atencao/20 border-status-atencao text-status-atencao';
    default: return 'bg-muted border-muted-foreground text-muted-foreground';
  }
};

const getBloqueioLabel = (tipo: string) => {
  switch (tipo) {
    case 'lunch-time': return 'Lunch Time';
    case 'lack': return 'Lack';
    case 'unavailable': return 'Unavailable';
    // Mantém compatibilidade com valores antigos
    case 'almoco': return 'Lunch Time';
    case 'falta': return 'Lack';
    case 'indisponivel': return 'Unavailable';
    default: return tipo;
  }
};

export const AgendaGrid = ({ 
  agendamentos, 
  profissionais, 
  bloqueios, 
  selectedDate, 
  onDateChange,
  onNewAgendamento,
  onEditAgendamento,
  onIniciarAtendimento,
  onFinalizarAtendimento,
  selectedProfissional,
  onProfissionalChange 
}: AgendaGridProps) => {
  const timeSlots = generateTimeSlots();
  const dateString = format(selectedDate, 'yyyy-MM-dd');

  // Filtrar dados para a data selecionada
  const dayAgendamentos = agendamentos.filter(a => a.data === dateString);
  const dayBloqueios = bloqueios.filter(b => b.data === dateString);

  // Filtrar profissionais se necessário
  const filteredProfissionais = selectedProfissional === 'todos' 
    ? profissionais 
    : profissionais.filter(p => p.id === selectedProfissional);

  // Verificar se um horário tem agendamento
  const getAgendamentoSlot = (profissionalId: string, hora: string) => {
    return dayAgendamentos.find(a => 
      a.profissional_id === profissionalId && 
      a.hora_inicio <= hora && 
      a.hora_fim > hora
    );
  };

  // Verificar se um horário tem bloqueio
  const getBloqueioSlot = (profissionalId: string, hora: string) => {
    return dayBloqueios.find(b => 
      b.profissional_id === profissionalId && 
      b.hora_inicio <= hora && 
      b.hora_fim > hora
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Agenda
            </CardTitle>
            <div className="flex items-center gap-4">
              {/* Seletor de Profissional */}
              <Select value={selectedProfissional} onValueChange={onProfissionalChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos profissionais</SelectItem>
                  {profissionais.map(prof => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Navegação de data */}
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

      {/* Grid da agenda */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header do grid */}
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

              {/* Slots de horário */}
              {timeSlots.map(time => (
                <div 
                  key={time} 
                  className="grid border-b hover:bg-muted/20" 
                  style={{ gridTemplateColumns: `120px repeat(${filteredProfissionais.length}, 1fr)` }}
                >
                  {/* Coluna de horário */}
                  <div className="p-3 border-r text-sm font-medium text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {time}
                  </div>

                  {/* Colunas dos profissionais */}
                  {filteredProfissionais.map(profissional => {
                    const agendamento = getAgendamentoSlot(profissional.id, time);
                    const bloqueio = getBloqueioSlot(profissional.id, time);

                    return (
                      <div key={`${profissional.id}-${time}`} className="p-2 border-r min-h-[60px]">
                        {agendamento ? (
                          // Mostrar agendamento
                          <div 
                            className={cn(
                              "p-2 rounded border-l-4 transition-shadow relative",
                              getStatusColor(agendamento.status)
                            )}
                          >
                            <div 
                              className="cursor-pointer"
                              onClick={() => onEditAgendamento(agendamento)}
                            >
                              <div className="text-sm font-medium">
                                {agendamento.cliente?.nome}
                              </div>
                              <div className="text-xs opacity-75">
                                {agendamento.servico?.nome}
                              </div>
                              <div className="text-xs opacity-75">
                                {agendamento.hora_inicio} - {agendamento.hora_fim}
                              </div>
                            </div>
                            
                            {/* Botões de ação baseados no status */}
                            <div className="mt-2 flex gap-1">
                              {(agendamento.status === 'agendado' || agendamento.status === 'confirmado') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onIniciarAtendimento?.(agendamento)}
                                  className="text-xs h-6 px-2"
                                >
                                  Iniciar
                                </Button>
                              )}
                              {agendamento.status === 'em_atendimento' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onFinalizarAtendimento?.(agendamento)}
                                  className="text-xs h-6 px-2"
                                >
                                  Finalizar
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : bloqueio ? (
                          // Mostrar bloqueio
                          <div className={cn(
                            "p-2 rounded border-l-4",
                            getBloqueioColor(bloqueio.tipo)
                          )}>
                            <div className="text-sm font-medium">
                              {getBloqueioLabel(bloqueio.tipo)}
                            </div>
                            {bloqueio.motivo && (
                              <div className="text-xs opacity-75">
                                {bloqueio.motivo}
                              </div>
                            )}
                          </div>
                        ) : (
                          // Slot vazio - permite criar agendamento
                          <button
                            className="w-full h-full rounded border-2 border-dashed border-transparent hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center group"
                            onClick={() => onNewAgendamento(dateString, time, profissional.id)}
                          >
                            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};