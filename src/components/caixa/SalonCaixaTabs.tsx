import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalonCaixaTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  openTicketsCount: number;
  closedTicketsCount: number;
  dailySalesValue: number;
}

export const SalonCaixaTabs = ({ 
  activeTab, 
  onTabChange, 
  openTicketsCount, 
  closedTicketsCount, 
  dailySalesValue 
}: SalonCaixaTabsProps) => {
  const tabs = [
    {
      id: 'open-tickets',
      label: 'Abertas',
      icon: Receipt,
      color: 'bg-[hsl(142,76%,36%)]', // Verde
      count: openTicketsCount
    },
    {
      id: 'closed-tickets',
      label: 'Fechadas',
      icon: FileText,
      color: 'bg-[hsl(217,91%,60%)]', // Azul
      count: closedTicketsCount
    },
    {
      id: 'daily-sales',
      label: 'Vendas',
      icon: BarChart3,
      color: 'bg-[hsl(291,64%,42%)]', // Roxo
      count: `R$ ${dailySalesValue.toFixed(0)}`
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "h-auto p-0 relative overflow-hidden transition-all",
                  isActive && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <div className={cn(
                  "w-full h-full p-4 text-white relative",
                  tab.color,
                  !isActive && "opacity-80 hover:opacity-100"
                )}>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Icon className="w-8 h-8" />
                    <div className="space-y-1">
                      <div className="text-xl font-bold">{tab.count}</div>
                      <div className="text-sm font-medium">{tab.label}</div>
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};