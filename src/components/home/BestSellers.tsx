import { useEffect, useState } from 'react';
import { products as mockProducts } from '../../data/mock';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';
import { getProductsByCategory } from '../../lib/shopify';
import { Loader2 } from 'lucide-react';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const yampiProducts = await getProductsByCategory('mais-vendidos', 5);
        if (yampiProducts && yampiProducts.length > 0) {
          setProducts(yampiProducts);
        } else {
          // Fallback para os IDs específicos que o usuário pediu originalmente
          const bestSellersIds = ['col-cran', 'cre-ind', 'coenz-ind', 'cell-ind', 'col-kit-3'];
          setProducts(mockProducts.filter((p) => bestSellersIds.includes(p.id)));
        }
      } catch (error) {
        console.error('Erro ao carregar Mais Vendidos da Yampi:', error);
        const bestSellersIds = ['col-cran', 'cre-ind', 'coenz-ind', 'cell-ind', 'col-kit-3'];
        setProducts(mockProducts.filter((p) => bestSellersIds.includes(p.id)));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-black mb-3">
            Os produtos <span className="text-age-gold">mais vendidos</span>
          </h2>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-400 font-bold">
            CONFIRA OS PRODUTOS PREFERIDOS DE NOSSOS CLIENTES
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-age-gold" size={32} />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {products.map((product) => (
              <div key={product.id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(20%-1.5rem)] max-w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

