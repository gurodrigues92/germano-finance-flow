import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaixaSubMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CaixaSubMenu = ({ activeTab, onTabChange }: CaixaSubMenuProps) => {
  const tabs = [
    {
      id: 'open-tickets',
      label: 'Open Tickets',
      icon: Receipt,
      description: 'Comandas abertas'
    },
    {
      id: 'closed-tickets',
      label: 'Closed Tickets',
      icon: FileText,
      description: 'Comandas fechadas'
    },
    {
      id: 'daily-sales',
      label: 'Daily Sales',
      icon: BarChart3,
      description: 'Vendas diárias'
    }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "h-auto p-3 flex-col gap-2",
                  activeTab === tab.id && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <Icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};