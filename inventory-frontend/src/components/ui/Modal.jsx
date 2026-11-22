import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';
import IconButton from './IconButton';

const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

function useOverlay(onClose) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);
}

export default function Modal({ title, description, size = 'md', onClose, children }) {
  useOverlay(onClose);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'relative flex max-h-[92vh] w-full flex-col rounded-t-xl bg-white shadow-panel sm:rounded-lg',
          widths[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-200 px-6 py-4">
          <div>
            <h2>{title}</h2>
            {description && <p className="mt-0.5 text-sm">{description}</p>}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
            <X size={18} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ModalBody({ className, children }) {
  return <div className={clsx('min-h-0 flex-1 overflow-y-auto px-6 py-5', className)}>{children}</div>;
}

export function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-ink-200 bg-ink-50 px-6 py-3.5 sm:rounded-b-lg">
      {children}
    </div>
  );
}
