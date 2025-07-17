import { NavLink, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { FinanceSidebar } from './FinanceSidebar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Scissors, User } from 'lucide-react';

export const FinanceLayout = () => {
  const { profile, isAdmin } = useUserProfile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-purple-50 to-orange-50 animate-gradient overflow-x-hidden">
        <FinanceSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b glass-strong border-purple-100 sticky top-0 z-50">
            <div className="flex h-full items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <SidebarTrigger />
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                  <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Studio Germano</h1>
                  <span className="hidden lg:inline text-sm text-muted-foreground">Sistema Financeiro</span>
                </div>
              </div>
              
              {/* User Profile Indicator */}
              {profile && (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">{profile.name}</span>
                    <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                      {isAdmin ? "Administrador" : "Assistente"}
                    </Badge>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </header>
          
          <main className="flex-1 p-3 sm:p-6 pb-24 animate-slide-up min-w-0">
            <Outlet />
          </main>
        </div>
        
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};