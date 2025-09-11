import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from './DatePicker';
import { useProfissionais } from '@/hooks/salon/useProfissionais';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, User, CreditCard, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  
  // Refs for auto-focus navigation
  const pixRef = useRef<HTMLInputElement>(null);
  const debitoRef = useRef<HTMLInputElement>(null);
  const creditoRef = useRef<HTMLInputElement>(null);
  
  const handleKeyPress = (e: React.KeyboardEvent, nextRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
      nextRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  const focusAndScroll = (element: HTMLInputElement) => {
    element.focus();
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className={cn("space-y-4", isMobile && "space-y-3")}>
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
              <SelectTrigger className={cn("h-12", isMobile && "h-10")}>
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
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1 gap-3" : "grid-cols-2")}>
              <div className={cn("space-y-2", isMobile && "space-y-1")}>
                <Label htmlFor="dinheiro" className={cn("flex items-center gap-2 font-medium", isMobile ? "text-sm" : "text-base")}>
                  <Banknote className="h-4 w-4" />
                  Dinheiro (R$)
                </Label>
                <Input
                  id="dinheiro"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.dinheiro}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, dinheiro: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, pixRef)}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn("text-lg", isMobile ? "h-10 text-base" : "h-12")}
                />
              </div>
              
              <div className={cn("space-y-2", isMobile && "space-y-1")}>
                <Label htmlFor="pix" className={cn("flex items-center gap-2 font-medium", isMobile ? "text-sm" : "text-base")}>
                  <CreditCard className="h-4 w-4" />
                  PIX (R$)
                </Label>
                <Input
                  ref={pixRef}
                  id="pix"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.pix}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, pix: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, debitoRef)}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn("text-lg", isMobile ? "h-10 text-base" : "h-12")}
                />
              </div>
            </div>
            
            {/* Cartões */}
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1 gap-3" : "grid-cols-2")}>
              <div className={cn("space-y-2", isMobile && "space-y-1")}>
                <Label htmlFor="debito" className={cn("flex items-center gap-2 font-medium", isMobile ? "text-sm" : "text-base")}>
                  <CreditCard className="h-4 w-4" />
                  Cartão Débito (R$)
                </Label>
                <Input
                  ref={debitoRef}
                  id="debito"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.debito}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, debito: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, creditoRef)}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn("text-lg", isMobile ? "h-10 text-base" : "h-12")}
                />
                <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Taxa: 1,61%</p>
              </div>
              
              <div className={cn("space-y-2", isMobile && "space-y-1")}>
                <Label htmlFor="credito" className={cn("flex items-center gap-2 font-medium", isMobile ? "text-sm" : "text-base")}>
                  <CreditCard className="h-4 w-4" />
                  Cartão Crédito (R$)
                </Label>
                <Input
                  ref={creditoRef}
                  id="credito"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="done"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.credito}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, credito: e.target.value }))}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn("text-lg", isMobile ? "h-10 text-base" : "h-12")}
                />
                <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Taxa: 3,51%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};