import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAgendaLayoutProps {
  header: React.ReactNode;
  tabs: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export const MobileAgendaLayout = ({ 
  header, 
  tabs, 
  content, 
  className 
}: MobileAgendaLayoutProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className={cn("space-y-6", className)}>
        {header}
        {tabs}
        {content}
      </div>
    );
  }

  return (
    <div className={cn("h-full w-full max-w-full flex flex-col bg-background overflow-x-hidden", className)}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
        {header}
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-[56px] z-10 w-full bg-background/95 backdrop-blur-md border-b border-border/20">
        {tabs}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden overflow-y-auto pb-20">
        {content}
      </div>
    </div>
  );
};