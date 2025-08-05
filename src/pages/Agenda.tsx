import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Plus } from 'lucide-react';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useServicos } from '@/hooks/salon/useServicos';
import { useBloqueiosAgenda } from '@/hooks/salon/useBloqueiosAgenda';
import { useComandas } from '@/hooks/salon/useComandas';
import { SalonAgendaGrid } from '@/components/agenda/SalonAgendaGrid';
import { SalonAgendaTabs } from '@/components/agenda/SalonAgendaTabs';
import { SalonAgendaHeader } from '@/components/agenda/SalonAgendaHeader';
import { AgendamentoDialog } from '@/components/agenda/AgendamentoDialog';
import { BloqueioDialog } from '@/components/agenda/BloqueioDialog';
import { AbsencesTab } from '@/components/agenda/AbsencesTab';
import { HolidayTab } from '@/components/agenda/HolidayTab';
import { SettingsTab } from '@/components/agenda/SettingsTab';
import { Agendamento } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Agenda() {
  const { agendamentos, loading, addAgendamento, loadAgendamentos, updateStatusAgendamento } = useAgendamentos();
  const { profissionais } = useProfissionais();
  const { servicos } = useServicos();
  const { bloqueios, addBloqueio, loadBloqueios } = useBloqueiosAgenda();
  const { createComanda } = useComandas();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Iniciar atendimento - muda status e cria comanda
  const handleIniciarAtendimento = async (agendamento: Agendamento) => {
    try {
      // Mudar status para em_atendimento
      await updateStatusAgendamento(agendamento.id, 'em_atendimento');
      
      // Criar comanda automaticamente
      const comandaData = {
        cliente_id: agendamento.cliente_id,
        profissional_principal_id: agendamento.profissional_id,
        observacoes: `Comanda criada automaticamente a partir do agendamento ${agendamento.id}`
      };
      
      const comanda = await createComanda(comandaData);
      
      toast({
        title: "Atendimento iniciado",
        description: `Comanda #${comanda.numero_comanda} criada automaticamente`
      });
      
      // Navegar para o caixa para mostrar a comanda criada
      navigate('/caixa');
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
    }
  };

  // Finalizar atendimento
  const handleFinalizarAtendimento = async (agendamento: Agendamento) => {
    try {
      await updateStatusAgendamento(agendamento.id, 'concluido');
      
      toast({
        title: "Atendimento finalizado",
        description: "Status do agendamento atualizado para concluído"
      });
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
    }
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
        {/* Header da Agenda SalonSoft */}
        <SalonAgendaHeader
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          selectedProfissional={selectedProfissional}
          onProfissionalChange={setSelectedProfissional}
          profissionais={profissionais}
        />

        {/* Abas SalonSoft */}
        <SalonAgendaTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === 'calendar' && (
          <SalonAgendaGrid
            agendamentos={agendamentos}
            profissionais={profissionais}
            bloqueios={bloqueios}
            selectedDate={selectedDate}
            onNewAgendamento={(data) => handleNewAgendamento(data.data, data.hora_inicio, data.profissional_id)}
            onEditAgendamento={handleEditAgendamento}
            onIniciarAtendimento={handleIniciarAtendimento}
            onFinalizarAtendimento={handleFinalizarAtendimento}
            selectedProfissional={selectedProfissional}
          />
        )}

        {activeTab === 'absences' && (
          <AbsencesTab onCreateBloqueio={() => setBloqueioDialogOpen(true)} />
        )}

        {activeTab === 'holiday' && (
          <HolidayTab />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
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