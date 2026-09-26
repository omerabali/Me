import React from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { useTranslation } from '../../lib/i18n/LanguageContext';
import { getLocalizedCategory } from '../../lib/i18n/projectLocalizer';
import type { Project } from '../../types/project';

interface EditorialProjectShowcaseProps {
  project: Project;
  index: number;
  onOpenModal: (project: Project) => void;
}

function getProjectScreenshot(project: Project): string {
  if (project.image_url && !project.image_url.includes('opengraph')) {
    return project.image_url;
  }
  const key = (project.slug || project.name || '').toLowerCase();
  if (key.includes('staj22001') || key.includes('beacon') || key.includes('rag')) {
    return '/project-beacon.png';
  }
  if (key.includes('skill-identity') || key.includes('identity')) {
    return '/project-skill-identity.png';
  }
  if (key.includes('medium') || key.includes('ai-medium') || key.includes('creator')) {
    return '/project-ai-medium.png';
  }
  return project.image_url || '';
}

export const EditorialProjectShowcase: React.FC<EditorialProjectShowcaseProps> = ({
  project,
  index,
  onOpenModal,
}) => {
  const { t, language } = useTranslation();
  const isReversed = index % 2 === 1;
  const screenshot = getProjectScreenshot(project);

  return (
    <article
      data-cursor="view"
      onClick={() => onOpenModal(project)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-rule bg-surface/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:shadow-2xl lg:grid lg:grid-cols-12 cursor-pointer"
    >
      {/* 1. GÖRSEL VİTRİN ALANI (7 Kolon - Siyah Arka Plan, Tam Görsel) */}
      <div
        className={`relative flex min-h-[280px] sm:min-h-[360px] lg:min-h-full w-full items-center justify-center overflow-hidden border-b border-rule/70 bg-[#07090e] p-3 sm:p-5 lg:p-6 ${
          isReversed
            ? 'lg:col-span-7 lg:col-start-6 lg:border-l'
            : 'lg:col-span-7 lg:border-r'
        }`}
      >
        {screenshot ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={screenshot}
              alt={project.display_name || project.name}
              className="max-h-[460px] w-full h-auto object-contain rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/40 text-ink-3 font-mono text-sm">
            {project.name}
          </div>
        )}

        {/* Sıra Numarası Filigranı */}
        <div className="pointer-events-none absolute bottom-4 right-5 font-mono text-6xl font-black text-white/10 sm:text-7xl select-none">
          0{index + 1}
        </div>
      </div>

      {/* 2. BİLGİ & EDİTORYAL METİN ALANI (5 Kolon) */}
      <div
        className={`flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 ${
          isReversed ? 'lg:col-start-1 lg:row-start-1' : ''
        }`}
      >
        <div>
          {/* Üst Kategori ve Canlı Demo Rozeti */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-rule/60 pb-4">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-accent uppercase">
              <Sparkles className="h-3 w-3" />
              <span>{getLocalizedCategory(project.category, language)}</span>
            </span>

            {project.homepage && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {t.featured.liveProduction}
              </span>
            )}
          </div>

          {/* Proje Başlığı */}
          <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-2xl">
            {project.display_name || project.name}
          </h3>

          {/* Proje Açıklaması */}
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            {project.description ||
              project.readme_summary ||
              'Software architecture and engineering solution.'}
          </p>

          {/* Öne Çıkan Mühendislik Vurguları (3 Madde) */}
          {project.features && project.features.length > 0 && (
            <div className="mt-5 space-y-2 border-t border-rule/40 pt-4">
              {project.features.slice(0, 3).map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-ink-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Teknoloji Etiketleri */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-rule bg-surface/80 px-2.5 py-1 font-mono text-[10px] font-medium text-ink-2"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Alt Aksiyon Butonları & Linkler */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-rule/60 pt-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-display text-xs font-bold text-white shadow-sm transition-all hover:bg-accent-deep hover:shadow-md"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t.featured.architectureReadme}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-surface px-3 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
              >
                <span>{t.featured.liveDemo}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-surface p-2 text-ink-2 hover:border-ink hover:text-ink transition-colors"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
