import { useState, useEffect } from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Clock, User, Scissors, FileText, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Agendamento, Cliente, Profissional, Servico } from '@/types/salon';
import { useClientes } from '@/hooks/salon/useClientes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslations } from '@/lib/translations';

interface MobileAgendamentoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (agendamentoData: {
    cliente_id: string;
    profissional_id: string;
    servico_id: string;
    data: string;
    hora_inicio: string;
    observacoes?: string;
  }) => void;
  profissionais: Profissional[];
  servicos: Servico[];
  initialData?: {
    profissional_id?: string;
    data?: string;
    hora_inicio?: string;
  };
  editingAgendamento?: Agendamento;
}

export const MobileAgendamentoDialog = ({
  open,
  onClose,
  onSubmit,
  profissionais,
  servicos,
  initialData,
  editingAgendamento
}: MobileAgendamentoDialogProps) => {
  const { clientes } = useClientes();
  const isMobile = useIsMobile();
  const t = useTranslations();

  const [formData, setFormData] = useState({
    cliente_id: '',
    profissional_id: initialData?.profissional_id || '',
    servico_id: '',
    data: initialData?.data || '',
    hora_inicio: initialData?.hora_inicio || '',
    observacoes: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.data ? new Date(initialData.data) : undefined
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'cliente', label: 'Cliente', icon: User },
    { id: 'profissional', label: 'Profissional', icon: User },
    { id: 'servico', label: 'Serviço', icon: Scissors },
    { id: 'datetime', label: 'Data e Hora', icon: Calendar },
    { id: 'details', label: 'Detalhes', icon: FileText }
  ];

  // Fill form if editing
  useEffect(() => {
    if (editingAgendamento) {
      setFormData({
        cliente_id: editingAgendamento.cliente_id,
        profissional_id: editingAgendamento.profissional_id,
        servico_id: editingAgendamento.servico_id,
        data: editingAgendamento.data,
        hora_inicio: editingAgendamento.hora_inicio,
        observacoes: editingAgendamento.observacoes || ''
      });
      setSelectedDate(new Date(editingAgendamento.data));
      setCurrentStep(0);
    }
  }, [editingAgendamento]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Cliente
        if (!formData.cliente_id) {
          newErrors.cliente_id = 'Selecione um cliente';
        }
        break;
      case 1: // Profissional
        if (!formData.profissional_id) {
          newErrors.profissional_id = 'Selecione um profissional';
        }
        break;
      case 2: // Serviço
        if (!formData.servico_id) {
          newErrors.servico_id = 'Selecione um serviço';
        }
        break;
      case 3: // Data e Hora
        if (!formData.data) {
          newErrors.data = 'Selecione uma data';
        }
        if (!formData.hora_inicio) {
          newErrors.hora_inicio = 'Selecione um horário';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        data: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      profissional_id: initialData?.profissional_id || '',
      servico_id: '',
      data: initialData?.data || '',
      hora_inicio: initialData?.hora_inicio || '',
      observacoes: ''
    });
    setSelectedDate(initialData?.data ? new Date(initialData.data) : undefined);
    setCurrentStep(0);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedCliente = clientes.find(c => c.id === formData.cliente_id);
  const selectedProfissional = profissionais.find(p => p.id === formData.profissional_id);
  const selectedServico = servicos.find(s => s.id === formData.servico_id);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Cliente
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cliente">Selecione o cliente</Label>
              <Select 
                value={formData.cliente_id} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, cliente_id: value }));
                  setErrors(prev => ({ ...prev, cliente_id: '' }));
                }}
              >
                <SelectTrigger className={cn(errors.cliente_id && "border-destructive")}>
                  <SelectValue placeholder="Escolha um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      <div>
                        <div className="font-medium">{cliente.nome}</div>
                        {cliente.telefone && (
                          <div className="text-sm text-muted-foreground">{cliente.telefone}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cliente_id && (
                <p className="text-sm text-destructive mt-1">{errors.cliente_id}</p>
              )}
            </div>
            
            {selectedCliente && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Cliente selecionado:</h4>
                <div className="space-y-1 text-sm">
                  <div>{selectedCliente.nome}</div>
                  {selectedCliente.telefone && (
                    <div className="text-muted-foreground">{selectedCliente.telefone}</div>
                  )}
                  {selectedCliente.email && (
                    <div className="text-muted-foreground">{selectedCliente.email}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Profissional
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="profissional">Selecione o profissional</Label>
              <Select 
                value={formData.profissional_id} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, profissional_id: value }));
                  setErrors(prev => ({ ...prev, profissional_id: '' }));
                }}
              >
                <SelectTrigger className={cn(errors.profissional_id && "border-destructive")}>
                  <SelectValue placeholder="Escolha um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {profissionais.map(prof => (
                    <SelectItem key={prof.id} value={prof.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: prof.cor_agenda }}
                        />
                        <div>
                          <div className="font-medium">{prof.nome}</div>
                          {prof.especialidades && prof.especialidades.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {prof.especialidades.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.profissional_id && (
                <p className="text-sm text-destructive mt-1">{errors.profissional_id}</p>
              )}
            </div>

            {selectedProfissional && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Profissional selecionado:</h4>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedProfissional.cor_agenda }}
                  />
                  <span className="font-medium">{selectedProfissional.nome}</span>
                  {selectedProfissional.tipo === 'assistente' && (
                    <Badge variant="secondary" className="text-xs">Assistente</Badge>
                  )}
                </div>
                {selectedProfissional.especialidades && selectedProfissional.especialidades.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedProfissional.especialidades.map((esp, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {esp}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 2: // Serviço
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="servico">Selecione o serviço</Label>
              <Select 
                value={formData.servico_id} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, servico_id: value }));
                  setErrors(prev => ({ ...prev, servico_id: '' }));
                }}
              >
                <SelectTrigger className={cn(errors.servico_id && "border-destructive")}>
                  <SelectValue placeholder="Escolha um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicos.map(servico => (
                    <SelectItem key={servico.id} value={servico.id}>
                      <div>
                        <div className="font-medium">{servico.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {servico.preco.toFixed(2)} • {Math.floor(servico.duracao_minutos / 60)}h{servico.duracao_minutos % 60 > 0 ? ` ${servico.duracao_minutos % 60}min` : ''}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.servico_id && (
                <p className="text-sm text-destructive mt-1">{errors.servico_id}</p>
              )}
            </div>

            {selectedServico && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Serviço selecionado:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedServico.nome}</span>
                    <Badge variant="secondary">
                      R$ {selectedServico.preco.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Duração: {Math.floor(selectedServico.duracao_minutos / 60)}h{selectedServico.duracao_minutos % 60 > 0 ? ` ${selectedServico.duracao_minutos % 60}min` : ''}
                  </div>
                  {selectedServico.descricao && (
                    <p className="text-sm text-muted-foreground italic">
                      {selectedServico.descricao}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3: // Data e Hora
        return (
          <div className="space-y-4">
            <div>
              <Label>Data do agendamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <ResponsiveButton
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      errors.data && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </ResponsiveButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.data && (
                <p className="text-sm text-destructive mt-1">{errors.data}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hora_inicio">Horário de início</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, hora_inicio: e.target.value }));
                  setErrors(prev => ({ ...prev, hora_inicio: '' }));
                }}
                className={cn(errors.hora_inicio && "border-destructive")}
              />
              {errors.hora_inicio && (
                <p className="text-sm text-destructive mt-1">{errors.hora_inicio}</p>
              )}
            </div>

            {selectedServico && formData.hora_inicio && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Resumo do horário:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Início: {formData.hora_inicio}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Fim estimado: {(() => {
                      const [hours, minutes] = formData.hora_inicio.split(':').map(Number);
                      const totalMinutes = hours * 60 + minutes + selectedServico.duracao_minutos;
                      const endHours = Math.floor(totalMinutes / 60);
                      const endMinutes = totalMinutes % 60;
                      return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4: // Detalhes
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações sobre o agendamento..."
                rows={4}
              />
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3">Resumo do agendamento:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{selectedCliente?.nome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Profissional:</span>
                  <span className="font-medium">{selectedProfissional?.nome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Serviço:</span>
                  <span className="font-medium">{selectedServico?.nome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-medium">
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Horário:</span>
                  <span className="font-medium">{formData.hora_inicio}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Valor:</span>
                  <span>R$ {selectedServico?.preco.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title={editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-green-500 text-white",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-px mx-1",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <ResponsiveButton
            variant="outline"
            onClick={currentStep === 0 ? handleClose : handleBack}
          >
            {currentStep === 0 ? (
              <>
                <X className="w-4 h-4 mr-2" />
                {t.actions.cancel}
              </>
            ) : (
              'Voltar'
            )}
          </ResponsiveButton>
          
          <ResponsiveButton onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {editingAgendamento ? t.actions.update : t.actions.schedule}
              </>
            ) : (
              'Próximo'
            )}
          </ResponsiveButton>
        </div>
      </div>
    </ResponsiveDialog>
  );
};