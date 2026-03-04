import { products } from '../../data/mock';
import ProductCard from '../ui/ProductCard';

export default function PromotionalKits() {
  const kits = products.filter(p => p.is_kit && p.is_popular).slice(0, 2);

  return (
    <section className="py-16 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 uppercase tracking-tighter italic">
          Kits <span className="text-orange-600">Promocionais</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Economize comprando nossos combos exclusivos pensados para seus objetivos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {kits.map((kit) => (
            <ProductCard key={kit.id} product={kit} />
          ))}
        </div>
      </div>
    </section>
  );
}
