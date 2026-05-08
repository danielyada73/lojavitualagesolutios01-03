import { useMemo } from 'react';
import ProductCard from '../ui/ProductCard';
import { products as allProducts } from '../../data/mock';

export default function ColagenoVerisolSection() {
  const products = useMemo(() =>
    allProducts
      .filter(p => p.category_id === 'colageno-verisol')
      .sort((a, b) => a.price - b.price)
      .slice(0, 3),
    []
  );

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-age-gold mb-2">
            Colágeno Verisol
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">
            PEPTÍDEOS BIOATIVOS COM COMPROVAÇÃO CLÍNICA
          </p>
          <button
            onClick={() => window.location.href = '/category/colageno-verisol'}
            className="inline-block bg-black text-white text-[10px] font-bold px-8 py-3 uppercase rounded-full hover:bg-age-gold hover:text-black transition-all shadow-lg mb-4"
          >
            Ver Produtos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

