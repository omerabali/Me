import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  GitFork,
  ListTree,
  Share2,
  Star,
  Check,
  Loader2,
} from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';
import { ReadmeView } from '../components/ui/ReadmeView';
import { fetchPublicProjectDetail } from '../lib/apiClient';
import { getStaticProjectDetail } from '../lib/staticProjects';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { getLocalizedCategory } from '../lib/i18n/projectLocalizer';
import type { ProjectDetail } from '../types/project';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTranslation();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sayfa başlığını ve meta açıklamasını dinamik güncelle
  useEffect(() => {
    if (project) {
      const title = `${project.display_name || project.title_tr || project.name} | Ömer Abalı`;
      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', project.description || project.description_tr || '');
      }
    }
  }, [project]);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    setError(null);

    fetchPublicProjectDetail(slug)
      .then((data) => {
        if (!active) return;
        if (data) {
          setProject(data);
          return;
        }
        const fallback = getStaticProjectDetail(slug);
        if (fallback) {
          setProject(fallback);
        } else {
          setError('Proje bulunamadı.');
        }
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Proje detayı API hatası, statik README deneniyor:', err);
        const fallback = getStaticProjectDetail(slug);
        if (fallback) {
          setProject(fallback);
          setError(null);
        } else {
          setError('Proje detayları ve README yüklenemedi. Lütfen tekrar deneyin.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  // README içindeki başlıklardan (h1, h2, h3) otomatik İçindekiler Tablosu (TOC) çıkar
  const tableOfContents = useMemo<HeadingItem[]>(() => {
    if (!project?.readme_markdown) return [];
    const lines = project.readme_markdown.split('\n');
    const items: HeadingItem[] = [];

    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim().replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        // rehype-slug algoritmasıyla uyumlu id
        const id = rawText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id, text: rawText, level });
      }
    }
    return items;
  }, [project?.readme_markdown]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
        <p className="mt-4 text-sm font-semibold text-ink-2">Proje ve README yükleniyor...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="neo-card p-10">
          <h1 className="font-display text-xl font-bold text-ink">Proje Bulunamadı</h1>
          <p className="mt-2 text-sm text-ink-2">{error || 'İstediğiniz proje mevcut değil veya kaldırılmış olabilir.'}</p>
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-xs font-semibold text-paper transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tüm Projelere Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = getLocalizedCategory(project.category, language);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Üst Navigasyon & Aksiyonlar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-5">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-xl border border-rule bg-surface px-4 py-2 text-xs font-semibold text-ink hover:border-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Tüm Projelere Dön</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-surface px-3 py-2 text-xs font-medium text-ink-2 hover:border-ink hover:text-ink transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          <span>{copied ? 'Bağlantı Kopyalandı' : 'Paylaş'}</span>
        </button>
      </div>

      {/* Proje Başlık Alanı */}
      <div className="neo-card mb-8 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block rounded-md border border-rule bg-surface px-2.5 py-1 text-[11px] font-bold tracking-wider text-accent uppercase">
              {categoryName}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {project.display_name || project.title_tr || project.name}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-ink-2">
              {project.description || project.description_tr}
            </p>
          </div>

          {/* Dış Bağlantılar (Kod & Demo) */}
          <div className="flex flex-wrap items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-paper transition-transform hover:-translate-y-0.5"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Kod</span>
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-rule bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:border-ink transition-colors"
              >
                <span>Canlı Demo</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Teknoloji Rozetleri & Metrikler */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule/60 pt-4 text-xs text-ink-3">
          <div className="flex flex-wrap gap-1.5">
            {(project.tech_stack || []).map((t) => (
              <span
                key={t}
                className="rounded-md border border-rule bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-2"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {project.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <strong>{project.stars}</strong> Yıldız
              </span>
            )}
            {project.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                <strong>{project.forks}</strong> Fork
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ana Gövde: 2 Sütun (Sol: README, Sağ: Sticky TOC) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sol Kolon: README Render Alanı */}
        <div className="lg:col-span-3">
          <div className="neo-card p-6 sm:p-10">
            {project.readme_markdown ? (
              <ReadmeView
                repo={project.repo_name || project.slug}
                md={project.readme_markdown}
              />
            ) : (
              <div className="py-12 text-center text-ink-3">
                <Code2 className="mx-auto h-10 w-10 opacity-40 mb-3" />
                <p className="text-sm">Bu proje için henüz bir README dokümantasyonu eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Kolon: İçindekiler (TOC - Sticky) */}
        <div className="hidden lg:block lg:col-span-1">
          {tableOfContents.length > 0 && (
            <div className="sticky top-24 neo-card p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-rule pb-2 font-display text-xs font-bold text-ink uppercase tracking-wider">
                <ListTree className="h-4 w-4 text-accent" />
                <span>İçindekiler</span>
              </div>
              <nav className="max-h-[75vh] overflow-y-auto space-y-1.5 text-xs">
                {tableOfContents.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                    className="block truncate text-ink-3 hover:text-accent transition-colors py-0.5"
                    title={item.text}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
