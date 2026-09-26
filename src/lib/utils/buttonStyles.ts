import { cn } from './cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ' +
  'transition-[background-color,color,border-color] duration-200 ease-editorial ' +
  'disabled:pointer-events-none disabled:opacity-50 cursor-pointer';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-paper border border-ink hover:bg-accent hover:border-accent',
  secondary:
    'bg-transparent text-ink border border-rule-strong hover:border-ink hover:bg-surface',
  ghost: 'bg-transparent text-ink-2 border border-transparent hover:text-ink',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-meta rounded-full',
  md: 'h-11 px-6 text-meta rounded-full',
};

/**
 * Buton görsel stilleri.
 * Bileşenden ayrı tutulur; böylece `<Link>` / `<a>` gibi elemanlara da
 * uygulanabilir ve React Fast Refresh bozulmaz.
 */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}
