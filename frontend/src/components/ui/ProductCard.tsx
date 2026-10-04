import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ImageOff, ShoppingCart } from 'lucide-react';
import Button from './Button';
import './ProductCard.css';

export interface ProductCardProps {
  id: string;
  name: string;
  brand?: string | null;
  price?: number | string | null;
  imageUrl?: string | null;
  description?: string | null;
  category?: { name: string } | string | null;
  stock?: number | null;
  onAddToCart?: (productId: string) => Promise<boolean>;
}

const priceFormatter = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ProductCard: React.FC<ProductCardProps> = ({
  id, name, brand, price, imageUrl, description, category, stock, onAddToCart,
}) => {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const hasImage = !!imageUrl && failedImage !== imageUrl;
  const imageLoaded = loadedImage === imageUrl;
  const numericPrice = price == null || (typeof price === 'string' && !price.trim()) ? NaN : Number(price);
  const hasPrice = Number.isFinite(numericPrice);
  const categoryName = typeof category === 'string' ? category : category?.name;
  const information = description?.trim() || (categoryName !== 'UNCATEGORIZED' ? categoryName : undefined);
  const knownStock = typeof stock === 'number' && Number.isFinite(stock);
  const canPurchase = !!onAddToCart && knownStock;
  const outOfStock = knownStock && stock <= 0;

  const handleAdd = async () => {
    if (!onAddToCart || outOfStock || purchaseStatus === 'loading') return;
    setPurchaseStatus('loading');
    try {
      const added = await onAddToCart(id);
      setPurchaseStatus(added ? 'success' : 'idle');
    } catch {
      setPurchaseStatus('error');
    }
  };

  return (
    <article className="product-card ds-card" aria-label={name}>
      <Link to={`/product/${id}`} aria-label={`Ver ${name}`} className="product-card-media">
        {hasImage ? (
          <>
            {!imageLoaded && <div aria-hidden="true" className="product-image-placeholder skeleton-shape" />}
            <img
              src={imageUrl}
              alt={name}
              width={640}
              height={480}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoadedImage(imageUrl)}
              onError={() => setFailedImage(imageUrl)}
              className={`product-card-image ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-text-secondary text-center">
            <ImageOff aria-hidden="true" size={28} strokeWidth={1.5} />
            <span className="text-xs sm:text-sm">Imagen no disponible</span>
          </div>
        )}
      </Link>
      <div className="product-card-body">
        {brand && <p className="text-xs font-medium text-text-secondary mb-1 break-words">{brand}</p>}
        <h3 className="product-card-name">
          <Link to={`/product/${id}`} className="rounded-control hover:text-accent transition-colors duration-[var(--motion-fast)]">{name}</Link>
        </h3>
        {information && <p className="product-card-description text-sm text-text-secondary">{information}</p>}
        <div className="mt-auto pt-4">
          <p className={`mb-3 tabular-nums ${hasPrice ? 'text-xl font-semibold text-primary' : 'text-sm text-text-secondary'}`}>
            {hasPrice ? `$${priceFormatter.format(numericPrice)}` : 'Precio no disponible'}
          </p>
          {canPurchase ? (
            <Button
              type="button"
              fullWidth
              loading={purchaseStatus === 'loading'}
              disabled={outOfStock}
              onClick={() => { void handleAdd(); }}
              aria-label={outOfStock ? `${name}: sin stock` : `Añadir ${name} al carrito`}
              className="product-card-action"
              data-feedback={purchaseStatus}
            >
              {purchaseStatus !== 'loading' && (purchaseStatus === 'success' ? <Check aria-hidden="true" size={18} /> : <ShoppingCart aria-hidden="true" size={18} />)}
              {outOfStock ? 'Sin stock' : purchaseStatus === 'loading' ? 'Agregando…' : purchaseStatus === 'success' ? 'Añadido' : <span>Añadir<span className="hidden sm:inline"> al carrito</span></span>}
            </Button>
          ) : (
            <Link to={`/product/${id}`} className="product-card-detail">Ver producto</Link>
          )}
          <div className="product-card-feedback">
            {purchaseStatus === 'success' && <p role="status" className="ds-feedback-enter text-success">Producto añadido. <Link to="/cart" className="font-medium underline underline-offset-2">Ver carrito</Link></p>}
            {purchaseStatus === 'error' && <p role="alert" className="ds-feedback-enter text-error">No se pudo añadir. Inténtalo de nuevo.</p>}
          </div>
        </div>
      </div>
    </article>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div aria-hidden="true" className="product-card product-card-skeleton ds-card">
    <div className="product-card-media"><div className="product-image-placeholder skeleton-shape" /></div>
    <div className="product-card-body gap-3">
      <div className="skeleton-shape h-3 w-1/3 rounded" />
      <div className="skeleton-shape h-4 w-full rounded" />
      <div className="skeleton-shape h-4 w-3/4 rounded" />
      <div className="skeleton-shape h-3 w-full rounded mt-1" />
      <div className="skeleton-shape h-6 w-1/2 rounded mt-auto" />
      <div className="skeleton-shape h-11 w-full rounded-control" />
      <div className="h-9" />
    </div>
  </div>
);

export default ProductCard;
