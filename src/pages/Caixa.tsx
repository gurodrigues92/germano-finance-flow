import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Plus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComandas } from '@/hooks/salon/useComandas';

export default function Caixa() {
  const { comandas, loading, createComanda } = useComandas();

  const comandasAbertas = comandas.filter(c => c.status === 'aberta');

  const handleNovaComanda = async () => {
    try {
      await createComanda({});
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
    }
  };

  return (
    <PageLayout
      title="Caixa"
      subtitle="Sistema de comandas e pagamentos"
      onFabClick={handleNovaComanda}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Comandas Abertas</h2>
          </div>
          <Button onClick={handleNovaComanda}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Comanda
          </Button>
        </div>

        {/* Comandas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-8">Carregando comandas...</div>
          ) : comandasAbertas.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma comanda aberta</p>
                <Button onClick={handleNovaComanda} className="mt-4">
                  Criar primeira comanda
                </Button>
              </CardContent>
            </Card>
          ) : (
            comandasAbertas.map((comanda) => (
              <Card key={comanda.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>Comanda #{comanda.numero_comanda}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {new Date(comanda.data_abertura).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Cliente:</strong> {comanda.cliente?.nome || 'Não informado'}</p>
                    <p><strong>Profissional:</strong> {comanda.profissional_principal?.nome || 'Não informado'}</p>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span><strong>Total:</strong></span>
                      <span className="text-lg font-semibold text-primary">
                        R$ {comanda.total_liquido.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}