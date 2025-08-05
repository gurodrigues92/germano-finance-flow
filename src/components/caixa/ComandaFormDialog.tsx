import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComandas } from '@/hooks/salon/useComandas';
import { useClientes } from '@/hooks/salon/useClientes';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { Plus } from 'lucide-react';

interface ComandaFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComandaCreated?: () => void;
}

export const ComandaFormDialog = ({
  isOpen,
  onOpenChange,
  onComandaCreated
}: ComandaFormDialogProps) => {
  const { createComanda } = useComandas();
  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    profissional_principal_id: '',
    observacoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await createComanda({
        cliente_id: formData.cliente_id || undefined,
        profissional_principal_id: formData.profissional_principal_id || undefined,
        observacoes: formData.observacoes || undefined
      });
      
      onComandaCreated?.();
      onOpenChange(false);
      setFormData({
        cliente_id: '',
        profissional_principal_id: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open && !loading) {
      setFormData({
        cliente_id: '',
        profissional_principal_id: '',
        observacoes: ''
      });
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Comanda
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente (opcional)</Label>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum cliente</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Profissional Principal */}
          <div className="space-y-2">
            <Label>Profissional Principal (opcional)</Label>
            <Select 
              value={formData.profissional_principal_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, profissional_principal_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum profissional</SelectItem>
                {profissionais.map((profissional) => (
                  <SelectItem key={profissional.id} value={profissional.id}>
                    {profissional.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              placeholder="Observações sobre a comanda..."
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Criando...' : 'Criar Comanda'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};