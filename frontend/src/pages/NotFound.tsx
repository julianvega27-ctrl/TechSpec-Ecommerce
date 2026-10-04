import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="page-wrapper py-12 sm:py-16 flex justify-center">
    <section className="ds-card max-w-lg w-full p-6 sm:p-10 text-center">
      <p className="text-accent font-semibold text-sm mb-3">Error 404</p>
      <h1 className="ds-page-title text-primary mb-4">Página no encontrada</h1>
      <p className="text-text-secondary mb-6">La página que buscas no está disponible.</p>
      <Link to="/" className="inline-flex min-h-12 items-center justify-center bg-primary text-white px-6 py-3 rounded-control font-medium hover:bg-primary-hover active:bg-primary transition-colors duration-200">Volver al inicio</Link>
    </section>
  </div>;
}