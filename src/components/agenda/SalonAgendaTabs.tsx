import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, UserX, Sun, Settings, Bell } from 'lucide-react';

interface SalonAgendaTabsProps {
  activeTab: 'calendar' | 'absences' | 'holiday' | 'settings' | 'notifications';
  onTabChange: (tab: 'calendar' | 'absences' | 'holiday' | 'settings' | 'notifications') => void;
}

export const SalonAgendaTabs = ({ activeTab, onTabChange }: SalonAgendaTabsProps) => {
  const tabs = [
    {
      id: 'calendar' as const,
      label: 'Calendar',
      icon: Calendar,
      color: '#4CAF50', // Verde
      description: 'Agenda principal'
    },
    {
      id: 'absences' as const,
      label: 'Absences',
      icon: UserX,
      color: '#FF9800', // Laranja
      description: 'Bloqueios e ausências'
    },
    {
      id: 'holiday' as const,
      label: 'Holiday',
      icon: Sun,
      color: '#2196F3', // Azul
      description: 'Feriados'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      color: '#607D8B', // Cinza
      description: 'Configurações da agenda'
    },
    {
      id: 'notifications' as const,
      label: 'Notifications',
      icon: Bell,
      color: '#9C27B0', // Roxo
      description: 'Central de notificações'
    }
  ];

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 h-auto whitespace-nowrap
                  ${isActive 
                    ? 'text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                style={{
                  backgroundColor: isActive ? tab.color : undefined
                }}
              >
                <Icon className="w-4 h-4" />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{tab.label}</span>
                  <span 
                    className={`text-xs ${
                      isActive ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {tab.description}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};