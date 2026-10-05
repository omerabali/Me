import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Copy,
  Mail,
} from 'lucide-react';
import { useProjects } from '../lib/hooks/useProjects';
import { FEATURED_PRIORITY_SLUGS } from '../lib/staticProjects';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { getLocalizedProject } from '../lib/i18n/projectLocalizer';
import { CountUp } from '../components/ui/CountUp';
import { Reveal } from '../components/ui/Reveal';
import { Skeleton } from '../components/ui/Skeleton';
import { Hero360Turntable } from '../components/ui/Hero360Turntable';
import { Marquee } from '../components/ui/Marquee';
import { EditorialProjectShowcase } from '../components/ui/EditorialProjectShowcase';

export const HomePage: React.FC = () => {
  const { projects, loading, total } = useProjects();
  const { t, language } = useTranslation();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('omerabali09@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const featured = useMemo(() => {
    const selected: typeof projects = [];

    for (const slug of FEATURED_PRIORITY_SLUGS) {
      const found = projects.find(
        (p) =>
          p.slug?.toLowerCase() === slug ||
          p.name?.toLowerCase() === slug ||
          p.slug?.toLowerCase().includes(slug) ||
          p.name?.toLowerCase().includes(slug)
      );
      if (found && !selected.some((s) => s.slug === found.slug)) {
        selected.push(found);
      }
    }

    if (selected.length < 3) {
      for (const p of projects) {
        if (!selected.some((s) => s.slug === p.slug)) {
          selected.push(p);
        }
        if (selected.length === 3) break;
      }
    }
    return selected.slice(0, 3).map((p) => getLocalizedProject(p, language));
  }, [projects, language]);

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-16 w-full overflow-hidden">
      {/* -------------------------------------------------------------------
          1. HERO BÖLÜMÜ — 360° DÖNEN KAHRAMAN SAHNESİ
      ------------------------------------------------------------------- */}
      <section className="w-full">
        <Hero360Turntable />
      </section>

      {/* -------------------------------------------------------------------
          2. KAYAN YAZI (MARQUEE) — GERÇEK TEKNİK ALTYAPI (DİNAMİK ÇEVİRİ)
      ------------------------------------------------------------------- */}
      <section className="w-full -my-8">
        <Marquee items={t.home.marqueeItems} />
      </section>

      {/* -------------------------------------------------------------------
          3. HAKKIMDA & MÜHENDİSLİK FELSEFESİ (ÖMER ABALI KİMLİĞİ)
      ------------------------------------------------------------------- */}
      <section className="shell">
        <Reveal>
          <div className="border-t border-rule pt-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
              {/* Sol Kolon: Manifesto Cümlesi */}
              <div className="lg:col-span-6">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
                  {t.home.manifestoTitle}
                </h2>
                <div className="mt-8">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-accent transition-colors"
                  >
                    <span>{t.home.readJourney}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Sağ Kolon: Anlatı + Saf Tipografik İstatistikler */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <p className="text-base sm:text-lg leading-relaxed text-ink-2 font-normal">
                  {t.home.manifestoBio}
                </p>

                {/* Temiz Tipografik Sayılar */}
                <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-10 border-t border-rule pt-8">
                  <div>
                    <div className="font-display text-3xl sm:text-5xl font-black text-ink tracking-tight">
                      {loading ? <Skeleton className="h-10 w-16" /> : <CountUp end={Math.max(total, 60)} />}
                    </div>
                    <span className="font-mono text-[11px] text-ink-3 uppercase tracking-wider block mt-1 font-semibold">
                      {t.home.statRepos}
                    </span>
                  </div>

                  <div>
                    <div className="font-display text-3xl sm:text-5xl font-black text-ink tracking-tight">
                      <CountUp end={3.62} decimals={2} />
                    </div>
                    <span className="font-mono text-[11px] text-ink-3 uppercase tracking-wider block mt-1 font-semibold">
                      {t.home.statHonors}
                    </span>
                  </div>

                  <div>
                    <div className="font-display text-3xl sm:text-5xl font-black text-ink tracking-tight">
                      400+
                    </div>
                    <span className="font-mono text-[11px] text-ink-3 uppercase tracking-wider block mt-1 font-semibold">
                      {t.home.statAlgorithms}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------------
          4. SEÇİLMİŞ ÇALIŞMALAR (PROJELER)
      ------------------------------------------------------------------- */}
      <section className="shell">
        <Reveal>
          <div className="border-t border-rule pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
                  {t.home.featuredHeading}
                </h2>
              </div>

              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:text-accent transition-colors"
              >
                <span>{t.home.viewAllRepos} ({Math.max(total, 60)})</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Geniş Format Editoryal Proje Kartları */}
            <div className="flex flex-col gap-10">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="neo-card p-8 min-h-[380px]">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="mt-4 h-32 w-full" />
                    </div>
                  ))
                : featured.map((project, idx) => (
                    <EditorialProjectShowcase
                      key={project.slug || project.name}
                      project={project}
                      index={idx}
                    />
                  ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------------
          5. UZMANLIK ALANLARI VE HİZMETLER
      ------------------------------------------------------------------- */}
      <section className="shell">
        <Reveal>
          <div className="border-t border-rule pt-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
              {t.home.servicesTitle}
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-ink-2">
              {t.home.servicesSubtitle}
            </p>

            {/* Numaralandırılmış Editoryal Izgara */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 border-t border-rule pt-10">
              {t.home.services.map((service, sIdx) => (
                <div key={sIdx} className="flex flex-col justify-between border-b border-rule/50 pb-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2">
                      {service.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] text-ink-3 uppercase tracking-wider font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------------
          6. NEDEN BİRLİKTE ÇALIŞMALIYIZ (ÇALIŞMA PRENSİPLERİ)
      ------------------------------------------------------------------- */}
      <section className="shell">
        <Reveal>
          <div className="border-t border-rule pt-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
              {t.home.whyWorkTitle}
            </h2>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.home.whyWorkItems.map((item) => (
                <div key={item.number} className="border-l border-rule pl-5">
                  <span className="font-mono text-xs text-ink-3 font-bold">{item.number}</span>
                  <h4 className="mt-2 font-display text-lg font-bold text-ink">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-ink-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------------
          7. BÜYÜK FİNAL ÇAĞRISI (İLETİŞİM)
      ------------------------------------------------------------------- */}
      <section className="shell">
        <Reveal>
          <div className="border-t border-rule pt-16 sm:pt-24 pb-16">
            {/* Büyük Tipografik Çağrı */}
            <div>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-ink tracking-tighter uppercase leading-[0.95]">
                {t.home.finalCtaTitle}
              </h2>
            </div>

            {/* Tek Tıkla E-posta Kopyalama & Aksiyonlar */}
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group relative inline-flex items-center gap-3 rounded-2xl border border-rule bg-surface px-6 py-4 font-mono text-sm sm:text-base font-bold text-ink shadow-md hover:border-ink hover:bg-surface-hover active:scale-98 transition-all cursor-pointer"
              >
                <Mail className="h-4 w-4 text-accent" />
                <span>omerabali09@gmail.com</span>
                {copiedEmail ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <Check className="h-3.5 w-3.5" /> {t.home.copied}
                  </span>
                ) : (
                  <Copy className="h-3.5 w-3.5 text-ink-3 group-hover:text-ink transition-colors" />
                )}
              </button>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-ink px-8 py-4 font-display text-sm sm:text-base font-bold text-paper shadow-xl hover:opacity-90 active:scale-98 transition-all"
              >
                <span>{t.home.sendMessage}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
};
