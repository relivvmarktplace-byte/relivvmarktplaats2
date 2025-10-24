import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'nl' ? 'en' : 'nl';
    i18n.changeLanguage(newLang);
  };

  const getCurrentFlag = () => {
    return i18n.language === 'nl' ? '🇳🇱' : '🇬🇧';
  };

  const getCurrentLanguageName = () => {
    return i18n.language === 'nl' ? 'Nederlands' : 'English';
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 rounded-xl ${className}`}
    >
      <span className="text-lg">{getCurrentFlag()}</span>
      <span className="text-sm font-medium hidden sm:inline">{getCurrentLanguageName()}</span>
    </Button>
  );
};

export default LanguageSwitcher;