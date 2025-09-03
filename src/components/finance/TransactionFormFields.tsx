import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from './DatePicker';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { Calendar, User, CreditCard, Banknote } from 'lucide-react';

interface TransactionFormFieldsProps {
  formData: {
    date: string;
    dinheiro: string;
    pix: string;
    debito: string;
    credito: string;
    profissionalId: string;
    temAssistente: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const TransactionFormFields = ({ formData, setFormData }: TransactionFormFieldsProps) => {
  const { profissionais } = useProfissionais();

  return (
    <div className="space-y-6">
      {/* Data e Profissional */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="date" className="text-base font-medium">Data da Transação</Label>
            <DatePicker
              value={formData.date}
              onChange={(date) => setFormData((prev: any) => ({ ...prev, date }))}
              placeholder="Selecione a data da transação"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Profissional (Opcional)</Label>
            <Select
              value={formData.profissionalId}
              onValueChange={(value) => setFormData((prev: any) => ({ ...prev, profissionalId: value }))}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum profissional</SelectItem>
                {profissionais.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="temAssistente"
                checked={formData.temAssistente}
                onCheckedChange={(checked) => 
                  setFormData((prev: any) => ({ 
                    ...prev, 
                    temAssistente: checked
                  }))
                }
              />
              <Label htmlFor="temAssistente" className="text-base font-medium">
                Teve assistente nesta transação
              </Label>
            </div>
            
            {formData.temAssistente && (
              <p className="text-sm text-muted-foreground pl-6">
                ℹ️ Taxa automática: 10% do valor do profissional
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Formas de Pagamento */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5" />
            Formas de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dinheiro e PIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="dinheiro" className="flex items-center gap-2 text-base font-medium">
                  <Banknote className="h-4 w-4" />
                  Dinheiro (R$)
                </Label>
                <Input
                  id="dinheiro"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.dinheiro}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, dinheiro: e.target.value }))}
                  className="h-12 text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="pix" className="flex items-center gap-2 text-base font-medium">
                  <CreditCard className="h-4 w-4" />
                  PIX (R$)
                </Label>
                <Input
                  id="pix"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.pix}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, pix: e.target.value }))}
                  className="h-12 text-lg"
                />
              </div>
            </div>
            
            {/* Cartões */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="debito" className="flex items-center gap-2 text-base font-medium">
                  <CreditCard className="h-4 w-4" />
                  Cartão Débito (R$)
                </Label>
                <Input
                  id="debito"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.debito}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, debito: e.target.value }))}
                  className="h-12 text-lg"
                />
                <p className="text-sm text-muted-foreground">Taxa: 1,61%</p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="credito" className="flex items-center gap-2 text-base font-medium">
                  <CreditCard className="h-4 w-4" />
                  Cartão Crédito (R$)
                </Label>
                <Input
                  id="credito"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.credito}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, credito: e.target.value }))}
                  className="h-12 text-lg"
                />
                <p className="text-sm text-muted-foreground">Taxa: 3,51%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};