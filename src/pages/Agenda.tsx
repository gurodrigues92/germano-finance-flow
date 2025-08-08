import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Plus } from 'lucide-react';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useServicos } from '@/hooks/salon/useServicos';
import { useBloqueiosAgenda } from '@/hooks/salon/useBloqueiosAgenda';
import { useComandas } from '@/hooks/salon/useComandas';
import { AdvancedAgendaGrid } from '@/components/agenda/AdvancedAgendaGrid';
import { AgendamentoDialog } from '@/components/agenda/AgendamentoDialog';
import { BloqueioDialog } from '@/components/agenda/BloqueioDialog';
import { AbsencesTab } from '@/components/agenda/AbsencesTab';
import { HolidayTab } from '@/components/agenda/HolidayTab';
import { SettingsTab } from '@/components/agenda/SettingsTab';
import { RecurringAgendamentoDialog } from '@/components/agenda/RecurringAgendamentoDialog';
import { NotificationCenter } from '@/components/agenda/NotificationCenter';
import { MobileAgendaLayout } from '@/components/agenda/MobileAgendaLayout';
import { ResponsiveHeader } from '@/components/agenda/ResponsiveHeader';
import { UnifiedTabNavigation } from '@/components/agenda/UnifiedTabNavigation';
import { ContextualActions } from '@/components/agenda/ContextualActions';
import { MobileAgendaView } from '@/components/agenda/MobileAgendaView';
import { Agendamento } from '@/types/salon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePageSEO } from '@/hooks/usePageSEO';

