import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/ui/action-button';
import { CalendarDays, Clock, User, Trash2 } from 'lucide-react';
import { useBloqueiosAgenda } from '@/hooks/salon/useBloqueiosAgenda';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AbsencesTabProps {
  onCreateBloqueio: () => void;
}

export const AbsencesTab = ({ onCreateBloqueio }: AbsencesTabProps) => {
  const { bloqueios, loading, removeBloqueio } = useBloqueiosAgenda();
  const { profissionais } = useProfissionais();
  const [selectedProfissional, setSelectedProfissional] = useState<string>('todos');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Filtrar bloqueios baseado na seleção
  const filteredBloqueios = bloqueios.filter(bloqueio => {
    const matchProfissional = selectedProfissional === 'todos' || bloqueio.profissional_id === selectedProfissional;
    return matchProfissional;
  });

  // Agrupar bloqueios por data
  const bloqueiosPorData = filteredBloqueios.reduce((acc, bloqueio) => {
    const data = bloqueio.data;
    if (!acc[data]) acc[data] = [];
    acc[data].push(bloqueio);
    return acc;
  }, {} as Record<string, typeof bloqueios>);

  const getBloqueioLabel = (tipo: string) => {
    switch (tipo) {
      case 'lack': return 'Falta';
      case 'unavailable': return 'Indisponível';
      case 'lunch-time': return 'Horário de Almoço';
      default: return tipo;
    }
  };

  const getBloqueioColor = (tipo: string) => {
    switch (tipo) {
      case 'lack': return 'bg-status-critical text-white';
      case 'unavailable': return 'bg-status-warning text-foreground';
      case 'lunch-time': return 'bg-lunch-time text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDeleteBloqueio = async (id: string) => {
    try {
      await removeBloqueio(id);
    } catch (error) {
      console.error('Erro ao remover bloqueio:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Filtros e Calendário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Navegação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtro por Profissional */}
          <div>
            <label className="text-sm font-medium mb-2 block">Profissional</label>
            <Select value={selectedProfissional} onValueChange={setSelectedProfissional}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Profissionais</SelectItem>
                {profissionais.map(prof => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mini Calendário */}
          <div>
            <label className="text-sm font-medium mb-2 block">Calendário</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>

          {/* Botão para criar bloqueio */}
          <Button onClick={onCreateBloqueio} className="w-full">
            Nova Ausência
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Bloqueios */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Ausências Cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando ausências...
              </div>
            ) : Object.keys(bloqueiosPorData).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma ausência encontrada para o filtro selecionado
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(bloqueiosPorData)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([data, bloqueiosData]) => (
                    <div key={data} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-lg mb-2">
                        {format(new Date(data + 'T00:00:00'), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </h4>
                      <div className="space-y-2">
                        {bloqueiosData.map(bloqueio => {
                          const profissional = profissionais.find(p => p.id === bloqueio.profissional_id);
                          return (
                            <div key={bloqueio.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={cn(getBloqueioColor(bloqueio.tipo))}>
                                    {getBloqueioLabel(bloqueio.tipo)}
                                  </Badge>
                                  <span className="font-medium">{profissional?.nome}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  {bloqueio.hora_inicio} - {bloqueio.hora_fim}
                                </div>
                                {bloqueio.motivo && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {bloqueio.motivo}
                                  </p>
                                )}
                              </div>
                              <ActionButton
                                icon={Trash2}
                                variant="delete"
                                onClick={() => handleDeleteBloqueio(bloqueio.id)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};