import React from 'react';
import { NOMENCLATURE } from '@/lib/finance/nomenclature';
import { TransactionCalculationResult } from '@/lib/finance/transactionCalculations';

interface TransactionPreviewProps {
  calculations: TransactionCalculationResult;
}

export const TransactionPreview = ({ calculations }: TransactionPreviewProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-2">
      <h4 className="font-medium text-sm">Preview dos Cálculos:</h4>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
        <div>
          <span className="text-muted-foreground">Total Bruto:</span>
          <span className="ml-2 font-medium text-finance-income">
            {calculations.totalBruto.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Total Líquido:</span>
          <span className="ml-2 font-medium text-finance-net">
            {calculations.totalLiquido.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Studio ({calculations.studioRate.toFixed(0)}%):</span>
          <span className="ml-2 font-medium text-finance-studio">
            {calculations.studioShare.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">{NOMENCLATURE.PROFISSIONAL_LABEL} ({calculations.eduRate.toFixed(0)}%):</span>
          <span className="ml-2 font-medium text-finance-edu">
            {calculations.eduShare.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">
            {NOMENCLATURE.ASSISTENTE_LABEL} ({calculations.kamRate.toFixed(0)}%
            {calculations.assistenteCalculationMode === 'percentage_of_total' 
              ? ' do total' 
              : ` do ${NOMENCLATURE.PROFISSIONAL_LABEL}`}):
          </span>
          <span className="ml-2 font-medium text-finance-kam">
            {calculations.kamShare.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};