import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import TechSpecsTable, { type TechSpec } from '../components/ui/TechSpecsTable';
import { Badge } from '../components/ui/Indicators';

const mockSpecs: TechSpec[] = [
  { label: 'MODELO', value: 'TS-MK2-01' },
  { label: 'SWITCHES', value: 'Tactile Obsidian (50g)' },
  { label: 'INTERFAZ', value: 'USB-C (Detachable)' },
  { label: 'ILUMINACIÓN', value: 'Per-key Electric Cyan LED' },
  { label: 'MATERIAL', value: 'Aluminio de grado aeroespacial' },
  { label: 'DIMENSIONES', value: '355 x 125 x 38 mm' },
  { label: 'PESO', value: '985g' },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="page-wrapper py-24 text-center mono-data text-[var(--color-obsidian)]">CARGANDO...</div>;
  if (!product) return <div className="page-wrapper py-24 text-center mono-data text-red-500">PRODUCTO NO ENCONTRADO</div>;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setAddingToCart(true);
    try {
      await axios.post('/cart', { productId: product.id, quantity });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Hubo un error al agregar al carrito.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="page-wrapper py-8">
      <div className="grid-container">
        
        {/* Image Gallery (Spans 7 columns on large screens) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-square bg-[var(--color-surface-container)] rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] flex items-center justify-center p-8 relative overflow-hidden">
            <span className="label-caps text-[var(--color-outline)] absolute top-4 left-4 z-10">VISTA PRINCIPAL</span>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="object-contain w-full h-full" />
            ) : (
              <div className="w-2/3 h-2/3 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                <span className="mono-data text-gray-500">NO IMAGE</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className={`aspect-square bg-[var(--color-surface-container)] rounded-[var(--radius-soft)] border cursor-pointer hover:border-[var(--color-primary)] transition-colors ${idx === 1 ? 'border-[var(--color-primary)]' : 'border-[var(--color-outline-subtle)]'} flex items-center justify-center`}>
                 <span className="mono-data text-xs text-gray-400">THUMB_0{idx}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info (Spans 5 columns) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col pt-4 lg:pt-0 lg:pl-8">
          <div className="mb-6 border-b border-[var(--color-outline-subtle)] pb-6">
            <Badge variant="outline">{product.category?.name || 'UNCATEGORIZED'}</Badge>
            <h1 className="text-4xl font-bold text-[var(--color-obsidian)] mt-4 mb-2">{product.name}</h1>
            <p className="mono-data text-gray-500 mb-4">MARCA: {product.brand}</p>
            <p className="text-3xl font-bold mono-data text-[var(--color-obsidian)]">${Number(product.price).toFixed(2)}</p>
          </div>

          <div className="mb-8 text-[var(--color-obsidian-light)]">
            <p>{product.description}</p>
          </div>

          <div className="mb-8 flex flex-col gap-4">
            <div className="flex gap-4 items-end">
              <div className="w-1/3">
                <label className="label-caps block mb-2">CANTIDAD</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1} 
                  max={product.stock}
                  className="w-full border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-2 text-center mono-data outline-none focus:border-[var(--color-primary)]" 
                />
              </div>
              <Button 
                fullWidth 
                variant="primary" 
                className="h-[42px]"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
              >
                {addingToCart ? 'AGREGANDO...' : 'AGREGAR AL CARRITO'}
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="mono-data text-sm">STOCK DISPONIBLE ({product.stock} unidades)</span>
            </div>
          </div>

          <div>
            <h3 className="label-caps mb-4">ESPECIFICACIONES TÉCNICAS</h3>
            <TechSpecsTable specs={mockSpecs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
