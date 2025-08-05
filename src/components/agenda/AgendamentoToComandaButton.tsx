import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Agendamento } from '@/types/salon';
import { cn } from '@/lib/utils';

interface AgendamentoToComandaButtonProps {
  agendamento: Agendamento;
  onIniciarAtendimento: (agendamento: Agendamento) => void;
  onFinalizarAtendimento: (agendamento: Agendamento) => void;
  temComandaAberta?: boolean;
  numeroComanda?: number;
}

export const AgendamentoToComandaButton = ({
  agendamento,
  onIniciarAtendimento,
  onFinalizarAtendimento,
  temComandaAberta,
  numeroComanda
}: AgendamentoToComandaButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleIniciarAtendimento = async () => {
    setLoading(true);
    try {
      await onIniciarAtendimento(agendamento);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarAtendimento = async () => {
    setLoading(true);
    try {
      await onFinalizarAtendimento(agendamento);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = () => {
    switch (agendamento.status) {
      case 'agendado':
        return (
          <Badge variant="outline" className="text-[hsl(var(--muted-foreground))]">
            <Clock className="w-3 h-3 mr-1" />
            Agendado
          </Badge>
        );
      case 'confirmado':
        return (
          <Badge variant="outline" className="text-[hsl(var(--primary))] border-[hsl(var(--primary))]">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmado
          </Badge>
        );
      case 'em_atendimento':
        return (
          <Badge className="bg-[hsl(var(--warning))] text-white">
            <Play className="w-3 h-3 mr-1" />
            Em Atendimento
          </Badge>
        );
      case 'concluido':
        return (
          <Badge className="bg-[hsl(var(--success))] text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'cancelado':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderActionButton = () => {
    if (agendamento.status === 'concluido' || agendamento.status === 'cancelado') {
      return null;
    }

    if (agendamento.status === 'em_atendimento') {
      return (
        <div className="space-y-2">
          {temComandaAberta && numeroComanda && (
            <div className="text-xs text-[hsl(var(--warning))] font-medium">
              Comanda #{numeroComanda} aberta
            </div>
          )}
          <Button
            size="sm"
            onClick={handleFinalizarAtendimento}
            disabled={loading}
            className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {loading ? 'Finalizando...' : 'Finalizar'}
          </Button>
        </div>
      );
    }

    if (agendamento.status === 'agendado' || agendamento.status === 'confirmado') {
      return (
        <Button
          size="sm"
          onClick={handleIniciarAtendimento}
          disabled={loading}
          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white"
        >
          <Play className="w-3 h-3 mr-1" />
          {loading ? 'Iniciando...' : 'Iniciar'}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      {renderStatusBadge()}
      {renderActionButton()}
    </div>
  );
};