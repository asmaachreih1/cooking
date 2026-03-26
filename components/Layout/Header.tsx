import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChefHat, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, hasPermission, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/recipes', label: t('nav.recipes') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-cream/95 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
      <div className="tatreez-border" />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3">
          {/* Logo Section */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-olive-green rounded-full flex items-center justify-center group-hover:bg-terracotta transition-colors">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif-elegant text-2xl text-dark-brown leading-tight">{t('common.siteTitle')}</h1>
                <p className="text-[10px] text-dark-brown/60 font-bold tracking-widest uppercase">{t('common.siteSubtitle')}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          {!isAuthPage && (
            <nav className="hidden lg:flex items-center justify-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-bold transition-all hover:tracking-wider whitespace-nowrap ${isActive(link.path)
                    ? 'text-olive-green'
                    : 'text-dark-brown hover:text-terracotta'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth/Action Section */}
          <div className="flex justify-end items-center gap-4">
            {!isAuthPage && (
              <div className="hidden lg:flex items-center gap-4">
                {user ? (
                  <>
                    {hasPermission('access_dashboard') && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 text-dark-brown hover:text-olive-green transition-colors font-bold text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('nav.dashboard')}</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-dark-brown hover:text-olive-green transition-colors font-bold text-sm"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-olive-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-terracotta transition-all shadow-warm active:scale-95"
                    >
                      {t('nav.signup')}
                    </Link>
                  </>
                )}
                
                {/* Language Switcher Desktop */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-beige/30 text-dark-brown hover:bg-olive-green hover:text-white transition-all text-xs font-bold"
                  title={t('header.switchLanguage')}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-dark-brown hover:text-olive-green transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden mt-4 py-6 border-t border-warm-beige/30">
            <div className="flex flex-col gap-6">
              {!isAuthPage && (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`font-bold text-lg ${isActive(link.path)
                        ? 'text-olive-green'
                        : 'text-dark-brown hover:text-terracotta'
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="h-[1px] bg-warm-beige/30" />
                  
                  {user ? (
                    hasPermission('access_dashboard') && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 bg-warm-beige/20 text-dark-brown px-5 py-3 rounded-2xl font-bold"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        {t('nav.dashboard')}
                      </Link>
                    )
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        href="/login"
                        className="flex items-center justify-center py-4 border border-warm-beige rounded-2xl font-bold text-dark-brown"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        href="/signup"
                        className="flex items-center justify-center py-4 bg-olive-green text-white rounded-2xl font-bold shadow-warm"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('nav.signup')}
                      </Link>
                    </div>
                  )}

                  <div className="h-[1px] bg-warm-beige/30" />

                  {/* Language Switcher Mobile */}
                  <button
                    onClick={() => {
                      setLanguage(language === 'en' ? 'ar' : 'en');
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-3 py-4 bg-warm-beige/20 text-dark-brown rounded-2xl font-bold"
                  >
                    <Globe className="w-5 h-5" />
                    {language === 'en' ? 'العربية (AR)' : 'English (EN)'}
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
