import clsx from 'clsx';

const tones = {
  default: 'text-ink-500 hover:bg-ink-100 hover:text-ink-900',
  danger: 'text-ink-500 hover:bg-danger-50 hover:text-danger-700',
};

export default function IconButton({ label, tone = 'default', className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
        'disabled:pointer-events-none disabled:opacity-40',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
