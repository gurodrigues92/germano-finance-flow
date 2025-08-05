import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveCardProps extends React.ComponentProps<typeof Card> {
  title?: string
  description?: string
  children: React.ReactNode
  headerActions?: React.ReactNode
}

export function ResponsiveCard({
  title,
  description,
  children,
  headerActions,
  className,
  ...props
}: ResponsiveCardProps) {
  const isMobile = useIsMobile()

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-200",
        isMobile ? "rounded-lg shadow-sm border-border/50" : "rounded-xl shadow-md hover:shadow-lg",
        className
      )} 
      {...props}
    >
      {(title || description || headerActions) && (
        <CardHeader className={cn(isMobile ? "p-4 pb-2" : "p-6")}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && (
                <CardTitle className={cn(
                  "font-semibold",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  {description}
                </CardDescription>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(isMobile ? "p-4 pt-2" : "p-6 pt-0")}>
        {children}
      </CardContent>
    </Card>
  )
}