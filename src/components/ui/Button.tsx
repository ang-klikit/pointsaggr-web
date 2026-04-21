import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leading?: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 disabled:bg-brand-200',
  secondary:
    'bg-canvas-muted text-ink hover:bg-ink/5 active:bg-ink/10 disabled:text-ink-subtle',
  ghost:
    'bg-transparent text-ink hover:bg-ink/5 active:bg-ink/10 disabled:text-ink-subtle',
  danger:
    'bg-danger text-white hover:opacity-90 active:opacity-80 disabled:opacity-60',
};

const SIZES: Record<Size, string> = {
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-14 px-6 text-base rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', fullWidth, leading, className = '', children, ...rest },
  ref,
) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed select-none';

  return (
    <button
      ref={ref}
      className={[base, VARIANTS[variant], SIZES[size], fullWidth ? 'w-full' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {leading}
      {children}
    </button>
  );
});
