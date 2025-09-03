import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, RefreshCw, Save, Info } from 'lucide-react';
import { useConfiguracoes } from '@/contexts/ConfiguracoesContext';

export const FinanceSettingsCard = () => {
  const { config, updateFinance, resetSection } = useConfiguracoes();
  const [formData, setFormData] = useState(config.finance);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateFinance(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSection('finance');
    setFormData(config.finance);
    setHasChanges(false);
  };

  const totalShares = formData.eduShareDefault + formData.kamShareDefault + formData.studioShareDefault;
  const isValidShares = Math.abs(totalShares - 100) < 0.01;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>
                Defina percentuais e taxas padrão para novas transações
              </CardDescription>
            </div>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Não salvo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Percentuais de Divisão */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Percentuais de Divisão Padrão</h3>
            {!isValidShares && (
              <Badge variant="destructive" className="text-xs">
                Total deve ser 100%
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eduShare">{config.nomenclatura.profissional} (%)</Label>
              <Input
                id="eduShare"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.eduShareDefault}
                onChange={(e) => handleChange('eduShareDefault', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kamShare">{config.nomenclatura.assistente} (%)</Label>
              <Input
                id="kamShare"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.kamShareDefault}
                onChange={(e) => handleChange('kamShareDefault', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studioShare">{config.nomenclatura.studio} (%)</Label>
              <Input
                id="studioShare"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.studioShareDefault}
                onChange={(e) => handleChange('studioShareDefault', e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Total: {totalShares.toFixed(1)}% {isValidShares && '✓'}
          </div>
        </div>

        {/* Taxas de Cartão */}
        <div className="space-y-4">
          <h3 className="font-semibold">Taxas de Cartão Padrão</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxaCredito">Taxa Cartão de Crédito (%)</Label>
              <Input
                id="taxaCredito"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={formData.taxaCreditoDefault}
                onChange={(e) => handleChange('taxaCreditoDefault', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxaDebito">Taxa Cartão de Débito (%)</Label>
              <Input
                id="taxaDebito"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={formData.taxaDebitoDefault}
                onChange={(e) => handleChange('taxaDebitoDefault', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Taxa do Assistente */}
        <div className="space-y-4">
          <h3 className="font-semibold">Configurações do Assistente</h3>
          
          <div className="space-y-2">
            <Label htmlFor="assistenteTaxa">Taxa do Assistente (%)</Label>
            <Input
              id="assistenteTaxa"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.assistenteTaxaDefault}
              onChange={(e) => handleChange('assistenteTaxaDefault', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Percentual cobrado quando há assistente no atendimento
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p>Estas configurações serão aplicadas automaticamente em novas transações. 
            Transações existentes não serão afetadas.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || !isValidShares}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};