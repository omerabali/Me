import React from 'react';
import { cn } from '../../lib/utils/cn';

interface SectionHeadingProps {
  /** Dergi tarzı bölüm numarası, ör. "01". */
  index?: string;
  title: string;
  /** Sağ tarafa hizalanan aksiyon (ör. "Tümünü gör"). */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Bölüm başlığı: üstte ince kural çizgisi, solda numara + etiket,
 * sağda opsiyonel aksiyon. Tüm sayfalarda ritmi sabit tutar.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  title,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-6 border-t border-rule pt-4',
        className,
      )}
    >
      <h2 className="flex items-baseline gap-3 font-mono text-micro font-medium uppercase text-ink-2">
        {index && <span className="text-ink-3 tabular-nums">{index}</span>}
        <span>{title}</span>
      </h2>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
