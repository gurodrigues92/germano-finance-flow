import { ResponsiveButton } from '@/components/ui/responsive-button';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { Calendar, Plus, Coffee, Clock } from 'lucide-react';
import { useTranslations } from '@/lib/translations';

interface EmptyAgendaStateProps {
  isToday: boolean;
  onCreateAgendamento: () => void;
}

export const EmptyAgendaState = ({ isToday, onCreateAgendamento }: EmptyAgendaStateProps) => {
  const t = useTranslations();

  return (
    <ResponsiveCard className="text-center py-12">
      <div className="flex flex-col items-center space-y-4">
        {isToday ? (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Coffee className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Sem agendamentos hoje</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Aproveite este tempo livre para organizar o salão ou relaxar um pouco.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Agenda livre</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Nenhum agendamento para este dia. Que tal criar o primeiro?
              </p>
            </div>
          </>
        )}
        
        <ResponsiveButton
          onClick={onCreateAgendamento}
          className="mt-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isToday ? 'Agendar agora' : t.actions.schedule}
        </ResponsiveButton>
        
        {isToday && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <Clock className="w-3 h-3" />
            Próximos horários disponíveis a partir das 09:00
          </div>
        )}
      </div>
    </ResponsiveCard>
  );
};