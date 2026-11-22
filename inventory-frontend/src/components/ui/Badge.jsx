import clsx from 'clsx';

const tones = {
  neutral: { wrap: 'bg-ink-100 text-ink-700', dot: 'bg-ink-400' },
  success: { wrap: 'bg-success-50 text-success-700', dot: 'bg-success-600' },
  warn: { wrap: 'bg-warn-50 text-warn-700', dot: 'bg-warn-600' },
  danger: { wrap: 'bg-danger-50 text-danger-700', dot: 'bg-danger-600' },
};

export default function Badge({ tone = 'neutral', dot = true, children }) {
  const t = tones[tone];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium',
        t.wrap
      )}
    >
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full', t.dot)} />}
      {children}
    </span>
  );
}
