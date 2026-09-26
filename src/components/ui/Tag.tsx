import React from 'react';
import { cn } from '../../lib/utils/cn';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Teknoloji/kategori etiketi. Editoryal dile uygun biçimde
 * dolgu yerine ince kenarlıkla tanımlanır.
 */
export const Tag: React.FC<TagProps> = ({ children, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-rule bg-surface',
        'px-2.5 py-0.5 font-mono text-[0.6875rem] leading-5 text-ink-2',
        className,
      )}
    >
      {children}
    </span>
  );
};
