import * as React from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard"

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile()
  const { isKeyboardOpen, keyboardHeight } = useVirtualKeyboard()

  if (isMobile) {
    const dynamicHeight = isKeyboardOpen 
      ? `calc(100svh - ${keyboardHeight}px)` 
      : '100svh';
      
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent 
          className={cn("max-h-none", className)}
          style={{ height: dynamicHeight }}
        >
          <DrawerHeader className="text-left px-4 py-3 border-b shrink-0">
            <DrawerTitle className="text-lg font-semibold">{title}</DrawerTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </DrawerHeader>
          <div 
            className="flex-1 px-4 py-4 overflow-y-auto overscroll-contain"
            style={{ 
              paddingBottom: isKeyboardOpen ? '1rem' : '6rem',
              scrollBehavior: 'smooth'
            }}
          >
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-[95vw] max-w-[600px] max-h-[95vh]", className)}>
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}