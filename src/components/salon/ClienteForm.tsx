import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClienteFormData } from '@/types/salon';

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  initialData?: ClienteFormData;
  isEditing?: boolean;
}

export const ClienteForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isEditing = false 
}: ClienteFormProps) => {
  const [formData, setFormData] = useState<ClienteFormData>({
    nome: initialData?.nome || '',
    telefone: initialData?.telefone || '',
    email: initialData?.email || '',
    data_nascimento: initialData?.data_nascimento || '',
    endereco: initialData?.endereco || '',
    observacoes: initialData?.observacoes || '',
    saldo: initialData?.saldo || 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form if not editing
      if (!isEditing) {
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          data_nascimento: '',
          endereco: '',
          observacoes: '',
          saldo: 0
        });
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ClienteFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
              placeholder="Nome completo do cliente"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="cliente@email.com"
            />
          </div>

          <div>
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={(e) => handleChange('data_nascimento', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Endereço completo"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Observações sobre o cliente"
              rows={3}
            />
          </div>

          {isEditing && (
            <div>
              <Label htmlFor="saldo">Saldo (R$)</Label>
              <Input
                id="saldo"
                type="number"
                step="0.01"
                value={formData.saldo}
                onChange={(e) => handleChange('saldo', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};