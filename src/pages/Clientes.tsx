import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClientes } from '@/hooks/salon/useClientes';
import { ClienteForm } from '@/components/salon/ClienteForm';

export default function Clientes() {
  const { clientes, loading, addCliente } = useClientes();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddCliente = () => {
    setIsFormOpen(true);
  };

  const handleSubmitCliente = async (data: any) => {
    await addCliente(data);
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
          ) : (
            clientes.map((cliente) => (
              <Card key={cliente.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{cliente.nome}</span>
                    {cliente.saldo !== 0 && (
                      <span className={`text-sm px-2 py-1 rounded ${
                        cliente.saldo > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        R$ {cliente.saldo.toFixed(2)}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                    <div className="pt-2 text-xs text-muted-foreground">
                      Cliente desde {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
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
          onOpenChange={setIsFormOpen}
          onSubmit={handleSubmitCliente}
        />
      </div>
    </PageLayout>
  );
}