import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CircleAlert, CheckCircle2, ImageOff, LoaderCircle } from 'lucide-react';

export function Breadcrumb({ current, parent = { label: 'Inicio', to: '/' } }: { current: string; parent?: { label: string; to: string } }) {
  return <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-text-secondary mb-6 min-w-0">
    <Link to={parent.to} className="shrink-0 hover:text-accent transition-colors">{parent.label}</Link>
    <ChevronRight size={14} aria-hidden="true" className="shrink-0" />
    <span aria-current="page" className="truncate text-primary">{current}</span>
  </nav>;
}

export function PageHeading({ title, description }: { title: string; description?: string }) {
  return <header className="mb-6 sm:mb-8"><h1 className="ds-page-title text-primary">{title}</h1>{description && <p className="text-text-secondary mt-2">{description}</p>}</header>;
}

export function Notice({ children, variant = 'error' }: { children: ReactNode; variant?: 'error' | 'success' | 'loading' }) {
  const Icon = variant === 'error' ? CircleAlert : variant === 'success' ? CheckCircle2 : LoaderCircle;
  return <div role={variant === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-control p-4 text-sm ${variant === 'error' ? 'bg-error-subtle text-error' : variant === 'success' ? 'bg-success-subtle text-success' : 'bg-background text-text-secondary'}`}>
    <Icon size={18} aria-hidden="true" className={`shrink-0 mt-0.5 ${variant === 'loading' ? 'ds-spinner' : ''}`} /><div className="min-w-0">{children}</div>
  </div>;
}

export function ProductImage({ src, name, className = '' }: { src?: string | null; name: string; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  return <div className={`flex items-center justify-center bg-background overflow-hidden ${className}`}>
    {src && failed !== src ? <img src={src} alt={name} width={640} height={480} className="w-full h-full object-contain" onError={() => setFailed(src)} /> : <div className="flex flex-col items-center justify-center gap-2 text-text-secondary text-center"><ImageOff size={24} aria-hidden="true" /><span className="text-xs">Imagen no disponible</span></div>}
  </div>;
}
