import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesByItemReport } from './SalesByItemReport';
import { SalesByPaymentReport } from './SalesByPaymentReport';
import { SalesByProfessionalReport } from './SalesByProfessionalReport';
import { GeneralOverviewReport } from './GeneralOverviewReport';
import { Transaction } from '@/types/finance';
import { useIsMobile } from '@/hooks/use-mobile';

interface SalesReportTabsProps {
  transactions: Transaction[];
  period: string;
}

export const SalesReportTabs = ({ transactions, period }: SalesReportTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
            {isMobile ? 'Geral' : 'Geral'}
          </TabsTrigger>
          <TabsTrigger value="payment" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
            {isMobile ? 'Pag.' : 'Pagamento'}
          </TabsTrigger>
          <TabsTrigger value="professional" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
            {isMobile ? 'Prof.' : 'Profissional'}
          </TabsTrigger>
          <TabsTrigger value="items" className={`${isMobile ? 'text-xs px-2 py-2' : 'text-sm'}`}>
            {isMobile ? 'Itens' : 'Itens'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <GeneralOverviewReport transactions={transactions} period={period} />
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <SalesByPaymentReport transactions={transactions} period={period} />
        </TabsContent>
        
        <TabsContent value="professional" className="space-y-4">
          <SalesByProfessionalReport transactions={transactions} period={period} />
        </TabsContent>
        
        <TabsContent value="items" className="space-y-4">
          <SalesByItemReport transactions={transactions} period={period} />
        </TabsContent>
      </Tabs>
    </div>
  );
};