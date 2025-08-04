import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';

export default function Agenda() {
  const { agendamentos, loading } = useAgendamentos();

  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje);

  return (
    <PageLayout
      title="Agenda"
      subtitle="Gestão de agendamentos do salão"
      onFabClick={() => {}}
      fabIcon={<Plus className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Agendamentos de Hoje</h2>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {/* Agendamentos */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">Carregando agendamentos...</div>
          ) : agendamentosHoje.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento para hoje</p>
              </CardContent>
            </Card>
          ) : (
            agendamentosHoje.map((agendamento) => (
              <Card key={agendamento.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {agendamento.cliente?.nome || 'Cliente não informado'}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {agendamento.hora_inicio}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Serviço:</strong> {agendamento.servico?.nome}</p>
                    <p><strong>Profissional:</strong> {agendamento.profissional?.nome}</p>
                    <p><strong>Valor:</strong> R$ {agendamento.valor.toFixed(2)}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        agendamento.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                        agendamento.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                        agendamento.status === 'em_atendimento' ? 'bg-orange-100 text-orange-800' :
                        agendamento.status === 'concluido' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agendamento.status}
                      </span>
                    </p>
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