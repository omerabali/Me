import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone } from 'lucide-react';
import { SITE } from '../../lib/constants/site';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { Logo } from '../ui/Logo';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-rule bg-paper transition-colors">
      <div className="shell py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* 1. Kolon: Marka & Sistem Durumu */}
          <div className="flex flex-col items-start gap-4 md:col-span-5">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-ink-2">
              {t.footer.description}
            </p>
          </div>

          {/* 2. Kolon: Hızlı Bağlantılar */}
          <div className="flex flex-col gap-3 md:col-span-3 md:pl-6">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
              {t.footer.quickLinks}
            </h4>
            <nav className="flex flex-col space-y-2 text-xs text-ink-2">
              <Link to="/" className="transition-colors hover:text-accent">
                {t.nav.home}
              </Link>
              <Link to="/about" className="transition-colors hover:text-accent">
                {t.nav.about}
              </Link>
              <Link to="/experience" className="transition-colors hover:text-accent">
                {t.nav.experience}
              </Link>
              <Link to="/projects" className="transition-colors hover:text-accent">
                {t.nav.projects}
              </Link>
              <Link to="/contact" className="transition-colors hover:text-accent">
                {t.nav.contact}
              </Link>
            </nav>
          </div>

          {/* 3. Kolon: İletişim & Sosyal Medya */}
          <div className="flex flex-col gap-3 md:col-span-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
              {t.footer.connect}
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs text-ink-2">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{SITE.email}</span>
              </a>

              <a
                href={`tel:${SITE.phoneHref}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{SITE.phone}</span>
              </a>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-rule bg-surface text-ink transition-colors hover:border-ink hover:text-accent"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                </a>

                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-rule bg-surface text-ink transition-colors hover:border-ink hover:text-accent"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Telif ve Başa Dön Çubuğu */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-rule pt-6 text-xs text-ink-3 sm:flex-row">
          <p>
            © {year} <span className="font-medium text-ink">{SITE.name}</span>. {t.footer.rights}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={t.footer.backToTop}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-rule bg-surface text-ink hover:border-ink hover:text-accent transition-all cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
