import { useEffect, useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { getProductsByCategory } from '../../lib/shopify';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

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
        const yampiProducts = await getProductsByCategory('coenzima', 10);
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
        console.error('Erro ao carregar Coenzima da Yampi:', error);
        setProducts(mockOffers);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-24 bg-age-dark text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-age-gold/10 blur-[120px] rounded-full -ml-32 -mt-32" />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-age-gold font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Vitalidade Celular</span>
            <h2 className="text-4xl md:text-6xl font-black leading-none mb-6">COENZIMA Q-10</h2>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest leading-relaxed">
              Energia pura para seu coração e células. A suplementação essencial para quem busca longevidade e disposição máxima no dia a dia.
            </p>
          </div>
          
          <button
            onClick={() => window.location.href = '/category/coenzima'}
            className="group flex items-center gap-4 bg-white/5 px-8 py-5 rounded-full shadow-lg border border-white/10 hover:bg-white hover:text-age-dark transition-all duration-500 whitespace-nowrap"
          >
            <span className="font-black text-xs uppercase tracking-widest">Explorar Linha</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-age-gold" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
