import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Plus, Receipt, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComandas } from '@/hooks/salon/useComandas';
import { ComandaDetailsDialog } from '@/components/caixa/ComandaDetailsDialog';
import { ComandaFormDialog } from '@/components/caixa/ComandaFormDialog';
import { SalonCaixaTabs } from '@/components/caixa/SalonCaixaTabs';
import { SalonCaixaTable } from '@/components/caixa/SalonCaixaTable';
import { DailySalesDashboard } from '@/components/caixa/DailySalesDashboard';
import { useState } from 'react';
import { Comanda } from '@/types/salon';

export default function Caixa() {
  const { comandas, loading, loadComandas } = useComandas();
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showNewComanda, setShowNewComanda] = useState(false);
  const [activeTab, setActiveTab] = useState('open-tickets');

  const comandasAbertas = comandas.filter(c => c.status === 'aberta');
  const comandasFechadas = comandas.filter(c => c.status === 'fechada');
  const dailySalesValue = comandasFechadas.reduce((sum, c) => sum + c.total_liquido, 0);

  const handleNovaComanda = () => {
    setShowNewComanda(true);
  };

  const handleViewComanda = (comanda: Comanda) => {
    setSelectedComanda(comanda);
    setShowDetails(true);
  };

  const handleComandaCreated = () => {
    loadComandas();
  };

  const handleCloseTicket = (comanda: Comanda) => {
    setSelectedComanda(comanda);
    setShowDetails(true);
  };

  return (
    <PageLayout
      title="Caixa"
      subtitle="Sistema de comandas SalonSoft"
      onFabClick={activeTab === 'open-tickets' ? handleNovaComanda : undefined}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header com botão New Sale */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Caixa</h1>
          <Button 
            onClick={handleNovaComanda}
            className="bg-[hsl(14,100%,57%)] hover:bg-[hsl(14,100%,52%)] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova venda
          </Button>
        </div>

        {/* Abas SalonSoft */}
        <SalonCaixaTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          openTicketsCount={comandasAbertas.length}
          closedTicketsCount={comandasFechadas.length}
          dailySalesValue={dailySalesValue}
        />

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === 'open-tickets' && (
          <SalonCaixaTable
            comandas={comandasAbertas}
            type="open"
            onViewComanda={handleViewComanda}
            onCloseTicket={handleCloseTicket}
            loading={loading}
          />
        )}

        {activeTab === 'closed-tickets' && (
          <SalonCaixaTable
            comandas={comandasFechadas}
            type="closed"
            onViewComanda={handleViewComanda}
            loading={loading}
          />
        )}

        {activeTab === 'daily-sales' && (
          <DailySalesDashboard comandas={comandas} />
        )}
      </div>

      <ComandaDetailsDialog
        comanda={selectedComanda}
        isOpen={showDetails}
        onOpenChange={setShowDetails}
      />

      <ComandaFormDialog
        isOpen={showNewComanda}
        onOpenChange={setShowNewComanda}
        onComandaCreated={handleComandaCreated}
      />
    </PageLayout>
  );
}