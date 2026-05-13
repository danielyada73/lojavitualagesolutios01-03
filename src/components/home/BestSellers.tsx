import { useMemo } from 'react';
import { products as mockProducts } from '../../data/mock';
import ProductCard from '../ui/ProductCard';

export default function BestSellers() {
  const products = useMemo(() => {
    const bestSellersIds = ['col-cran', 'cre-ind', 'coenz-ind', 'cell-ind', 'omega-ind'];
    return mockProducts.filter((p) => bestSellersIds.includes(p.id));
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

