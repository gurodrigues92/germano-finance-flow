import { useState, useCallback } from 'react';
import { Transaction } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, Trash2, ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionMobileCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onLongPress?: (transactionId: string) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export const TransactionMobileCard = ({ 
  transaction, 
  onEdit, 
  onDelete, 
  onLongPress,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection
}: TransactionMobileCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleDelete = () => {
    onDelete(transaction.id);
  };

  const handleTouchStart = useCallback(() => {
    if (!isSelectionMode && onLongPress) {
      const timer = setTimeout(() => {
        onLongPress(transaction.id);
      }, 500); // 500ms long press
      setLongPressTimer(timer);
    }
  }, [isSelectionMode, onLongPress, transaction.id]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleCardClick = () => {
    if (isSelectionMode && onToggleSelection) {
      onToggleSelection(transaction.id);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getPaymentMethods = () => {
    const methods = [];
    if (transaction.dinheiro > 0) methods.push({ label: 'Dinheiro', value: transaction.dinheiro });
    if (transaction.pix > 0) methods.push({ label: 'PIX', value: transaction.pix });
    if (transaction.debito > 0) methods.push({ label: 'Débito', value: transaction.debito });
    if (transaction.credito > 0) methods.push({ label: 'Crédito', value: transaction.credito });
    return methods;
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer mb-2",
        isSelected && "ring-2 ring-primary bg-primary/5",
        isSelectionMode && "hover:bg-muted/50"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-2">
          {/* Selection checkbox */}
          {isSelectionMode && (
            <div className="mr-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (onToggleSelection) {
                    onToggleSelection(transaction.id);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                </span>
              </div>
              <div className="text-lg font-bold text-primary">
                {formatCurrency(transaction.totalBruto)}
              </div>
            </div>
          </div>
          
          {/* Action Buttons - Hidden in selection mode */}
          {!isSelectionMode && (
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(transaction);
                }}
                className="h-10 w-10 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Compact Payment Methods */}
        <div className="flex flex-wrap gap-1 mb-2">
          {getPaymentMethods().map((method) => (
            <Badge key={method.label} variant="secondary" className="text-xs px-1.5 py-0.5">
              {method.label}: {formatCurrency(method.value)}
            </Badge>
          ))}
        </div>

        {/* Compact Summary */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center p-2 bg-muted/30 rounded">
            <div className="text-xs text-muted-foreground">Líquido</div>
            <div className="font-semibold text-finance-net text-sm">
              {formatCurrency(transaction.totalLiquido)}
            </div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded">
            <div className="text-xs text-muted-foreground">Taxas</div>
            <div className="font-semibold text-finance-fees text-sm">
              {formatCurrency(transaction.taxaDebito + transaction.taxaCredito)}
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-1 h-auto mt-2 text-xs font-normal"
            >
              <span>Detalhes</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  expanded && "transform rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 mt-3 pt-3 border-t">
            {/* Detailed Payment Methods */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Métodos de Pagamento</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Dinheiro:</span>
                    <span className="font-medium">
                      {transaction.dinheiro > 0 ? formatCurrency(transaction.dinheiro) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PIX:</span>
                    <span className="font-medium">
                      {transaction.pix > 0 ? formatCurrency(transaction.pix) : '-'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Débito:</span>
                    <span className="font-medium">
                      {transaction.debito > 0 ? formatCurrency(transaction.debito) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédito:</span>
                    <span className="font-medium">
                      {transaction.credito > 0 ? formatCurrency(transaction.credito) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Distribuição</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Studio (60%):</span>
                  <span className="font-semibold text-finance-studio">
                    {formatCurrency(transaction.studioShare)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Profissional (40%):</span>
                  <span className="font-semibold text-finance-profissional">
                    {formatCurrency(transaction.eduShare)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span>Assistente (4%):</span>
                  <span className="font-semibold text-finance-assistente">
                    {formatCurrency(transaction.kamShare)}
                  </span>
                </div>
              </div>
            </div>

            {/* Taxes Breakdown */}
            {(transaction.taxaDebito > 0 || transaction.taxaCredito > 0) && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Taxas Detalhadas</h4>
                <div className="space-y-1 text-xs">
                  {transaction.taxaDebito > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa Débito:</span>
                      <span className="font-medium text-finance-fees">
                        {formatCurrency(transaction.taxaDebito)}
                      </span>
                    </div>
                  )}
                  {transaction.taxaCredito > 0 && (
                    <div className="flex justify-between">
                      <span>Taxa Crédito:</span>
                      <span className="font-medium text-finance-fees">
                        {formatCurrency(transaction.taxaCredito)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};