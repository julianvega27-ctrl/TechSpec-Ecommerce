import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TechSpecsTable, { type TechSpec } from '../components/ui/TechSpecsTable';
import { Badge } from '../components/ui/Indicators';
import CatalogState from '../components/ui/CatalogState';
import { Breadcrumb, Notice, ProductImage } from '../components/ui/Interior';
import { actionLinkClass, formatPrice } from '../utils/storefront';

interface Product {
  id: string; name: string; brand?: string; price?: number | string | null;
  imageUrl?: string; description?: string; stock?: number;
  category?: { name: string }; images?: { url: string }[]; specifications?: TechSpec[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      if (!id) { setLoading(false); return; }
      try {
        const response = await axios.get(`/products/${id}`);
        const payload = response.data.data || response.data;
        if (!cancelled) { setProduct(payload); setSelectedImage(payload.imageUrl || payload.images?.[0]?.url || null); }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally { if (!cancelled) setLoading(false); }
    };
    void fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (!product || addingToCart) return;
    setAddingToCart(true);
    setPurchaseError('');
    try {
      await axios.post('/cart', { productId: product.id, quantity });
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setPurchaseError('Hubo un error al agregar al carrito. Inténtalo de nuevo.');
    } finally { setAddingToCart(false); }
  };

  if (loading) return <div className="page-wrapper py-8"><Notice variant="loading">Cargando producto…</Notice></div>;
  if (!product) return <div className="page-wrapper py-8"><CatalogState variant="error" title="No pudimos mostrar este producto" description="El producto no está disponible o no se pudo cargar." action={<Link className={actionLinkClass} to="/catalog">Volver al catálogo</Link>} /></div>;
  const images = [product.imageUrl, ...(product.images || []).map(image => image.url)].filter((src): src is string => !!src);
  const knownStock = typeof product.stock === 'number' && Number.isFinite(product.stock);

  return <div className="product-detail-page page-wrapper py-8 lg:py-10">
    <Breadcrumb current={product.name} parent={{ label: 'Catálogo', to: '/catalog' }} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <section aria-label="Imágenes del producto" className="min-w-0 space-y-4">
        <ProductImage src={selectedImage} name={product.name} className="ds-card aspect-[4/3] p-6 sm:p-8" />
        {images.length > 1 && <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`Ver imagen ${index + 1} de ${product.name}`} aria-pressed={selectedImage === src} onClick={() => setSelectedImage(src)} className={`ds-card min-h-11 aspect-square p-2 hover:border-accent transition-colors duration-200 ${selectedImage === src ? 'border-accent ring-1 ring-accent' : ''}`}>
            <ProductImage src={src} name="" className="w-full h-full rounded-control" />
          </button>)}
        </div>}
      </section>
      <section aria-label="Información del producto" className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {product.category?.name && <Badge variant="outline">{product.category.name}</Badge>}
          {product.brand && <span className="text-sm font-medium text-text-secondary">{product.brand}</span>}
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-primary leading-tight break-words tracking-tight">{product.name}</h1>
        <p className="text-3xl font-semibold text-primary tabular-nums mt-5 mb-5">{formatPrice(product.price)}</p>
        {product.description && <p className="text-text-secondary leading-relaxed mb-6 break-words">{product.description}</p>}
        <div className="ds-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <Input id="product-quantity" label="Cantidad" type="number" value={quantity} onChange={event => setQuantity(Math.max(1, parseInt(event.target.value) || 1))} min={1} max={product.stock} disabled={addingToCart} fullWidth={false} wrapperClassName="sm:w-24 shrink-0" className="text-center tabular-nums" />
            <Button type="button" fullWidth size="lg" loading={addingToCart} disabled={knownStock && product.stock! <= 0} onClick={() => { void handleAddToCart(); }}>
              {!addingToCart && <ShoppingCart size={18} aria-hidden="true" />}{addingToCart ? 'Agregando…' : knownStock && product.stock! <= 0 ? 'Sin stock' : 'Añadir al carrito'}
            </Button>
          </div>
          {knownStock && <p className={`text-sm ${product.stock! > 0 ? 'text-success' : 'text-text-secondary'}`}>{product.stock! > 0 ? `Stock disponible: ${product.stock} unidades` : 'Sin stock disponible'}</p>}
          {purchaseError && <Notice>{purchaseError}</Notice>}
        </div>
      </section>
    </div>
    <section aria-labelledby="product-specifications" className="mt-8 lg:mt-12 max-w-4xl">
      <h2 id="product-specifications" className="ds-section-title text-primary mb-4">Especificaciones técnicas</h2>
      {product.specifications?.length ? <TechSpecsTable specs={product.specifications} /> : <div className="ds-card p-6 text-sm text-text-secondary">No hay especificaciones disponibles para este producto.</div>}
    </section>
  </div>;
}
