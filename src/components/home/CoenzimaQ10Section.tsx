import { useEffect, useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { getProductsByCategory, getAllProducts } from '../../lib/yampi';
import { Loader2 } from 'lucide-react';

const mockOffers: Product[] = [
  {
    id: 'coenz-ind',
    category_id: 'coenzima',
    name: '1 Pote Coenzima Q10 100% Natural',
    description: '60 cápsulas de 500 mg/cada',
    original_price: 109.90,
    price: 49.90,
    discount_percentage: 55,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/12i1-zNojutljuRZKVlNo4dfWcHy9124I',
    is_popular: true
  },
  {
    id: 'coenz-kit-2',
    category_id: 'coenzima',
    name: '2 Potes Coenzima Q10',
    description: '120 cápsulas de 500 mg/cada',
    original_price: 219.90,
    price: 65.90,
    discount_percentage: 70,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1FrI2Fg4bqDkuoacT9aywxkfBqnDaNCo3',
    is_popular: true
  },
  {
    id: 'coenz-kit-3',
    category_id: 'coenzima',
    name: '3 Potes Coenzima Q10',
    description: '180 cápsulas de 500 mg/cada',
    original_price: 329.90,
    price: 99.90,
    discount_percentage: 71,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/17FKIVWECEUSfgkXNUB46Sl6U6EOBjj1e',
    is_popular: true
  }
];

export default function CoenzimaQ10Section() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        let yampiProducts = await getProductsByCategory('coenzima', 10);

        if (!yampiProducts || yampiProducts.length < 3) {
            // Fallback: tenta buscar por slug se a categoria não retornar o suficiente
            const slugs = ['coenz-ind', 'coenz-kit-2', 'coenz-kit-3'];
            const all = await getAllProducts(50);
            const found = all.filter(p => slugs.includes(p.handle));
            if (found.length > 0) yampiProducts = found;
        }

        if (yampiProducts && yampiProducts.length > 0) {
          const sorted = [...yampiProducts].sort((a, b) => a.price - b.price).slice(0, 3);
          setProducts(sorted);
        } else {
          setProducts(mockOffers);
        }
      } catch (error) {
        console.error('Erro ao carregar Coenzima da Yampi:', error);
        setProducts(mockOffers);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-age-gold mb-2">
            Coenzima Q10
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500">
            CONTROLE DO COLESTEROL E AÇÃO ANTIOXIDANTE
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

