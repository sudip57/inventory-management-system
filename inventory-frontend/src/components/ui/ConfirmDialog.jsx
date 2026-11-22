import { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from './Modal';
import Button from './Button';

// onConfirm may be async. Errors are shown inline and keep the dialog open.
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  tone = 'danger',
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setBusy(false);
    }
  }

  return (
    <Modal title={title} size="sm" onClose={busy ? () => {} : onClose}>
      <ModalBody>
        <p className="text-sm">{message}</p>
        {error && <p className="mt-3 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p>}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant={tone} loading={busy} onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
