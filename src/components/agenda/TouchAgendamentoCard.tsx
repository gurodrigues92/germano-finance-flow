import { ResponsiveButton } from '@/components/ui/responsive-button';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { Badge } from '@/components/ui/badge';
import { Agendamento } from '@/types/salon';
import { cn } from '@/lib/utils';
import { Clock, User, Scissors, Phone, MapPin, PlayCircle, CheckCircle, Edit, MoreVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslations } from '@/lib/translations';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TouchAgendamentoCardProps {
  agendamento: Agendamento;
  onEdit: (agendamento: Agendamento) => void;
  onIniciarAtendimento?: (agendamento: Agendamento) => void;
  onFinalizarAtendimento?: (agendamento: Agendamento) => void;
  variant?: 'default' | 'compact' | 'minimal';
  showProfessional?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'agendado': return 'bg-agenda-scheduled/10 border-l-agenda-scheduled text-agenda-scheduled';
    case 'confirmado': return 'bg-agenda-confirmed/10 border-l-agenda-confirmed text-agenda-confirmed';
    case 'em_atendimento': return 'bg-agenda-in-progress/10 border-l-agenda-in-progress text-agenda-in-progress';
    case 'concluido': return 'bg-agenda-completed/10 border-l-agenda-completed text-agenda-completed';
    case 'cancelado': return 'bg-agenda-cancelled/10 border-l-agenda-cancelled text-agenda-cancelled';
    default: return 'bg-muted/50 border-l-muted-foreground text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'agendado': return Clock;
    case 'confirmado': return CheckCircle;
    case 'em_atendimento': return PlayCircle;
    case 'concluido': return CheckCircle;
    case 'cancelado': return Clock;
    default: return Clock;
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

export const TouchAgendamentoCard = ({ 
  agendamento, 
  onEdit, 
  onIniciarAtendimento, 
  onFinalizarAtendimento,
  variant = 'default',
  showProfessional = false
}: TouchAgendamentoCardProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();
  const StatusIcon = getStatusIcon(agendamento.status);

  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  const canStart = (agendamento.status === 'agendado' || agendamento.status === 'confirmado') && onIniciarAtendimento;
  const canFinish = agendamento.status === 'em_atendimento' && onFinalizarAtendimento;
  const isCompleted = agendamento.status === 'concluido' || agendamento.status === 'cancelado';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(agendamento);
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIniciarAtendimento?.(agendamento);
  };

  const handleFinish = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFinalizarAtendimento?.(agendamento);
  };

  if (isMinimal) {
    return (
      <div 
        className={cn(
          "p-3 rounded-lg border-l-4 transition-all",
          getStatusColor(agendamento.status),
          "hover:shadow-sm cursor-pointer"
        )}
        onClick={() => onEdit(agendamento)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm truncate">
                {agendamento.cliente?.nome || 'Cliente não definido'}
              </span>
              <Badge variant="secondary" className="text-xs">
                {getStatusLabel(agendamento.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {agendamento.hora_inicio} - {agendamento.hora_fim}
              </div>
              {agendamento.servico && (
                <div className="flex items-center gap-1">
                  <Scissors className="w-3 h-3" />
                  <span className="truncate">{agendamento.servico.nome}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {(canStart || canFinish) && (
              <ResponsiveButton
                size="sm"
                variant={canStart ? "default" : "outline"}
                onClick={canStart ? handleStart : handleFinish}
                className="h-8 px-2"
              >
                {canStart ? (
                  <PlayCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
              </ResponsiveButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveCard 
      className={cn(
        "transition-all duration-200 cursor-pointer border-l-4",
        getStatusColor(agendamento.status),
        "hover:shadow-md active:scale-[0.99]",
        isCompact && "compact"
      )}
      onClick={() => onEdit(agendamento)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "font-semibold truncate",
                isCompact ? "text-base" : "text-lg"
              )}>
                {agendamento.cliente?.nome || 'Cliente não definido'}
              </h3>
              <Badge 
                variant="secondary" 
                className={cn(
                  "shrink-0",
                  isCompact ? "text-xs" : "text-sm"
                )}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {getStatusLabel(agendamento.status)}
              </Badge>
            </div>
            
            {/* Time */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className={isCompact ? "text-sm" : "text-base"}>
                {agendamento.hora_inicio} - {agendamento.hora_fim}
              </span>
            </div>
          </div>

          {!isCompleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ResponsiveButton 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </ResponsiveButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t.actions.edit}
                </DropdownMenuItem>
                {canStart && (
                  <DropdownMenuItem onClick={handleStart}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {t.actions.start}
                  </DropdownMenuItem>
                )}
                {canFinish && (
                  <DropdownMenuItem onClick={handleFinish}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t.actions.finish}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Service Info */}
        {agendamento.servico && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scissors className="w-4 h-4" />
            <span className={isCompact ? "text-sm" : "text-base"}>
              {agendamento.servico.nome}
            </span>
            {agendamento.valor && agendamento.valor > 0 && (
              <Badge variant="outline" className="ml-auto">
                R$ {agendamento.valor.toFixed(2)}
              </Badge>
            )}
          </div>
        )}

        {/* Professional */}
        {showProfessional && agendamento.profissional && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className={isCompact ? "text-sm" : "text-base"}>
              {agendamento.profissional.nome}
            </span>
          </div>
        )}

        {/* Client Info */}
        {!isCompact && agendamento.cliente && (
          <div className="space-y-1">
            {agendamento.cliente.telefone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                {agendamento.cliente.telefone}
              </div>
            )}
            {agendamento.cliente.endereco && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{agendamento.cliente.endereco}</span>
              </div>
            )}
          </div>
        )}

        {/* Observations */}
        {!isCompact && agendamento.observacoes && (
          <div className="p-2 bg-muted/50 rounded text-sm">
            <p className="text-muted-foreground italic">
              "{agendamento.observacoes}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!isCompleted && !isCompact && (
          <div className="flex gap-2 pt-2 border-t">
            {canStart && (
              <ResponsiveButton
                variant="default"
                onClick={handleStart}
                className="flex-1"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {t.actions.start}
              </ResponsiveButton>
            )}
            
            {canFinish && (
              <ResponsiveButton
                variant="outline"
                onClick={handleFinish}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t.actions.finish}
              </ResponsiveButton>
            )}
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
};