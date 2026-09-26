import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowDownToLine, Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { SITE } from '../../lib/constants/site';
import { useTheme } from '../../lib/hooks/useTheme';
import { useTranslation } from '../../lib/i18n/LanguageContext';
import type { Language } from '../../lib/i18n/translations';
import { cn } from '../../lib/utils/cn';
import { Logo } from '../ui/Logo';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'tr', label: 'TR', flag: '🇹🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const navItems = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.experience, path: '/experience' },
    { label: t.nav.projects, path: '/projects' },
    { label: t.nav.contact, path: '/contact' },
  ];

  const close = useCallback(() => {
    setOpen(false);
    setLangMenuOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  // Click outside to close language menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langMenuOpen]);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-rule bg-paper/85 backdrop-blur-md shadow-xs py-3'
          : 'border-b border-transparent bg-paper/60 backdrop-blur-xs py-4 md:py-5',
      )}
    >
      <div className="shell flex items-center justify-between gap-4">
        {/* Marka / Logo */}
        <Link
          to="/"
          className="flex items-center"
          aria-label={`${SITE.name} — ${t.nav.home}`}
        >
          <Logo size="md" />
        </Link>

        {/* Masaüstü Navigasyonu */}
        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-7 md:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'relative py-1 text-meta font-medium transition-colors duration-200',
                  isActive
                    ? 'text-ink font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-ink'
                    : 'text-ink-2 hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sağ Araçlar (Dil Seçici, Tema, CV) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Çok Dilli Seçici (TR / EN / DE) */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-rule bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink transition-all hover:border-ink hover:bg-surface-hover"
              aria-label="Dil değiştir / Change language / Sprache ändern"
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-3.5 w-3.5 text-ink-2" />
              <span className="uppercase">{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-rule bg-paper p-1.5 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                      language === lang.code
                        ? 'bg-accent text-white font-semibold'
                        : 'text-ink hover:bg-surface',
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {language === lang.code && (
                      <span className="text-[10px] uppercase opacity-80">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tema Değiştirici (Aydınlık / Karanlık Mod) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
            title={theme === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rule bg-surface text-ink transition-all hover:border-ink hover:text-accent cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 scale-100" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 transition-transform rotate-0 scale-100" />
            )}
          </button>

          {/* Direct Contact Button */}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center rounded-xl bg-ink px-3.5 py-1.5 text-xs font-bold text-paper transition-all hover:opacity-90"
          >
            <span>{t.nav.contact}</span>
          </Link>

          {/* CV İndir Butonu */}
          <a
            href="/cv.pdf"
            download="Omer_Abali_CV.pdf"
            className="hidden items-center gap-1.5 rounded-xl border border-rule-strong bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs transition-all hover:border-ink hover:bg-surface-hover sm:flex"
          >
            <span>{t.nav.cvDownload}</span>
            <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          {/* Mobil Menü Butonu */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rule bg-surface text-ink transition-colors hover:border-ink md:hidden"
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobil Çekmece Menü */}
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 top-[60px] bottom-0 z-50 flex flex-col justify-between border-t border-rule bg-paper p-6 backdrop-blur-xl md:hidden overflow-y-auto"
        >
          <div className="flex flex-col space-y-4">
            {/* Dil Seçici (Mobil) */}
            <div className="flex items-center gap-2 rounded-xl border border-rule bg-surface p-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    close();
                  }}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all',
                    language === lang.code
                      ? 'bg-accent text-white shadow-xs'
                      : 'text-ink-2 hover:text-ink',
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            <nav aria-label="Mobil menü" className="flex flex-col space-y-1">
              {navItems.map((item, i) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-ink hover:bg-surface hover:text-accent',
                    )
                  }
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
                </NavLink>
              ))}

              <a
                href="/cv.pdf"
                download="Omer_Abali_CV.pdf"
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-ink hover:bg-surface"
              >
                <span>{t.nav.cvDownload} (PDF)</span>
                <ArrowDownToLine className="h-4 w-4 text-ink-3" />
              </a>
            </nav>
          </div>

          <div className="border-t border-rule pt-6">
            <p className="font-mono text-xs text-ink-3">{SITE.email}</p>
            <p className="mt-1 text-xs text-ink-3">© 2026 {SITE.name}</p>
          </div>
        </div>
      )}
    </header>
  );
};
