import type { ReactNode } from 'react';
import { CircleAlert, SearchX } from 'lucide-react';

interface CatalogStateProps {
  variant: 'empty' | 'error';
  title: string;
  description: string;
  action?: ReactNode;
}

export default function CatalogState({ variant, title, description, action }: CatalogStateProps) {
  const Icon = variant === 'error' ? CircleAlert : SearchX;
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className="ds-card flex flex-col items-center justify-center text-center min-h-72 px-6 py-10">
      <div className={`mb-4 rounded-card p-3 ${variant === 'error' ? 'bg-error-subtle text-error' : 'bg-accent-subtle text-accent'}`}>
        <Icon aria-hidden="true" size={28} strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold text-primary mb-2">{title}</h2>
      <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
