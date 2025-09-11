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

  // Helper function to check if field has value
  const hasValue = (value: string) => value && parseFloat(value) > 0;

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
            {/* Dinheiro e PIX - Enhanced Visual Prominence */}
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1 gap-4" : "grid-cols-2")}>
              {/* Dinheiro Field */}
              <div className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 bg-gradient-to-br",
                hasValue(formData.dinheiro) 
                  ? "from-finance-income/10 to-finance-income/5 border-finance-income/30 shadow-lg shadow-finance-income/10" 
                  : "from-background to-muted/20 border-border hover:border-finance-income/20 hover:shadow-md",
                isMobile && "p-3"
              )}>
                <Label htmlFor="dinheiro" className={cn(
                  "flex items-center gap-2 font-semibold text-finance-income mb-3",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  <Banknote className={cn("h-5 w-5", hasValue(formData.dinheiro) && "text-finance-income")} />
                  Dinheiro
                  {hasValue(formData.dinheiro) && (
                    <span className="ml-auto text-xs bg-finance-income/20 text-finance-income px-2 py-1 rounded-full">
                      ✓ Preenchido
                    </span>
                  )}
                </Label>
                <Input
                  id="dinheiro"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                  value={formData.dinheiro}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, dinheiro: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, pixRef)}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn(
                    "text-xl font-semibold bg-background/50 backdrop-blur-sm border-2 transition-all duration-300",
                    "focus:ring-4 focus:ring-finance-income/20 focus:border-finance-income focus:shadow-lg",
                    "placeholder:text-muted-foreground/60",
                    isMobile ? "h-12 text-lg" : "h-14",
                    hasValue(formData.dinheiro) && "text-finance-income border-finance-income/50"
                  )}
                />
              </div>
              
              {/* PIX Field */}
              <div className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 bg-gradient-to-br",
                hasValue(formData.pix) 
                  ? "from-finance-net/10 to-finance-net/5 border-finance-net/30 shadow-lg shadow-finance-net/10" 
                  : "from-background to-muted/20 border-border hover:border-finance-net/20 hover:shadow-md",
                isMobile && "p-3"
              )}>
                <Label htmlFor="pix" className={cn(
                  "flex items-center gap-2 font-semibold text-finance-net mb-3",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  <CreditCard className={cn("h-5 w-5", hasValue(formData.pix) && "text-finance-net")} />
                  PIX
                  {hasValue(formData.pix) && (
                    <span className="ml-auto text-xs bg-finance-net/20 text-finance-net px-2 py-1 rounded-full">
                      ✓ Preenchido
                    </span>
                  )}
                </Label>
                <Input
                  ref={pixRef}
                  id="pix"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                  value={formData.pix}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, pix: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, debitoRef)}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn(
                    "text-xl font-semibold bg-background/50 backdrop-blur-sm border-2 transition-all duration-300",
                    "focus:ring-4 focus:ring-finance-net/20 focus:border-finance-net focus:shadow-lg",
                    "placeholder:text-muted-foreground/60",
                    isMobile ? "h-12 text-lg" : "h-14",
                    hasValue(formData.pix) && "text-finance-net border-finance-net/50"
                  )}
                />
              </div>
            </div>
            
            {/* Cartões - Enhanced Visual Prominence */}
            <div className={cn("grid gap-4", isMobile ? "grid-cols-1 gap-4" : "grid-cols-2")}>
              {/* Cartão Débito */}
              <div className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 bg-gradient-to-br",
                hasValue(formData.debito) 
                  ? "from-finance-profissional/10 to-finance-profissional/5 border-finance-profissional/30 shadow-lg shadow-finance-profissional/10" 
                  : "from-background to-muted/20 border-border hover:border-finance-profissional/20 hover:shadow-md",
                isMobile && "p-3"
              )}>
                <Label htmlFor="debito" className={cn(
                  "flex items-center gap-2 font-semibold text-finance-profissional mb-3",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  <CreditCard className={cn("h-5 w-5", hasValue(formData.debito) && "text-finance-profissional")} />
                  {isMobile ? 'Débito' : 'Cartão Débito'}
                  {hasValue(formData.debito) && (
                    <span className="ml-auto text-xs bg-finance-profissional/20 text-finance-profissional px-2 py-1 rounded-full">
                      ✓ Preenchido
                    </span>
                  )}
                </Label>
                <Input
                  ref={debitoRef}
                  id="debito"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="next"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                  value={formData.debito}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, debito: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, creditoRef)}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn(
                    "text-xl font-semibold bg-background/50 backdrop-blur-sm border-2 transition-all duration-300",
                    "focus:ring-4 focus:ring-finance-profissional/20 focus:border-finance-profissional focus:shadow-lg",
                    "placeholder:text-muted-foreground/60",
                    isMobile ? "h-12 text-lg" : "h-14",
                    hasValue(formData.debito) && "text-finance-profissional border-finance-profissional/50"
                  )}
                />
                <p className={cn(
                  "text-finance-profissional/70 font-medium mt-2",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  💳 Taxa: 1,61%
                </p>
              </div>
              
              {/* Cartão Crédito */}
              <div className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 bg-gradient-to-br",
                hasValue(formData.credito) 
                  ? "from-finance-assistente/10 to-finance-assistente/5 border-finance-assistente/30 shadow-lg shadow-finance-assistente/10" 
                  : "from-background to-muted/20 border-border hover:border-finance-assistente/20 hover:shadow-md",
                isMobile && "p-3"
              )}>
                <Label htmlFor="credito" className={cn(
                  "flex items-center gap-2 font-semibold text-finance-assistente mb-3",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  <CreditCard className={cn("h-5 w-5", hasValue(formData.credito) && "text-finance-assistente")} />
                  {isMobile ? 'Crédito' : 'Cartão Crédito'}
                  {hasValue(formData.credito) && (
                    <span className="ml-auto text-xs bg-finance-assistente/20 text-finance-assistente px-2 py-1 rounded-full">
                      ✓ Preenchido
                    </span>
                  )}
                </Label>
                <Input
                  ref={creditoRef}
                  id="credito"
                  type="number"
                  inputMode="numeric"
                  enterKeyHint="done"
                  step="0.01"
                  min="0"
                  placeholder="R$ 0,00"
                  value={formData.credito}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, credito: e.target.value }))}
                  onFocus={(e) => isMobile && focusAndScroll(e.target)}
                  className={cn(
                    "text-xl font-semibold bg-background/50 backdrop-blur-sm border-2 transition-all duration-300",
                    "focus:ring-4 focus:ring-finance-assistente/20 focus:border-finance-assistente focus:shadow-lg",
                    "placeholder:text-muted-foreground/60",
                    isMobile ? "h-12 text-lg" : "h-14",
                    hasValue(formData.credito) && "text-finance-assistente border-finance-assistente/50"
                  )}
                />
                <p className={cn(
                  "text-finance-assistente/70 font-medium mt-2",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  💳 Taxa: 3,51%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};