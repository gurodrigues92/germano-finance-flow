import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesByItemReport } from './SalesByItemReport';
import { SalesByPaymentReport } from './SalesByPaymentReport';
import { SalesByProfessionalReport } from './SalesByProfessionalReport';
import { GeneralOverviewReport } from './GeneralOverviewReport';
import { Transaction } from '@/types/finance';

interface SalesReportTabsProps {
  transactions: Transaction[];
  period: string;
}

export const SalesReportTabs = ({ transactions, period }: SalesReportTabsProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Geral</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="professional">Profissional</TabsTrigger>
          <TabsTrigger value="items">Itens</TabsTrigger>
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