import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Scissors, Play, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Agendamento, Profissional, BloqueioAgenda } from '@/types/salon';

interface SalonAgendaGridProps {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  bloqueios: BloqueioAgenda[];
  selectedDate: Date;
  selectedProfissional: string;
  onNewAgendamento: (data: { profissional_id: string; data: string; hora_inicio: string }) => void;
  onEditAgendamento: (agendamento: Agendamento) => void;
  onIniciarAtendimento: (agendamento: Agendamento) => void;
  onFinalizarAtendimento: (agendamento: Agendamento) => void;
}

export const SalonAgendaGrid = ({
  agendamentos,
  profissionais,
  bloqueios,
  selectedDate,
  selectedProfissional,
  onNewAgendamento,
  onEditAgendamento,
  onIniciarAtendimento,
  onFinalizarAtendimento
}: SalonAgendaGridProps) => {
  // Gerar horários de 07:00 às 23:00 em intervalos de 30min
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 23) { // Não adicionar :30 para 23h
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  // Filtrar profissionais baseado na seleção
  const filteredProfissionais = selectedProfissional === 'todos' 
    ? profissionais.filter(p => p.ativo)
    : profissionais.filter(p => p.id === selectedProfissional && p.ativo);

  // Filtrar agendamentos do dia selecionado
  const dayAgendamentos = agendamentos.filter(a => a.data === selectedDateStr);

  // Filtrar bloqueios do dia selecionado
  const dayBloqueios = bloqueios.filter(b => b.data === selectedDateStr);

  const getAgendamentoForSlot = (profissionalId: string, timeSlot: string) => {
    return dayAgendamentos.find(a => 
      a.profissional_id === profissionalId && 
      a.hora_inicio <= timeSlot && 
      a.hora_fim > timeSlot
    );
  };

  const getBloqueioForSlot = (profissionalId: string, timeSlot: string) => {
    return dayBloqueios.find(b => 
      b.profissional_id === profissionalId && 
      b.hora_inicio <= timeSlot && 
      b.hora_fim > timeSlot
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return '#4CAF50'; // Verde
      case 'agendado': return '#FF9800'; // Laranja
      case 'em_atendimento': return '#2196F3'; // Azul
      case 'finalizado': return '#9C27B0'; // Roxo
      case 'cancelado': return '#F44336'; // Vermelho
      default: return '#607D8B'; // Cinza
    }
  };

  const getBloqueioColor = (tipo: string) => {
    switch (tipo) {
      case 'Lunch Time': return '#9C27B0'; // Roxo
      case 'Unavailable': return '#FF9800'; // Amarelo
      case 'Lack': return '#F44336'; // Vermelho
      default: return '#607D8B'; // Cinza
    }
  };

  const handleSlotClick = (profissionalId: string, timeSlot: string) => {
    const existingAgendamento = getAgendamentoForSlot(profissionalId, timeSlot);
    const existingBloqueio = getBloqueioForSlot(profissionalId, timeSlot);
    
    if (existingAgendamento) {
      onEditAgendamento(existingAgendamento);
    } else if (!existingBloqueio) {
      onNewAgendamento({
        profissional_id: profissionalId,
        data: selectedDateStr,
        hora_inicio: timeSlot
      });
    }
  };

  if (filteredProfissionais.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Nenhum profissional disponível
          </h3>
          <p className="text-muted-foreground">
            Verifique se há profissionais ativos cadastrados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid bg-gray-50 border-b" style={{
              gridTemplateColumns: `80px repeat(${filteredProfissionais.length}, 1fr)`
            }}>
              <div className="p-3 border-r bg-gray-100">
                <span className="text-sm font-semibold text-gray-700">Horário</span>
              </div>
              {filteredProfissionais.map((profissional) => (
                <div key={profissional.id} className="p-3 border-r text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: profissional.cor_agenda }}
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {profissional.nome}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map((timeSlot) => (
              <div 
                key={timeSlot}
                className="grid border-b hover:bg-gray-25 transition-colors"
                style={{
                  gridTemplateColumns: `80px repeat(${filteredProfissionais.length}, 1fr)`
                }}
              >
                {/* Time Column */}
                <div className="p-2 border-r bg-gray-50 flex items-center">
                  <span className="text-xs font-medium text-gray-600">
                    {timeSlot}
                  </span>
                </div>

                {/* Professional Columns */}
                {filteredProfissionais.map((profissional) => {
                  const agendamento = getAgendamentoForSlot(profissional.id, timeSlot);
                  const bloqueio = getBloqueioForSlot(profissional.id, timeSlot);

                  return (
                    <div 
                      key={profissional.id}
                      className="p-1 border-r min-h-[50px] cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => handleSlotClick(profissional.id, timeSlot)}
                    >
                      {agendamento && agendamento.hora_inicio === timeSlot ? (
                        <div 
                          className="rounded-lg p-2 text-white text-xs h-full"
                          style={{ 
                            backgroundColor: getStatusColor(agendamento.status),
                            minHeight: '48px'
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">
                              {agendamento.hora_inicio} to {agendamento.hora_fim}
                            </span>
                            <div className="flex gap-1">
                              {agendamento.status === 'confirmado' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 text-white hover:bg-white/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onIniciarAtendimento(agendamento);
                                  }}
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                              {agendamento.status === 'em_atendimento' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 text-white hover:bg-white/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onFinalizarAtendimento(agendamento);
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="text-white/90 text-xs">
                            Cliente: {agendamento.cliente_id}
                          </div>
                          <div className="text-white/80 text-xs">
                            Serviço: {agendamento.servico_id}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="mt-1 text-xs bg-white/20 text-white border-white/30"
                          >
                            {agendamento.status}
                          </Badge>
                        </div>
                      ) : bloqueio && bloqueio.hora_inicio === timeSlot ? (
                        <div 
                          className="rounded-lg p-2 text-white text-xs h-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: getBloqueioColor(bloqueio.tipo),
                            minHeight: '48px'
                          }}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{bloqueio.tipo}</div>
                            <div className="text-white/80">{bloqueio.motivo}</div>
                          </div>
                        </div>
                      ) : agendamento || bloqueio ? (
                        // Slot ocupado mas não é o slot inicial
                        <div className="h-full opacity-50" />
                      ) : (
                        // Slot vazio
                        <div className="h-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
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
  );
};