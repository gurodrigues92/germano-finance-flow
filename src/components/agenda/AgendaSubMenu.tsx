import { Button } from '@/components/ui/button';
import { Calendar, UserX, Sun, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgendaSubMenuProps {
  activeTab: 'calendar' | 'absences' | 'holiday' | 'settings';
  onTabChange: (tab: 'calendar' | 'absences' | 'holiday' | 'settings') => void;
}

export const AgendaSubMenu = ({ activeTab, onTabChange }: AgendaSubMenuProps) => {
  const tabs = [
    { id: 'calendar' as const, label: 'Agenda', icon: Calendar },
    { id: 'absences' as const, label: 'Ausências', icon: UserX },
    { id: 'holiday' as const, label: 'Feriados', icon: Sun },
    { id: 'settings' as const, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex gap-2 p-4 bg-muted/30 rounded-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2",
              activeTab === tab.id && "shadow-sm"
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};