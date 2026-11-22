import { Link } from 'react-router-dom';
import clsx from 'clsx';

// One bordered strip with dividers rather than a row of floating cards.
// stats: [{ label, value, hint, to, tone? }]
export default function StatStrip({ stats }) {
  return (
    <div className="surface grid grid-cols-2 overflow-hidden lg:grid-cols-4">
      {stats.map((s, i) => (
        <Link
          key={s.label}
          to={s.to}
          className={clsx(
            'block px-5 py-4 text-inherit no-underline transition-colors hover:bg-ink-50 hover:no-underline',
            'border-ink-200',
            i % 2 === 1 && 'border-l',
            i >= 2 && 'border-t lg:border-t-0',
            i > 0 && 'lg:border-l'
          )}
        >
          <p className="eyebrow">{s.label}</p>
          <p
            className={clsx(
              'num mt-2 text-[28px] font-semibold leading-none tracking-tight',
              s.tone === 'warn' && s.value > 0 && 'text-warn-700',
              s.tone === 'danger' && s.value > 0 && 'text-danger-700',
              !s.tone && 'text-ink-900'
            )}
          >
            {s.value ?? '–'}
          </p>
          <p className="mt-2 text-xs text-ink-500">{s.hint}</p>
        </Link>
      ))}
    </div>
  );
}
