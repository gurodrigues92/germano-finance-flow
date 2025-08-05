import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  variant: 'view' | 'edit' | 'delete';
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  view: 'bg-status-normal hover:bg-status-normal/90 text-status-normal-foreground',
  edit: 'bg-status-atencao hover:bg-status-atencao/90 text-status-atencao-foreground',
  delete: 'bg-status-critico hover:bg-status-critico/90 text-status-critico-foreground'
};

export const ActionButton = ({ 
  icon: Icon, 
  onClick, 
  variant, 
  disabled = false,
  className 
}: ActionButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 p-0 border-0 rounded-full',
        variantStyles[variant],
        className
      )}
    >
      <Icon className="h-3 w-3" />
    </Button>
  );
};