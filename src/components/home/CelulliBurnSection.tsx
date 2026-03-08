import { useEffect, useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { getProductsByCategory } from '../../lib/shopify';
import { Loader2 } from 'lucide-react';

const mockOffers: Product[] = [
  {
    id: 'cell-ind',
    category_id: 'celluli',
    name: '1 Pote Celulli Burn 100% Natural',
    description: '60 cápsulas de 500 mg/cada',
    original_price: 99.90,
    price: 39.90,
    discount_percentage: 60,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1tOBC8M0mpnAkHCUtZntZLf-PiWzcWMTo',
    is_popular: true
  },
  {
    id: 'cell-kit-2',
    category_id: 'celluli',
    name: '2 Potes Celulli Burn 100% Natural',
    description: '120 cápsulas de 500 mg/cada',
    original_price: 199.90,
    price: 55.90,
    discount_percentage: 74,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1rIKr_pT7RFEz6tVAGo3PQICq4EtT2JIU',
    is_popular: true
  },
  {
    id: 'cell-kit-3',
    category_id: 'celluli',
    name: '3 Potes Celulli Burn 100% Natural',
    description: '180 cápsulas de 500 mg/cada',
    original_price: 299.90,
    price: 69.90,
    discount_percentage: 77,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1450UF0tdiT5sjxv7CJZJeh4CuZpNZAAY',
    is_popular: true
  }
];

export default function CelulliBurnSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const yampiProducts = await getProductsByCategory('celluli', 10);
        if (yampiProducts && yampiProducts.length > 0) {
          const filtered = yampiProducts
            .filter(p => !p.name.toLowerCase().includes('6 potes'))
            .sort((a, b) => a.price - b.price)
            .slice(0, 3);
          setProducts(filtered);
        } else {
          setProducts(mockOffers);
        }
      } catch (error) {
        console.error('Erro ao carregar Celulli Burn da Yampi:', error);
        setProducts(mockOffers);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-age-gold mb-2">
            Celulli Burn
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            ELIMINE AS CELULITES COM NOSSO SUPLEMENTO 100% NATURAL!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-age-gold" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

