import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t('footer.about', { defaultValue: 'About Relivv' })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('footer.aboutText', { 
                defaultValue: 'Relivv is the Netherlands\' leading circular marketplace for sustainable second-hand shopping with secure escrow payments.' 
              })}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t('footer.quickLinks', { defaultValue: 'Quick Links' })}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-slate-300 hover:text-white transition-colors text-sm">
                  🔍 {t('navigation.explore')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-300 hover:text-white transition-colors text-sm">
                  📂 {t('navigation.categories')}
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-slate-300 hover:text-white transition-colors text-sm">
                  💼 {t('navigation.sell')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm">
                  👤 {t('footer.myAccount', { defaultValue: 'My Account' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t('footer.support', { defaultValue: 'Support' })}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-slate-300 hover:text-white transition-colors text-sm">
                  🎫 {t('footer.supportTickets', { defaultValue: 'Support Tickets' })}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-white transition-colors text-sm">
                  ❓ {t('footer.faq', { defaultValue: 'FAQ' })}
                </Link>
              </li>
              <li>
                <a href="mailto:support@relivv.nl" className="text-slate-300 hover:text-white transition-colors text-sm">
                  📧 {t('footer.contactSupport', { defaultValue: 'Contact Support' })}
                </a>
              </li>
              <li>
                <a href="tel:+31000000000" className="text-slate-300 hover:text-white transition-colors text-sm">
                  📞 {t('footer.callUs', { defaultValue: 'Call Us' })}
                </a>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white transition-colors text-sm">
                  📄 {t('footer.terms', { defaultValue: 'Terms & Conditions' })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t('footer.contact', { defaultValue: 'Contact' })}
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-slate-300">
                📍 Amsterdam, Netherlands
              </p>
              <p className="text-slate-300">
                📧 support@relivv.nl
              </p>
              <p className="text-slate-300">
                📞 +31 (0) 20 123 4567
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-slate-300 hover:text-white transition-colors text-2xl">
                  📘
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors text-2xl">
                  📷
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors text-2xl">
                  🐦
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>
              © 2024 Relivv. {t('footer.allRightsReserved', { defaultValue: 'All rights reserved.' })}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">
                {t('footer.privacy', { defaultValue: 'Privacy Policy' })}
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                {t('footer.termsShort', { defaultValue: 'Terms' })}
              </Link>
              <Link to="/faq" className="hover:text-white transition-colors">
                {t('footer.help', { defaultValue: 'Help' })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
