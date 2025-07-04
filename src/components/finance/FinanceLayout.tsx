import { NavLink, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { FinanceSidebar } from './FinanceSidebar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';

export const FinanceLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <FinanceSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-full items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground">Studio Germano</h1>
                <span className="text-sm text-muted-foreground">Sistema Financeiro</span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-muted/10 pb-24">
            <Outlet />
          </main>
        </div>
        
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};