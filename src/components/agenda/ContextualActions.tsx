import React from 'react';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { Plus, UserX, Calendar, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ContextualActionsProps {
  activeTab: 'calendar' | 'absences' | 'holiday' | 'settings' | 'notifications';
  onNewAgendamento: () => void;
  onNewBloqueio: () => void;
  onNewRecurring?: () => void;
  className?: string;
}

export const ContextualActions = ({ 
  activeTab, 
  onNewAgendamento, 
  onNewBloqueio, 
  onNewRecurring,
  className 
}: ContextualActionsProps) => {
  const isMobile = useIsMobile();

  const getMainAction = () => {
    switch (activeTab) {
      case 'calendar':
        return {
          label: 'Novo Agendamento',
          icon: Plus,
          action: onNewAgendamento,
          primary: true
        };
      case 'absences':
        return {
          label: 'Novo Bloqueio',
          icon: UserX,
          action: onNewBloqueio,
          primary: true
        };
      default:
        return null;
    }
  };

  const getSecondaryActions = () => {
    const actions = [];
    
    if (activeTab === 'calendar' && onNewRecurring) {
      actions.push({
        label: 'Agendamento Recorrente',
        icon: Calendar,
        action: onNewRecurring
      });
    }
    
    return actions;
  };

  const mainAction = getMainAction();
  const secondaryActions = getSecondaryActions();

  if (!mainAction) return null;

  if (isMobile) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-30", className)}>
        <div className="flex flex-col gap-2 items-end">
          {/* Secondary Actions */}
          {secondaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <ResponsiveButton
                key={index}
                variant="secondary"
                size="lg"
                onClick={action.action}
                className="h-12 w-12 rounded-full shadow-lg"
              >
                <Icon className="w-5 h-5" />
              </ResponsiveButton>
            );
          })}
          
          {/* Main Action */}
          <ResponsiveButton
            variant="default"
            size="lg"
            onClick={mainAction.action}
            className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90"
          >
            <mainAction.icon className="w-6 h-6" />
          </ResponsiveButton>
        </div>
      </div>
    );
  }

  // Desktop version - inline actions
  if (secondaryActions.length === 0) {
    return (
      <ResponsiveButton
        variant="default"
        onClick={mainAction.action}
        className={cn("flex items-center gap-2", className)}
      >
        <mainAction.icon className="w-4 h-4" />
        {mainAction.label}
      </ResponsiveButton>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ResponsiveButton
        variant="default"
        onClick={mainAction.action}
        className="flex items-center gap-2"
      >
        <mainAction.icon className="w-4 h-4" />
        {mainAction.label}
      </ResponsiveButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ResponsiveButton variant="outline" size="sm" className="h-9 w-9 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </ResponsiveButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {secondaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={index}
                onClick={action.action}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};