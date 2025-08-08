import { ReactNode } from 'react';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { FloatingActionButton } from '@/components/navigation/FloatingActionButton';
import { NavigationEnhancements } from '@/components/navigation/NavigationEnhancements';
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
  return <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-muted/20 pb-20 sm:pb-24">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="page-container !pb-0">
          <NavigationEnhancements>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle || 'Sistema de Gestão Profissional'}</p>
          </NavigationEnhancements>
        </div>
      </header>

      {/* Content */}
      <main className="page-container">
        {/* Greeting Section */}
        {showGreeting && <GreetingHeader />}

        {/* Page Content */}
        <div className="mobile-spacing">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button */}
      {onFabClick && <FloatingActionButton onClick={onFabClick} />}
    </div>;
};