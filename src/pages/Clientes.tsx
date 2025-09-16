import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Users, Plus, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useClientes } from '@/hooks/salon/useClientes';
import { useClienteStats } from '@/hooks/salon/useClienteStats';
import { useExcelImport } from '@/hooks/salon/useExcelImport';
import { ClienteForm } from '@/components/salon/ClienteForm';
import { ClienteDetailsDialog } from '@/components/salon/ClienteDetailsDialog';
import { SalonClientTable } from '@/components/salon/SalonClientTable';
import { ClienteAnalytics } from '@/components/salon/ClienteAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cliente, ClienteFilters as ClienteFiltersType } from '@/types/salon';
import { useTranslations } from '@/lib/translations';

export default function Clientes() {
  const t = useTranslations();
  const { clientes, loading, addCliente, updateCliente, loadClientes } = useClientes();
  const { stats, loading: statsLoading } = useClienteStats();
  const { importing, importClientesFromExcel } = useExcelImport();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditingCliente, setIsEditingCliente] = useState<Cliente | null>(null);
  const [filters, setFilters] = useState<ClienteFiltersType>({});
  const [activeFilter, setActiveFilter] = useState<string>('all');

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
    setActiveFilter('all');
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    
    switch (filterId) {
      case 'all':
        setFilters({});
        break;
      case 'agendados':
        setFilters({ status: 'agendados' });
        break;
      case 'credito':
        setFilters({ status: 'com_credito' });
        break;
      case 'debito':
        setFilters({ status: 'em_debito' });
        break;
      case 'pacote':
        setFilters({ status: 'com_pacote' });
        break;
    }
  };

  const handleImportExcel = async () => {
    await importClientesFromExcel();
    loadClientes(); // Recarregar clientes após importação
  };

  const clientesComCredito = clientes.filter(c => c.saldo > 0).length;
  const clientesEmDebito = clientes.filter(c => c.saldo < 0).length;

  const filterButtons = [
    { id: 'all', label: 'Todos os clientes', count: clientes.length },
    { id: 'agendados', label: 'Agendados', count: 0 },
    { id: 'credito', label: 'Clientes com crédito', count: clientesComCredito },
    { id: 'debito', label: 'Clientes em débito', count: clientesEmDebito },
    { id: 'pacote', label: 'Clientes com pacote', count: 0 }
  ];

  return (
    <PageLayout
      title="Clientes"
      subtitle="Gestão de clientes - SalonSoft"
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
              {/* SalonSoft Style Filters */}
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterClick(filter.id)}
                    className="text-sm"
                  >
                    {filter.label} ({filter.count})
                  </Button>
                ))}
              </div>

              {/* Search Bar and Actions */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Buscar clientes..."
                          value={filters.search || ''}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline"
                        onClick={handleImportExcel}
                        disabled={importing}
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {importing ? 'Importando...' : 'Importar Excel'}
                      </Button>
                      
                      <Button 
                        onClick={handleAddCliente}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar cliente
                      </Button>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                    Mostrando {filteredClientes.length} de {clientes.length} clientes
                  </div>
                </CardContent>
              </Card>

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