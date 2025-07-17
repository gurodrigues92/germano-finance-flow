import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetaFinanceira, MetaFinanceiraInput, TIPOS_META } from '@/types/metas';
import { format } from 'date-fns';
import { DatePicker } from '@/components/finance/DatePicker';

interface MetaFormProps {
  meta?: MetaFinanceira;
  onSubmit: (data: MetaFinanceiraInput) => Promise<{ success: boolean }>;
  onCancel: () => void;
}

export const MetaForm = ({ meta, onSubmit, onCancel }: MetaFormProps) => {
  const [formData, setFormData] = useState<MetaFinanceiraInput>({
    tipo: meta?.tipo || 'receita',
    titulo: meta?.titulo || '',
    descricao: meta?.descricao || '',
    valor_meta: meta?.valor_meta || 0,
    valor_atual: meta?.valor_atual || 0,
    data_inicio: meta ? format(new Date(meta.data_inicio), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    data_fim: meta ? format(new Date(meta.data_fim), 'yyyy-MM-dd') : '',
    categoria: meta?.categoria || '',
    status: meta?.status || 'ativa'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await onSubmit(formData);
    
    if (result.success) {
      onCancel();
    }
    
    setLoading(false);
  };

  const handleChange = (field: keyof MetaFinanceiraInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {meta ? 'Editar Meta' : 'Nova Meta Financeira'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo da Meta</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPOS_META).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria (Opcional)</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                placeholder="Ex: Equipamentos, Curso, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título da Meta</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              placeholder="Ex: Comprar novo secador profissional"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (Opcional)</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descreva sua meta em detalhes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_meta">Valor da Meta (R$)</Label>
              <Input
                id="valor_meta"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_meta}
                onChange={(e) => handleChange('valor_meta', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_atual">Valor Atual (R$)</Label>
              <Input
                id="valor_atual"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_atual}
                onChange={(e) => handleChange('valor_atual', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <DatePicker
                value={formData.data_inicio}
                onChange={(date) => handleChange('data_inicio', date)}
                placeholder="Selecione a data de início"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Conclusão</Label>
              <DatePicker
                value={formData.data_fim}
                onChange={(date) => handleChange('data_fim', date)}
                placeholder="Selecione a data de conclusão"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : (meta ? 'Atualizar' : 'Criar Meta')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};