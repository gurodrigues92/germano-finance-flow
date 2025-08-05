import { useState } from 'react';
import { useDataInitializer } from '@/hooks/useDataInitializer';
import { usePermissions } from '@/contexts/UserProfileContext';
import { useSampleSalonData } from '@/hooks/salon/useSampleSalonData';
import { useSalonDashboard } from '@/hooks/useSalonDashboard';
import { useAgendamentosHoje } from '@/hooks/useAgendamentosHoje';
import { useComandas } from '@/hooks/salon/useComandas';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
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
  const { salonMetrics, profissionalPerformance, servicoPopularidade } = useSalonDashboard({ comandas, profissionais });
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
      
      {/* Dashboard operacional do salão */}
      <SalonDashboard 
        metrics={salonMetrics} 
        agendamentosHoje={agendamentosHoje}
        proximosAgendamentos={proximosAgendamentos}
      />
      
      {/* Quick Actions */}
      <SalonQuickActions 
        onNewAgendamento={handleNewAgendamento}
        onNewComanda={handleNewComanda}
        onNewCliente={handleNewCliente}
      />
      
      {/* Performance dos profissionais e popularidade dos serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ProfessionalPerformance performance={profissionalPerformance} />
        <ServicePopularity services={servicoPopularidade} />
      </div>

      {/* Acesso ao Dashboard Financeiro (apenas para admins) */}
      {hasPermission('view_financial_metrics') && (
        <FinanceDashboardAccess />
      )}
    </PageLayout>
  );
};