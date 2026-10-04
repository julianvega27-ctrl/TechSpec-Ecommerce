import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'error' | 'success' | 'warning';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-accent-subtle text-accent',
    secondary: 'bg-surface-container text-primary',
    outline: 'bg-card text-primary border border-border',
    error: 'bg-error-subtle text-error',
    success: 'bg-success-subtle text-success',
    warning: 'bg-warning-subtle text-warning'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-badge text-xs font-medium leading-4 ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div role="progressbar" aria-label="Progreso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 100) : 0} className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
      <div
        className="bg-accent h-full origin-left transition-transform duration-[var(--motion-normal)]"
        style={{ transform: `scaleX(${Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 100) / 100 : 0})` }}
      />
    </div>
  );
};

export const FullScreenLoader: React.FC = () => {
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-background z-50">
      <div aria-hidden="true" className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full ds-spinner"></div>
      <span className="text-sm text-text-secondary">Cargando...</span>
    </div>
  );
};
