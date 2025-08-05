import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from './DatePicker';
import { useProfissionais } from '@/hooks/salon/useProfissionais';

interface TransactionFormFieldsProps {
  formData: {
    date: string;
    dinheiro: string;
    pix: string;
    debito: string;
    credito: string;
    profissionalId: string;
    temAssistente: boolean;
    assistenteTaxa: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const TransactionFormFields = ({ formData, setFormData }: TransactionFormFieldsProps) => {
  const { profissionais } = useProfissionais();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <DatePicker
          value={formData.date}
          onChange={(date) => setFormData((prev: any) => ({ ...prev, date }))}
          placeholder="Selecione a data da transação"
        />
      </div>

      <div className="space-y-2">
        <Label>Profissional (Opcional)</Label>
        <Select
          value={formData.profissionalId}
          onValueChange={(value) => setFormData((prev: any) => ({ ...prev, profissionalId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um profissional" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum profissional</SelectItem>
            {profissionais.map((prof) => (
              <SelectItem key={prof.id} value={prof.id}>
                {prof.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="temAssistente"
            checked={formData.temAssistente}
            onCheckedChange={(checked) => 
              setFormData((prev: any) => ({ 
                ...prev, 
                temAssistente: checked,
                assistenteTaxa: checked ? prev.assistenteTaxa : '0'
              }))
            }
          />
          <Label htmlFor="temAssistente" className="text-sm font-medium">
            Teve assistente nesta transação
          </Label>
        </div>
        
        {formData.temAssistente && (
          <div className="space-y-2">
            <Label htmlFor="assistenteTaxa">Taxa do Assistente (R$)</Label>
            <Input
              id="assistenteTaxa"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.assistenteTaxa}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, assistenteTaxa: e.target.value }))}
              className="text-base sm:text-lg p-2 sm:p-3"
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="dinheiro">Dinheiro (R$)</Label>
          <Input
            id="dinheiro"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.dinheiro}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, dinheiro: e.target.value }))}
            className="text-base sm:text-lg p-2 sm:p-3"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pix">PIX (R$)</Label>
          <Input
            id="pix"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.pix}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, pix: e.target.value }))}
            className="text-base sm:text-lg p-2 sm:p-3"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="debito">Débito (R$)</Label>
          <Input
            id="debito"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.debito}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, debito: e.target.value }))}
            className="text-base sm:text-lg p-2 sm:p-3"
          />
          <p className="text-xs text-muted-foreground">Taxa: 1,61%</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="credito">Crédito (R$)</Label>
          <Input
            id="credito"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.credito}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, credito: e.target.value }))}
            className="text-base sm:text-lg p-2 sm:p-3"
          />
          <p className="text-xs text-muted-foreground">Taxa: 3,51%</p>
        </div>
      </div>
    </>
  );
};