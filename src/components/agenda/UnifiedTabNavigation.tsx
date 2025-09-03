import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, UserX, Sun, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnifiedTabNavigationProps {
  activeTab: 'calendar' | 'absences' | 'holiday' | 'settings' | 'notifications';
  onTabChange: (tab: 'calendar' | 'absences' | 'holiday' | 'settings' | 'notifications') => void;
}

export const UnifiedTabNavigation = ({ activeTab, onTabChange }: UnifiedTabNavigationProps) => {
  const isMobile = useIsMobile();

  const tabs = [
    {
      id: 'calendar' as const,
      label: 'Agenda',
      icon: Calendar,
      shortLabel: 'Agenda',
    },
    {
      id: 'absences' as const,
      label: 'Ausências',
      icon: UserX,
      shortLabel: 'Ausências',
    },
    {
      id: 'holiday' as const,
      label: 'Feriados',
      icon: Sun,
      shortLabel: 'Feriados',
    },
    {
      id: 'settings' as const,
      label: 'Configurações',
      icon: Settings,
      shortLabel: 'Config',
    },
    {
      id: 'notifications' as const,
      label: 'Notificações',
      icon: Bell,
      shortLabel: 'Avisos',
    }
  ];

  if (isMobile) {
    return (
      <div className="px-3 py-2">
        <div className="flex overflow-x-auto gap-1 scrollbar-hide -mx-1 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                size="sm"
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap min-h-[36px] px-3 text-xs",
                  "transition-all duration-200 flex-shrink-0",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium">{tab.shortLabel}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="bg-card rounded-lg border border-border p-2">
      <div className="flex overflow-x-auto gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 h-auto whitespace-nowrap",
                "transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};