import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import heroLaptop from '../assets/hero-laptop.jpg';
import './Hero.css';

// Photo source: https://images.unsplash.com/photo-1496181133206-80ce9b88a853

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="techspec-hero" aria-labelledby="hero-title">
      <div className="page-wrapper">
        <div className="hero-frame ds-card">
          <div className="hero-copy">
            <p className="flex items-center gap-2 text-sm font-medium text-accent mb-4">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Tecnología a tu medida
            </p>
            <h1 id="hero-title" className="hero-title text-primary">
              Dale potencia
              <span className="block text-accent">a tus ideas.</span>
            </h1>
            <p className="hero-description text-base text-text-secondary">
              Encuentra laptops, componentes y periféricos para trabajar, crear y jugar.
            </p>
            <Button type="button" size="lg" variant="primary" className="hero-cta w-full sm:w-auto self-start" onClick={() => navigate('/catalog')}>
              Explorar catálogo
              <ArrowRight aria-hidden="true" size={18} />
            </Button>
          </div>
          <div className="hero-media bg-surface-container">
            <img
              src={heroLaptop}
              alt="Laptop plateada abierta en un escritorio de madera claro"
              width={1440}
              height={960}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
