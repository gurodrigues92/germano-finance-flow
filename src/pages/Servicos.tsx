import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Plus, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useServicos } from '@/hooks/salon/useServicos';

export default function Servicos() {
  const { servicos, loading, getServicosPorCategoria } = useServicos();

  const servicosPorCategoria = getServicosPorCategoria();

  const formatDuracao = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas === 0) return `${mins}min`;
    if (mins === 0) return `${horas}h`;
    return `${horas}h ${mins}min`;
  };

  return (
    <PageLayout
      title="Serviços"
      subtitle="Catálogo de serviços do salão"
      onFabClick={() => {}}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Catálogo de Serviços</h2>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {/* Serviços por Categoria */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-8">Carregando serviços...</div>
          ) : Object.keys(servicosPorCategoria).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                <Button className="mt-4">
                  Cadastrar primeiro serviço
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(servicosPorCategoria).map(([categoria, servicosCategoria]) => (
              <div key={categoria} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: servicosCategoria[0]?.cor_categoria || '#8B5CF6' }}
                  />
                  <h3 className="text-lg font-semibold">{categoria}</h3>
                  <Badge variant="secondary">{servicosCategoria.length}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {servicosCategoria.map((servico) => (
                    <Card key={servico.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{servico.nome}</span>
                          <span className="text-lg font-semibold text-primary">
                            R$ {servico.preco.toFixed(2)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {servico.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {servico.descricao}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{formatDuracao(servico.duracao_minutos)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span>R$ {servico.preco.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}