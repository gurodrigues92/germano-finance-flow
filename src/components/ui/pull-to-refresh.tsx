import React, { useEffect } from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  resistance?: number;
}

export const PullToRefresh = ({
  onRefresh,
  children,
  className,
  threshold = 80,
  resistance = 2.5
}: PullToRefreshProps) => {
  const {
    containerRef,
    bindPullToRefresh,
    isPulling,
    pullDistance,
    isRefreshing,
    threshold: thresholdValue
  } = usePullToRefresh({ onRefresh, threshold, resistance });

  useEffect(() => {
    const cleanup = bindPullToRefresh();
    return cleanup;
  }, [bindPullToRefresh]);

  const progress = Math.min(pullDistance / thresholdValue, 1);
  const shouldTrigger = pullDistance >= thresholdValue;

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      style={{
        transform: `translateY(${isPulling ? pullDistance : 0}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-background/80 backdrop-blur-sm border-b z-50"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 0 ? 1 : 0,
          transition: 'opacity 0.2s ease'
        }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Atualizando...</span>
            </>
          ) : (
            <>
              <RotateCcw 
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  shouldTrigger && "rotate-180 text-primary"
                )}
                style={{
                  transform: `rotate(${progress * 180}deg)`
                }}
              />
              <span className={shouldTrigger ? "text-primary font-medium" : ""}>
                {shouldTrigger ? "Solte para atualizar" : "Puxe para atualizar"}
              </span>
            </>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};