import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Agendamento, Profissional, BloqueioAgenda } from '@/types/salon';
import { Clock, User, Scissors, Plus, Calendar as CalendarIcon, List, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TouchAgendamentoCard } from './TouchAgendamentoCard';
import { MobileTimeSlots } from './MobileTimeSlots';
import { useTranslations } from '@/lib/translations';
import { EmptyAgendaState } from './EmptyAgendaState';

interface MobileAgendaViewProps {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  bloqueios: BloqueioAgenda[];
  selectedDate: Date;
  selectedProfissional: string;
  onNewAgendamento: (data: { data: string; hora_inicio: string; profissional_id?: string }) => void;
  onEditAgendamento: (agendamento: Agendamento) => void;
  onIniciarAtendimento?: (agendamento: Agendamento) => void;
  onFinalizarAtendimento?: (agendamento: Agendamento) => void;
  onRefresh?: () => Promise<void>;
}

type MobileViewMode = 'timeline' | 'list' | 'professional';

export const MobileAgendaView = ({
  agendamentos,
  profissionais,
  bloqueios,
  selectedDate,
  selectedProfissional,
  onNewAgendamento,
  onEditAgendamento,
  onIniciarAtendimento,
  onFinalizarAtendimento,
  onRefresh
}: MobileAgendaViewProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<MobileViewMode>('timeline');

  const { isPulling, pullDistance, isRefreshing, bindPullToRefresh } = usePullToRefresh({
    onRefresh: onRefresh || (() => Promise.resolve()),
    threshold: 100,
    resistance: 0.5
  });

  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const isToday = dateString === format(new Date(), 'yyyy-MM-dd');

  // Filter data for selected date
  const dayAgendamentos = useMemo(() => {
    return agendamentos
      .filter(a => a.data === dateString)
      .filter(a => selectedProfissional === 'todos' || a.profissional_id === selectedProfissional)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }, [agendamentos, dateString, selectedProfissional]);

  const dayBloqueios = useMemo(() => {
    return bloqueios
      .filter(b => b.data === dateString)
      .filter(b => selectedProfissional === 'todos' || b.profissional_id === selectedProfissional);
  }, [bloqueios, dateString, selectedProfissional]);

  const filteredProfissionais = useMemo(() => {
    return selectedProfissional === 'todos' 
      ? profissionais 
      : profissionais.filter(p => p.id === selectedProfissional);
  }, [profissionais, selectedProfissional]);

  // Group agendamentos by professional for professional view
  const agendamentosByProfissional = useMemo(() => {
    const grouped: Record<string, Agendamento[]> = {};
    filteredProfissionais.forEach(prof => {
      grouped[prof.id] = dayAgendamentos.filter(a => a.profissional_id === prof.id);
    });
    return grouped;
  }, [dayAgendamentos, filteredProfissionais]);

  const renderTimelineView = () => (
    <div className="space-y-2">
      {dayAgendamentos.length === 0 ? (
        <EmptyAgendaState
          isToday={isToday}
          onCreateAgendamento={() => onNewAgendamento({
            data: dateString,
            hora_inicio: format(new Date(), 'HH:mm'),
            profissional_id: selectedProfissional !== 'todos' ? selectedProfissional : undefined
          })}
        />
      ) : (
        <>
          {dayAgendamentos.map(agendamento => (
            <TouchAgendamentoCard
              key={agendamento.id}
              agendamento={agendamento}
              onEdit={onEditAgendamento}
              onIniciarAtendimento={onIniciarAtendimento}
              onFinalizarAtendimento={onFinalizarAtendimento}
              showProfessional={selectedProfissional === 'todos'}
            />
          ))}
          
          {/* Add new appointment button */}
          <Card className="p-4 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <ResponsiveButton
              variant="ghost"
              className="w-full h-16 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
              onClick={() => onNewAgendamento({
                data: dateString,
                hora_inicio: dayAgendamentos.length > 0 
                  ? dayAgendamentos[dayAgendamentos.length - 1].hora_fim || '18:00'
                  : '09:00',
                profissional_id: selectedProfissional !== 'todos' ? selectedProfissional : undefined
              })}
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">{t.actions.schedule}</span>
            </ResponsiveButton>
          </Card>
        </>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {dayAgendamentos.length === 0 ? (
        <EmptyAgendaState
          isToday={isToday}
          onCreateAgendamento={() => onNewAgendamento({
            data: dateString,
            hora_inicio: format(new Date(), 'HH:mm'),
            profissional_id: selectedProfissional !== 'todos' ? selectedProfissional : undefined
          })}
        />
      ) : (
        dayAgendamentos.map(agendamento => (
          <TouchAgendamentoCard
            key={agendamento.id}
            agendamento={agendamento}
            onEdit={onEditAgendamento}
            onIniciarAtendimento={onIniciarAtendimento}
            onFinalizarAtendimento={onFinalizarAtendimento}
            variant="compact"
            showProfessional={selectedProfissional === 'todos'}
          />
        ))
      )}
    </div>
  );

  const renderProfessionalView = () => (
    <div className="space-y-4">
      {filteredProfissionais.map(profissional => {
        const profAgendamentos = agendamentosByProfissional[profissional.id] || [];
        
        return (
          <Card key={profissional.id} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: profissional.cor_agenda }}
              />
              <h3 className="font-medium">{profissional.nome}</h3>
              {profissional.tipo === 'assistente' && (
                <Badge variant="secondary" className="text-xs">Assist.</Badge>
              )}
              <Badge variant="outline" className="ml-auto text-xs">
                {profAgendamentos.length} agendamento{profAgendamentos.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {profAgendamentos.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum agendamento hoje</p>
                  <ResponsiveButton
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => onNewAgendamento({
                      data: dateString,
                      hora_inicio: '09:00',
                      profissional_id: profissional.id
                    })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t.actions.schedule}
                  </ResponsiveButton>
                </div>
              ) : (
                profAgendamentos.map(agendamento => (
                  <TouchAgendamentoCard
                    key={agendamento.id}
                    agendamento={agendamento}
                    onEdit={onEditAgendamento}
                    onIniciarAtendimento={onIniciarAtendimento}
                    onFinalizarAtendimento={onFinalizarAtendimento}
                    variant="minimal"
                    showProfessional={false}
                  />
                ))
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );

  if (!isMobile) {
    return (
      <MobileTimeSlots
        agendamentos={dayAgendamentos}
        profissionais={filteredProfissionais}
        bloqueios={dayBloqueios}
        selectedDate={selectedDate}
        onNewAgendamento={onNewAgendamento}
        onEditAgendamento={onEditAgendamento}
        onIniciarAtendimento={onIniciarAtendimento}
        onFinalizarAtendimento={onFinalizarAtendimento}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 bg-primary/10 transition-all duration-200"
          style={{ height: `${Math.min(pullDistance, 100)}px` }}
        >
          <div className="flex items-center justify-center h-full">
            <div className={cn(
              "w-6 h-6 border-2 border-primary border-t-transparent rounded-full",
              isRefreshing ? "animate-spin" : ""
            )} />
          </div>
        </div>
      )}

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as MobileViewMode)} className="flex-1">
        <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <TabsList className="grid w-full grid-cols-3 h-12 m-2">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden xs:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span className="hidden xs:inline">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden xs:inline">Profissionais</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div {...bindPullToRefresh} className="flex-1">
          <ScrollArea className="h-[calc(100vh-144px)]">
            <div className="p-4">
              <TabsContent value="timeline" className="mt-0">
                {renderTimelineView()}
              </TabsContent>
              <TabsContent value="list" className="mt-0">
                {renderListView()}
              </TabsContent>
              <TabsContent value="professional" className="mt-0">
                {renderProfessionalView()}
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};