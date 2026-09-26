import React from 'react';
import { useInView } from '../../lib/hooks/useInView';
import { cn } from '../../lib/utils/cn';

interface RevealProps {
  children: React.ReactNode;
  /** Kademeli giriş için gecikme (ms). */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
}

/**
 * İçeriği yalnızca viewport'a girdiğinde açığa çıkarır.
 * Hareket azaltma tercihi CSS tarafında otomatik olarak devreye girer.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-visible={inView ? 'true' : 'false'}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={cn('reveal', className)}
    >
      {children}
    </Tag>
  );
};
