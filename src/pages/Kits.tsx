import { useMemo } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { products as mockProducts } from '../data/mock';

export default function Kits() {
  const kits = useMemo(() => mockProducts.filter(p => p.is_kit), []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4 uppercase italic tracking-tighter">
        Kits <span className="text-age-gold">Promocionais</span>
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto uppercase tracking-widest text-sm">
        Aproveite nossos descontos exclusivos em combos selecionados para maximizar seus resultados.
      </p>

      {kits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kits.map((kit) => (
            <ProductCard key={kit.id} product={kit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          Nenhum kit promocional encontrado no momento.
        </div>
      )}
    </div>
  );
}
