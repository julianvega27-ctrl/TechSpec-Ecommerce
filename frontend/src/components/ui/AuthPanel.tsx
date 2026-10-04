import type { ReactNode } from 'react';
import { UserRound } from 'lucide-react';
import { Notice } from './Interior';

export default function AuthPanel({ title, description, error, children }: { title: string; description: ReactNode; error: string; children: ReactNode }) {
  return <div className="auth-page page-wrapper py-8 sm:py-12 flex justify-center">
    <section aria-labelledby="auth-title" className="ds-card w-full max-w-[480px] p-5 sm:p-8">
      <div className="w-11 h-11 flex items-center justify-center rounded-card bg-accent-subtle text-accent mb-5"><UserRound size={22} aria-hidden="true" /></div>
      <h1 id="auth-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">{title}</h1>
      <p className="text-sm text-text-secondary mt-2 mb-6 leading-relaxed">{description}</p>
      {error && <div className="mb-5"><Notice>{error}</Notice></div>}
      {children}
    </section>
  </div>;
}

export function AuthDivider() {
  return <div className="flex items-center gap-3 text-xs text-text-secondary my-6"><span className="h-px flex-1 bg-border" /><span>O continúa con Google</span><span className="h-px flex-1 bg-border" /></div>;
}
