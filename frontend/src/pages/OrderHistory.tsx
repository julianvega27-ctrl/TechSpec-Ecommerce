import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '../components/ui/Indicators';
import { useAuth } from '../context/AuthContext';

const OrderHistory: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders/my-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, navigate, loading]);

  if (!user || loading) {
    return <div className="page-wrapper py-24 text-center mono-data">Cargando historial de órdenes...</div>;
  }

  const getStatusBadgeVariant = (status: string): "primary" | "secondary" | "error" | "outline" => {
    switch (status) {
      case 'PENDING':
      case 'PROCESSING':
        return 'secondary';
      case 'SHIPPED':
      case 'DELIVERED':
        return 'primary';
      case 'CANCELED':
        return 'error';
      default:
        return 'outline';
    }
  };

  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">HISTORIAL DE ÓRDENES</h1>
      </div>

      <div className="grid-container">
        <aside className="col-span-12 md:col-span-3 border-r border-[var(--color-outline-subtle)] pr-6 hidden md:block">
          <ul className="space-y-4">
            <li>
              <Link to="/profile" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Información Personal</Link>
            </li>
            {user?.role === 'ADMIN' && (
              <>
                <li className="pt-2 pb-1 border-t border-[var(--color-outline-subtle)]">
                  <span className="text-xs font-bold text-[var(--color-obsidian)] label-caps">ADMINISTRACIÓN</span>
                </li>
                <li>
                  <Link to="/admin/products" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Productos</Link>
                </li>
                <li>
                  <Link to="/admin/categories" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Categorías</Link>
                </li>
                <li>
                  <Link to="/admin/users" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Usuarios</Link>
                </li>
                <li>
                  <Link to="/admin/orders" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Gestión de Pedidos</Link>
                </li>
                <li className="pt-2 border-t border-[var(--color-outline-subtle)]"></li>
              </>
            )}
            <li>
              <span className="text-[var(--color-primary)] font-medium block">Historial de Órdenes</span>
            </li>
            <li>
              <Link to="/security" className="text-[var(--color-obsidian-light)] hover:text-[var(--color-obsidian)] cursor-pointer block">Seguridad</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-[var(--color-error)] mt-8 block cursor-pointer bg-transparent border-none p-0 text-left w-full">Cerrar Sesión</button>
            </li>
          </ul>
        </aside>

        <div className="col-span-12 md:col-span-9">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-white overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-subtle)]">
                <tr>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)]">ID ORDEN</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)]">FECHA</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)]">ESTADO</th>
                  <th className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[var(--color-obsidian-light)] mono-data">NO TIENES ÓRDENES AÚN</td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.id} className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 !== 0 ? 'bg-[var(--color-surface)]' : 'bg-white'}`}>
                      <td className="py-4 px-4 mono-data font-medium text-[var(--color-obsidian)]">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 px-4 mono-data text-[var(--color-outline)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="py-4 px-4 mono-data text-right font-bold">${Number(order.totalAmount).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
