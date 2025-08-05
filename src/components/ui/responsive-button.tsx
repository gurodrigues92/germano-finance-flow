import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveButtonProps extends ButtonProps {
  mobileSize?: "sm" | "default" | "lg"
  desktopSize?: "sm" | "default" | "lg"
}

export const ResponsiveButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveButtonProps
>(({ className, mobileSize = "default", desktopSize = "default", ...props }, ref) => {
  const isMobile = useIsMobile()
  const size = isMobile ? mobileSize : desktopSize

  return (
    <Button
      ref={ref}
      size={size}
      className={cn(
        "transition-all duration-200",
        isMobile ? "min-h-[44px] text-base" : "min-h-[40px]",
        "active:scale-95 hover:scale-[1.02]",
        className
      )}
      {...props}
    />
  )
})

ResponsiveButton.displayName = "ResponsiveButton"