import * as React from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsivePopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  alignOffset?: number
  modal?: boolean
}

export function ResponsivePopover({
  open,
  onOpenChange,
  trigger,
  children,
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  alignOffset = 0,
  modal = true
}: ResponsivePopoverProps) {
  const isMobile = useIsMobile()

  // On mobile, use Dialog for better UX
  if (isMobile) {
    return (
      <>
        <div onClick={() => onOpenChange(!open)}>
          {trigger}
        </div>
        <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
          <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
          <DialogContent className={cn(
            "w-[95vw] max-w-[400px] max-h-[90vh] overflow-y-auto p-0 gap-0",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}>
            {children}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // On desktop, use enhanced Popover with custom overlay
  return (
    <>
      {/* Custom backdrop for desktop popover */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/20 backdrop-blur-[2px] animate-in fade-in-0"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "z-50 w-[95vw] max-w-[400px] p-0 shadow-lg border-2",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          {children}
        </PopoverContent>
      </Popover>
    </>
  )
}