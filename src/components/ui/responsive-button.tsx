import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveButtonProps extends ButtonProps {
  mobileSize?: "sm" | "default" | "lg"
  desktopSize?: "sm" | "default" | "lg"
  mobileText?: string
  desktopText?: string
  showIconOnly?: boolean
}

export const ResponsiveButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveButtonProps
>(({ 
  className, 
  mobileSize = "default", 
  desktopSize = "default", 
  mobileText,
  desktopText,
  showIconOnly = false,
  children,
  ...props 
}, ref) => {
  const isMobile = useIsMobile()
  const size = isMobile ? mobileSize : desktopSize
  
  // Use adaptive text if provided
  const content = (() => {
    if (showIconOnly && isMobile) {
      // Extract icon from children if it exists
      return React.Children.toArray(children).find(child => 
        React.isValidElement(child) && typeof child.type !== 'string'
      ) || children;
    }
    if (mobileText && desktopText) {
      return isMobile ? mobileText : desktopText;
    }
    return children;
  })();

  return (
    <Button
      ref={ref}
      size={size}
      className={cn(
        "transition-all duration-200",
        isMobile ? "min-h-[44px] px-3" : "min-h-[40px]",
        "active:scale-95 hover:scale-[1.02]",
        showIconOnly && isMobile && "w-auto aspect-square",
        className
      )}
      {...props}
    >
      {content}
    </Button>
  )
})

ResponsiveButton.displayName = "ResponsiveButton"