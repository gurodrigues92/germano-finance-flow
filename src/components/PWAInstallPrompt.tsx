import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Detectar se já está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);
    
    // Listener para Android
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Para iOS, mostrar prompt manual após 5 segundos
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed successfully');
      }
      setDeferredPrompt(null);
    }
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Não mostrar se já instalado ou foi dispensado
  if (isStandalone || localStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null;
  }

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-xl shadow-xl z-[50] animate-slide-down">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Instalar App</h3>
            <p className="text-sm opacity-90 mt-1">
              {isIOS 
                ? 'Toque em "Compartilhar" → "Adicionar à Tela Inicial"'
                : 'Adicione à tela inicial para acesso rápido'
              }
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {!isIOS && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Instalar Agora</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Agora não
          </button>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;