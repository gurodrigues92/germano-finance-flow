import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profissional } from '@/types/salon';
import { Phone, Mail, Clock, Percent, Palette, Edit, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/formatUtils';

interface ProfissionalDetailsDialogProps {
  profissional: Profissional | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (profissional: Profissional) => void;
}

const DIAS_SEMANA_MAP = {
  'segunda': 'Segunda',
  'terca': 'Terça',
  'quarta': 'Quarta',
  'quinta': 'Quinta',
  'sexta': 'Sexta',
  'sabado': 'Sábado',
  'domingo': 'Domingo'
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'cabeleireiro':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'assistente':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'recepcionista':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'cabeleireiro':
      return 'Cabeleireiro(a)';
    case 'assistente':
      return 'Assistente';
    case 'recepcionista':
      return 'Recepcionista';
    default:
      return tipo;
  }
};

export const ProfissionalDetailsDialog: React.FC<ProfissionalDetailsDialogProps> = ({
  profissional,
  open,
  onOpenChange,
  onEdit
}) => {
  if (!profissional) return null;

  const horarioTrabalho = profissional.horario_trabalho || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">{profissional.nome}</DialogTitle>
              <Badge className={`mt-2 ${getTipoColor(profissional.tipo)}`}>
                {getTipoLabel(profissional.tipo)}
              </Badge>
            </div>
            <Button onClick={() => onEdit(profissional)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profissional.telefone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{profissional.telefone}</span>
                </div>
              )}
              
              {profissional.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{profissional.email}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4 text-muted-foreground" />
                <span>Comissão: {profissional.percentual_comissao}%</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <span>Cor da agenda:</span>
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-muted"
                    style={{ backgroundColor: profissional.cor_agenda || '#8B5CF6' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horários de Trabalho */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Horários de Trabalho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {Object.entries(DIAS_SEMANA_MAP).map(([key, label]) => {
                  const horario = horarioTrabalho[key];
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{label}</span>
                      {horario?.ativo ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {horario.inicio || '08:00'} às {horario.fim || '18:00'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Não trabalha</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas (Placeholder para futuras implementações) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Agendamentos Este Mês</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">-</div>
                  <div className="text-sm text-muted-foreground">Receita Este Mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};