export default function Agenda() {
  const { agendamentos, loading, addAgendamento, loadAgendamentos, updateStatusAgendamento } = useAgendamentos();
  const { profissionais } = useProfissionais();
  const { servicos } = useServicos();
  const { bloqueios, addBloqueio, loadBloqueios } = useBloqueiosAgenda();
  const { createComanda } = useComandas();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  usePageSEO({
    title: 'Agenda | App',
    description: 'Agendamentos móveis com fluxo fluido e design limpo.',
    canonicalPath: '/agenda'
  });

  // Estados da interface
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProfissional, setSelectedProfissional] = useState('todos');
  const [activeTab, setActiveTab] = useState<'calendar' | 'absences' | 'holiday' | 'settings' | 'notifications'>('calendar');
  
  // Estados dos dialogs
  const [agendamentoDialogOpen, setAgendamentoDialogOpen] = useState(false);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
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

  const handleRefresh = async () => {
    const date = selectedDate;
    const inicioSemana = new Date(date);
    inicioSemana.setDate(date.getDate() - date.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    await Promise.all([
      loadAgendamentos({
        data_inicio: inicioSemana.toISOString().split('T')[0],
        data_fim: fimSemana.toISOString().split('T')[0]
      }),
      (async () => {
        await loadBloqueios(
          inicioSemana.toISOString().split('T')[0],
          fimSemana.toISOString().split('T')[0]
        );
      })()
    ]);
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
      
      // Criar comanda automaticamente com dados do agendamento
      const comandaData = {
        cliente_id: agendamento.cliente_id,
        profissional_principal_id: agendamento.profissional_id,
        observacoes: `Comanda criada automaticamente - Agendamento: ${agendamento.servico?.nome || 'Serviço'} - ${agendamento.data} às ${agendamento.hora_inicio}`
      };
      
      const comanda = await createComanda(comandaData);
      
      // TODO: Adicionar serviço como item inicial da comanda
      // await addItemComanda(comanda.id, {
      //   item_id: agendamento.servico_id,
      //   nome_item: agendamento.servico?.nome,
      //   tipo: 'servico',
      //   quantidade: 1,
      //   valor_unitario: agendamento.valor,
      //   profissional_id: agendamento.profissional_id
      // });
      
      toast({
        title: "✅ Atendimento iniciado com sucesso",
        description: `Comanda #${comanda.numero_comanda} criada automaticamente. Redirecionando...`
      });
      
      // Navegar para o caixa para mostrar a comanda criada
      setTimeout(() => navigate('/caixa'), 1500);
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
      toast({
        title: "Erro ao iniciar atendimento",
        description: "Não foi possível criar a comanda automaticamente",
        variant: "destructive"
      });
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

  const handleSubmitRecurring = async (agendamentosList: any[]) => {
    try {
      // Criar múltiplos agendamentos
      for (const agendamentoData of agendamentosList) {
        await addAgendamento(agendamentoData);
      }
      
      toast({
        title: "Sucesso",
        description: `${agendamentosList.length} agendamentos criados com sucesso`
      });
    } catch (error) {
      console.error('Erro ao criar agendamentos recorrentes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar todos os agendamentos",
        variant: "destructive"
      });
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

  const handleNewRecurring = () => {
    setRecurringDialogOpen(true);
  };

  if (loading) {
    return (
      <PageLayout title="Agenda" subtitle="Carregando...">
        <div className="text-center py-8">Carregando agenda...</div>
      </PageLayout>
    );
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          isMobile ? (
            <MobileAgendaView
              agendamentos={agendamentos}
              profissionais={profissionais}
              bloqueios={bloqueios}
              selectedDate={selectedDate}
              selectedProfissional={selectedProfissional}
              onNewAgendamento={({ data, hora_inicio, profissional_id }) =>
                handleNewAgendamento(data, hora_inicio, profissional_id)
              }
              onEditAgendamento={handleEditAgendamento}
              onIniciarAtendimento={handleIniciarAtendimento}
              onFinalizarAtendimento={handleFinalizarAtendimento}
              onRefresh={handleRefresh}
            />
          ) : (
            <AdvancedAgendaGrid
              agendamentos={agendamentos}
              profissionais={profissionais}
              bloqueios={bloqueios}
              selectedDate={selectedDate}
              onNewAgendamento={(data) => handleNewAgendamento(data.data, data.hora_inicio, data.profissional_id)}
              onEditAgendamento={handleEditAgendamento}
              onIniciarAtendimento={handleIniciarAtendimento}
              onFinalizarAtendimento={handleFinalizarAtendimento}
              selectedProfissional={selectedProfissional}
              onDateChange={handleDateChange}
            />
          )
        );
      case 'absences':
        return <AbsencesTab onCreateBloqueio={() => setBloqueioDialogOpen(true)} />;
      case 'holiday':
        return <HolidayTab />;
      case 'settings':
        return <SettingsTab />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return null;
    }
  };

  const header = (
    <ResponsiveHeader
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
      selectedProfissional={selectedProfissional}
      onProfissionalChange={setSelectedProfissional}
      profissionais={profissionais}
    />
  );

  const tabs = (
    <UnifiedTabNavigation 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
    />
  );

  if (isMobile) {
    return (
      <PageLayout
        title="Agenda"
        subtitle="Sistema avançado de agendamentos"
      >
        <MobileAgendaLayout
          header={header}
          tabs={tabs}
          content={renderContent()}
        />

        {/* Mobile Contextual Actions */}
        <ContextualActions
          activeTab={activeTab}
          onNewAgendamento={() => handleNewAgendamento(
            selectedDate.toISOString().split('T')[0],
            '09:00'
          )}
          onNewBloqueio={() => setBloqueioDialogOpen(true)}
          onNewRecurring={handleNewRecurring}
        />

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

        <RecurringAgendamentoDialog
          open={recurringDialogOpen}
          onClose={() => setRecurringDialogOpen(false)}
          onSubmit={handleSubmitRecurring}
          profissionais={profissionais}
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

  // Desktop version
  return (
    <PageLayout
      title="Agenda"
      subtitle="Sistema avançado de agendamentos com notificações automáticas"
      onFabClick={handleFabClick}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {header}
        
        <div className="flex items-center justify-between">
          {tabs}
          <ContextualActions
            activeTab={activeTab}
            onNewAgendamento={() => handleNewAgendamento(
              selectedDate.toISOString().split('T')[0],
              '09:00'
            )}
            onNewBloqueio={() => setBloqueioDialogOpen(true)}
            onNewRecurring={handleNewRecurring}
          />
        </div>

        {renderContent()}
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

      <RecurringAgendamentoDialog
        open={recurringDialogOpen}
        onClose={() => setRecurringDialogOpen(false)}
        onSubmit={handleSubmitRecurring}
        profissionais={profissionais}
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