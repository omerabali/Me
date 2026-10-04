import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  ExternalLink,
  Search,
  Star,
} from 'lucide-react';
import { useProjects } from '../lib/hooks/useProjects';
import { Reveal } from '../components/ui/Reveal';
import { Skeleton } from '../components/ui/Skeleton';
import { GithubIcon } from '../components/ui/Icons';
import { useTranslation } from '../lib/i18n/LanguageContext';
import {
  CANONICAL_CATEGORIES,
  normalizeCategoryKey,
  getLocalizedCategory,
  getLocalizedProject,
} from '../lib/i18n/projectLocalizer';
const ALL = 'all';

export const ProjectsPage: React.FC = () => {
  const { projects, loading, error, reload } = useProjects();
  const { t, language } = useTranslation();
  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const localizedProjects = useMemo(() => {
    return projects.map((p) => getLocalizedProject(p, language));
  }, [projects, language]);

  const categories = useMemo(() => {
    return [ALL, ...CANONICAL_CATEGORIES];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(language === 'tr' ? 'tr' : 'en');

    const result = localizedProjects.filter((p) => {
      const rawProject = projects.find((rp) => rp.slug === p.slug || rp.name === p.name);

      // 1. Kategori Kontrolü (Normalize edilmiş 4 ana kategoriyle %100 kusursuz eşleşme)
      const projectCatKey = normalizeCategoryKey(p.category || rawProject?.category);
      if (category !== ALL && projectCatKey !== category) {
        return false;
      }

      if (!q) return true;

      // 2. Akıllı Arama Kontrolü
      const name = (p.name || '').toLocaleLowerCase('en');
      const displayName = (p.display_name || '').toLocaleLowerCase(language === 'tr' ? 'tr' : 'en');
      const slug = (p.slug || '').toLocaleLowerCase('en');
      const tech = (p.tech_stack || []).map((t) => t.toLocaleLowerCase('en'));
      const catLocalized = (p.category || '').toLocaleLowerCase(language === 'tr' ? 'tr' : 'en');

      // A) İsim veya Başlık doğrudan eşleşmesi (örn: "me" yazınca repo adı "Me" olan proje anında eşleşir)
      if (name === q || slug === q || displayName === q) return true;
      if (name.includes(q) || slug.includes(q) || displayName.includes(q)) return true;

      // B) Teknoloji veya Kategori eşleşmesi (örn: "react", "dart", "python")
      if (tech.some((t) => t.includes(q)) || catLocalized.includes(q)) return true;

      // C) Sadece 3 harften uzun aramalarda açıklama/README metnine bak
      // (Böylece 2 harfli "me" arandığında "değerlendirme" veya "geliştirme" gibi kelimeler yanlışlıkla eşleşmez!)
      if (q.length > 2) {
        const desc = (p.description || '').toLocaleLowerCase(language === 'tr' ? 'tr' : 'en');
        const readme = (p.readme_summary || '').toLocaleLowerCase(language === 'tr' ? 'tr' : 'en');
        if (desc.includes(q) || readme.includes(q)) return true;
      }

      return false;
    });

    return result.sort((a, b) => {
      // Arama yapılıyorsa tam isim eşleşenleri (örn: "Me") listenin en tepesine al
      if (q) {
        const aExact = a.name?.toLowerCase() === q || a.slug?.toLowerCase() === q;
        const bExact = b.name?.toLowerCase() === q || b.slug?.toLowerCase() === q;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts = a.name?.toLowerCase().startsWith(q) || a.display_name?.toLowerCase().startsWith(q);
        const bStarts = b.name?.toLowerCase().startsWith(q) || b.display_name?.toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
      }

      const orderA = a.sort_order ?? 9999;
      const orderB = b.sort_order ?? 9999;
      if (orderA !== orderB) return orderA - orderB;
      const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
      const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });
  }, [localizedProjects, projects, category, query, language]);

  return (
    <div className="shell py-12 md:py-16">
      {/* -------------------------------------------------------------------
          BAŞLIK & AÇIKLAMA (i18n Destekli Başlık)
      ------------------------------------------------------------------- */}
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            {t.projects.titlePrefix}{' '}
            <span className="text-accent">{t.projects.titleHighlight}</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-2 md:text-base">
            {t.projects.subtitle}
          </p>
        </Reveal>
      </div>

      {/* -------------------------------------------------------------------
          FİLTRE & ARAMA ÇUBUĞU
      ------------------------------------------------------------------- */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-b border-rule pb-6 sm:flex-row">
        {/* Kategori Butonları */}
        <div
          role="group"
          aria-label="Kategori filtresi"
          className="flex flex-wrap items-center gap-2"
        >
          {categories.map((cat) => {
            const active = category === cat;
            const label = cat === ALL ? t.projects.allFilter : getLocalizedCategory(cat, language);
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-accent text-white shadow-xs'
                    : 'border border-rule bg-surface text-ink-2 hover:border-ink hover:text-ink'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Arama Kutusu */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.projects.searchPlaceholder}
            aria-label={t.projects.searchPlaceholder}
            className="w-full rounded-xl border border-rule bg-surface py-2 pl-10 pr-4 text-xs text-ink placeholder:text-ink-3 transition-colors focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* -------------------------------------------------------------------
          PROJE KARTLARI IZGARASI (Screenshot 3 Referansı)
      ------------------------------------------------------------------- */}
      <div className="mt-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="neo-card p-6">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="mt-4 h-6 w-3/4" />
                <Skeleton className="mt-2 h-14 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="neo-card p-12 text-center">
            <p className="text-base font-bold text-ink">{error}</p>
            <button
              onClick={reload}
              className="mt-4 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-paper"
            >
              Yeniden Dene
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="neo-card p-12 text-center">
            <p className="text-base font-bold text-ink">{t.projects.noResults}</p>
            <p className="mt-1 text-xs text-ink-2">{t.projects.noResultsHint}</p>
            <button
              onClick={() => {
                setCategory(ALL);
                setQuery('');
              }}
              className="mt-4 rounded-xl border border-rule bg-surface px-4 py-2 text-xs font-semibold text-ink"
            >
              {t.projects.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.slug || project.name} delay={(i % 6) * 50}>
                <article className="neo-card group flex h-full flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60">
                  {/* Üst Kart Önizleme / Görsel Alanı */}
                  <Link
                    to={`/projects/${project.slug || project.name}`}
                    className="relative flex h-44 w-full cursor-pointer items-center justify-center overflow-hidden border-b border-rule bg-linear-to-br from-surface to-paper-sunk p-6"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                        <Code2 className="h-6 w-6" />
                      </div>
                      <span className="mt-2 font-display text-sm font-bold text-ink">
                        {project.display_name || project.name}
                      </span>
                    </div>

                    {/* Kategori Rozeti */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md border border-rule bg-surface/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-accent uppercase backdrop-blur-xs">
                        {project.category || 'Software'}
                      </span>
                    </div>

                    {/* Yıldız Rozeti */}
                    {project.stars > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md border border-rule bg-surface/90 px-2 py-0.5 text-[11px] font-semibold text-ink-2 backdrop-blur-xs">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>{project.stars}</span>
                      </div>
                    )}
                  </Link>

                  {/* Kart İçeriği & Açıklaması */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h2 className="font-display text-base font-bold text-ink transition-colors group-hover:text-accent">
                        <Link to={`/projects/${project.slug || project.name}`}>
                          {project.display_name || project.name}
                        </Link>
                      </h2>

                      <p className="mt-2 text-xs leading-relaxed text-ink-2 line-clamp-3">
                        {project.description ||
                          project.readme_summary ||
                          'Modern software and architecture solution.'}
                      </p>
                    </div>

                    {/* Alt Bölüm: Teknolojiler ve Aksiyonlar */}
                    <div className="mt-6 border-t border-rule/60 pt-4">
                      {/* Teknoloji Etiketleri */}
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {(project.tech_stack || []).slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-rule bg-surface px-2 py-0.5 text-[10px] font-medium text-ink-3"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Aksiyon Butonları & Linkleri */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub Code"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-2 hover:text-ink transition-colors"
                            >
                              <GithubIcon className="h-3.5 w-3.5" />
                              <span>{t.projects.code}</span>
                            </a>
                          )}

                          {project.has_readme === true && (
                            <Link
                              to={`/projects/${project.slug || project.name}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-deep transition-colors"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{t.projects.readme}</span>
                            </Link>
                          )}
                        </div>

                        {(project.demo_url || project.homepage) && (
                          <a
                            href={project.demo_url || project.homepage || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-2 hover:text-ink"
                          >
                            <span>{t.projects.demo}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
