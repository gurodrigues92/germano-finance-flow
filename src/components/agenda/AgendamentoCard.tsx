import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Agendamento } from '@/types/salon';
import { cn } from '@/lib/utils';
import { Clock, User, Scissors, Edit } from 'lucide-react';

interface AgendamentoCardProps {
  agendamento: Agendamento;
  onEdit: (agendamento: Agendamento) => void;
  onIniciarAtendimento?: (agendamento: Agendamento) => void;
  onFinalizarAtendimento?: (agendamento: Agendamento) => void;
  isDragging?: boolean;
  compact?: boolean;
  showDate?: boolean;
  draggable?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'agendado': return 'bg-agenda-scheduled border-agenda-scheduled text-agenda-scheduled-foreground';
    case 'confirmado': return 'bg-agenda-confirmed border-agenda-confirmed text-agenda-confirmed-foreground';
    case 'em_atendimento': return 'bg-agenda-in-progress border-agenda-in-progress text-agenda-in-progress-foreground';
    case 'concluido': return 'bg-agenda-completed border-agenda-completed text-agenda-completed-foreground';
    case 'cancelado': return 'bg-agenda-cancelled border-agenda-cancelled text-agenda-cancelled-foreground';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'agendado': return 'Agendado';
    case 'confirmado': return 'Confirmado';
    case 'em_atendimento': return 'Em Atendimento';
    case 'concluido': return 'Concluído';
    case 'cancelado': return 'Cancelado';
    default: return status;
  }
};

export const AgendamentoCard = ({ 
  agendamento, 
  onEdit, 
  onIniciarAtendimento, 
  onFinalizarAtendimento,
  isDragging = false,
  compact = false,
  showDate = false,
  draggable = true
}: AgendamentoCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: agendamento.id,
    disabled: !draggable || agendamento.status === 'concluido' || agendamento.status === 'cancelado'
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const cardClasses = cn(
    "p-2 rounded border-l-4 transition-all relative group",
    getStatusColor(agendamento.status),
    {
      'opacity-50 shadow-lg z-50': isBeingDragged || isDragging,
      'hover:shadow-sm cursor-move': draggable && agendamento.status !== 'concluido' && agendamento.status !== 'cancelado',
      'p-1': compact,
      'cursor-default': !draggable || agendamento.status === 'concluido' || agendamento.status === 'cancelado'
    }
  );

  return (
    <div
      ref={setDragRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cardClasses}
    >
      <div className="space-y-1">
        {/* Cliente e Status */}
        <div className="flex items-center justify-between">
          <div className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            {agendamento.cliente?.nome || 'Cliente não definido'}
          </div>
          <Badge variant="secondary" className="text-xs">
            {getStatusLabel(agendamento.status)}
          </Badge>
        </div>

        {/* Serviço */}
        <div className={cn("opacity-75 flex items-center gap-1", compact ? "text-xs" : "text-xs")}>
          <Scissors className="w-3 h-3" />
          {agendamento.servico?.nome || 'Serviço não definido'}
        </div>

        {/* Horário */}
        <div className={cn("opacity-75 flex items-center gap-1", compact ? "text-xs" : "text-xs")}>
          <Clock className="w-3 h-3" />
          {agendamento.hora_inicio} - {agendamento.hora_fim}
        </div>

        {/* Data (se showDate for true) */}
        {showDate && (
          <div className="text-xs opacity-75">
            {new Date(agendamento.data).toLocaleDateString('pt-BR')}
          </div>
        )}

        {/* Profissional (se compact for false) */}
        {!compact && agendamento.profissional && (
          <div className="text-xs opacity-75 flex items-center gap-1">
            <User className="w-3 h-3" />
            {agendamento.profissional.nome}
          </div>
        )}

        {/* Valor (se disponível) */}
        {agendamento.valor && agendamento.valor > 0 && (
          <div className="text-xs font-medium">
            R$ {agendamento.valor.toFixed(2)}
          </div>
        )}

        {/* Observações (se disponível e não compact) */}
        {!compact && agendamento.observacoes && (
          <div className="text-xs opacity-75 italic">
            {agendamento.observacoes}
          </div>
        )}
      </div>
      
      {/* Botões de ação */}
      {!compact && !isDragging && (
        <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(agendamento);
            }}
            className="text-xs h-6 px-2"
          >
            <Edit className="w-3 h-3" />
          </Button>
          
          {(agendamento.status === 'agendado' || agendamento.status === 'confirmado') && onIniciarAtendimento && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onIniciarAtendimento(agendamento);
              }}
              className="text-xs h-6 px-2"
            >
              Iniciar
            </Button>
          )}
          
          {agendamento.status === 'em_atendimento' && onFinalizarAtendimento && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onFinalizarAtendimento(agendamento);
              }}
              className="text-xs h-6 px-2"
            >
              Finalizar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};