import * as React from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

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

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={cn("h-[100vh] max-h-none", className)}>
          <DrawerHeader className="text-left px-6 py-4 border-b">
            <DrawerTitle className="text-xl font-semibold">{title}</DrawerTitle>
            {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
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