import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const NetworkStatus: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm z-[40] flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span>Sem conexão - Funcionando no modo offline</span>
    </div>
  );
};

export default NetworkStatus;