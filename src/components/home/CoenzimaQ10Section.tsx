import { useMemo } from 'react';
import ProductCard from '../ui/ProductCard';
import { products as allProducts } from '../../data/mock';

export default function CoenzimaQ10Section() {
  const products = useMemo(() =>
    allProducts
      .filter(p => p.category_id === 'coenzima')
      .sort((a, b) => a.price - b.price)
      .slice(0, 3),
    []
  );

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

