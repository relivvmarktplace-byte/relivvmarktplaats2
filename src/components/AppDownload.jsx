import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

const AppDownload = ({ className = "" }) => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support PWA install
      toast.info('💡 ' + t('appDownload.installInfo'));
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('🎉 ' + t('appDownload.installSuccess'));
    } else {
      toast.info(t('appDownload.installLater'));
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <Card className={`bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            📱 {t('appDownload.title')}
          </h3>
          <p className="text-slate-600">
            {t('appDownload.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* App Store Button */}
          <a
            href="https://apps.apple.com/app/relivv"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-black text-white rounded-2xl p-4 hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🍎</div>
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
            </div>
          </a>

          {/* Google Play Button */}
          <a
            href="https://play.google.com/store/apps/details?id=com.relivv"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-black text-white rounded-2xl p-4 hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📱</div>
                <div className="text-left">
                  <div className="text-xs opacity-80">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* PWA Install Button */}
        {showInstallButton && (
          <Button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 mb-4"
          >
            ⚡ {t('appDownload.installWebApp')}
          </Button>
        )}

        {/* QR Codes for easy mobile access */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-xs text-slate-500">{t('appDownload.iosQR')}</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <p className="text-xs text-slate-500">{t('appDownload.androidQR')}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          * {t('appDownload.availableIn')}
        </p>
      </CardContent>
    </Card>
  );
};

export default AppDownload;