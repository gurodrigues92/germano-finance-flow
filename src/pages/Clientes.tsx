import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Phone, Mail, Eye, Edit, DollarSign, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/ui/action-button';
import { useClientes } from '@/hooks/salon/useClientes';
import { ClienteForm } from '@/components/salon/ClienteForm';
import { ClienteDetailsDialog } from '@/components/salon/ClienteDetailsDialog';
import { ClienteFilters } from '@/components/salon/ClienteFilters';
import { Cliente, ClienteFilters as ClienteFiltersType } from '@/types/salon';
import { formatCurrency } from '@/lib/formatUtils';

export default function Clientes() {
  const { clientes, loading, addCliente, updateCliente } = useClientes();
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

  return (
    <PageLayout
      title="Clientes"
      subtitle="Gestão de clientes do salão"
      onFabClick={handleAddCliente}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Lista de Clientes</h2>
          </div>
          <Button onClick={handleAddCliente}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Filtros */}
        <ClienteFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalClientes={clientes.length}
          filteredCount={filteredClientes.length}
        />

        {/* Clientes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-8">Carregando clientes...</div>
          ) : clientes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
                <Button onClick={handleAddCliente} className="mt-4">
                  Cadastrar primeiro cliente
                </Button>
              </CardContent>
            </Card>
          ) : filteredClientes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente encontrado com os filtros aplicados</p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle 
                        className={`w-3 h-3 fill-current ${
                          cliente.saldo > 0 ? 'text-status-normal' : 
                          cliente.saldo < 0 ? 'text-status-critico' : 
                          'text-muted-foreground'
                        }`} 
                      />
                      <span className="truncate">{cliente.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!cliente.ativo && (
                        <Badge variant="destructive" className="text-xs">Inativo</Badge>
                      )}
                      {cliente.saldo !== 0 && (
                        <Badge variant={cliente.saldo > 0 ? 'default' : 'destructive'}>
                          {formatCurrency(cliente.saldo, true)}
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cliente.telefone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{cliente.telefone}</span>
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm truncate">{cliente.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">
                        Cliente desde {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex gap-1">
                        <ActionButton
                          icon={Eye}
                          variant="view"
                          onClick={() => handleViewCliente(cliente)}
                        />
                        <ActionButton
                          icon={Edit}
                          variant="edit"
                          onClick={() => handleEditCliente(cliente)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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