import { NavLink } from 'react-router-dom';
import { AlertTriangle, Cpu, LayoutDashboard, Tags } from 'lucide-react';
import clsx from 'clsx';
import { APP_NAME, APP_TAGLINE } from '@/config';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/inventory', label: 'Inventory', icon: Cpu },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/stock-alerts', label: 'Stock alerts', icon: AlertTriangle },
];

export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded bg-ink-900 font-mono text-[11px] font-semibold text-white">
        SR
      </span>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold text-ink-900">{APP_NAME}</p>
        <p className="text-xs text-ink-500">{APP_TAGLINE}</p>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-ink-200 bg-white transition-transform',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-5 py-5">
          <Wordmark />
        </div>

        <nav className="flex-1 space-y-0.5 px-3" aria-label="Main">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors hover:no-underline',
                  isActive
                    ? 'bg-ink-100 text-ink-900'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                )
              }
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="px-5 py-4 text-xs text-ink-400">Inventory console</p>
      </aside>
    </>
  );
}
