import { useEffect, useState } from 'react';
import { useCartStore } from '../../store/cart';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { getProductsByCategory } from '../../lib/yampi';
import { Loader2 } from 'lucide-react';

const mockOffers: Product[] = [
  {
    id: 'verisol-ind',
    category_id: 'colageno-verisol',
    name: '1 Pote Colágeno Verisol',
    description: '60 cápsulas de 500 mg/cada',
    original_price: 99.90,
    price: 39.90,
    discount_percentage: 60,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1Y6x63-ucORHZ6uiRdcUJS0Hg19t1a2BB',
    is_popular: true
  },
  {
    id: 'verisol-kit-2',
    category_id: 'colageno-verisol',
    name: '2 Potes Colágeno Verisol',
    description: '120 cápsulas de 500 mg/cada',
    original_price: 199.90,
    price: 55.90,
    discount_percentage: 74,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/15EA9Itgo7VmVNm_9dadIpaY-NvcfF3b8',
    is_popular: true
  },
  {
    id: 'verisol-kit-3',
    category_id: 'colageno-verisol',
    name: '3 Potes Colágeno Verisol',
    description: '180 cápsulas de 500 mg/cada',
    original_price: 299.90,
    price: 69.90,
    discount_percentage: 77,
    thumbnail_url: 'https://lh3.googleusercontent.com/d/1H15nQWZblvjbNqYBrKDgurKNHqBNTvjA',
    is_popular: true
  }
];

export default function ColagenoVerisolSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const yampiProducts = await getProductsByCategory('colageno-verisol', 10);
        if (yampiProducts && yampiProducts.length > 0) {
          const filtered = yampiProducts
            .filter(p => p.tags?.includes('verisol'))
            .filter(p => !p.name.toLowerCase().includes('6 potes'))
            .sort((a, b) => a.price - b.price)
            .slice(0, 3);
          setProducts(filtered);
        } else {
          setProducts(mockOffers);
        }
      } catch (error) {
        console.error('Erro ao carregar Verisol da Yampi:', error);
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
            Colágeno Verisol
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            RENOVE SUA PELE COM O COLÁGENO MAIS EFICAZ DO BRASIL!
          </p>
          <div className="inline-block bg-black text-white text-[10px] font-bold px-4 py-1 uppercase rounded-full">
            FRETE GRÁTIS
          </div>
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

