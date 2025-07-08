import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { NOMENCLATURE } from '@/lib/finance/nomenclature';
import { CustomRates } from '@/lib/finance/calculations';

interface CustomRatesSectionProps {
  useCustomRates: boolean;
  customRates?: CustomRates;
  onToggleCustomRates: (checked: boolean) => void;
  onUpdateCustomRates: (rates: CustomRates) => void;
}

export const CustomRatesSection = ({ 
  useCustomRates, 
  customRates, 
  onToggleCustomRates, 
  onUpdateCustomRates 
}: CustomRatesSectionProps) => {
  return (
    <div className="space-y-4 sm:space-y-6 border-t pt-4 sm:pt-6">
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              <Label htmlFor="customRates" className="text-sm sm:text-base font-semibold text-foreground">
                Distribuição Personalizada
              </Label>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Por padrão: Studio 60%, {NOMENCLATURE.PROFISSIONAL_LABEL} 40%, {NOMENCLATURE.ASSISTENTE_LABEL} 10%
            </p>
          </div>
          <div className="flex-shrink-0">
            <Switch
              id="customRates"
              checked={useCustomRates}
              onCheckedChange={onToggleCustomRates}
              className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted"
            />
          </div>
        </div>
      </div>

      {useCustomRates && (
        <div className="space-y-4 bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-primary">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Definir Taxas Personalizadas
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm font-medium">Studio (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                value={customRates?.studioRate || 60}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  onUpdateCustomRates({
                    ...customRates!,
                    studioRate: value
                  });
                }}
                className="text-lg sm:text-xl py-3 sm:py-4 px-3 sm:px-4 text-center font-semibold min-h-[48px] sm:min-h-[52px] touch-manipulation"
              />
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm font-medium">{NOMENCLATURE.PROFISSIONAL_LABEL} (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                value={customRates?.eduRate || 40}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  onUpdateCustomRates({
                    ...customRates!,
                    eduRate: value
                  });
                }}
                className="text-lg sm:text-xl py-3 sm:py-4 px-3 sm:px-4 text-center font-semibold min-h-[48px] sm:min-h-[52px] touch-manipulation"
              />
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm font-medium">{NOMENCLATURE.ASSISTENTE_LABEL} (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                value={customRates?.kamRate || 10}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  onUpdateCustomRates({
                    ...customRates!,
                    kamRate: value
                  });
                }}
                className="text-lg sm:text-xl py-3 sm:py-4 px-3 sm:px-4 text-center font-semibold min-h-[48px] sm:min-h-[52px] touch-manipulation"
              />
            </div>
          </div>
          
          {customRates && (
            <div className="text-xs">
              {(() => {
                const total = (customRates.studioRate || 0) + 
                              (customRates.eduRate || 0) + 
                              (customRates.kamRate || 0);
                if (total === 100) {
                  return <span className="text-green-600">✓ Total: 100% (válido)</span>;
                } else {
                  return <span className="text-destructive">⚠ Total: {total}% (deve somar 100%)</span>;
                }
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};