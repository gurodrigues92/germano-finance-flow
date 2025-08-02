import { useState, useCallback } from 'react';
import { Transaction } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, Trash2, ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCompactCurrency } from '@/lib/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
    return formatCompactCurrency(value, isMobile);
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
        "transition-all duration-200 hover:shadow-md cursor-pointer mb-2 active:scale-[0.98]",
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
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isSelectionMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (onToggleSelection) {
                    onToggleSelection(transaction.id);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4"
              />
            )}
            <div>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.date).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short' 
                })}
              </p>
              <p className="text-base font-semibold" title={formatCompactCurrency(transaction.totalBruto, false)}>
                {formatCurrency(transaction.totalBruto)}
              </p>
            </div>
          </div>
          
          {!isSelectionMode && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(transaction);
                }}
                className="h-7 w-7 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Payment Methods - Compact */}
        <div className="flex flex-wrap gap-1 mb-2">
          {getPaymentMethods()
            .filter(method => method.value > 0)
            .slice(0, 3)
            .map((method) => (
              <Badge key={method.label} variant="outline" className="text-xs px-1 py-0">
                {method.label.slice(0, 3)}: {formatCurrency(method.value)}
              </Badge>
            ))}
          {getPaymentMethods().filter(method => method.value > 0).length > 3 && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              +{getPaymentMethods().filter(method => method.value > 0).length - 3}
            </Badge>
          )}
        </div>

        {/* Key Metrics */}
        <div className="flex justify-between text-xs">
          <div>
            <span className="text-muted-foreground">Líq: </span>
            <span className="font-medium" title={formatCompactCurrency(transaction.totalLiquido, false)}>
              {formatCurrency(transaction.totalLiquido)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Taxa: </span>
            <span className="font-medium">
              {(((transaction.taxaDebito + transaction.taxaCredito) / transaction.totalBruto) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-center p-0 h-6 mt-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronDown 
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  expanded && "transform rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-2 pt-2">
            {/* Payment Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {getPaymentMethods().map((method) => (
                <div key={method.label} className="flex justify-between">
                  <span className="text-muted-foreground">{method.label}:</span>
                  <span className="font-medium">{formatCurrency(method.value)}</span>
                </div>
              ))}
            </div>

            {/* Distribution */}
            <div className="border-t border-border/50 pt-2">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-muted-foreground">Studio</p>
                  <p className="font-medium">{formatCurrency(transaction.studioShare)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Prof</p>
                  <p className="font-medium">{formatCurrency(transaction.eduShare)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Assist</p>
                  <p className="font-medium">{formatCurrency(transaction.kamShare)}</p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};