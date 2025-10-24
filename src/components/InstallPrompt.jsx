import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    
    // Don't show again if dismissed within last 7 days
    if (dismissed && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 5 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white dark:from-indigo-600 dark:to-purple-700">
        <div className="p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="text-5xl">📱</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Install Relivv App</h3>
              <p className="text-white/90 text-sm mb-4">
                Install our app for a better experience! Access Relivv instantly from your home screen.
              </p>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleInstallClick}
                  className="bg-white text-indigo-600 hover:bg-white/90 font-semibold flex-1"
                >
                  📲 Install Now
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Later
                </Button>
              </div>
              
              <div className="mt-4 flex items-center space-x-4 text-xs text-white/80">
                <span>✓ Offline access</span>
                <span>✓ Fast & secure</span>
                <span>✓ No app store</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstallPrompt;
