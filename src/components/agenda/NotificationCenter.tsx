import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  Send,
  CheckCircle,
  AlertTriangle,
  Settings,
  Volume2
} from 'lucide-react';
import { useAgendamentos } from '@/hooks/salon/useAgendamentos';
import { useClientes } from '@/hooks/salon/useClientes';
import { format, addHours, isBefore, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: 'appointment_created' | 'appointment_tomorrow' | 'appointment_2hours' | 'appointment_30min';
  message: string;
  method: 'email' | 'sms' | 'whatsapp' | 'push';
}

const defaultRules: NotificationRule[] = [
  {
    id: '1',
    name: 'Confirmação de Agendamento',
    enabled: true,
    trigger: 'appointment_created',
    message: 'Olá {cliente}! Seu agendamento para {servico} está confirmado para {data} às {hora}.',
    method: 'whatsapp'
  },
  {
    id: '2',
    name: 'Lembrete 1 dia antes',
    enabled: true,
    trigger: 'appointment_tomorrow',
    message: 'Lembrete: Você tem um agendamento amanhã ({data}) às {hora} para {servico}.',
    method: 'whatsapp'
  },
  {
    id: '3',
    name: 'Lembrete 2 horas antes',
    enabled: false,
    trigger: 'appointment_2hours',
    message: 'Seu agendamento é em 2 horas! {data} às {hora} para {servico}.',
    method: 'sms'
  },
  {
    id: '4',
    name: 'Lembrete 30 minutos antes',
    enabled: true,
    trigger: 'appointment_30min',
    message: 'Seu agendamento é em 30 minutos! Estamos te esperando.',
    method: 'push'
  }
];

export const NotificationCenter = () => {
  const { agendamentos } = useAgendamentos();
  const { clientes } = useClientes();
  const { toast } = useToast();

  const [rules, setRules] = useState<NotificationRule[]>(defaultRules);
  const [pendingNotifications, setPendingNotifications] = useState<any[]>([]);
  const [sentNotifications, setSentNotifications] = useState<any[]>([]);
  const [autoSend, setAutoSend] = useState(false);

  // Gerar notificações pendentes
  useEffect(() => {
    const now = new Date();
    const notifications: any[] = [];

    agendamentos.forEach(agendamento => {
      const appointmentDateTime = new Date(`${agendamento.data}T${agendamento.hora_inicio}`);
      const cliente = clientes.find(c => c.id === agendamento.cliente_id);
      
      if (!cliente || appointmentDateTime <= now) return;

      rules.forEach(rule => {
        if (!rule.enabled) return;

        let shouldNotify = false;
        let scheduledFor = appointmentDateTime;

        switch (rule.trigger) {
          case 'appointment_created':
            // Seria disparado na criação do agendamento
            break;
          case 'appointment_tomorrow':
            if (isTomorrow(appointmentDateTime)) {
              shouldNotify = true;
              scheduledFor = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes
            }
            break;
          case 'appointment_2hours':
            const twoHoursBefore = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);
            if (isBefore(now, twoHoursBefore) && twoHoursBefore > now) {
              shouldNotify = true;
              scheduledFor = twoHoursBefore;
            }
            break;
          case 'appointment_30min':
            const thirtyMinBefore = new Date(appointmentDateTime.getTime() - 30 * 60 * 1000);
            if (isBefore(now, thirtyMinBefore) && thirtyMinBefore > now) {
              shouldNotify = true;
              scheduledFor = thirtyMinBefore;
            }
            break;
        }

        if (shouldNotify) {
          const message = rule.message
            .replace('{cliente}', cliente.nome)
            .replace('{servico}', agendamento.servico?.nome || 'Serviço')
            .replace('{data}', format(appointmentDateTime, "dd/MM/yyyy", { locale: ptBR }))
            .replace('{hora}', agendamento.hora_inicio);

          notifications.push({
            id: `${agendamento.id}-${rule.id}`,
            agendamentoId: agendamento.id,
            ruleId: rule.id,
            ruleName: rule.name,
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            clienteTelefone: cliente.telefone,
            message,
            method: rule.method,
            scheduledFor,
            status: 'pending'
          });
        }
      });
    });

    setPendingNotifications(notifications);
  }, [agendamentos, clientes, rules]);

  const sendNotification = async (notification: any) => {
    try {
      // Aqui você implementaria o envio real da notificação
      // Ex: API do WhatsApp, SMS, etc.
      
      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sentNotification = {
        ...notification,
        status: 'sent',
        sentAt: new Date().toISOString()
      };

      setSentNotifications(prev => [sentNotification, ...prev]);
      setPendingNotifications(prev => prev.filter(n => n.id !== notification.id));

      toast({
        title: "Notificação enviada",
        description: `${notification.method.toUpperCase()} enviado para ${notification.clienteNome}`
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a notificação",
        variant: "destructive"
      });
    }
  };

  const sendAllPending = async () => {
    for (const notification of pendingNotifications) {
      await sendNotification(notification);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre envios
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'sms': return <Phone className="w-4 h-4 text-blue-600" />;
      case 'email': return <Send className="w-4 h-4 text-gray-600" />;
      case 'push': return <Bell className="w-4 h-4 text-purple-600" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'whatsapp': return 'WhatsApp';
      case 'sms': return 'SMS';
      case 'email': return 'E-mail';
      case 'push': return 'Push';
      default: return method;
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Central de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Envio automático</span>
                <Button
                  variant={autoSend ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoSend(!autoSend)}
                >
                  {autoSend ? "Ativo" : "Inativo"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {pendingNotifications.length} pendentes
              </Badge>
              <Badge variant="outline">
                {sentNotifications.length} enviadas
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificações Pendentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pendentes</CardTitle>
              {pendingNotifications.length > 0 && (
                <Button size="sm" onClick={sendAllPending}>
                  Enviar Todas
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {pendingNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma notificação pendente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingNotifications.slice(0, 10).map(notification => (
                  <div key={notification.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(notification.method)}
                        <span className="font-medium text-sm">{notification.clienteNome}</span>
                        <Badge variant="outline" className="text-xs">
                          {notification.ruleName}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendNotification(notification)}
                      >
                        Enviar
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        Agendado para: {format(new Date(notification.scheduledFor), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notificações Enviadas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enviadas Recentemente</CardTitle>
          </CardHeader>
          <CardContent>
            {sentNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma notificação enviada ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentNotifications.slice(0, 10).map(notification => (
                  <div key={notification.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(notification.method)}
                        <span className="font-medium text-sm">{notification.clienteNome}</span>
                        <Badge variant="outline" className="text-xs">
                          {notification.ruleName}
                        </Badge>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        Enviado em: {format(new Date(notification.sentAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuração de Regras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Regras de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={rule.enabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleRule(rule.id)}
                      >
                        {rule.enabled ? "Ativo" : "Inativo"}
                      </Button>
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getMethodIcon(rule.method)}
                        {getMethodLabel(rule.method)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {rule.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Para usar notificações por WhatsApp e SMS, configure as integrações nas configurações do sistema.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};