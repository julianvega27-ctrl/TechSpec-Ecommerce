import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShoppingCart, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import CatalogState from '../components/ui/CatalogState';
import { Breadcrumb, PageHeading, Notice, ProductImage } from '../components/ui/Interior';
import { actionLinkClass, formatPrice } from '../utils/storefront';

interface CartItem { id: string; quantity: number; product: { id: string; name: string; brand?: string; price: number | string; imageUrl?: string } }

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user && !loading) { navigate('/login'); return; }
    const fetchCart = async () => {
      try {
        const response = await axios.get('/cart');
        const payload = response.data.data || response.data;
        setCartItems(payload);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('No se pudo cargar el carrito. Vuelve a abrir esta página para intentarlo de nuevo.');
      } finally { setLoading(false); }
    };
    if (user) void fetchCart();
  }, [user, navigate, loading]);

  const updateQuantity = async (id: string, quantity: number) => {
    if (pending.includes(id)) return;
    setPending(current => [...current, id]); setError('');
    try {
      if (quantity <= 0) {
        await axios.delete(`/cart/${id}`);
        setCartItems(current => current.filter(item => item.id !== id));
      } else {
        await axios.put(`/cart/${id}`, { quantity });
        setCartItems(current => current.map(item => item.id === id ? { ...item, quantity } : item));
      }
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('No se pudo actualizar el carrito. Inténtalo de nuevo.');
    } finally { setPending(current => current.filter(itemId => itemId !== id)); }
  };
  const removeItem = async (id: string) => {
    if (pending.includes(id)) return;
    setPending(current => [...current, id]); setError('');
    try {
      await axios.delete(`/cart/${id}`);
      setCartItems(current => current.filter(item => item.id !== id));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      setError('No se pudo eliminar el producto. Inténtalo de nuevo.');
    } finally { setPending(current => current.filter(itemId => itemId !== id)); }
  };
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (!user) return <div className="page-wrapper py-8"><CatalogState variant="empty" title="Tu carrito" description="Por favor, inicia sesión para ver tu carrito." action={<Link to="/login" className={actionLinkClass}>Iniciar sesión</Link>} /></div>;
  return <div className="cart-page page-wrapper py-8 lg:py-10">
    <Breadcrumb current="Carrito" parent={{ label: 'Catálogo', to: '/catalog' }} />
    <PageHeading title="Tu carrito" description="Revisa tus productos antes de continuar con la compra." />
    {loading ? <Notice variant="loading">Cargando carrito…</Notice> : <>
      {error && <div className="mb-6"><Notice>{error}</Notice></div>}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
        <section aria-label="Productos del carrito" className="min-w-0 space-y-4">
          {cartItems.length === 0 ? <CatalogState variant="empty" title={error ? 'Productos no disponibles' : 'Tu carrito está vacío'} description={error ? 'No podemos mostrar los productos en este momento.' : 'Explora el catálogo y encuentra tu próximo equipo.'} action={<Link to="/catalog" className={actionLinkClass}>Explorar catálogo</Link>} /> : cartItems.map(item => {
            const busy = pending.includes(item.id);
            return <article key={item.id} aria-label={item.product.name} aria-busy={busy} className="ds-card p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <Link to={`/product/${item.product.id}`} className="shrink-0 rounded-control" aria-label={`Ver ${item.product.name}`}><ProductImage src={item.product.imageUrl} name={item.product.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-control border border-border p-2" /></Link>
                <div className="flex-1 min-w-0">
                  {item.product.brand && <p className="text-xs text-text-secondary mb-1">{item.product.brand}</p>}
                  <h2 className="text-base font-medium text-primary break-words"><Link to={`/product/${item.product.id}`} className="hover:text-accent transition-colors">{item.product.name}</Link></h2>
                  <p className="mt-2 text-sm text-text-secondary tabular-nums">Precio unitario: <span className="text-primary">{formatPrice(item.product.price)}</span></p>
                </div>
              </div>
              <div className="flex flex-wrap items-end gap-4 mt-4 pt-4 border-t border-border">
                <Input id={`cart-quantity-${item.id}`} label="Cantidad" aria-label={`Cantidad de ${item.product.name}`} type="number" value={item.quantity} onChange={event => { void updateQuantity(item.id, parseInt(event.target.value) || 0); }} min={1} disabled={busy} fullWidth={false} wrapperClassName="w-20" className="text-center tabular-nums" />
                <Button type="button" variant="ghost" loading={busy} disabled={busy} aria-label={`Eliminar ${item.product.name}`} onClick={() => { void removeItem(item.id); }} className="text-error enabled:hover:text-error">
                  {!busy && <Trash2 size={16} aria-hidden="true" />}{busy ? 'Actualizando…' : 'Eliminar'}
                </Button>
                <div className="ml-auto min-w-0 text-right"><p className="text-xs text-text-secondary mb-1">Subtotal del producto</p><p className="text-lg font-semibold text-primary tabular-nums break-words">{formatPrice(Number(item.product.price) * item.quantity)}</p></div>
              </div>
            </article>;
          })}
          {cartItems.length > 0 && <Link to="/catalog" className={`${actionLinkClass} mt-2`}>Seguir comprando</Link>}
        </section>
        {(!error || cartItems.length > 0) && <aside aria-label="Resumen de compra" className="ds-card p-5 sm:p-6 min-w-0">
          <h2 className="text-lg font-semibold text-primary mb-6">Resumen de compra</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-text-secondary">Subtotal</dt><dd className="text-primary tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-text-secondary">Impuestos (18%)</dt><dd className="text-primary tabular-nums">{formatPrice(tax)}</dd></div>
            <div className="flex justify-between gap-3 items-center border-t border-border pt-5"><dt className="font-medium text-primary">Total estimado</dt><dd className="text-2xl font-semibold text-primary tabular-nums">{formatPrice(total)}</dd></div>
          </dl>
          <Link to="/checkout" className="mt-6 flex min-h-12 items-center justify-center gap-2 bg-primary text-white font-semibold text-sm rounded-control px-4 py-3 hover:bg-primary-hover active:bg-primary transition-colors duration-200">Proceder al pago<ArrowRight size={18} aria-hidden="true" /></Link>
          <p className="flex items-center gap-2 mt-4 text-xs text-text-secondary"><ShoppingCart size={14} aria-hidden="true" />{cartItems.reduce((count, item) => count + item.quantity, 0)} unidades en tu carrito</p>
        </aside>}
      </div>
    </>}
  </div>;
}
