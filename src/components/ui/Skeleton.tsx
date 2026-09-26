import React from 'react';
import { cn } from '../../lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

/** Tek bir yükleme bloğu (parıltı efektli). */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded bg-paper-sunk',
      'after:absolute after:inset-0 after:-translate-x-full',
      'after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent',
      'after:animate-[shimmer_1.6s_infinite]',
      className,
    )}
  />
);

/** Proje listesi için satır iskeleti. */
export const ProjectRowSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-12">
    <div className="space-y-3 md:col-span-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="space-y-2 md:col-span-5">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div className="flex gap-2 md:col-span-3 md:justify-end">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);
