import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, navigate, loading]);

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await axios.delete(`/cart/${id}`);
        setCartItems(cartItems.filter(item => item.id !== id));
      } else {
        await axios.put(`/cart/${id}`, { quantity });
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
      }
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await axios.delete(`/cart/${id}`);
      setCartItems(cartItems.filter(item => item.id !== id));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!user) {
    return <div className="page-wrapper py-24 text-center mono-data">Por favor, inicie sesión para ver su carrito.</div>;
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-obsidian)]">CARRITO DE COMPRAS</h1>
      </div>

      <div className="grid-container">
        <div className="col-span-12 lg:col-span-8">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-white overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
                <tr>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] w-1/2">PRODUCTO</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-center">CANTIDAD</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-right">PRECIO</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[var(--color-obsidian-light)]">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingCart size={48} className="mb-4 text-[var(--color-outline-subtle)]" />
                        <span className="mono-data">EL CARRITO ESTÁ VACÍO</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item, index) => (
                    <tr key={item.id} className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 !== 0 ? 'bg-[var(--color-surface)]' : 'bg-white'}`}>
                      <td className="py-4 px-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-[var(--color-surface-container)] border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] flex items-center justify-center overflow-hidden">
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-gray-400 mono-data">IMG</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-obsidian)]">{item.product.name}</p>
                          <p className="mono-data text-xs text-[var(--color-outline)]">SKU: {item.product.id.slice(0, 8)}</p>
                          <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors mt-2 flex items-center gap-1 text-xs" title="Eliminar del carrito">
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          min={1}
                          className="w-16 border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-1 text-center mono-data outline-none"
                        />
                      </td>
                      <td className="py-4 px-4 mono-data text-right">${Number(item.product.price).toFixed(2)}</td>
                      <td className="py-4 px-4 mono-data text-right font-bold">${(Number(item.product.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-[var(--color-surface-container)] p-6 sticky top-24">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">RESUMEN DE ORDEN</h3>

            <div className="flex justify-between mb-4">
              <span className="text-[var(--color-obsidian-light)]">Subtotal</span>
              <span className="mono-data">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 border-b border-[var(--color-outline-subtle)] pb-4">
              <span className="text-[var(--color-obsidian-light)]">Impuestos (18%)</span>
              <span className="mono-data">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-bold text-[var(--color-obsidian)]">TOTAL ESTIMADO</span>
              <span className="mono-data text-2xl font-bold">${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <Button fullWidth variant="primary" className="h-12">
                PROCEDER AL PAGO
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
