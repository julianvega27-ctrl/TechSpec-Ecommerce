import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Notice } from '../components/ui/Interior';
import { formatPrice } from '../utils/storefront';
import { useAuth } from '../context/AuthContext';

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<{ id: string; quantity: number; product: { name: string; price: number | string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get('/cart');
        const payload = response.data.data || response.data;
        setCartItems(payload);
        if (payload.length === 0) {
          navigate('/cart');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, navigate, loading]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);
    try {
      await axios.post('/orders/checkout');
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/orders');
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Error al procesar el pago' : 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.18;

  const finalTotal = subtotal + tax;

  if (!user || loading) {
    return <div className="page-wrapper py-24 text-center mono-data">Cargando...</div>;
  }

  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="ds-page-title text-primary">Finalizar compra</h1>
      </div>

      <form className="grid-container" onSubmit={handleCheckout}>
        <div className="col-span-12 lg:col-span-8 min-w-0 space-y-6">
          <section className="ds-card p-5 sm:p-6">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">DIRECCIÓN DE ENVÍO</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="NOMBRE(S)" type="text" required defaultValue={user.name} />
                <Input label="APELLIDO(S)" type="text" />
              </div>
              <Input label="DIRECCIÓN COMPLETA" type="text" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="CIUDAD" type="text" required />
                <Input label="ESTADO/PROVINCIA" type="text" required />
                <Input label="CÓDIGO POSTAL" type="text" required />
              </div>
            </div>
          </section>

          <section className="ds-card p-5 sm:p-6">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">MÉTODO DE PAGO</h3>
            <div className="space-y-4">
              <label className="flex items-center min-h-11 gap-4 border border-[var(--color-accent)] bg-[var(--color-surface)] p-4 rounded-[var(--radius-soft)] cursor-pointer">
                <input type="radio" name="payment" defaultChecked aria-label="Tarjeta de crédito o débito" className="accent-accent w-4 h-4 shrink-0" />
                <div>
                  <p className="font-medium">Tarjeta de Crédito / Débito</p>
                  <p className="text-sm text-[var(--color-obsidian-light)]">Procesado de forma segura</p>
                </div>
              </label>
            </div>

            <div className="mt-6">
              <Input label="NÚMERO DE TARJETA" type="text" placeholder="0000 0000 0000 0000" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="EXPIRACIÓN (MM/AA)" type="text" placeholder="12/25" required />
                <Input label="CVC" type="text" placeholder="123" required />
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="ds-card p-5 sm:p-6 lg:sticky lg:top-24">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">RESUMEN DE LA ORDEN</h3>

            <div className="space-y-4 mb-6 border-b border-[var(--color-outline-subtle)] pb-6 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span className="min-w-0 flex-1 break-words text-text-secondary">{item.quantity}x {item.product.name}</span>
                  <span className="tabular-nums shrink-0">{formatPrice(Number(item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-[var(--color-obsidian-light)]">Subtotal</span>
              <span className="mono-data">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4 border-b border-[var(--color-outline-subtle)] pb-4">
              <span className="text-[var(--color-obsidian-light)]">Impuestos (18%)</span>
              <span className="mono-data">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-bold text-[var(--color-obsidian)]">TOTAL</span>
              <span className="mono-data text-2xl font-bold">{formatPrice(finalTotal)}</span>
            </div>

            {error && <div className="mb-4"><Notice>{error}</Notice></div>}

            <Button fullWidth variant="primary" className="h-12" type="submit" loading={processing} disabled={cartItems.length === 0}>
              {processing ? 'Procesando…' : 'Confirmar pago'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
