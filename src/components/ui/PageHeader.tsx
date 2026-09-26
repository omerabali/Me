import React from 'react';

interface PageHeaderProps {
  /** Dergi tarzı bölüm işareti, ör. "Bölüm 02". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Sağ üstte gösterilen kısa istatistik/meta bilgisi. */
  meta?: React.ReactNode;
}

/**
 * Tüm iç sayfalarda ortak başlık bloğu.
 * Sayfalar arasında dikey ritmi ve hiyerarşiyi sabitler.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  meta,
}) => {
  return (
    <header className="border-b border-rule pb-12 pt-16 md:pt-24">
      <p className="font-mono text-micro uppercase text-ink-3">{eyebrow}</p>

      <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h1 className="text-h1 text-ink">{title}</h1>
        {meta && <div className="shrink-0 md:text-right">{meta}</div>}
      </div>

      {description && (
        <p className="measure mt-6 text-lead text-ink-2">{description}</p>
      )}
    </header>
  );
};
