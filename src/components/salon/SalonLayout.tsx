import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SalonSidebar } from './SalonSidebar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Scissors, User } from 'lucide-react';

export const SalonLayout = () => {
  const { profile, isAdmin } = useUserProfile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 animate-gradient overflow-x-hidden">
        <SalonSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-white/80 backdrop-blur-md border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex h-full items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <SidebarTrigger />
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Studio Germano</h1>
                  <span className="hidden lg:inline text-sm text-gray-600">Sistema de Gestão</span>
                </div>
              </div>
              
              {/* User Profile Indicator */}
              {profile && (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-800">{profile.name}</span>
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
          
          <main className="flex-1 p-3 sm:p-6 pb-24 animate-slide-up min-w-0 bg-gray-50">
            <Outlet />
          </main>
        </div>
        
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};