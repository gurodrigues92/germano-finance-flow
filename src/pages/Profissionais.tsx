import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, Plus, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfissionais } from '@/hooks/salon/useProfissionais';

export default function Profissionais() {
  const { profissionais, loading } = useProfissionais();

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'cabeleireiro': return 'bg-purple-100 text-purple-800';
      case 'assistente': return 'bg-blue-100 text-blue-800';
      case 'recepcionista': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'cabeleireiro': return 'Cabeleireiro(a)';
      case 'assistente': return 'Assistente';
      case 'recepcionista': return 'Recepcionista';
      default: return tipo;
    }
  };

  return (
    <PageLayout
      title="Profissionais"
      subtitle="Gestão da equipe do salão"
      onFabClick={() => {}}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Equipe do Salão</h2>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Profissional
          </Button>
        </div>

        {/* Profissionais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-8">Carregando profissionais...</div>
          ) : profissionais.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum profissional cadastrado</p>
                <Button className="mt-4">
                  Cadastrar primeiro profissional
                </Button>
              </CardContent>
            </Card>
          ) : (
            profissionais.map((profissional) => (
              <Card key={profissional.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: profissional.cor_agenda }}
                      />
                      <span className="truncate">{profissional.nome}</span>
                    </div>
                    <Badge className={getTipoColor(profissional.tipo)}>
                      {getTipoLabel(profissional.tipo)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profissional.telefone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{profissional.telefone}</span>
                      </div>
                    )}
                    {profissional.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm truncate">{profissional.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Comissão:</span>
                      <span className="text-sm font-semibold">
                        {profissional.percentual_comissao}%
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