import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProfissionalFormData, HorarioTrabalho } from '@/types/salon';
import { CORES_PROFISSIONAL } from '@/types/salon';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface ProfissionalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProfissionalFormData) => Promise<void>;
  initialData?: ProfissionalFormData;
  isEditing?: boolean;
}

const DIAS_SEMANA = [
  { key: 'segunda', label: 'Segunda-feira' },
  { key: 'terca', label: 'Terça-feira' },
  { key: 'quarta', label: 'Quarta-feira' },
  { key: 'quinta', label: 'Quinta-feira' },
  { key: 'sexta', label: 'Sexta-feira' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' }
];

const TIPOS_PROFISSIONAL = [
  { value: 'cabeleireiro', label: 'Cabeleireiro(a)' },
  { value: 'assistente', label: 'Assistente' },
  { value: 'recepcionista', label: 'Recepcionista' }
];

export const ProfissionalForm: React.FC<ProfissionalFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfissionalFormData>({
    nome: '',
    telefone: '',
    email: '',
    tipo: 'cabeleireiro',
    percentual_comissao: 40,
    cor_agenda: '#8B5CF6',
    horario_trabalho: {}
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        tipo: 'cabeleireiro',
        percentual_comissao: 40,
        cor_agenda: '#8B5CF6',
        horario_trabalho: {}
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          tipo: 'cabeleireiro',
          percentual_comissao: 40,
          cor_agenda: '#8B5CF6',
          horario_trabalho: {}
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHorarioChange = (dia: string, campo: 'inicio' | 'fim' | 'ativo', valor: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      horario_trabalho: {
        ...prev.horario_trabalho,
        [dia]: {
          ...prev.horario_trabalho[dia],
          [campo]: valor
        }
      }
    }));
  };

  const handleChange = (field: keyof ProfissionalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Profissional' : 'Novo Profissional'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PROFISSIONAL.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone || ''}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comissao">Comissão (%)</Label>
                <Input
                  id="comissao"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentual_comissao}
                  onChange={(e) => handleChange('percentual_comissao', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cor">Cor da Agenda</Label>
                <div className="flex gap-2">
                  {CORES_PROFISSIONAL.map(cor => (
                    <button
                      key={cor}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.cor_agenda === cor ? 'border-primary' : 'border-muted'
                      }`}
                      style={{ backgroundColor: cor }}
                      onClick={() => handleChange('cor_agenda', cor)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Horários de Trabalho */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Trabalho
            </h3>
            
            <div className="space-y-3">
              {DIAS_SEMANA.map(dia => (
                <div key={dia.key} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-24">
                    <Switch
                      checked={formData.horario_trabalho[dia.key]?.ativo || false}
                      onCheckedChange={(checked) => handleHorarioChange(dia.key, 'ativo', checked)}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Label className="text-sm font-medium">{dia.label}</Label>
                  </div>
                  
                  {formData.horario_trabalho[dia.key]?.ativo && (
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={formData.horario_trabalho[dia.key]?.inicio || '08:00'}
                        onChange={(e) => handleHorarioChange(dia.key, 'inicio', e.target.value)}
                        className="w-24"
                      />
                      <span className="self-center">às</span>
                      <Input
                        type="time"
                        value={formData.horario_trabalho[dia.key]?.fim || '18:00'}
                        onChange={(e) => handleHorarioChange(dia.key, 'fim', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};