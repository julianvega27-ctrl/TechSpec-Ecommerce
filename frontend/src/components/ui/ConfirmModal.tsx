import React from 'react';
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
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-subtle)] rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 mb-6">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-full shrink-0">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-obsidian)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--color-obsidian-light)]">{message}</p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto !bg-red-600 hover:!bg-red-700 focus:ring-red-500 text-white border-transparent"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
