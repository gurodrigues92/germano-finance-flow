import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClientes } from '@/hooks/salon/useClientes';
import { useClienteStats } from '@/hooks/salon/useClienteStats';
import { ClienteForm } from '@/components/salon/ClienteForm';
import { ClienteDetailsDialog } from '@/components/salon/ClienteDetailsDialog';
import { SalonClientFilters } from '@/components/salon/SalonClientFilters';
import { SalonClientTable } from '@/components/salon/SalonClientTable';
import { ClienteQuickFilters } from '@/components/salon/ClienteQuickFilters';
import { ClienteAdvancedFilters } from '@/components/salon/ClienteAdvancedFilters';
import { ClienteAnalytics } from '@/components/salon/ClienteAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cliente, ClienteFilters as ClienteFiltersType } from '@/types/salon';
import { useTranslations } from '@/lib/translations';

export default function Clientes() {
  const t = useTranslations();
  const { clientes, loading, addCliente, updateCliente } = useClientes();
  const { stats, loading: statsLoading } = useClienteStats();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditingCliente, setIsEditingCliente] = useState<Cliente | null>(null);
  const [filters, setFilters] = useState<ClienteFiltersType>({});

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          cliente.nome.toLowerCase().includes(searchLower) ||
          (cliente.telefone?.toLowerCase().includes(searchLower)) ||
          (cliente.email?.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Filtro de status
      if (filters.status) {
        switch (filters.status) {
          case 'agendados':
            // TODO: Implementar quando tiver integração com agenda
            break;
          case 'com_credito':
            if (cliente.saldo <= 0) return false;
            break;
          case 'em_debito':
            if (cliente.saldo >= 0) return false;
            break;
          case 'com_pacote':
            // TODO: Implementar quando tiver sistema de pacotes
            break;
        }
      }

      // Filtro ativo/inativo
      if (filters.ativo !== undefined) {
        if (cliente.ativo !== filters.ativo) return false;
      }

      return true;
    });
  }, [clientes, filters]);

  const handleAddCliente = () => {
    setIsFormOpen(true);
  };

  const handleSubmitCliente = async (data: any) => {
    await addCliente(data);
    setIsFormOpen(false);
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsDetailsOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setIsEditingCliente(cliente);
    setIsFormOpen(true);
  };

  const handleSubmitEditCliente = async (data: any) => {
    if (isEditingCliente) {
      await updateCliente(isEditingCliente.id, data);
      setIsEditingCliente(null);
      setIsFormOpen(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditingCliente(null);
  };

  const handleQuickFilterSelect = (quickFilter: Partial<ClienteFiltersType>) => {
    // Se o filtro já está ativo, desativa
    const isCurrentlyActive = JSON.stringify(filters) === JSON.stringify(quickFilter);
    if (isCurrentlyActive) {
      setFilters({});
    } else {
      setFilters(quickFilter);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <PageLayout
      title={t.navigation.clients}
      subtitle="Gestão completa de clientes"
      onFabClick={handleAddCliente}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t.actions.loading}</p>
          </div>
        ) : (
          <Tabs defaultValue="clientes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clientes">Gerenciar Clientes</TabsTrigger>
              <TabsTrigger value="analytics">Análises e Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clientes" className="space-y-6">
              {/* SalonSoft Filters */}
              {!statsLoading && (
                <ClienteQuickFilters
                  onFilterSelect={handleQuickFilterSelect}
                  currentFilters={filters}
                  stats={stats}
                />
              )}

              <ClienteAdvancedFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />

              <SalonClientFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalClientes={clientes.length}
                filteredCount={filteredClientes.length}
                onAddClient={handleAddCliente}
              />

              {/* SalonSoft Table */}
              <SalonClientTable
                clientes={filteredClientes}
                onViewCliente={handleViewCliente}
                onEditCliente={handleEditCliente}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <ClienteAnalytics stats={stats} loading={statsLoading} />
            </TabsContent>
          </Tabs>
        )}

        {/* Cliente Form */}
        <ClienteForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          onSubmit={isEditingCliente ? handleSubmitEditCliente : handleSubmitCliente}
          initialData={isEditingCliente ? {
            nome: isEditingCliente.nome,
            telefone: isEditingCliente.telefone || '',
            email: isEditingCliente.email || '',
            data_nascimento: isEditingCliente.data_nascimento || '',
            endereco: isEditingCliente.endereco || '',
            observacoes: isEditingCliente.observacoes || '',
            saldo: isEditingCliente.saldo
          } : undefined}
          isEditing={!!isEditingCliente}
        />

        {/* Cliente Details Dialog */}
        <ClienteDetailsDialog
          cliente={selectedCliente}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </PageLayout>
  );
}