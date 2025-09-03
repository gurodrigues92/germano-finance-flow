import { useState } from 'react';
import { useDataInitializer } from '@/hooks/useDataInitializer';
import { usePermissions } from '@/contexts/UserProfileContext';
import { useSampleSalonData } from '@/hooks/salon/useSampleSalonData';
import { useSalonDashboard } from '@/hooks/useSalonDashboard';
import { useAgendamentosHoje } from '@/hooks/useAgendamentosHoje';
import { useComandas } from '@/hooks/salon/useComandas';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useClientes } from '@/hooks/salon/useClientes';
import { useServicos } from '@/hooks/salon/useServicos';
import { PageLayout } from '@/components/layout/PageLayout';
import { SalonDashboard } from '@/components/dashboard/SalonDashboard';
import { SalonQuickActions } from '@/components/dashboard/SalonQuickActions';
import { ProfessionalPerformance } from '@/components/dashboard/ProfessionalPerformance';
import { ServicePopularity } from '@/components/dashboard/ServicePopularity';
import { SalonMetrics } from '@/components/dashboard/SalonMetrics';
import { FinanceDashboardAccess } from '@/components/dashboard/FinanceDashboardAccess';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  
  // Inicializar dados reais
  useDataInitializer();
  useSampleSalonData(); // Initialize sample salon data
  
  // Get salon dashboard data
  const { comandas } = useComandas();
  const { profissionais } = useProfissionais();
  const { clientes } = useClientes();
  const { servicos } = useServicos();
  const { salonMetrics, profissionalPerformance, servicoPopularidade } = useSalonDashboard({ comandas, profissionais, clientes, servicos });
  const { agendamentosHoje, proximosAgendamentos } = useAgendamentosHoje();

  const handleNewAgendamento = () => {
    navigate('/agenda');
  };

  const handleNewComanda = () => {
    navigate('/caixa');
  };

  const handleNewCliente = () => {
    navigate('/clientes');
  };

  return (
    <PageLayout 
      title="Studio Germano" 
      subtitle="Dashboard Operacional"
      showGreeting={true}
    >
      {/* Métricas principais do salão */}
      <SalonMetrics metrics={salonMetrics} />
      
      {/* Quick Actions */}
      <SalonQuickActions 
        onNewAgendamento={handleNewAgendamento}
        onNewComanda={handleNewComanda}
        onNewCliente={handleNewCliente}
      />
      
      {/* Dashboard operacional simplificado */}
      <SalonDashboard 
        metrics={salonMetrics} 
        agendamentosHoje={agendamentosHoje}
        proximosAgendamentos={proximosAgendamentos}
      />
      
      {/* Performance dos profissionais */}
      <ProfessionalPerformance performance={profissionalPerformance} />

      {/* Acesso ao Dashboard Financeiro (apenas para admins) */}
      {hasPermission('view_financial_metrics') && (
        <FinanceDashboardAccess />
      )}
    </PageLayout>
  );
};