import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ActionButton } from '@/components/ui/action-button';
import { Calendar, Plus, CalendarCheck, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Holiday {
  id: string;
  nome: string;
  data: string;
  tipo: 'nacional' | 'personalizado';
  funcionamento: 'fechado' | 'meio-expediente' | 'normal';
  observacoes?: string;
}

const FERIADOS_NACIONAIS_2024: Holiday[] = [
  { id: '1', nome: 'Ano Novo', data: '2024-01-01', tipo: 'nacional', funcionamento: 'fechado' },
  { id: '2', nome: 'Carnaval', data: '2024-02-12', tipo: 'nacional', funcionamento: 'fechado' },
  { id: '3', nome: 'Carnaval', data: '2024-02-13', tipo: 'nacional', funcionamento: 'fechado' },
  { id: '4', nome: 'Sexta-feira Santa', data: '2024-03-29', tipo: 'nacional', funcionamento: 'fechado' },
  { id: '5', nome: 'Tiradentes', data: '2024-04-21', tipo: 'nacional', funcionamento: 'meio-expediente' },
  { id: '6', nome: 'Dia do Trabalhador', data: '2024-05-01', tipo: 'nacional', funcionamento: 'fechado' },
  { id: '7', nome: 'Independência do Brasil', data: '2024-09-07', tipo: 'nacional', funcionamento: 'meio-expediente' },
  { id: '8', nome: 'Nossa Senhora Aparecida', data: '2024-10-12', tipo: 'nacional', funcionamento: 'meio-expediente' },
  { id: '9', nome: 'Finados', data: '2024-11-02', tipo: 'nacional', funcionamento: 'meio-expediente' },
  { id: '10', nome: 'Proclamação da República', data: '2024-11-15', tipo: 'nacional', funcionamento: 'meio-expediente' },
  { id: '11', nome: 'Natal', data: '2024-12-25', tipo: 'nacional', funcionamento: 'fechado' },
];

export const HolidayTab = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(FERIADOS_NACIONAIS_2024);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    nome: '',
    data: '',
    funcionamento: 'fechado' as Holiday['funcionamento'],
    observacoes: ''
  });

  const getFuncionamentoLabel = (funcionamento: Holiday['funcionamento']) => {
    switch (funcionamento) {
      case 'fechado': return 'Fechado';
      case 'meio-expediente': return 'Meio Expediente';
      case 'normal': return 'Funcionamento Normal';
    }
  };

  const getFuncionamentoColor = (funcionamento: Holiday['funcionamento']) => {
    switch (funcionamento) {
      case 'fechado': return 'bg-status-critical text-white';
      case 'meio-expediente': return 'bg-status-warning text-foreground';
      case 'normal': return 'bg-status-success text-white';
    }
  };

  const handleAddHoliday = () => {
    if (!newHoliday.nome || !newHoliday.data) return;

    const holiday: Holiday = {
      id: Date.now().toString(),
      nome: newHoliday.nome,
      data: newHoliday.data,
      tipo: 'personalizado',
      funcionamento: newHoliday.funcionamento,
      observacoes: newHoliday.observacoes
    };

    setHolidays(prev => [...prev, holiday].sort((a, b) => a.data.localeCompare(b.data)));
    setNewHoliday({ nome: '', data: '', funcionamento: 'fechado', observacoes: '' });
    setShowAddForm(false);
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const handleUpdateFuncionamento = (id: string, funcionamento: Holiday['funcionamento']) => {
    setHolidays(prev => prev.map(h => h.id === id ? { ...h, funcionamento } : h));
  };

  // Separar por ano e mês
  const holidaysByMonth = holidays.reduce((acc, holiday) => {
    const date = new Date(holiday.data + 'T00:00:00');
    const monthKey = format(date, 'yyyy-MM');
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(holiday);
    return acc;
  }, {} as Record<string, Holiday[]>);

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Gestão de Feriados
            </CardTitle>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Feriado
            </Button>
          </div>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Feriado</Label>
                <Input
                  id="nome"
                  value={newHoliday.nome}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Aniversário da cidade"
                />
              </div>
              
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={newHoliday.data}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="funcionamento">Funcionamento</Label>
                <Select value={newHoliday.funcionamento} onValueChange={(value: Holiday['funcionamento']) => 
                  setNewHoliday(prev => ({ ...prev, funcionamento: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fechado">Fechado</SelectItem>
                    <SelectItem value="meio-expediente">Meio Expediente</SelectItem>
                    <SelectItem value="normal">Funcionamento Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newHoliday.observacoes}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddHoliday}>Adicionar</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lista de feriados por mês */}
      <div className="space-y-4">
        {Object.entries(holidaysByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([monthKey, monthHolidays]) => (
            <Card key={monthKey}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(new Date(monthKey + '-01'), "MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthHolidays.map(holiday => (
                    <div key={holiday.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{holiday.nome}</span>
                          <Badge variant={holiday.tipo === 'nacional' ? 'default' : 'secondary'}>
                            {holiday.tipo === 'nacional' ? 'Nacional' : 'Personalizado'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(holiday.data + 'T00:00:00'), "dd 'de' MMMM", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <Select 
                              value={holiday.funcionamento} 
                              onValueChange={(value: Holiday['funcionamento']) => 
                                handleUpdateFuncionamento(holiday.id, value)
                              }
                            >
                              <SelectTrigger className="w-40 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fechado">Fechado</SelectItem>
                                <SelectItem value="meio-expediente">Meio Expediente</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {holiday.observacoes && (
                          <p className="text-sm text-muted-foreground mt-1">{holiday.observacoes}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={cn(getFuncionamentoColor(holiday.funcionamento))}>
                          {getFuncionamentoLabel(holiday.funcionamento)}
                        </Badge>
                        {holiday.tipo === 'personalizado' && (
                          <ActionButton
                            icon={Trash2}
                            variant="delete"
                            onClick={() => handleDeleteHoliday(holiday.id)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};