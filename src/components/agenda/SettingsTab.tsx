import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Bell, Palette, Save } from 'lucide-react';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useToast } from '@/hooks/use-toast';

interface AgendaSettings {
  horarioAbertura: string;
  horarioFechamento: string;
  intervaloAtendimento: number;
  lunchTimeAutomatico: boolean;
  lunchTimeInicio: string;
  lunchTimeFim: string;
  notificacoes: {
    lembreteCliente: boolean;
    confirmacaoAgendamento: boolean;
    alertaAtraso: boolean;
  };
  cores: {
    [key: string]: string;
  };
}

const DEFAULT_SETTINGS: AgendaSettings = {
  horarioAbertura: '08:00',
  horarioFechamento: '18:00',
  intervaloAtendimento: 30,
  lunchTimeAutomatico: true,
  lunchTimeInicio: '12:00',
  lunchTimeFim: '12:30',
  notificacoes: {
    lembreteCliente: true,
    confirmacaoAgendamento: true,
    alertaAtraso: false
  },
  cores: {}
};

const CORES_DISPONIVEIS = [
  { nome: 'Roxo', valor: '#8B5CF6' },
  { nome: 'Azul', valor: '#3B82F6' },
  { nome: 'Verde', valor: '#10B981' },
  { nome: 'Rosa', valor: '#EC4899' },
  { nome: 'Laranja', valor: '#F59E0B' },
  { nome: 'Vermelho', valor: '#EF4444' },
  { nome: 'Índigo', valor: '#6366F1' },
  { nome: 'Esmeralda', valor: '#059669' },
];

export const SettingsTab = () => {
  const { profissionais, updateProfissional } = useProfissionais();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AgendaSettings>(() => {
    // Carregar configurações do localStorage ou usar padrão
    const saved = localStorage.getItem('agenda-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const handleSaveSettings = () => {
    localStorage.setItem('agenda-settings', JSON.stringify(settings));
    toast({
      title: "Configurações salvas",
      description: "As configurações da agenda foram atualizadas com sucesso"
    });
  };

  const handleUpdateProfissionalCor = async (profissionalId: string, cor: string) => {
    try {
      await updateProfissional(profissionalId, { cor_agenda: cor });
      toast({
        title: "Cor atualizada",
        description: "A cor do profissional foi atualizada na agenda"
      });
    } catch (error) {
      console.error('Erro ao atualizar cor:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horários de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="abertura">Horário de Abertura</Label>
              <Input
                id="abertura"
                type="time"
                value={settings.horarioAbertura}
                onChange={(e) => setSettings(prev => ({ ...prev, horarioAbertura: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="fechamento">Horário de Fechamento</Label>
              <Input
                id="fechamento"
                type="time"
                value={settings.horarioFechamento}
                onChange={(e) => setSettings(prev => ({ ...prev, horarioFechamento: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="intervalo">Intervalo entre Atendimentos (minutos)</Label>
            <Select 
              value={settings.intervaloAtendimento.toString()} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, intervaloAtendimento: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lunch Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horário de Almoço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="lunch-auto">Aplicar automaticamente para todos os profissionais</Label>
              <p className="text-sm text-muted-foreground">
                Bloqueia automaticamente o horário de almoço na agenda
              </p>
            </div>
            <Switch
              id="lunch-auto"
              checked={settings.lunchTimeAutomatico}
              onCheckedChange={(checked) => setSettings(prev => ({ 
                ...prev, 
                lunchTimeAutomatico: checked 
              }))}
            />
          </div>
          
          {settings.lunchTimeAutomatico && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lunch-inicio">Início do Almoço</Label>
                <Input
                  id="lunch-inicio"
                  type="time"
                  value={settings.lunchTimeInicio}
                  onChange={(e) => setSettings(prev => ({ ...prev, lunchTimeInicio: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lunch-fim">Fim do Almoço</Label>
                <Input
                  id="lunch-fim"
                  type="time"
                  value={settings.lunchTimeFim}
                  onChange={(e) => setSettings(prev => ({ ...prev, lunchTimeFim: e.target.value }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configurações de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Lembrete para Cliente</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar lembrete 1 hora antes do agendamento
                </p>
              </div>
              <Switch
                checked={settings.notificacoes.lembreteCliente}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  notificacoes: { ...prev.notificacoes, lembreteCliente: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Confirmação de Agendamento</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar confirmação imediata após agendamento
                </p>
              </div>
              <Switch
                checked={settings.notificacoes.confirmacaoAgendamento}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  notificacoes: { ...prev.notificacoes, confirmacaoAgendamento: checked }
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Alerta de Atraso</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar quando cliente estiver 15 min atrasado
                </p>
              </div>
              <Switch
                checked={settings.notificacoes.alertaAtraso}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  notificacoes: { ...prev.notificacoes, alertaAtraso: checked }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cores dos Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Cores dos Profissionais na Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profissionais.map(profissional => (
              <div key={profissional.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: profissional.cor_agenda || '#8B5CF6' }}
                  />
                  <span className="font-medium">{profissional.nome}</span>
                </div>
                <div className="flex gap-1">
                  {CORES_DISPONIVEIS.map(cor => (
                    <button
                      key={cor.valor}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: cor.valor }}
                      onClick={() => handleUpdateProfissionalCor(profissional.id, cor.valor)}
                      title={cor.nome}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleSaveSettings} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};