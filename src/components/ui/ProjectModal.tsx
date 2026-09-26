import React from 'react';
import { ArrowUpRight, BookOpen, Code2, ExternalLink, GitFork, Star, X } from 'lucide-react';
import { GithubIcon } from './Icons';
import { MarkdownViewer } from './MarkdownViewer';
import { useTranslation } from '../../lib/i18n/LanguageContext';
import { getLocalizedCategory } from '../../lib/i18n/projectLocalizer';
import type { Project } from '../../types/project';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t, language } = useTranslation();

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-rule bg-surface shadow-2xl overflow-hidden">
        {/* Modal Başlık Çubuğu */}
        <div className="flex items-center justify-between border-b border-rule px-6 py-4 bg-paper/60 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base md:text-lg font-bold text-ink">
                {project.display_name || project.name}
              </h3>
              <span className="text-xs font-mono text-ink-3">
                {getLocalizedCategory(project.category, language)} · {project.name}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.modal.close}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rule bg-surface text-ink-2 hover:border-ink hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal İçeriği */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* İstatistik ve Bağlantı Çubuğu */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-paper p-4">
            <div className="flex items-center gap-5 text-xs text-ink-2">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <strong>{project.stars}</strong> {t.modal.stars}
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork className="h-4 w-4 text-ink-3" />
                <strong>{project.forks}</strong> {t.modal.forks}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rule bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:border-ink shadow-2xs transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>{t.modal.viewOnGithub}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}

              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-deep shadow-xs transition-colors"
                >
                  <span>{t.modal.liveDemo}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Gerçek Sistem Ekran Görüntüsü */}
          {project.image_url && !project.image_url.includes('opengraph') && (
            <div className="overflow-hidden rounded-2xl border border-rule bg-[#07090e] p-2 flex items-center justify-center shadow-md">
              <img
                src={project.image_url}
                alt={project.display_name || project.name}
                className="w-full max-h-[500px] object-contain rounded-xl block border border-white/10"
              />
            </div>
          )}

          {/* Teknolojiler */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div>
              <h4 className="font-mono text-xs font-bold uppercase text-ink-3 mb-2.5">
                {t.modal.techStack}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="skill-pill text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Canlı Formatlı README & Dokümantasyon */}
          <div className="border-t border-rule/60 pt-6">
            <h4 className="font-mono text-xs font-bold uppercase text-ink-3 mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>{t.modal.readmeTitle}</span>
            </h4>

            <div className="rounded-2xl border border-rule bg-paper p-6 shadow-xs select-text">
              <MarkdownViewer
                content={
                  project.readme_raw ||
                  project.readme_detail ||
                  `# ${project.display_name || project.name}\n\n${
                    project.description || project.readme_summary || 'README content not available.'
                  }`
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
