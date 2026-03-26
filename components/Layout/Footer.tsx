import Link from 'next/link';
import { ChefHat, Mail, Phone, MapPin, Heart, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Flag SVG Components
const LebaneseFlagIcon = () => (
  <svg viewBox="0 0 30 20" className="w-6 h-4">
    <rect width="30" height="20" fill="#ED1C24" />
    <rect y="5" width="30" height="10" fill="#FFFFFF" />
    <path d="M15 6 L17 10 L15 14 L13 10 Z" fill="#00A651" />
    <path d="M12 8 L15 7 L18 8 L15 9 Z" fill="#00A651" />
    <path d="M12 12 L15 11 L18 12 L15 13 Z" fill="#00A651" />
  </svg>
);

const PalestinianFlagIcon = () => (
  <svg viewBox="0 0 30 20" className="w-6 h-4">
    <rect width="30" height="6.67" fill="#000000" />
    <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
    <rect y="13.33" width="30" height="6.67" fill="#007A3D" />
    <polygon points="0,0 10,10 0,20" fill="#ED1C24" />
  </svg>
);

const Footer = () => {
  const { t, language } = useLanguage();
  return (
    <footer className="bg-dark-brown text-cream">
      {/* Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-olive-green via-terracotta to-deep-red" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-olive-green rounded-full flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-serif-elegant text-2xl">{t('common.siteTitle')}</h3>
                <p className="text-xs text-cream/60">{t('common.siteSubtitle')}</p>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              {t('common.footerDescription')}
            </p>
            {/* Flag Icons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LebaneseFlagIcon />
                <span className="text-xs text-cream/60">{t('common.lebanon')}</span>
              </div>
              <div className="flex items-center gap-2">
                <PalestinianFlagIcon />
                <span className="text-xs text-cream/60">{t('common.palestine')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-elegant text-xl mb-6 text-olive-green">{t('common.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/recipes', label: t('nav.recipes') },
                { path: '/about', label: t('nav.about') },
                { path: '/services', label: t('nav.services') },
                { path: '/blog', label: t('nav.blog') },
                { path: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-cream/70 hover:text-terracotta transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif-elegant text-xl mb-6 text-olive-green">{t('common.recipeCategories')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'main', label: t('categories.main') },
                { key: 'appetizers', label: t('categories.appetizers') },
                { key: 'desserts', label: t('categories.desserts') },
                { key: 'salads', label: t('categories.salads') },
                { key: 'soups', label: t('categories.soups') },
                { key: 'beverages', label: t('categories.beverages') },
              ].map((category) => (
                <li key={category.key}>
                  <Link
                    href="/recipes"
                    className="text-cream/70 hover:text-terracotta transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif-elegant text-xl mb-6 text-olive-green">{t('common.getInTouch')}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-terracotta" />
                <a href="mailto:hello@montahakitchen.com" className="text-cream/70 hover:text-terracotta transition-colors text-sm">
                  hello@montahakitchen.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-terracotta" />
                <span className="text-cream/70 text-sm">+961 76 371 425</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm">{language === 'en' ? 'Tyre, Lebanon' : 'صور، لبنان'}</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-olive-green transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-olive-green transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-olive-green transition-colors">
                < Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/50 text-sm flex items-center gap-1">
              {t('header.madeWith')} <Heart className="w-4 h-4 text-deep-red fill-deep-red" /> {t('header.fromKitchen')}
            </p>
            <p className="text-cream/50 text-sm">
              © 2026 {t('common.siteTitle')}. {t('common.allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
