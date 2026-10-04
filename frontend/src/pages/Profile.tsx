import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRound, Package, LockKeyhole, LogOut, Pencil, Settings } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Breadcrumb, PageHeading, Notice } from '../components/ui/Interior';

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const loggingOut = useRef(false);
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState<{ userId: string; value: string } | null>(null);
  const displayName = savedName?.userId === user?.id ? savedName?.value || '' : user?.name || '';
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!isLoading && !user && !loggingOut.current) navigate('/login');
  }, [user, isLoading, navigate]);
  const handleLogout = () => { loggingOut.current = true; logout(); navigate('/'); };
  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    try {
      setIsSaving(true); setMessage('');
      await axios.put('/users/profile', { name });
      setSavedName({ userId: user.id, value: name });
      setMessage('Perfil actualizado correctamente'); setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error al actualizar el perfil');
    } finally { setIsSaving(false); }
  };
  if (isLoading || !user) return <div className="page-wrapper py-8"><Notice variant="loading">Cargando perfil…</Notice></div>;
  const accountLink = 'flex min-h-11 items-center gap-3 rounded-control px-3 py-3 text-sm text-text-secondary hover:text-primary hover:bg-background active:bg-surface-container-high transition-colors duration-200';
  const adminLinks = [{ to: '/admin/products', label: 'Gestión de productos' }, { to: '/admin/categories', label: 'Gestión de categorías' }, { to: '/admin/users', label: 'Gestión de usuarios' }, { to: '/admin/orders', label: 'Gestión de pedidos' }];
  return <div className="profile-page page-wrapper py-8 lg:py-10">
    <Breadcrumb current="Mi cuenta" />
    <PageHeading title="Mi cuenta" description="Consulta y actualiza tus datos personales." />
    <div className="grid grid-cols-1 md:grid-cols-[224px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
      <aside className="ds-card p-4 min-w-0">
        <nav aria-label="Mi cuenta" className="space-y-1">
          <Link to="/profile" aria-current="page" className="flex min-h-11 items-center gap-3 rounded-control p-3 text-sm font-medium text-accent bg-accent-subtle"><UserRound size={18} aria-hidden="true" />Información personal</Link>
          <Link to="/orders" className={accountLink}><Package size={18} aria-hidden="true" className="shrink-0" />Historial de órdenes</Link>
          <Link to="/security" className={accountLink}><LockKeyhole size={18} aria-hidden="true" className="shrink-0" />Contraseña</Link>
          {user.role === 'ADMIN' && <div className="border-t border-border mt-3 pt-3">
            <p className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-secondary"><Settings size={14} aria-hidden="true" />Administración</p>
            {adminLinks.map(link => <Link key={link.to} to={link.to} className={accountLink}>{link.label}</Link>)}
          </div>}
          <div className="border-t border-border mt-3 pt-3"><Button type="button" variant="ghost" fullWidth onClick={handleLogout} className="justify-start text-error enabled:hover:text-error"><LogOut size={18} aria-hidden="true" />Cerrar sesión</Button></div>
        </nav>
      </aside>
      <section aria-labelledby="profile-contact-title" className="ds-card p-5 sm:p-8 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
          <div><h2 id="profile-contact-title" className="text-xl font-semibold text-primary">Datos de contacto</h2><p className="text-sm text-text-secondary mt-1">Información de tu cuenta TechSpec.</p></div>
          {!isEditing && <Button type="button" variant="secondary" onClick={() => { setName(displayName); setIsEditing(true); setMessage(''); }}><Pencil size={16} aria-hidden="true" />Editar</Button>}
        </div>
        {message && <div className="mb-6"><Notice variant={message === 'Perfil actualizado correctamente' ? 'success' : 'error'}>{message}</Notice></div>}
        {!isEditing ? <dl className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div><dt className="text-sm text-text-secondary mb-2">Nombre completo</dt><dd className="text-base font-medium text-primary break-words">{displayName}</dd></div>
          <div><dt className="text-sm text-text-secondary mb-2">Correo electrónico</dt><dd className="text-base font-medium text-primary break-all">{user.email}</dd></div>
          {user.role === 'ADMIN' && <div><dt className="text-sm text-text-secondary mb-2">Rol</dt><dd className="text-base font-medium text-primary">{user.role}</dd></div>}
        </dl> : <form aria-label="Editar perfil" className="space-y-5" onSubmit={handleSave}>
          <Input label="Nombre completo" type="text" value={name} autoComplete="name" onChange={event => setName(event.target.value)} required disabled={isSaving} wrapperClassName="" autoFocus />
          <Input label="Correo electrónico" type="email" value={user.email} disabled wrapperClassName="" />
          {user.role === 'ADMIN' && <Input label="Rol" type="text" value={user.role} disabled wrapperClassName="" />}
          <div className="pt-5 border-t border-border flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button type="button" variant="secondary" disabled={isSaving} onClick={() => { setIsEditing(false); setName(displayName); }}>Cancelar</Button>
            <Button type="submit" loading={isSaving}>{isSaving ? 'Guardando…' : 'Guardar cambios'}</Button>
          </div>
        </form>}
      </section>
    </div>
  </div>;
}
