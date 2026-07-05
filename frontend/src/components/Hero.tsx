import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden border-b border-[var(--color-outline-subtle)]">
      <div className="page-wrapper py-16 md:py-32">
        <div className="grid-container">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-[var(--color-obsidian)] sm:text-5xl md:text-6xl mb-6">
              <span className="block xl:inline">PRECISIÓN EN</span>{' '}
              <span className="block text-[var(--color-primary)] xl:inline">MOVIMIENTO</span>
            </h1>
            <p className="text-lg text-[var(--color-obsidian-light)] mb-8 max-w-2xl">
              Equipamiento técnico de alto rendimiento diseñado para profesionales. Descubre nuestra nueva línea de periféricos mecánicos y hardware especializado con ingeniería de grado corporativo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog">
                <Button variant="primary" className="h-12 px-8 w-full sm:w-auto">
                  EXPLORAR CATÁLOGO
                </Button>
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 mt-12 lg:mt-0 relative aspect-video lg:aspect-square flex items-center justify-center bg-[var(--color-surface-container)] rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-surface-dim)] to-transparent opacity-30"></div>
            <div className="label-caps text-[var(--color-outline)] border border-[var(--color-outline)] px-4 py-2 rounded-[var(--radius-badge)]">
              RENDERIZADO DE HARDWARE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
