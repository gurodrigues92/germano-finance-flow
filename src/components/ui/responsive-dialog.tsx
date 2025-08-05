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
        <DrawerContent className={cn("max-h-[90vh]", className)}>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-[95vw] max-w-[425px] max-h-[90vh]", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}