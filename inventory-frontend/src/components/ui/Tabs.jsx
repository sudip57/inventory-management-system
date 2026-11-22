import clsx from 'clsx';

// tabs: [{ id, label, count? }]
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-6 border-b border-ink-200" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={clsx(
              '-mb-px flex items-center gap-2 border-b-2 pb-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-brand-600 text-ink-900'
                : 'border-transparent text-ink-500 hover:text-ink-800'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'num rounded px-1.5 py-px text-xs',
                  isActive ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
