import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TransactionFormFieldsProps {
  formData: {
    date: string;
    dinheiro: string;
    pix: string;
    debito: string;
    credito: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const TransactionFormFields = ({ formData, setFormData }: TransactionFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, date: e.target.value }))}
          required
          className="text-base sm:text-lg p-2 sm:p-3"
        />
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