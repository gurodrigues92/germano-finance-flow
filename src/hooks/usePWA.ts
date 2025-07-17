import { useEffect, useState } from 'react';

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Usar vite-plugin-pwa em vez de registro manual
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('PWA: Service Worker ready');
        
        // Verificar atualizações usando workbox
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                
                // Toast de atualização com design system
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg z-[60]';
                toast.innerHTML = `
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                    <span>Nova versão disponível!</span>
                    <button onclick="window.location.reload()" class="ml-4 bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1 rounded text-sm">
                      Atualizar
                    </button>
                  </div>
                `;
                document.body.appendChild(toast);
                
                // Remover após 5 segundos
                setTimeout(() => {
                  if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                  }
                }, 5000);
              }
            });
          }
        });
      });
    }

    // Monitorar status de conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const reloadApp = () => {
    window.location.reload();
  };

  return {
    isOnline,
    updateAvailable,
    reloadApp
  };
};