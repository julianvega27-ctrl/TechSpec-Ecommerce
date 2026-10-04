import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-outline-subtle)] mt-auto">
      <div className="page-wrapper py-12">
        <div className="grid-container">
          <div className="col-span-12 md:col-span-4 flex justify-center md:justify-start mb-6 md:mb-0 items-center">
            <span className="font-bold text-xl text-[var(--color-obsidian)] tracking-tight">TECH<span className="text-accent">SPEC</span></span>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-wrap justify-center gap-x-6 items-center">
            <Link to="/terms" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] label-caps inline-flex min-h-11 items-center transition-colors">
              Términos
            </Link>
            <Link to="/privacy" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] label-caps inline-flex min-h-11 items-center transition-colors">
              Privacidad
            </Link>
            <Link to="/support" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-primary)] label-caps inline-flex min-h-11 items-center transition-colors">
              Soporte
            </Link>
          </div>
          <div className="col-span-12 md:col-span-4 mt-8 md:mt-0 flex justify-center md:justify-end items-center">
            <p className="text-center mono-data text-sm text-[var(--color-outline)]">
              &copy; {new Date().getFullYear()} TECHSPEC. ALGUNOS DERECHOS RESERVADOS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
