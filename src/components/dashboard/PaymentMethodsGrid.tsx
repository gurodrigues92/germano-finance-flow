import { CompactCard } from '@/components/dashboard/CompactCard';
import { Banknote, Smartphone, CreditCard } from 'lucide-react';

interface PaymentMethodsGridProps {
  totalBruto: number;
  totalDinheiro: number;
  totalPix: number;
  totalDebito: number;
  totalCredito: number;
  trends: {
    dinheiro: number;
    pix: number;
    debito: number;
    credito: number;
  };
}

export const PaymentMethodsGrid = ({ 
  totalBruto,
  totalDinheiro,
  totalPix,
  totalDebito,
  totalCredito,
  trends 
}: PaymentMethodsGridProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-sm sm:text-md font-semibold text-foreground mb-3 sm:mb-4">Métodos de Pagamento</h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <CompactCard
          title="Dinheiro"
          value={totalDinheiro}
          icon={Banknote}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          trend={{
            value: trends.dinheiro,
            isPositive: trends.dinheiro >= 0
          }}
          percentage={`${totalBruto > 0 ? ((totalDinheiro / totalBruto) * 100).toFixed(1) : 0}%`}
        />
        
        <CompactCard
          title="PIX"
          value={totalPix}
          icon={Smartphone}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          trend={{
            value: trends.pix,
            isPositive: trends.pix >= 0
          }}
          percentage={`${totalBruto > 0 ? ((totalPix / totalBruto) * 100).toFixed(1) : 0}%`}
        />
        
        <CompactCard
          title="Débito"
          value={totalDebito}
          icon={CreditCard}
          iconColor="text-violet-600"
          iconBg="bg-violet-100"
          trend={{
            value: trends.debito,
            isPositive: trends.debito >= 0
          }}
          percentage={`${totalBruto > 0 ? ((totalDebito / totalBruto) * 100).toFixed(1) : 0}%`}
        />
        
        <CompactCard
          title="Crédito"
          value={totalCredito}
          icon={CreditCard}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
          trend={{
            value: trends.credito,
            isPositive: trends.credito >= 0
          }}
          percentage={`${totalBruto > 0 ? ((totalCredito / totalBruto) * 100).toFixed(1) : 0}%`}
        />
      </div>
    </div>
  );
};