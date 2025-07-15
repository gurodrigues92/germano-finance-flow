import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

interface TaxaCardProps {
  taxaName: string;
  percentage: number;
  baseValue: number;
  taxaValue: number;
  type: 'debito' | 'credito';
}

export const TaxaCard = ({
  taxaName,
  percentage,
  baseValue,
  taxaValue,
  type
}: TaxaCardProps) => {
  const isVisible = baseValue > 0 && taxaValue > 0;

  if (!isVisible) return null;

  const typeColors = {
    debito: {
      bg: 'bg-violet-50 dark:bg-violet-950/20',
      border: 'border-l-violet-400',
      badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
      text: 'text-violet-700 dark:text-violet-300'
    },
    credito: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-l-amber-400',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
      text: 'text-amber-700 dark:text-amber-300'
    }
  };

  const colors = typeColors[type];

  console.log('[Financeiro] TaxaCard rendered:', { taxaName, percentage, baseValue, taxaValue });

  return (
    <Card className={`${colors.bg} ${colors.border} border-l-4 shadow-sm`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calculator className={`h-4 w-4 ${colors.text}`} />
            <h4 className="font-medium text-sm text-foreground">
              Taxa {taxaName}
            </h4>
          </div>
          <Badge variant="secondary" className={colors.badge}>
            {percentage.toFixed(2)}%
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor Base:</span>
            <span className="font-medium">
              {baseValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxa Aplicada:</span>
            <span className={`font-medium ${colors.text}`}>
              -{taxaValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </span>
          </div>
          
          <div className="border-t pt-1 mt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor Líquido:</span>
              <span className="font-semibold text-finance-net">
                {(baseValue - taxaValue).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};