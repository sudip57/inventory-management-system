import clsx from 'clsx';
import Spinner from './Spinner';

const variants = {
  primary: 'border-transparent bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border-ink-300 bg-white text-ink-800 hover:bg-ink-100',
  ghost: 'border-transparent bg-transparent text-ink-700 hover:bg-ink-100',
  danger: 'border-transparent bg-danger-600 text-white hover:bg-danger-700',
};

const sizes = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-sm',
};

export default function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
