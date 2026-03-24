import { useEffect, useState } from 'react';
import { useCartStore } from '../../store/cart';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { getProductsByCategory } from '../../lib/shopify';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

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
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-age-gold/5 blur-[120px] rounded-full -mr-64 -mt-32" />
      
      <div className="container max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-age-gold font-bold text-xs uppercase tracking-[0.3em] mb-4 block">Eficácia Comprovada</span>
            <h2 className="text-4xl md:text-6xl font-black leading-none mb-6">COLÁGENO VERISOL®</h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest leading-relaxed">
              O segredo das celebridades para uma pele firme e radiante. Inicie hoje o seu tratamento e renove sua autoestima de dentro para fora.
            </p>
          </div>
          
          <button
            onClick={() => window.location.href = '/category/colageno-po'}
            className="group flex items-center gap-4 bg-white px-8 py-5 rounded-full shadow-lg border border-gray-100 hover:bg-age-gold hover:text-white transition-all duration-500 whitespace-nowrap"
          >
            <span className="font-black text-xs uppercase tracking-widest">Ver Todos os Sabores</span>
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
