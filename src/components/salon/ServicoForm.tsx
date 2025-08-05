import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ServicoFormData } from '@/types/salon';
import { CATEGORIAS_SERVICO, CORES_CATEGORIA } from '@/types/salon';
import { Palette, Clock, DollarSign } from 'lucide-react';

interface ServicoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ServicoFormData) => Promise<void>;
  initialData?: ServicoFormData;
  isEditing?: boolean;
}

export const ServicoForm: React.FC<ServicoFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServicoFormData>({
    nome: '',
    categoria: '',
    preco: 0,
    duracao_minutos: 60,
    descricao: '',
    cor_categoria: '#8B5CF6'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nome: '',
        categoria: '',
        preco: 0,
        duracao_minutos: 60,
        descricao: '',
        cor_categoria: '#8B5CF6'
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
          categoria: '',
          preco: 0,
          duracao_minutos: 60,
          descricao: '',
          cor_categoria: '#8B5CF6'
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ServicoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDuracaoOptions = () => {
    const opcoes = [];
    for (let i = 15; i <= 240; i += 15) {
      const horas = Math.floor(i / 60);
      const minutos = i % 60;
      let label = '';
      
      if (horas > 0) {
        label += `${horas}h`;
        if (minutos > 0) label += ` ${minutos}min`;
      } else {
        label = `${minutos}min`;
      }
      
      opcoes.push({ value: i, label });
    }
    return opcoes;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Serviço *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: Corte Masculino"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_SERVICO.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Preço *
                </Label>
                <Input
                  id="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => handleChange('preco', Number(e.target.value))}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duração *
                </Label>
                <Select 
                  value={formData.duracao_minutos.toString()} 
                  onValueChange={(value) => handleChange('duracao_minutos', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatDuracaoOptions().map(opcao => (
                      <SelectItem key={opcao.value} value={opcao.value.toString()}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Cor da Categoria
              </Label>
              <div className="flex gap-2 flex-wrap">
                {CORES_CATEGORIA.map(cor => (
                  <button
                    key={cor}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.cor_categoria === cor 
                        ? 'border-primary scale-110' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: cor }}
                    onClick={() => handleChange('cor_categoria', cor)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao || ''}
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Descrição detalhada do serviço..."
                rows={3}
              />
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