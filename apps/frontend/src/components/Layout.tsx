import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { authApi } from '../api/auth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isAuthenticated = authApi.isAuthenticated();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    ...(isAuthenticated ? [
      { path: '/avatar-editor', label: t('nav.avatarEditor') },
      { path: '/cosmetics', label: t('nav.cosmetics') },
      { path: '/marketplace', label: t('nav.marketplace') },
      { path: '/worlds', label: t('nav.worlds') },
    ] : []),
  ];

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              🎮 {t('common.appName')}
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-secondary">
                  {t('nav.logout')}
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t('common.appName')}</h3>
              <p className="text-gray-400">
                {t('home.hero.subtitle')}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t('nav.home')}</h3>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © 2024 {t('common.appName')}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
