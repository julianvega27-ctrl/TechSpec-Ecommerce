import React, { useEffect, useId, useRef } from 'react';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div hidden={!isOpen} inert={!isOpen || undefined} aria-hidden={!isOpen || undefined} className="ds-presence fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4">
      <div ref={dialogRef} role="dialog" aria-modal={isOpen || undefined} aria-labelledby={titleId} aria-describedby={messageId} className="ds-dialog-surface ds-card shadow-dialog w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 mb-6">
          <div className={`p-3 rounded-control shrink-0 ${variant === 'danger' ? 'bg-error-subtle text-error' : 'bg-accent-subtle text-accent'}`}>
            <AlertTriangle aria-hidden="true" size={24} />
          </div>
          <div>
            <h3 id={titleId} className="text-lg font-semibold text-primary mb-2">{title}</h3>
            <p id={messageId} className="text-sm text-text-secondary">{message}</p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
