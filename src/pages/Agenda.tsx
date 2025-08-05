import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Plus } from 'lucide-react';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useServicos } from '@/hooks/salon/useServicos';
import { useBloqueiosAgenda } from '@/hooks/salon/useBloqueiosAgenda';
import { AgendaGrid } from '@/components/agenda/AgendaGrid';
import { AgendaSubMenu } from '@/components/agenda/AgendaSubMenu';
import { AgendamentoDialog } from '@/components/agenda/AgendamentoDialog';
import { BloqueioDialog } from '@/components/agenda/BloqueioDialog';
import { Agendamento } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';

export default function Agenda() {
  const { agendamentos, loading, addAgendamento, loadAgendamentos } = useAgendamentos();
  const { profissionais } = useProfissionais();
  const { servicos } = useServicos();
  const { bloqueios, addBloqueio, loadBloqueios } = useBloqueiosAgenda();
  const { toast } = useToast();

  // Estados da interface
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProfissional, setSelectedProfissional] = useState('todos');
  const [activeTab, setActiveTab] = useState<'calendar' | 'absences' | 'holiday' | 'settings'>('calendar');
  
  // Estados dos dialogs
  const [agendamentoDialogOpen, setAgendamentoDialogOpen] = useState(false);
  const [bloqueioDialogOpen, setBloqueioDialogOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | undefined>();
  const [newAgendamentoData, setNewAgendamentoData] = useState<{
    profissional_id?: string;
    data?: string;
    hora_inicio?: string;
  }>({});

  // Handlers
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    
    // Recarregar dados para a nova data (semana)
    const inicioSemana = new Date(date);
    inicioSemana.setDate(date.getDate() - date.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    loadAgendamentos({
      data_inicio: inicioSemana.toISOString().split('T')[0],
      data_fim: fimSemana.toISOString().split('T')[0]
    });

    loadBloqueios(
      inicioSemana.toISOString().split('T')[0],
      fimSemana.toISOString().split('T')[0]
    );
  };

  const handleNewAgendamento = (data: string, hora: string, profissionalId?: string) => {
    setNewAgendamentoData({
      data,
      hora_inicio: hora,
      profissional_id: profissionalId
    });
    setEditingAgendamento(undefined);
    setAgendamentoDialogOpen(true);
  };

  const handleEditAgendamento = (agendamento: Agendamento) => {
    setEditingAgendamento(agendamento);
    setNewAgendamentoData({});
    setAgendamentoDialogOpen(true);
  };

  const handleSubmitAgendamento = async (agendamentoData: any) => {
    try {
      await addAgendamento(agendamentoData);
      setAgendamentoDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const handleSubmitBloqueio = async (bloqueioData: any) => {
    try {
      await addBloqueio(bloqueioData);
      setBloqueioDialogOpen(false);
      toast({
        title: "Sucesso",
        description: "Bloqueio adicionado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao criar bloqueio:', error);
    }
  };

  const handleFabClick = () => {
    if (activeTab === 'calendar') {
      handleNewAgendamento(
        selectedDate.toISOString().split('T')[0],
        '09:00'
      );
    } else if (activeTab === 'absences') {
      setBloqueioDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Agenda" subtitle="Carregando...">
        <div className="text-center py-8">Carregando agenda...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Agenda"
      subtitle="Sistema visual de agendamentos"
      onFabClick={handleFabClick}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Submenu */}
        <AgendaSubMenu activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === 'calendar' && (
          <AgendaGrid
            agendamentos={agendamentos}
            profissionais={profissionais}
            bloqueios={bloqueios}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onNewAgendamento={handleNewAgendamento}
            onEditAgendamento={handleEditAgendamento}
            selectedProfissional={selectedProfissional}
            onProfissionalChange={setSelectedProfissional}
          />
        )}

        {activeTab === 'absences' && (
          <div className="text-center py-8 text-muted-foreground">
            Gestão de ausências em desenvolvimento...
          </div>
        )}

        {activeTab === 'holiday' && (
          <div className="text-center py-8 text-muted-foreground">
            Gestão de feriados em desenvolvimento...
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-8 text-muted-foreground">
            Configurações da agenda em desenvolvimento...
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AgendamentoDialog
        open={agendamentoDialogOpen}
        onClose={() => setAgendamentoDialogOpen(false)}
        onSubmit={handleSubmitAgendamento}
        profissionais={profissionais}
        servicos={servicos}
        initialData={newAgendamentoData}
        editingAgendamento={editingAgendamento}
      />

      <BloqueioDialog
        open={bloqueioDialogOpen}
        onClose={() => setBloqueioDialogOpen(false)}
        onSubmit={handleSubmitBloqueio}
        profissionais={profissionais}
      />
    </PageLayout>
  );
}