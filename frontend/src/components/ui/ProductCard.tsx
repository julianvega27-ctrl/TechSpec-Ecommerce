import React from 'react';
import { Link } from 'react-router-dom';

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  imageUrl,
}) => {
  return (
    <Link to={`/product/${id}`} className="group block h-full">
      <div className="relative h-full flex flex-col bg-transparent transition-all duration-300 border border-transparent hover:border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">

        <div className="relative aspect-square w-full bg-[var(--color-surface-container)] flex items-center justify-center p-4">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="object-contain w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400">
              <span className="label-caps">No Image</span>
            </div>
          )}

          {/* Hover overlay with metadata */}
          <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
            <span className="mono-data text-[var(--color-obsidian)] mb-2"></span>
            <span className="label-caps text-[var(--color-primary)]"></span>
          </div>
        </div>

        <div className="pt-4 pb-2 px-2 flex flex-col flex-grow">
          <p className="label-caps text-[var(--color-outline)] mb-1">{brand}</p>
          <h3 className="font-medium text-[var(--color-obsidian)] leading-tight mb-2 flex-grow">{name}</h3>
          <p className="mono-data text-lg font-bold text-[var(--color-obsidian)]">
            ${Number(price).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
