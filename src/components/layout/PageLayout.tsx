import { ReactNode } from 'react';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { GreetingHeader } from '@/components/dashboard/GreetingHeader';
interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showGreeting?: boolean;
  onFabClick?: () => void;
  fabIcon?: ReactNode;
}
export const PageLayout = ({
  children,
  title,
  subtitle,
  showGreeting = false,
  onFabClick,
  fabIcon
}: PageLayoutProps) => {
  return <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="bg-card shadow-sm p-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground">{subtitle || 'Sistema de Gestão Profissional'}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Greeting Section */}
        {showGreeting && <GreetingHeader />}
        
        {/* Page Title */}
        {title && <div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          </div>}

        {/* Page Content */}
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button */}
      {onFabClick && <FloatingActionButton onClick={onFabClick} />}
    </div>;
};