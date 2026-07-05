import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white',
    secondary: 'bg-[var(--color-obsidian)] text-white',
    outline: 'bg-transparent text-[var(--color-obsidian)] border border-[var(--color-obsidian)]',
    error: 'bg-[var(--color-error)] text-white'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-badge)] label-caps ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-[var(--color-surface-container-high)] h-[2px]">
      <div 
        className="bg-[var(--color-primary)] h-[2px] transition-all duration-300"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  );
};
