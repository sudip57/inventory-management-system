import { useId } from 'react';
import clsx from 'clsx';

// Label + control + hint/error, wired together for accessibility.
function Field({ label, error, hint, className, children }) {
  return (
    <div className={className}>
      {label && <span className="field-label">{label}</span>}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger-700">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export function Input({ label, error, hint, className, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <input id={id} className={clsx('control', error && 'control-error')} {...props} />
      {error ? (
        <p className="mt-1.5 text-xs text-danger-700">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export function Textarea({ label, error, hint, className, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <textarea id={id} className={clsx('control', error && 'control-error')} {...props} />
      {error ? (
        <p className="mt-1.5 text-xs text-danger-700">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export function Select({ label, error, hint, className, children, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <select id={id} className={clsx('control', error && 'control-error')} {...props}>
        {children}
      </select>
      {error ? (
        <p className="mt-1.5 text-xs text-danger-700">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

export default Field;
